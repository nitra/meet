# 1. Вступ

## Що таке Nitra Live

**Nitra Live** — відкритий клієнт відеоконференцій, побудований на:

- **Vue 3** + **livekit-client** — власні UI-компоненти для кімнат, відео, чату
- **LiveKit Cloud** або власний **LiveKit Server** — бекенд для реального часу
- **Vite** — збірка фронтенду в директорії **`site/`**; API обслуговується окремим сервісом у **`run/next/`** (Bun) для connection details та запису

Додаток дає змогу проводити демо-зустрічі з автогенерацією кімнат та підключатися до власного LiveKit-сервера з URL і токеном.

## Технічний стек

- **Vue 3** + **Vue Router** — SPA у `site/` з файловою маршрутизацією (`vue-router/auto-routes`: `pages/index.vue`, `pages/rooms/[roomName].vue`, `pages/custom.vue`)
- **livekit-client** — клієнтський SDK для підключення до кімнат
- **livekit-server-sdk** — у **`run/next/`**: видача токенів (connection-details) та керування Egress (запис)
- Власні Vue-компоненти: `PreJoin.vue`, `ConferenceBlock.vue`, `VideoConference.vue`, `SettingsMenu.vue`, налаштування медіа тощо

## Структура додатку

- **Головна** (`/`) — `site/src/pages/index.vue`: вибір вкладки Demo або Custom
- **Кімната** (`/rooms/[roomName]`) — `site/src/pages/rooms/[roomName].vue`: відеоконференція з пре-джойном та отриманням connection details через API; відео публікується з кодеком **H.265** (HEVC) для апаратного кодування на MacBook M1
- **Кастомне підключення** (`/custom`) — `site/src/pages/custom.vue`: вхід за URL сервера та JWT-токеном

Деталі кожного блоку — у відповідних розділах книги.

<details>
<summary><strong>Тести функціональності</strong></summary>

```typescript
{{#include test/spec.spec.ts:intro_tests}}
```

</details>
