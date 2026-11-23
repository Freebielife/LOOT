# LOOT Observatory

## О проекте / токене

Согласно метаданным контракта, LOOT — нативный токен платформы LootVault DEX. Проект описывает его модель словами «Mine, Hold, Earn». Это самоописание проекта, а не подтверждение доходности.

Самоописание из метаданных токена; заявления проекта не проверены независимо.

Источники (проверены 2026-11-23):

- <https://tonapi.io/v2/jettons/EQCM4DEzDVFLq7kaSodQX-8-u_aF9M9DDe1EePWsuMozqGkt>

Generated from https://github.com/Freebielife/TON-Observatory-Template.

Run python3 -m scripts.refresh_observatory; python3 build.py; python3 verify.py.
Publish index.html in TON Sites only after independent on-chain verification.
Снимок содержит проверенные данные LOOT; неполные разделы явно отмечаются в интерфейсе.
Only native TON swap pairs supported. Locks, staking and custom project NFT badges are configured through project.json and verified against TonAPI.
GitHub Actions: резервное обновление в :17 и :47 UTC; возможны задержки GitHub. Подключение к общему Cloudflare runner отдельно не подтверждено.

Foundation version: 1.3.0. Holders show 10, expandable to top 20.
`project.json` is the per-project specification. Contract/pool/precision changes require regenerating from the factory; do not reuse another token's snapshot.
Run `python3 build.py` for an atomic bundle and `build/report.json` size report.
No external fonts, scripts or images are needed to render the saved page. Fresh data checks and manual wallet lookups require network access.
Cloudflare dispatch registration and GitHub repository access remain separate deployment steps. No credentials go into HTML.

## Оформление и ссылки

Изображение image(10).png предоставлено пользователем и явно выбрано для главного баннера и всех разделов вместо флага. Оно встроено в HTML.

Официальный сайт из метаданных: https://lootvault.lol (проверен 2026-11-23, заголовок LootVault Mining).
Канал: https://t.me/lootvault_channel; сообщество: https://t.me/LootVault_Community; бот: https://t.me/LootVaultDexBot.

Сбор переводов на нулевой адрес ограничен бюджетом 90 секунд между запросами; при превышении исправные предыдущие данные сохраняются, статус остаётся неполным. Этот раздел выполняется после основных данных.

## Размер самостоятельного HTML

Для активного LOOT встраиваются последние 500 сделок. Все графики (TON/USD, шесть периодов), объёмы и топ продавцов за 1/7/30 дней рассчитываются по полному сохранённому снимку до сокращения. Полные строки остаются в data/snapshot.json и загружаются при доступной сети. Ограничение истории и неполное покрытие периодов не скрываются.
