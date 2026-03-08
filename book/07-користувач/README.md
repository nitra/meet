# 7. Користувацький досвід

## Швидкі клавіші (KeyboardShortcuts)

Компонент **KeyboardShortcuts.vue** підписується на події клавіатури (через **tinykeys**) і надає:

- **Cmd/Ctrl + Shift + A** — перемикання мікрофона (toggle)
- **Cmd/Ctrl + Shift + V** — перемикання камери (toggle)

Використовується композабл **useTrackToggle** (`site/src/composables/useTrackToggle.js`) для мікрофона та камери.

## Меню налаштувань (SettingsMenu)

- **SettingsMenu.vue** відображається в кімнаті (якщо `VITE_SHOW_SETTINGS_MENU === 'true'`).
- Вкладки: **Медіа** (камера, мікрофон, динаміки), **Запис** (якщо задано **VITE_LK_RECORD_ENDPOINT**).
- **CameraSettings.vue** / **MicrophoneSettings.vue** / **MediaDeviceMenu.vue** — вибір пристроїв і перемикання треків.
- Для запису: кнопка «Почати»/«Зупинити» запис, індикатор обробки запиту.

## PreJoin

- Компонент **PreJoin.vue**: екран перед входом у кімнату — введення імені, перемикачі відео/аудіо.
- За замовчуванням відео та аудіо увімкнені.
- Після сабміту **LiveKitRoom.vue** викликає API connection-details і підключає до кімнати через **ConferenceBlock.vue** з вибраними налаштуваннями.

## Теми та стилі

- Додаток використовує `data-lk-theme="default"` для теми LiveKit; стилі головної сторінки — `site/src/styles/Home.module.css` (підключено в `pages/index.vue`); компоненти живуть у `site/src/components/livekit/` з власними scoped-стилями.

## Дебаг (опційно)

- Компонент **DebugMode.vue** показує додаткову технічну інформацію в кімнаті для діагностики підключення та стану.

<details>
<summary><strong>Тести функціональності</strong></summary>

```typescript
{{#include test/spec.spec.ts:ux_tests}}
```

</details>
