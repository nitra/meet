# 5. Запис зустрічей

## Можливість запису

- Запис доступний лише якщо налаштовано змінну **VITE_LK_RECORD_ENDPOINT** (базовий URL, наприклад `http://localhost:8080/api/record`).
- У **SettingsMenu.vue** з’являється вкладка «Запис» з кнопкою «Почати»/«Зупинити» запис.

## Старт запису (API)

- Клієнт робить запит на ендпоінт старту запису (наприклад, `{VITE_LK_RECORD_ENDPOINT}/start`) з query-параметром **roomName**.
- Реалізація на бекенді (`run/next/src/routes/record-start.js`) використовує **EgressClient** з `livekit-server-sdk`:
  - Перевіряє, чи вже є активний egress для цієї кімнати; якщо так — повертає 409.
  - Створює **Room Composite Egress**: один відеофайл (layout типу `speaker`) з усіма учасниками.
  - Вихід — **EncodedFileOutput** з завантаженням у **S3** (потрібні змінні: S3_KEY_ID, S3_KEY_SECRET, S3_BUCKET, S3_ENDPOINT, S3_REGION).
  - Ім’я файлу: `{ISO date}-{roomName}.mp4`.

**Важливо:** поточна реалізація не перевіряє права користувача — будь-хто, хто знає `roomName`, може стартувати запис. Для продакшену потрібна авторизація.

## Зупинка запису (API)

- Окремий ендпоінт (наприклад, **{VITE_LK_RECORD_ENDPOINT}/stop**) приймає **roomName** (або egress ID); реалізація в `run/next/src/routes/record-stop.js` зупиняє активний egress через EgressClient.

## Індикатор запису

- Компонент **RecordingIndicator.vue** показує в UI, що зустріч записується (стан з композабла **useIsRecording**).

<details>
<summary><strong>Тести функціональності</strong></summary>

```typescript
{{#include test/spec.spec.ts:recording_tests}}
```

</details>
