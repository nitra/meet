# 6. API та бекенд

## Connection Details

**Маршрут:** `GET /api/connection-details`

**Призначення:** видача даних для підключення учасника до кімнати (URL сервера + JWT).

**Query-параметри:**

- `roomName` (обов’язковий)
- `participantName` (обов’язковий)
- `metadata` (опційно)
- `region` (опційно) — для вибору регіону LiveKit Cloud

**Логіка:**

- Читає `LIVEKIT_URL`, `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET`.
- Якщо передано `region`, URL перетворюється через **getLiveKitURL**.
- Генерується унікальний identity: `participantName__randomPostfix` (postfix у cookie для стабільності).
- Створюється **AccessToken** з VideoGrant (room, roomJoin, canPublish, canSubscribe, canPublishData), TTL 5 хв.
- Відповідь: JSON типу **ConnectionDetails** (`serverUrl`, `roomName`, `participantName`, `participantToken`) і встановлення cookie з postfix.

## Record Start

**Маршрут:** `GET /api/record/start?roomName=...`

- Перевірка наявності `roomName`.
- Створення EgressClient, перевірка на вже запущений egress.
- Старт Room Composite Egress з виводом у S3 (конфіг з env).
- Повертає 200 при успіху, 409 якщо запис уже йде, 4xx/5xx при помилках.

## Record Stop

**Маршрут:** `GET /api/record/stop` (з параметром кімнати або egress)

- Зупинка активного egress для вказаної кімнати через EgressClient.

## Типи (lib/types.ts)

- **SessionProps** — параметри сесії (roomName, identity, опційні треки, region, TURN тощо).
- **TokenResult** — identity + accessToken.
- **ConnectionDetails** — serverUrl, roomName, participantName, participantToken.
- **isVideoCodec** — type guard для валідного відеокодека (vp8, vp9, av1 тощо).

## Утиліти

- **getLiveKitURL** — формування регіонального URL для LiveKit Cloud.
- **client-utils** — `encodePassphrase`, `decodePassphrase`, `generateRoomId`, `randomString` для клієнтської логіки (E2EE, імена кімнат).

<details>
<summary><strong>Тести функціональності</strong></summary>

```typescript
{{#include test/spec.spec.ts:api_tests}}
```

</details>
