# 2. Зустрічі та кімнати

## Режими входу

### Demo (демо-зустріч)

- На головній сторінці вкладка **Demo**.
- Кнопка **Start Meeting** генерує унікальний ідентифікатор кімнати (`generateRoomId()`) і перенаправляє на `/rooms/[roomName]`.

### Custom (кастомне підключення)

- Вкладка **Custom**: користувач вводить **LiveKit Server URL** та **Token** (JWT).
- Після сабміту редірект на `/custom/?liveKitUrl=...&token=...`.
- Сторінка `/custom` рендерить `VideoConferenceClientImpl`; підтримується query-параметр `singlePC`.

## Кімната (`/rooms/[roomName]`)

- **Серверна частина** (`page.tsx`): читає `roomName`, опційно `region`, `hq` і передає їх у клієнтський компонент.
- **Клієнт** (`PageClientImpl.tsx`):
  - Показує **PreJoin** (ім’я, вмикання камери/мікрофона) до отримання connection details.
  - Після сабміту PreJoin викликає **API** `CONN_DETAILS_ENDPOINT` (за замовчуванням `/api/connection-details`) з `roomName`, `participantName`, опційно `region`.
  - Отримані дані (`serverUrl`, `roomName`, `participantName`, `participantToken`) зберігаються в стейті і використовуються для підключення до кімнати через **VideoConference** (LiveKit Components).
- Відео завжди публікується з кодеком **VP9** та RED для аудіо; підтримуються **регіони** (через `getLiveKitURL` для LiveKit Cloud).

## Генерація імені кімнати

- У демо-режимі кімната створюється «на льоту»; ім’я генерується клієнтом (наприклад, випадковий рядок), щоб кожен «Start Meeting» вів у нову кімнату.

<details>
<summary><strong>Тести функціональності</strong></summary>

```typescript
{{#include test/spec.spec.ts:meetings_tests}}
```

</details>
