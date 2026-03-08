# 2. Зустрічі та кімнати

## Режими входу

### Demo (демо-зустріч)

- На головній сторінці вкладка **Demo**.
- Кнопка **Start Meeting** викликає `generateRoomId()` з `site/src/lib/client-utils.js` і перенаправляє на `/rooms/[roomName]`.

### Custom (кастомне підключення)

- Вкладка **Custom**: користувач вводить **LiveKit Server URL** та **Token** (JWT).
- Після сабміту редірект на `/custom?liveKitUrl=...&token=...`.
- Сторінка `site/src/pages/custom.vue` рендерить **LiveKitRoom** з пропсами `liveKitUrl`, `token`; підтримується query-параметр `singlePC`.

## Кімната (`/rooms/[roomName]`)

- **Сторінка** `site/src/pages/rooms/[roomName].vue`: читає `roomName` з `route.params`, опційно `region` та `hq` з `route.query`, передає їх у **LiveKitRoom.vue**.
- **LiveKitRoom.vue**:
  - Показує **PreJoin** (ім’я, вмикання камери/мікрофона) до отримання connection details.
  - Після сабміту PreJoin викликає **API** `VITE_CONN_DETAILS_ENDPOINT` (за замовчуванням `/api/connection-details`) з `roomName`, `participantName`, опційно `region`.
  - Отримані дані зберігаються в `connectionDetails` і передаються в **ConferenceBlock.vue** разом із **userChoices** для підключення через **Room** (livekit-client) та **VideoConference.vue**.
- Відео публікується з кодеком **H.265** (HEVC) та RED для аудіо; підтримуються **регіони** (через `getLiveKitURL` у API та клієнті).

## Генерація імені кімнати

- У демо-режимі кімната створюється «на льоту»; ім’я генерується клієнтом у `generateRoomId()` (формат `xxxx-xxxx`), щоб кожен «Start Meeting» вів у нову кімнату.

<details>
<summary><strong>Тести функціональності</strong></summary>

```typescript
{{#include test/spec.spec.ts:meetings_tests}}
```

</details>
