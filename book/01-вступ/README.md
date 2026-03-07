# 1. Вступ

## Що таке LiveKit Meet

**LiveKit Meet** — відкритий клієнт відеоконференцій, побудований на:

- **LiveKit Components** (`@livekit/components-react`) — UI-компоненти для кімнат, відео, чату
- **LiveKit Cloud** або власний **LiveKit Server** — бекенд для реального часу
- **Next.js** — фреймворк додатку (App Router, API routes)

Додаток дає змогу проводити демо-зустрічі з автогенерацією кімнат та підключатися до власного LiveKit-сервера з URL і токеном.

## Технічний стек

- **Next.js 15** — React-додаток з серверними та клієнтськими маршрутами
- **livekit-client** — клієнтський SDK для підключення до кімнат
- **livekit-server-sdk** — видача токенів та керування Egress (запис)
- **@livekit/components-react** — готові компоненти (PreJoin, VideoConference, чат тощо)

## Структура додатку

- **Головна** (`/`) — вибір вкладки Demo або Custom
- **Кімната** (`/rooms/[roomName]`) — відеоконференція з пре-джойном та отриманням connection details через API (відео завжди VP9)
- **Кастомне підключення** (`/custom`) — вхід за URL сервера та JWT-токеном

Деталі кожного блоку — у відповідних розділах книги.

<details>
<summary><strong>Тести функціональності</strong></summary>

```typescript
{{#include test/spec.spec.ts:intro_tests}}
```

</details>
