# TaskFlow — aplikacja Task Manager

TaskFlow to responsywna aplikacja webowa do zarządzania zadaniami, przygotowana jako projekt zaliczeniowy z przedmiotu Zaawansowany Interfejs Użytkownika. Aplikacja pozwala użytkownikowi logować się, dodawać zadania, filtrować je, oznaczać jako ukończone oraz usuwać. Projekt obejmuje pełny proces: od prototypu lo-fi i hi-fi, przez implementację interfejsu, aż po publiczne wdrożenie.

## Linki

* **Demo aplikacji:** TODO: wklej link do Rendera, np. `https://projektziu2.onrender.com/`
* **Repozytorium GitHub:** TODO: wklej link do publicznego repozytorium
* **Projekt Figma:** TODO: wklej link do lo-fi / hi-fi / user flow
* **Notatka UX:** dostępna w aplikacji w widoku `/about`

## Cel projektu

Celem projektu było zaprojektowanie i zaimplementowanie kompletnego interfejsu użytkownika dla aplikacji typu Task Manager. Aplikacja ma umożliwiać użytkownikowi samodzielne korzystanie z produktu: od logowania, przez zarządzanie zadaniami, po otrzymywanie informacji zwrotnych o wykonanych akcjach.

Projekt pokazuje zastosowanie nowoczesnych technologii frontendowych, obsługę formularzy, walidację, komunikację z API, responsywność, dostępność oraz deployment publiczny.

## Główne funkcjonalności

* Rejestracja i logowanie użytkownika.
* Dashboard z listą zadań.
* Dodawanie nowych zadań.
* Oznaczanie zadań jako ukończone.
* Usuwanie zadań.
* Filtrowanie zadań:

  * wszystkie,
  * aktywne,
  * ukończone,
  * wysokiego priorytetu.
* Wyszukiwanie zadań.
* Przełączanie widoku listy / siatki.
* Kategorie i priorytety zadań.
* Komunikaty sukcesu i błędu.
* Tryb jasny i ciemny.
* Responsywny layout na desktopie i mobile.
* Widoki dodatkowe:

  * profil,
  * powiadomienia,
  * pomoc,
  * opis UX projektu.

## Stack technologiczny

| Obszar                    | Technologia                       |
| ------------------------- | --------------------------------- |
| Frontend                  | React 19                          |
| Framework / routing       | TanStack Start, TanStack Router   |
| Budowanie projektu        | Vite                              |
| UI                        | Tailwind CSS, shadcn/ui, Radix UI |
| Ikony                     | Lucide React                      |
| Formularze                | React Hook Form                   |
| Walidacja                 | Zod                               |
| Pobieranie danych / cache | TanStack Query                    |
| Backend / API             | Server Routes w TanStack Start    |
| Baza danych i autoryzacja | Supabase                          |
| Animacje                  | Motion                            |
| Toasty / feedback         | Sonner                            |
| Deployment                | Render                            |

> W projekcie zamiast MUI zastosowano alternatywny stack UI: Tailwind CSS + shadcn/ui + Radix UI. Radix zapewnia dostępne komponenty bazowe, a Tailwind i shadcn/ui pozwalają zbudować spójny, kontrolowany design system.

## Instalacja i uruchomienie lokalne

### 1. Klonowanie repozytorium

```bash
git clone TODO: wklej link do repozytorium
cd TODO: nazwa-folderu-projektu
```

### 2. Instalacja zależności

```bash
npm install
```

Alternatywnie można użyć Bun:

```bash
bun install
```

### 3. Konfiguracja zmiennych środowiskowych

Utwórz plik `.env` w głównym katalogu projektu i uzupełnij dane Supabase:

```env
VITE_SUPABASE_URL=TODO
VITE_SUPABASE_PUBLISHABLE_KEY=TODO

SUPABASE_URL=TODO
SUPABASE_PUBLISHABLE_KEY=TODO
SUPABASE_SERVICE_ROLE_KEY=TODO
```

Wartości należy pobrać z panelu Supabase.

### 4. Uruchomienie aplikacji w trybie developerskim

```bash
npm run dev
```

Aplikacja będzie dostępna lokalnie pod adresem:

```txt
http://localhost:5173
```

### 5. Build produkcyjny

```bash
npm run build
```

### 6. Uruchomienie wersji produkcyjnej

```bash
npm start
```

## Deployment

Aplikacja została przygotowana do wdrożenia na Renderze.

Konfiguracja deploymentu:

```txt
Build Command:
npm install && npm run build

Start Command:
npm start
```

W panelu Render należy ustawić zmienne środowiskowe Supabase:

```env
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
SUPABASE_URL
SUPABASE_PUBLISHABLE_KEY
SUPABASE_SERVICE_ROLE_KEY
```

Po wdrożeniu aplikacja jest dostępna publicznie pod linkiem:

```txt
TODO: wklej link do Rendera
```

## Struktura projektu

