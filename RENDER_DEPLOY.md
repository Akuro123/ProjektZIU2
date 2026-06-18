# Deploy na Render

Ten projekt to TanStack Start + React + Supabase. Na Render użyj **Web Service**, nie Static Site.

## Render settings

- **Runtime / Language:** Node
- **Build Command:** `npm ci && npm run build`
- **Start Command:** `npm start`

`npm start` odpala `render-server.mjs`, który:

1. ładuje build SSR z `dist/server/server.js`,
2. serwuje pliki statyczne z `dist/client`,
3. nasłuchuje na `process.env.PORT` oraz `0.0.0.0`, czego wymaga Render.

## Environment variables

Dodaj w Render → Environment:

```env
NODE_ENV=production
VITE_SUPABASE_URL=...
VITE_SUPABASE_PUBLISHABLE_KEY=...
SUPABASE_URL=...
SUPABASE_PUBLISHABLE_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

`SUPABASE_URL` może mieć tę samą wartość co `VITE_SUPABASE_URL`.
`SUPABASE_PUBLISHABLE_KEY` może mieć tę samą wartość co `VITE_SUPABASE_PUBLISHABLE_KEY`.
`SUPABASE_SERVICE_ROLE_KEY` trzymaj tylko po stronie serwera — nie dodawaj go jako `VITE_*`.

## Lokalny test produkcyjny

```bash
npm ci
npm run build
PORT=10000 npm start
```

Potem otwórz `http://localhost:10000`.
