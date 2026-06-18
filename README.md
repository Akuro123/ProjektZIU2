# TaskFlow — Zaawansowany Interfejs Użytkownika

Elegancka aplikacja do zarządzania zadaniami (Task Manager) zbudowana w React + TanStack Start z trwałym zapisem przez własne REST API.

## 🔗 Linki

- **Demo (Live):** _wypełnij po opublikowaniu_ — przycisk **Publish** w Lovable
- **Repozytorium:** _wypełnij po wypchnięciu na GitHub_

## ✨ Funkcjonalności

- Pełny CRUD zadań (tytuł, opis, priorytet, termin) z trwałym zapisem w bazie danych
- REST API: `GET/POST /api/todos`, `PATCH/DELETE /api/todos/:id`
- Filtry: All / Active / Completed / High Priority + przełącznik widoku Grid / List
- Tryb jasny / ciemny (paleta OKLCH, kontrast WCAG AA)
- Pełna obsługa klawiaturą, `focus-visible`, `aria-*`, `prefers-reduced-motion`
- Walidacja formularza klient + serwer (React Hook Form + Zod)
- Animacje przejść, mikrointerakcje (Motion / Framer), toasty (sonner)
- Responsive Design — sidebar na desktop, drawer mobilny, breakpointy `sm/md/lg`

## 🧰 Stack

| Warstwa | Technologia |
|---|---|
| Framework | React 19 + TanStack Start (Vite 7, SSR) |
| Routing | TanStack Router (file-based) |
| Data fetching | TanStack Query |
| UI | Tailwind CSS v4, shadcn/ui (Radix) |
| Animacje | Motion (Framer) |
| Formularze | React Hook Form + Zod |
| Backend | Server Routes (TanStack) + Lovable Cloud (Postgres) |

## 🚀 Uruchomienie lokalne

```bash
# 1. Zainstaluj zależności
bun install        # lub: npm install

# 2. Zmienne środowiskowe (Lovable Cloud)
# Skopiuj .env.example -> .env i uzupełnij:
#   VITE_SUPABASE_URL=...
#   VITE_SUPABASE_PUBLISHABLE_KEY=...
#   SUPABASE_SERVICE_ROLE_KEY=...   # tylko po stronie serwera

# 3. Uruchom dev server
bun run dev        # http://localhost:5173

# 4. Build produkcyjny
bun run build
```

## 📁 Struktura

```
src/
├─ routes/
│  ├─ __root.tsx               # shell + meta
│  ├─ _app.tsx                 # layout (sidebar, header, drawer)
│  ├─ _app.index.tsx           # dashboard zadań
│  ├─ _app.about.tsx           # notatka UX
│  ├─ _app.profile.tsx, _app.help.tsx, _app.notifications.tsx
│  └─ api/
│     ├─ todos.ts              # GET / POST /api/todos
│     └─ todos.$id.ts          # PATCH / DELETE /api/todos/:id
├─ components/ui/              # shadcn/ui
├─ integrations/supabase/      # klient bazy danych
└─ styles.css                  # tokeny designu (OKLCH)
```

## 🌐 REST API

| Metoda | Endpoint | Opis |
|---|---|---|
| GET | `/api/todos` | Lista zadań |
| POST | `/api/todos` | Utwórz zadanie (`title`, `description?`, `priority`, `due_date?`) |
| PATCH | `/api/todos/:id` | Aktualizacja (np. `completed`) |
| DELETE | `/api/todos/:id` | Usuń zadanie |

## ♿ Dostępność (WCAG)

- Semantyczny HTML: `<main>`, `<nav>`, `<header>`, `<aside>`, `<form role="search">`
- Etykiety ARIA dla wszystkich przycisków ikonkowych, `aria-pressed`, `aria-current`, `aria-live`
- Kontrast min. AA (paleta OKLCH zarówno light/dark)
- Pełna obsługa klawiaturą, `focus-visible`, `Esc` zamyka modale, focus-trap w dialogach (Radix)
- Wsparcie `prefers-reduced-motion`
- Obrazy z `width`/`height`/`decoding="async"` (eliminacja CLS)

## 🧪 Notatka UX

**Persona:** Anna, 27 lat, junior PM w SaaS. Pracuje hybrydowo, prowadzi 10–20 mikro-zadań dziennie. Potrzebuje szybkiego dodawania z klawiatury, wyraźnych priorytetów, jasnego rozdziału aktywne/ukończone.

**Kluczowe decyzje (heurystyki Nielsena):**
- Floating Action Button — H7 (efektywność użycia)
- Filtry jako toggle z `aria-pressed` — H6 (rozpoznawaj zamiast pamiętaj)
- Inline error messages + Zod — H9 (pomoc w naprawianiu błędów)
- Toasty potwierdzające akcje — H1 (widoczność statusu systemu)
- Spójna ikonografia Lucide + kolory priorytetów — H4 (spójność i standardy)

Pełna notatka dostępna w aplikacji pod `/about`.

## 📜 Licencja

MIT — projekt edukacyjny.