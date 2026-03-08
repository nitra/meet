# 6. API та бекенд

## Connection Details

**Маршрут:** `GET /api/connection-details` (обслуговується **run/next**: `src/routes/connection-details.js`)

**Призначення:** видача даних для підключення учасника до кімнати (URL сервера + JWT).

**Query-параметри:**

- `roomName` (обов’язковий)
- `participantName` (обов’язковий)
- `metadata` (опційно)
- `region` (опційно) — для вибору регіону LiveKit Cloud

**Логіка:**

- Читає `LIVEKIT_URL`, `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET`.
- Якщо передано `region`, URL перетворюється через **getLiveKitURL** (`run/next/src/lib/getLiveKitURL.js`).
- Генерується унікальний identity: `participantName__randomPostfix` (postfix у cookie `random-participant-postfix` для стабільності).
- Створюється **AccessToken** з VideoGrant (room, roomJoin, canPublish, canSubscribe, canPublishData), TTL 5 хв.
- Відповідь: JSON (`serverUrl`, `roomName`, `participantName`, `participantToken`) і встановлення cookie з postfix.

## Record Start

**Маршрут:** `GET /api/record/start?roomName=...` (реалізація: `run/next/src/routes/record-start.js`)

- Перевірка наявності `roomName`.
- Створення EgressClient, перевірка на вже запущений egress.
- Старт Room Composite Egress з виводом у S3 (конфіг з env).
- Повертає 200 при успіху, 409 якщо запис уже йде, 4xx/5xx при помилках.

## Record Stop

**Маршрут:** `GET /api/record/stop` (реалізація: `run/next/src/routes/record-stop.js`) — з параметром кімнати або egress

- Зупинка активного egress для вказаної кімнати через EgressClient.

## Бекенд (run/next)

- Сервіс на **Bun**, точка входу `src/index.js`, маршрути підключені до connection-details та record (start/stop).
- Утиліти: **getLiveKitURL** у `run/next/src/lib/getLiveKitURL.js`; **utils.js** — cookies, `randomString` для identity postfix.

## Клієнт (site)

- **client-utils.js** — `generateRoomId`, `randomString`, `isLowPowerDevice` для клієнтської логіки (імена кімнат, Krisp).
- **getLiveKitURL.js** — формування регіонального URL на клієнті (якщо потрібно).

<details>
<summary><strong>Тести функціональності</strong></summary>

```typescript
{{#include test/spec.spec.ts:api_tests}}
```

</details>
