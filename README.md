# Travel & Expense — MVP skeleton

React (Vite) recreation of the "Mes ordres de mission" macOS design mockup, with every button wired up.

## Run

```bash
npm install
npm run dev
```

Then open the URL printed by Vite (usually http://localhost:5173).

## Build

```bash
npm run build
npm run preview
```

## Structure

- `src/App.jsx` — page routing (sidebar), modal, toast, window scaling
- `src/components/` — one component per section of the mockup
- `src/data/missions.js` — sample data and formatting helpers (swap for an API later)
- `src/styles.css` — the mockup's CSS, plus styles for the modal, toast, form and placeholder pages
