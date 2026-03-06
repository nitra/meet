# 4. Безпека та шифрування

## End-to-End Encryption (E2EE)

- Користувач може ввімкнути **E2EE** на головній сторінці (вкладки Demo та Custom).
- Задається **passphrase** (або використовується згенерований); він має бути однаковим у всіх учасників кімнати (передається окремо, наприклад по секретному каналу).
- Passphrase кодується для URL (`encodePassphrase`) і передається в **hash** фрагменті посилання (`#encodedPassphrase`), щоб не потрапляти в логи сервера.

## Як працює E2EE в клієнті

- **useSetupE2EE**: на клієнті з `location.hash` витягується закодований passphrase, створюється Web Worker з `livekit-client/e2ee-worker`.
- У кімнаті використовується **ExternalE2EEKeyProvider** з цим worker і passphrase; опції кімнати налаштовуються так, щоб E2EE було увімкнено при наявності ключів.
- Запис зустрічей при увімкненому E2EE **не підтримується** (перевірка в меню запису та на бекенді).

## Токени (JWT)

- Учасник заходить у кімнату тільки з валідним **Access Token** (JWT), виданим бекендом.
- У демо-режимі токен видає API **connection-details**: використовуються `LIVEKIT_API_KEY` та `LIVEKIT_API_SECRET`, задається TTL (наприклад, 5 хвилин), права на `roomJoin`, `canPublish`, `canSubscribe`, `canPublishData`.
- **Identity** учасника формується як `participantName__randomPostfix`; postfix зберігається в cookie, щоб повторні заходи в ту саму кімнату мали стабільний identity.

## Регіони (LiveKit Cloud)

- При підключенні можна передати **region** (наприклад, через query). Функція **getLiveKitURL** перетворює базовий LiveKit Cloud URL на регіональний (піддомен з регіоном), щоб трафік йшов через обраний регіон.

<details>
<summary><strong>Тести функціональності</strong></summary>

```typescript
{{#include test/spec.spec.ts:security_tests}}
```

</details>
