# 4. Безпека

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
