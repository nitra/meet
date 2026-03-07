# 7. Користувацький досвід

## Швидкі клавіші (KeyboardShortcuts)

Компонент **KeyboardShortcuts** підписується на `keydown` і надає:

- **Cmd/Ctrl + Shift + A** — перемикання мікрофона (toggle)
- **Cmd/Ctrl + Shift + V** — перемикання камери (toggle)

Використовується хук **useTrackToggle** з LiveKit Components для мікрофона та камери.

## Меню налаштувань (SettingsMenu)

- Відображається в кімнаті (якщо `NEXT_PUBLIC_SHOW_SETTINGS_MENU === 'true'`).
- Вкладки: **Media Devices** (камера, мікрофон, динамік), **Recording** (якщо задано recording endpoint).
- **CameraSettings** / **MicrophoneSettings** — вибір пристроїв і перемикання треків.
- Для запису: кнопка старт/стоп, індикатор обробки запиту.

## PreJoin

- Екран перед входом у кімнату: введення імені, перемикачі відео/аудіо.
- За замовчуванням відео та аудіо увімкнені.
- Після сабміту викликається API connection-details і відбувається підключення до кімнати з вибраними налаштуваннями.

## Чат та посилання

- Використовується **formatChatMessageLinks** з LiveKit Components для відображення повідомлень чату з клікабельними посиланнями.

## Теми та стилі

- Додаток використовує `data-lk-theme="default"` для теми LiveKit Components; стилі головної сторінки — у `Home.module.css`, меню налаштувань — у `SettingsMenu.module.css`.

## Дебаг (опційно)

- Компонент **DebugMode** може показувати додаткову технічну інформацію в кімнаті для діагностики підключення та стану.

<details>
<summary><strong>Тести функціональності</strong></summary>

```typescript
{{#include test/spec.spec.ts:ux_tests}}
```

</details>
