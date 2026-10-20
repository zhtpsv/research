# Research Atlas (React)

React-версия сайта Research Atlas: тот же дизайн (оригинальный CSS), языки RU / EN / KK и панель специальных возможностей.

## Запуск
```
npm install
npm run dev       # разработка
npm run build     # сборка в dist/ (Vite)
```
Без Vite: `npm i react react-dom esbuild && node scripts/build-esbuild.mjs` → `dist-offline/index.html` открывается двойным кликом.

## Структура
- `src/i18n/{ru,en,kk}.js` — все тексты; язык переключается в шапке (сохраняется, `?lang=kk`).
- `src/a11y/` — панель доступности (Alt+A): размер текста, контраст (обычный/высокий/тёмный), интервалы, шрифт, ссылки, ч/б, курсор, фокус, линейка чтения, озвучивание.
- `src/components/` — секции и графики (SVG на React). `src/lib/research.js` — данные и расчёты.
- `src/styles/main.css` — оригинальные стили; `extras.css`, `a11y.css` — дополнения.
- `public/downloads/` — PDF статьи и ZIP с кодом/данными.
