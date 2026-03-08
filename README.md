<a href="https://livekit.io/">
  <img src="./.github/assets/livekit-mark.png" alt="LiveKit logo" width="100" height="100">
</a>

# LiveKit Meet

<p>
  <a href="https://meet.livekit.io"><strong>Try the demo</strong></a>
  •
  <a href="https://github.com/livekit/components-js">LiveKit Components</a>
  •
  <a href="https://docs.livekit.io/">LiveKit Docs</a>
  •
  <a href="https://livekit.io/cloud">LiveKit Cloud</a>
  •
  <a href="https://blog.livekit.io/">Blog</a>
</p>

<br>

LiveKit Meet is an open source video conferencing app built on [LiveKit Components](https://github.com/livekit/components-js), [LiveKit Cloud](https://cloud.livekit.io/), and Vite. It's been completely redesigned from the ground up using our new components library.

![LiveKit Meet screenshot](./.github/assets/livekit-meet.jpg)

## Tech Stack

- Frontend: [Vite](https://vite.dev/) + React; app is built with [@livekit/components-react](https://github.com/livekit/components-js/).
- API: optional Node/Bun server in `run/next/` for connection details and recording.

## Demo

Give it a try at https://meet.livekit.io.

## Dev Setup

Steps to get a local dev setup up and running:

1. Run `bun install` to install all dependencies (корінь і пакет `site/`).
2. Copy `site/.env.example` to `site/.env.local` and set the required environment variables.
3. If `site/public/` is empty, copy assets: `cp -R public/* site/public/`.
4. Run `bun dev` to start the Vite dev server and open [http://localhost:5173](http://localhost:5173).
5. Start development 🎉
