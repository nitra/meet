# 1. Вступ

## Що таке Nitra Live

**Nitra Live** — відкритий клієнт відеоконференцій, побудований на:

- **Vue 3** + **livekit-client** — власні UI-компоненти для кімнат, відео, чату
- **LiveKit Cloud** або власний **LiveKit Server** — бекенд для реального часу
- **Vite** — збірка фронтенду в директорії **`site/`**; API обслуговується окремим сервісом у **`run/next/`** (Bun) для connection details та запису

Додаток дає змогу проводити демо-зустрічі з автогенерацією кімнат та підключатися до власного LiveKit-сервера з URL і токеном.

## Технічний стек

- **Vue 3** + **Vue Router** — SPA у `site/` з файловою маршрутизацією (`vue-router/auto-routes`: `pages/index.vue`, `pages/rooms/[roomName].vue`)
- **livekit-client** — клієнтський SDK для підключення до кімнат
- **livekit-server-sdk** — у **`run/next/`**: видача токенів (connection-details) та керування Egress (запис)
- Власні Vue-компоненти: `PreJoin.vue`, `ConferenceBlock.vue`, `VideoConference.vue`, `SettingsMenu.vue`, налаштування медіа тощо

## Структура додатку

- **Головна** (`/`) — `site/src/pages/index.vue`: кнопка **Start Meeting** для переходу в кімнату
- **Кімната** (`/rooms/[roomName]`) — `site/src/pages/rooms/[roomName].vue`: відеоконференція з пре-джойном та отриманням connection details через API; відео публікується з кодеком **H.265** (HEVC) для апаратного кодування на MacBook M1

Деталі кожного блоку — у відповідних розділах книги.

<details>
<summary><strong>Тести функціональності</strong></summary>

```typescript
{{#include test/spec.spec.ts:intro_tests}}
```

</details>
