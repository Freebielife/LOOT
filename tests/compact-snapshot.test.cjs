const test=require('node:test');
const assert=require('node:assert/strict');
const {compactSnapshot}=require('../scripts/compact_snapshot.cjs');
const {marketCapSeries}=require('../web/market-cap.js');
const pool='EQAJ_seDWXCvKh7zObjzByO4quyDzAcaZjRgsmTnyMumXR1H';
test('offline compact view preserves full-history spikes, daily totals and exact seller units',()=>{
 const now=2_000_000_000;
 const rows=Array.from({length:1500},(_,i)=>({time:now-i*120,kind:i%3?'buy':'sell',tokenAmount:i===1300?'0.000000001':'100.000000001',ton:i===1400?'10000':'2',wallet:'0:'+String(i%21).padStart(64,'0'),tx:i.toString(16).padStart(64,'0'),lt:String(1500-i),pool}));
 const source={trades:{rows,since:now-180000,asOf:now},holders:{totalSupply:'5000000000',holders:[{wallet:rows[0].wallet}]},identity:{byWallet:{}}};
 const compact=compactSnapshot(source);
 assert.equal(source.trades.rows.length,1500);assert.equal(compact.trades.rows.length,500);
 for(const duration of [3600,86400,7*86400,365*86400]){
  const full=marketCapSeries(source,duration,60,'TON'),small=marketCapSeries(compact,duration,60,'TON');
  for(const key of ['low','high','change','latestCap','tradeCount','partial'])assert.deepEqual(small[key],full[key]);
  assert.deepEqual(small.points,full.points.map(p=>({time:p.time,cap:p.cap})));
  const expected=rows.filter(r=>r.time>=now-duration).reduce((n,r)=>n+Number(r.ton),0);
  const actual=compact.compactView.volumes[duration].reduce((n,b)=>n+b.buy+b.sell,0);
  assert.ok(Math.abs(expected-actual)<1e-9);
 }
 assert.equal(compact.compactView.daily.buys,rows.filter(r=>r.time>now-86400&&r.kind==='buy').length);
 const allSells=rows.filter(r=>r.time>now-7*86400&&r.kind==='sell');
 const actualUnits=compact.compactView.sellers[7].reduce((n,r)=>n+BigInt(r.units),0n);
 assert.equal(actualUnits,BigInt(allSells.length)*100000000001n);
 assert.ok(JSON.stringify(compact).length<JSON.stringify(source).length);
});
