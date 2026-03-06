# E2E тести за розділами книги

Тести лежать у кожному розділі: `book/<розділ>/test/spec.spec.ts`.

## Запуск

```bash
# Усі тести (автоматично запускає dev-сервер, якщо не запущений)
pnpm exec playwright test

# Конкретний розділ
pnpm exec playwright test book/01-вступ/test
pnpm exec playwright test book/06-апі/test
```

## Умови

- Браузери Playwright: `pnpm exec playwright install`
- Для тестів кімнат та API: `LIVEKIT_URL`, `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET`