```txt
src/
├── components/
│   └── ui/                    # Komponenty interfejsu shadcn/ui
├── hooks/
│   ├── use-auth.ts            # Obsługa użytkownika i sesji
│   └── use-mobile.tsx         # Detekcja widoku mobilnego
├── integrations/
│   └── supabase/              # Integracja z Supabase
├── lib/
│   ├── auth-api.ts            # Funkcje związane z autoryzacją
│   ├── notifications.ts       # Obsługa powiadomień
│   ├── todos-api.ts           # Schematy i logika API zadań
│   └── utils.ts               # Funkcje pomocnicze
├── routes/
│   ├── __root.tsx             # Główny root aplikacji
│   ├── _app.tsx               # Layout aplikacji: sidebar, header, drawer
│   ├── _app.index.tsx         # Główny dashboard z zadaniami
│   ├── _app.about.tsx         # Notatka UX
│   ├── _app.help.tsx          # Widok pomocy
│   ├── _app.notifications.tsx # Widok powiadomień
│   ├── _app.profile.tsx       # Widok profilu użytkownika
│   ├── login.tsx              # Logowanie i rejestracja
│   └── api/
│       ├── todos.ts           # GET i POST /api/todos
│       └── todos.$id.ts       # PATCH i DELETE /api/todos/:id
├── router.tsx                 # Konfiguracja routera
├── server.ts                  # Konfiguracja serwera
├── start.ts                   # Start aplikacji
└── styles.css                 # Globalne style, tokeny, dark mode, focus
```

## Routing

Aplikacja posiada kilka widoków obsługiwanych przez TanStack Router:

| Ścieżka          | Opis                           |
| ---------------- | ------------------------------ |
| `/`              | Dashboard z listą zadań        |
| `/login`         | Logowanie i rejestracja        |
| `/profile`       | Profil użytkownika             |
| `/notifications` | Powiadomienia                  |
| `/help`          | Pomoc                          |
| `/about`         | Opis UX i założeń projektowych |

Dzięki temu aplikacja spełnia wymaganie routingu pomiędzy minimum 2–3 ekranami.

## API

Projekt posiada własne endpointy REST do obsługi zadań.

| Metoda | Endpoint         | Opis                      |
| ------ | ---------------- | ------------------------- |
| GET    | `/api/todos`     | Pobranie listy zadań      |
| POST   | `/api/todos`     | Utworzenie nowego zadania |
| PATCH  | `/api/todos/:id` | Aktualizacja zadania      |
| DELETE | `/api/todos/:id` | Usunięcie zadania         |

Przykładowy przepływ dodawania zadania:

1. Użytkownik wypełnia formularz.
2. React Hook Form obsługuje stan formularza.
3. Zod waliduje dane po stronie klienta.
4. Frontend wysyła żądanie `POST /api/todos`.
5. Endpoint API ponownie waliduje dane.
6. Dane są zapisywane w Supabase.
7. TanStack Query odświeża listę zadań.
8. Użytkownik widzi nowe zadanie oraz komunikat sukcesu.

## Formularze i walidacja

Formularze w projekcie są obsługiwane przez React Hook Form, a walidacja przez Zod.

Walidowane są między innymi:

* wymagany tytuł zadania,
* długość pól tekstowych,
* priorytet zadania,
* kategoria zadania,
* data wykonania,
* poprawność przesyłanych danych do API.

Walidacja znajduje się zarówno po stronie klienta, jak i po stronie endpointów API. Dzięki temu aplikacja nie opiera się wyłącznie na walidacji frontendowej.

## State management

Do obsługi stanu danych użyto TanStack Query.

TanStack Query odpowiada za:

* pobieranie zadań,
* cache danych,
* stany `loading`,
* stany `success`,
* stany `error`,
* odświeżanie danych po dodaniu, edycji lub usunięciu zadania.

Lokalne stany interfejsu, takie jak otwarcie modala, aktualny filtr lub widok listy/siatki, są obsługiwane przez React `useState`.

Stan użytkownika i sesji obsługiwany jest przez Supabase oraz własny hook `useAuth`.

## Responsive Design

Aplikacja została zaprojektowana responsywnie.

Zastosowane rozwiązania:

* layout desktopowy z bocznym menu,
* mobilny drawer zamiast stałego sidebaru,
* breakpointy Tailwind CSS,
* widok listy i siatki,
* elastyczne karty zadań,
* przyciski i elementy interaktywne dostosowane do ekranów dotykowych.

Aplikacja jest wygodna zarówno na komputerze, jak i na urządzeniach mobilnych.

## Dostępność — WCAG

W projekcie zastosowano elementy poprawiające dostępność:

