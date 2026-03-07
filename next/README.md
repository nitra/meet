# Бекенд API (сервіс next)

Окремий сервіс з API для LiveKit Meet: токени підключення та керування записом.

## Ендпоінти

- `GET /api/connection-details?roomName=&participantName=&metadata=&region=` — отримати дані для підключення до кімнати (токен, URL сервера).
- `GET /api/record/start?roomName=` — почати запис кімнати (потрібні S3 змінні).
- `GET /api/record/stop?roomName=` — зупинити запис.

## Запуск

```bash
# З кореня репозиторію
bun run dev:api

# Або з папки next
bun run dev
```

Перед першим запуском скопіюй `.env.example` в `.env` і заповни `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET`, `LIVEKIT_URL`.

## Фронтенд (site)

Щоб site використовував цей бекенд, у `site/.env.local` задай:

- `NEXT_PUBLIC_CONN_DETAILS_ENDPOINT=http://localhost:3001/api/connection-details`
- `NEXT_PUBLIC_LK_RECORD_ENDPOINT=http://localhost:3001/api/record`

За замовчуванням (якщо не вказано) site очікує API на тому ж origin (`/api/...`), тобто потрібен проксі або окремий бекенд з цими змінними.
