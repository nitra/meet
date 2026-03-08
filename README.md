<a href="https://livekit.io/">
  <img src="./.github/assets/livekit-mark.png" alt="LiveKit logo" width="100" height="100">
</a>

# Nitra Live

<br>

Nitra Live це система для проведення відеоконференцій. Переважно членами команди для роботи над проектами.

![Nitra Live screenshot](./.github/assets/livekit-meet.jpg)

## Tech Stack

- Frontend: [Vite](https://vite.dev/) + Vue 3; app uses [livekit-client](https://github.com/livekit/client-sdk-js) and custom Vue components.
- API: optional Node/Bun server in `run/next/` for connection details and recording.

## Demo

Give it a try at https://meet.livekit.io.

## Dev Setup

Steps to get a local dev setup up and running:

1. Run `bun install` to install all dependencies (корінь і пакет `site/`).
2. Copy `site/.env.example` to `site/.env.local` and set the required environment variables.
3. Run `bun dev` to start the Vite dev server and open [http://localhost:5173](http://localhost:5173).
4. Start development 🎉