* semantyczny HTML,
* elementy takie jak `main`, `nav`, `aside`, `header`,
* `aria-label` dla przycisków ikonowych,
* `aria-pressed` dla przełączników i filtrów,
* `aria-current` dla aktywnych elementów nawigacji,
* widoczny stan fokusu,
* obsługa klawiaturą,
* `skip-link` do przejścia do głównej treści,
* komponenty Radix UI wspierające focus-trap i obsługę klawiatury,
* wsparcie `prefers-reduced-motion`,
* tryb jasny i ciemny z zachowaniem czytelności.

TODO: po wykonaniu audytu uzupełnić:

```txt
Lighthouse Accessibility: TODO/100
AXE: TODO, np. brak błędów krytycznych
```

## Mikrointerakcje i animacje

W projekcie zastosowano mikrointerakcje poprawiające odbiór aplikacji:

* animacje przejść,
* efekty hover,
* feedback po kliknięciu,
* loading spinner,
* komunikaty sukcesu,
* komunikaty błędów,
* toasty po akcjach użytkownika,
* płynne otwieranie dialogów i menu.

Do animacji wykorzystano bibliotekę Motion oraz przejścia CSS.

## Prototypowanie UI

Projekt został poprzedzony etapem projektowym w Figmie.

TODO: uzupełnij po dodaniu linku:

* **Lo-fi:** szkic podstawowego układu aplikacji i rozmieszczenia elementów.
* **Hi-fi:** finalny projekt interfejsu z kolorystyką, komponentami i typografią.
* **User flow:** przepływ użytkownika od logowania do zarządzania zadaniami.

Link do Figmy:

```txt
TODO: wklej link do projektu Figma
```

## Notatka UX

Projekt kierowany jest do użytkowników, którzy chcą szybko organizować codzienne zadania, nadawać im priorytety i kontrolować postęp pracy.

### Przykładowa persona

Anna, 27 lat, pracuje hybrydowo i codziennie zarządza wieloma małymi zadaniami. Potrzebuje aplikacji, która pozwoli jej szybko dodać zadanie, oznaczyć priorytet, sprawdzić aktywne rzeczy do zrobienia i łatwo odróżnić zadania ważne od mniej pilnych.

### Kluczowe decyzje projektowe

* Najważniejsza akcja, czyli dodanie zadania, jest łatwo dostępna.
* Priorytety i kategorie pomagają szybciej rozpoznawać typ zadania.
* Filtry pozwalają ograniczyć liczbę widocznych zadań.
* Toasty i loadingi informują użytkownika o stanie systemu.
* Widok mobilny używa drawer menu, aby nie zabierać miejsca na ekranie.
* Tryb ciemny poprawia komfort pracy w różnych warunkach.

### Odniesienie do heurystyk Nielsena

* **Widoczność statusu systemu:** komunikaty sukcesu, błędu i loading.
* **Spójność i standardy:** powtarzalne komponenty UI i ikony.
* **Rozpoznawanie zamiast przypominania:** widoczne filtry i statusy zadań.
* **Zapobieganie błędom:** walidacja formularzy.
* **Pomoc w rozpoznawaniu i naprawianiu błędów:** czytelne komunikaty walidacyjne.

## Spełnienie wymagań projektowych

| Wymaganie                       | Realizacja w projekcie                                                |
| ------------------------------- | --------------------------------------------------------------------- |
| Prototyp lo-fi                  | TODO: link do Figmy                                                   |
| Prototyp hi-fi i user flow      | TODO: link do Figmy                                                   |
| Spójność UI z implementacją     | Interfejs zaimplementowany zgodnie z projektem aplikacji Task Manager |
| Komponenty wielokrotnego użytku | Komponenty shadcn/ui oraz podział widoków                             |
| Routing                         | TanStack Router, kilka osobnych widoków                               |
| Biblioteka UI                   | Tailwind CSS + shadcn/ui + Radix UI jako alternatywa dla MUI          |
| Responsive Design               | Breakpointy, sidebar desktopowy, drawer mobilny                       |
| Formularz z walidacją           | React Hook Form + Zod                                                 |
| Dostępność                      | Semantyczny HTML, ARIA, focus, obsługa klawiaturą                     |
| State management                | TanStack Query, useAuth, lokalne stany React                          |
| API / mock                      | REST API + Supabase                                                   |
| GET + POST/PATCH/DELETE         | Zaimplementowane endpointy `/api/todos`                               |
| Obsługa błędów                  | Komunikaty UI, toasty, odpowiedzi API                                 |
| Animacje                        | Motion, CSS transitions                                               |
| Deployment                      | Render                                                                |
| README                          | Ten plik                                                              |
| Publiczne repozytorium          | TODO: link do GitHuba                                                 |

## Komendy

```bash
npm install
npm run dev
npm run build
npm start
npm run lint
npm run format
```

## Autor

Jakub Wiatr
Projekt indywidualny — Zaawansowany Interfejs Użytkownika

## Status projektu

Projekt gotowy do prezentacji po uzupełnieniu:

* linku do publicznego demo,
* linku do publicznego repozytorium GitHub,
* linku do projektu Figma,
* wyniku audytu Lighthouse lub AXE.
