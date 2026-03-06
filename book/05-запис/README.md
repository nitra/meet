# 5. Запис зустрічей

## Можливість запису

- Запис доступний лише якщо налаштовано змінну **NEXT_PUBLIC_LK_RECORD_ENDPOINT** (наприклад, `/api/record/start` для старту).
- У **Settings** з’являється вкладка «Recording» з кнопкою увімкнути/вимкнути запис.
- Запис **заборонений** для кімнат з увімкненим E2EE (перевірка в UI та логіка бекенду).

## Старт запису (API)

- **GET** запит на ендпоінт старту запису (наприклад, `/api/record/start`) з query-параметром **roomName**.
- Реалізація використовує **EgressClient** з `livekit-server-sdk`:
  - Перевіряє, чи вже є активний egress для цієї кімнати; якщо так — повертає 409.
  - Створює **Room Composite Egress**: один відеофайл (layout типу `speaker`) з усіма учасниками.
  - Вихід — **EncodedFileOutput** з завантаженням у **S3** (потрібні змінні: S3_KEY_ID, S3_KEY_SECRET, S3_BUCKET, S3_ENDPOINT, S3_REGION).
  - Ім’я файлу: `{ISO date}-{roomName}.mp4`.

**Важливо:** поточна реалізація не перевіряє права користувача — будь-хто, хто знає `roomName`, може стартувати запис. Для продакшену потрібна авторизація.

## Зупинка запису (API)

- Окремий ендпоінт (наприклад, **/api/record/stop**) приймає **roomName** (або egress ID) і зупиняє активний egress для цієї кімнати через EgressClient.

## Індикатор запису

- Компонент **RecordingIndicator** показує в UI, що зустріч записується (використовується стан запису з контексту LiveKit / `useIsRecording`).

<details>
<summary><strong>Тести функціональності</strong></summary>

```typescript
{{#include test/spec.spec.ts:recording_tests}}
```

</details>
