/* Compact the offline view without changing exact chart and ranking results. */
const {marketCapSeries}=require('../web/market-cap.js');
const DAY=86400, RANGES=[3600,DAY,7*DAY,30*DAY,182*DAY,365*DAY];
function compactSnapshot(source){
 const rows=source.trades?.rows||[];
 if(rows.length<=500)return source;
 const snapshot=structuredClone(source), end=source.trades.asOf;
 const view={tradeCount:rows.length,charts:{},volumes:{},sellers:{},lastActivity:{}};
 const tracked=new Set((source.holders?.holders||[]).map(r=>r.wallet));
 for(const row of rows)if(tracked.has(row.wallet)&&!(row.wallet in view.lastActivity))view.lastActivity[row.wallet]=row.kind;
 for(const duration of RANGES){
  for(const currency of ['TON','USD']){
   const model=marketCapSeries(source,duration,60,currency);
   view.charts[duration+':'+currency]={...model,latest:model.latest?{time:model.latest.time}:null,points:model.points.map(p=>({time:p.time,cap:p.cap}))};
  }
  const start=end-duration, step=duration/30;
  const bins=Array.from({length:30},()=>({buy:0,sell:0}));
  for(const row of rows){
   if(!['buy','sell'].includes(row.kind)||row.time<start||row.time>end)continue;
   const value=Number(row.ton);if(!Number.isFinite(value)||value<=0)continue;
   bins[Math.min(29,Math.floor((row.time-start)/step))][row.kind]+=value;
  }
  view.volumes[duration]=bins;
 }
 const within=rows.filter(r=>r.time>end-DAY&&r.time<=end),buys=within.filter(r=>r.kind==='buy'),sells=within.filter(r=>r.kind==='sell');
 view.daily={buys:buys.length,sells:sells.length,buyVolume:buys.reduce((n,r)=>n+Number(r.ton),0),sellVolume:sells.reduce((n,r)=>n+Number(r.ton),0),buyers:new Set(buys.map(r=>r.wallet)).size,sellers:new Set(sells.map(r=>r.wallet)).size};
 for(const days of [1,7,30]){
  const groups=new Map();
  for(const row of rows){
   if(row.kind!=='sell'||row.time<=end-days*DAY||row.time>end)continue;
   const group=groups.get(row.wallet)||{...row,units:0n,count:0};
   const [whole,fraction='']=row.tokenAmount.split('.');
   group.units+=BigInt(whole)*10n**9n+BigInt(fraction.padEnd(9,'0'));group.count++;groups.set(row.wallet,group);
  }
  view.sellers[days]=[...groups.values()].filter(r=>!source.identity?.byWallet?.[r.wallet]?.role).sort((a,b)=>a.units===b.units?a.wallet.localeCompare(b.wallet):a.units>b.units?-1:1).slice(0,20).map(r=>({...r,units:r.units.toString()}));
 }
 snapshot.compactView=view;snapshot.trades.rows=rows.slice(0,500);
 return snapshot;
}
module.exports={compactSnapshot};
if(require.main===module){let input='';process.stdin.setEncoding('utf8');process.stdin.on('data',s=>input+=s);process.stdin.on('end',()=>process.stdout.write(JSON.stringify(compactSnapshot(JSON.parse(input)))));}
