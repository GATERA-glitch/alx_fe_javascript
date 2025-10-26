# Dynamic Quote Generator — dom-manipulation

This small web app demonstrates using `localStorage` and `sessionStorage` plus JSON import/export.

## Files
- `index.html` — main UI
- `styles.css` — simple styling
- `app.js` — logic: localStorage/sessionStorage + import/export

## How to run
1. Place files in `alx_fe_javascript/dom-manipulation/`.
2. Serve or open `index.html` in a browser:
   - Quick server: `cd alx_fe_javascript/dom-manipulation && python -m http.server 8000`
   - Open `http://localhost:8000/` then click `index.html`.

## Features to test
- **Add quote** → persists to `localStorage` (key: `dqg_quotes_v1`).
- **View** → displays quote and stores last viewed index in `sessionStorage` (key: `dqg_last_viewed`).
- **Export JSON** → downloads `quotes-YYYY-MM-DD.json`.
- **Import JSON** → accepts an array of `{ text, author }`; prompts to append or replace.
- **Clear Local Storage** → resets saved quotes to defaults.

## Sample JSON format
```json
[
  { "text": "Example quote", "author": "Author Name" },
  { "text": "Another quote", "author": "" }
]
