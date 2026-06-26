# TaskFlow — aplikacja Task Manager

TaskFlow to responsywna aplikacja webowa do zarządzania zadaniami, przygotowana jako projekt zaliczeniowy z przedmiotu **Zaawansowany Interfejs Użytkownika**. Aplikacja umożliwia użytkownikowi rejestrację, logowanie, dodawanie zadań, filtrowanie ich, wyszukiwanie, oznaczanie jako ukończone oraz usuwanie.

Projekt obejmuje pełny proces pracy nad interfejsem użytkownika: od prototypowania w Figmie, przez implementację UI, integrację z backendem i bazą danych, aż po deployment publiczny oraz testy dostępności.

## Linki

* **Demo aplikacji:** https://projektziu2.onrender.com/
* **Repozytorium GitHub:** https://github.com/Akuro123/ProjektZIU2
* **Projekt Figma:** https://www.figma.com/design/Iq7uK3z1iSK1ANNA7Nt0uG/FIgma-ZUI?node-id=0-1&t=eeYrmohGKTH8byvA-1
* **Notatka UX:** dostępna w aplikacji w widoku `/about`

## Cel projektu

Celem projektu było zaprojektowanie i zaimplementowanie kompletnego interfejsu użytkownika dla aplikacji typu Task Manager. Aplikacja ma umożliwiać użytkownikowi samodzielne korzystanie z produktu: od logowania, przez zarządzanie zadaniami, aż po otrzymywanie informacji zwrotnych o wykonanych akcjach.

Projekt pokazuje zastosowanie nowoczesnych technologii frontendowych i full-stackowych, obsługę formularzy, walidację danych, komunikację z API, integrację z bazą danych, responsywność, dostępność oraz deployment publiczny.

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
* Kategorie zadań:

  * personal,
  * work,
  * shopping,
  * health,
  * learning,
  * other.
* Priorytety zadań:

  * low,
  * medium,
  * high.
* Komunikaty sukcesu i błędu.
* Toasty po akcjach użytkownika.
* Tryb jasny i ciemny.
* Responsywny layout na desktopie i mobile.
* Widoki dodatkowe:

  * profil,
  * powiadomienia,
  * pomoc,
  * opis UX projektu.

## Stack technologiczny

| Obszar                    | Technologia                             |
| ------------------------- | --------------------------------------- |
| Frontend                  | React 19                                |
| Framework / routing       | TanStack Start, TanStack Router         |
| Budowanie projektu        | Vite                                    |
| UI                        | Tailwind CSS, shadcn/ui, Radix UI       |
| Ikony                     | Lucide React                            |
| Formularze                | React Hook Form                         |
| Walidacja                 | Zod                                     |
| Pobieranie danych / cache | TanStack Query                          |
| Backend / API             | Server Routes w TanStack Start          |
| Baza danych i autoryzacja | Supabase                                |
| Animacje                  | Motion, CSS transitions, tw-animate-css |
| Toasty / feedback         | Sonner                                  |
| Testy E2E / accessibility | Playwright, axe-core                    |
| Lint / jakość kodu        | ESLint, jsx-a11y, Prettier              |
| Deployment                | Render                                  |

W projekcie zamiast MUI zastosowano alternatywny stack UI: **Tailwind CSS + shadcn/ui + Radix UI**. Radix zapewnia dostępne komponenty bazowe, a Tailwind i shadcn/ui pozwalają zbudować spójny, kontrolowany design system.

## Instalacja i uruchomienie lokalne

### 1. Klonowanie repozytorium

```bash
git clone https://github.com/Akuro123/ProjektZIU2.git
cd ProjektZIU2
```

### 2. Instalacja zależności

```bash
npm install
```

### 3. Konfiguracja zmiennych środowiskowych

W głównym katalogu projektu należy utworzyć plik `.env`.

Przykładowa struktura pliku:

```env
VITE_SUPABASE_URL=<your_supabase_url>
VITE_SUPABASE_PUBLISHABLE_KEY=<your_supabase_publishable_key>

SUPABASE_URL=<your_supabase_url>
SUPABASE_PUBLISHABLE_KEY=<your_supabase_publishable_key>
SUPABASE_SERVICE_ROLE_KEY=<your_supabase_service_role_key>

E2E_EMAIL=<test_user_email>
E2E_PASSWORD=<test_user_password>
```

Zmienne `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY` i `SUPABASE_SERVICE_ROLE_KEY` są potrzebne do działania aplikacji z Supabase.

Zmienne `E2E_EMAIL` i `E2E_PASSWORD` są używane wyłącznie lokalnie do testów Playwright, żeby test mógł zalogować użytkownika i sprawdzić dashboard.

Plik `.env` nie powinien być commitowany do repozytorium.

### 4. Uruchomienie aplikacji w trybie developerskim

```bash
npm run dev
```

Lokalnie aplikacja działa pod adresem:

```txt
http://localhost:8080
```

### 5. Build produkcyjny

```bash
npm run build
```

### 6. Uruchomienie wersji produkcyjnej

```bash
npm run start
```

Wersja produkcyjna uruchamiana jest przez plik:

```txt
render-server.mjs
```

Na Renderze aplikacja nasłuchuje na porcie zdefiniowanym przez zmienną `PORT`. Domyślnie Render używa portu `10000`.

## Deployment

Aplikacja została wdrożona na Renderze.

Publiczny adres aplikacji:

```txt
https://projektziu2.onrender.com/
```

Konfiguracja deploymentu:

```txt
Build Command:
npm install && npm run build

Start Command:
npm run start
```

W panelu Render ustawione są zmienne środowiskowe potrzebne do połączenia z Supabase:

```env
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
SUPABASE_URL
SUPABASE_PUBLISHABLE_KEY
SUPABASE_SERVICE_ROLE_KEY
```

Render uruchamia aplikację jako web service. Serwer musi nasłuchiwać na `0.0.0.0` i porcie wskazanym przez zmienną `PORT`.

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
│   ├── error-capture.ts       # Obsługa błędów serwerowych
│   ├── error-page.ts          # Strona błędu SSR
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
├── start.ts                   # Start aplikacji i middleware błędów
└── styles.css                 # Globalne style, tokeny, dark mode, focus
```

Dodatkowe katalogi:

```txt
supabase/
├── setup-todos.sql            # Skrypt tworzenia tabeli todos
└── migrations/                # Migracje bazy danych
```

```txt
tests/
└── a11y.spec.ts               # Testy dostępności Playwright + axe-core
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

Dzięki temu aplikacja spełnia wymaganie routingu pomiędzy wieloma ekranami.

## Backend

Backend projektu jest zrealizowany przez **Server Routes w TanStack Start**. Nie jest to osobny serwer Express, tylko backend osadzony w strukturze aplikacji full-stack.

Najważniejsze pliki backendowe:

```txt
src/routes/api/todos.ts
src/routes/api/todos.$id.ts
src/lib/todos-api.ts
src/integrations/supabase/request-client.server.ts
```

### Endpoint `/api/todos`

Plik:

```txt
src/routes/api/todos.ts
```

Obsługiwane metody:

| Metoda | Endpoint     | Opis                      |
| ------ | ------------ | ------------------------- |
| GET    | `/api/todos` | Pobranie listy zadań      |
| POST   | `/api/todos` | Utworzenie nowego zadania |

Endpoint `GET /api/todos` obsługuje:

* wyszukiwanie przez parametr `q`,
* filtrowanie po statusie,
* filtrowanie po kategorii,
* limit,
* offset,
* paginację.

Przykłady:

```txt
/api/todos?q=zakupy
/api/todos?filter=active
/api/todos?category=work
/api/todos?q=projekt&filter=active&category=work
```

Endpoint `POST /api/todos` służy do tworzenia nowego zadania. Dane są walidowane przez Zod przed zapisem do bazy.

### Endpoint `/api/todos/:id`

Plik:

```txt
src/routes/api/todos.$id.ts
```

Obsługiwane metody:

| Metoda | Endpoint         | Opis                 |
| ------ | ---------------- | -------------------- |
| PATCH  | `/api/todos/:id` | Aktualizacja zadania |
| DELETE | `/api/todos/:id` | Usunięcie zadania    |

`PATCH` pozwala zmienić dane zadania, np. tytuł, opis, kategorię, priorytet, datę wykonania albo status `completed`.

`DELETE` usuwa zadanie użytkownika.

## Baza danych i Supabase

Projekt używa Supabase do:

* autoryzacji użytkowników,
* przechowywania zadań,
* zabezpieczenia danych przez Row Level Security,
* powiązania zadań z konkretnym użytkownikiem.

Tabela `todos` zawiera między innymi pola:

| Pole          | Opis                         |
| ------------- | ---------------------------- |
| `id`          | Identyfikator zadania        |
| `title`       | Tytuł zadania                |
| `description` | Opis zadania                 |
| `completed`   | Status ukończenia            |
| `priority`    | Priorytet: low, medium, high |
| `category`    | Kategoria zadania            |
| `due_date`    | Data wykonania               |
| `user_id`     | Id użytkownika               |
| `created_at`  | Data utworzenia              |
| `updated_at`  | Data ostatniej aktualizacji  |

Najważniejszy element bezpieczeństwa to `user_id` oraz polityki RLS. Dzięki nim użytkownik może widzieć, dodawać, edytować i usuwać tylko swoje zadania.

## Formularze i walidacja

W projekcie znajdują się formularze:

* logowania,
* rejestracji,
* dodawania zadania,
* edycji profilu.

Formularze są obsługiwane przez **React Hook Form**, a walidacja przez **Zod**.

Walidowane są między innymi:

* wymagany tytuł zadania,
* długość pól tekstowych,
* poprawność kategorii,
* poprawność priorytetu,
* data wykonania,
* poprawność przesyłanych danych do API,
* dane logowania i rejestracji.

W projekcie wykorzystywane jest także czyszczenie danych tekstowych przez `trim()`. Dotyczy to między innymi:

* emaila,
* nazwy użytkownika,
* tytułu zadania,
* opisu zadania,
* frazy wyszukiwania.

Przykład:

```txt
"   zakupy   " → "zakupy"
```

Hasło nie powinno być automatycznie trimowane, ponieważ spacja może być częścią hasła.

Walidacja jest wykonywana zarówno po stronie klienta, jak i po stronie backendu. Dzięki temu aplikacja nie opiera się wyłącznie na zabezpieczeniach frontendowych.

## Wyszukiwarka

Wyszukiwarka zadań działa przez parametr `q` w endpointcie:

```txt
GET /api/todos?q=...
```

Użytkownik wpisuje frazę w polu wyszukiwania, a frontend przekazuje ją do API. Backend wyszukuje zadania po tytule i opisie.

Przykład:

```txt
/api/todos?q=mleko
```

Wyszukiwanie może działać razem z filtrami:

```txt
/api/todos?q=zakupy&filter=active&category=shopping
```

Parametr wyszukiwania jest czyszczony przez `trim()`, dlatego przypadkowe spacje na początku lub końcu frazy nie wpływają na wynik.

## State management

Do obsługi stanu danych użyto **TanStack Query**.

TanStack Query odpowiada za:

* pobieranie zadań,
* cache danych,
* obsługę stanów `loading`,
* obsługę stanów `success`,
* obsługę stanów `error`,
* odświeżanie danych po dodaniu, edycji lub usunięciu zadania.

Lokalne stany interfejsu są obsługiwane przez React `useState`. Dotyczy to między innymi:

* otwarcia modala,
* aktualnego filtra,
* wybranej kategorii,
* widoku listy lub siatki,
* trybu jasnego i ciemnego,
* menu mobilnego.

Stan użytkownika i sesji obsługiwany jest przez Supabase oraz własny hook:

```txt
src/hooks/use-auth.ts
```

## Elementy UI

Projekt korzysta z komponentów **shadcn/ui** i **Radix UI**. Komponenty bazowe znajdują się w folderze:

```txt
src/components/ui
```

Najważniejsze używane elementy UI:

* `Button`,
* `Input`,
* `Textarea`,
* `Label`,
* `Dialog`,
* `Select`,
* `Card`,
* `Badge`,
* `Avatar`,
* `Dropdown Menu`,
* `Popover`,
* `Tooltip`,
* `Toaster`,
* `Alert`,
* `Skeleton`.

Główne elementy interfejsu:

* sidebar,
* topbar,
* dashboard,
* karty zadań,
* formularz dodawania zadania,
* formularz logowania,
* formularz rejestracji,
* widok profilu,
* widok powiadomień,
* widok pomocy,
* widok opisu UX.

Komponent `Carousel` nie jest używany w obecnej wersji aplikacji. Jeżeli został usunięty razem z zależnością `embla-carousel-react`, nie wpływa to na działanie aktualnych widoków.

## Animacje i mikrointerakcje

W projekcie zastosowano animacje i mikrointerakcje poprawiające odbiór aplikacji.

Wykorzystane rozwiązania:

* `motion/react`,
* `AnimatePresence`,
* `motion.div`,
* `motion.button`,
* `motion.article`,
* klasy `animate-in` i `animate-out` z `tw-animate-css`,
* klasy Tailwind `animate-spin` i `animate-pulse`,
* przejścia CSS.

Przykłady animacji:

* płynne pojawianie się kart zadań,
* delikatne przesunięcie kart przy wejściu,
* efekt hover na kartach,
* skalowanie przycisku po najechaniu,
* mikrointerakcja kliknięcia,
* animowany spinner ładowania,
* animowane dialogi,
* animowane menu mobilne,
* płynne pojawianie się toastów.

Projekt wspiera także `prefers-reduced-motion`. Jeśli użytkownik ma w systemie ustawione ograniczenie animacji, aplikacja redukuje animacje do minimum. Jest to ważne z perspektywy dostępności.

## Responsive Design

Aplikacja została zaprojektowana responsywnie.

Zastosowane rozwiązania:

* layout desktopowy z bocznym menu,
* mobilny drawer zamiast stałego sidebaru,
* breakpointy Tailwind CSS,
* widok listy i siatki,
* elastyczne karty zadań,
* topbar dostosowany do szerokości ekranu,
* przyciski i elementy interaktywne dostosowane do ekranów dotykowych,
* minimalna wysokość elementów interaktywnych wspierająca wygodną obsługę na mobile.

Aplikacja jest wygodna zarówno na komputerze, jak i na urządzeniach mobilnych.

## Dostępność — WCAG

W projekcie zastosowano elementy poprawiające dostępność:

* semantyczny HTML,
* elementy `main`, `nav`, `aside`, `header`,
* `aria-label` dla przycisków ikonowych,
* `aria-pressed` dla przełączników i filtrów,
* `aria-current` dla aktywnych elementów nawigacji,
* widoczny stan fokusu,
* obsługa klawiaturą,
* `skip-link` do przejścia do głównej treści,
* komponenty Radix UI wspierające focus-trap i obsługę klawiatury,
* wsparcie `prefers-reduced-motion`,
* tryb jasny i ciemny z poprawionymi kontrastami,
* testy automatyczne Playwright + axe-core,
* reguły accessibility w ESLint przez `eslint-plugin-jsx-a11y`.

### Wynik Lighthouse

Audyt Lighthouse wykonany dla wdrożonej aplikacji:

| Kategoria      | Wynik   |
| -------------- | ------- |
| Performance    | 91/100  |
| Accessibility  | 94/100  |
| Best Practices | 100/100 |
| SEO            | 100/100 |

### Testy axe-core

Automatyczne testy dostępności zostały wykonane z użyciem:

```txt
Playwright + @axe-core/playwright
```

Wynik:

```txt
3 passed
```

Testy sprawdzają:

* ekran logowania,
* tryb rejestracji,
* dashboard po zalogowaniu.

Nazwy testów:

```txt
Accessibility › login page has no automatically detectable WCAG A/AA violations
Accessibility › signup mode has no automatically detectable WCAG A/AA violations
Accessibility › dashboard has no automatically detectable WCAG A/AA violations
```

## Testowanie

Projekt zawiera testy E2E i testy dostępności.

Biblioteki użyte do testów:

* `@playwright/test`,
* `@axe-core/playwright`,
* `eslint-plugin-jsx-a11y`.

Dostępne komendy:

```bash
npm run lint
npm run test:e2e
npm run test:a11y
npm run test:a11y:headed
npm run test:a11y:ui
npm run test:report
```

### Lint

```bash
npm run lint
```

Komenda uruchamia ESLint i sprawdza kod, w tym reguły dostępności dla JSX/React.

### Testy dostępności

```bash
npm run test:a11y
```

Komenda uruchamia Playwright i axe-core dla pliku:

```txt
tests/a11y.spec.ts
```

### Podgląd testów w UI

```bash
npm run test:a11y:ui
```

Komenda otwiera interfejs Playwrighta, w którym można uruchamiać testy ręcznie i obserwować kolejne kroki.

### Testy w widocznej przeglądarce

```bash
npm run test:a11y:headed
```

Komenda uruchamia testy w widocznym oknie przeglądarki.

## Lighthouse

Lighthouse można uruchomić z poziomu Chrome DevTools albo z terminala.

Dostępne skrypty:

```bash
npm run lighthouse
npm run lighthouse:login
```

Przykładowe uruchomienie ręczne:

```bash
npx lighthouse https://projektziu2.onrender.com/ --view
```

Uruchomienie w trybie incognito:

```bash
npx lighthouse https://projektziu2.onrender.com/ --view --chrome-flags="--incognito"
```

## Prototypowanie UI

Projekt został poprzedzony etapem projektowym w Figmie.

Link do projektu:

```txt
https://www.figma.com/design/Iq7uK3z1iSK1ANNA7Nt0uG/FIgma-ZUI?node-id=0-1&t=eeYrmohGKTH8byvA-1
```

W projekcie figmowym uwzględniono:

* szkic podstawowego układu aplikacji,
* widok logowania,
* dashboard,
* układ kart zadań,
* podstawowy user flow,
* finalną kolorystykę i typografię,
* rozplanowanie głównych elementów interfejsu.

## Notatka UX

Projekt kierowany jest do użytkowników, którzy chcą szybko organizować codzienne zadania, nadawać im priorytety i kontrolować postęp pracy.

### Przykładowa persona

Anna, 27 lat, pracuje hybrydowo i codziennie zarządza wieloma małymi zadaniami. Potrzebuje aplikacji, która pozwoli jej szybko dodać zadanie, oznaczyć priorytet, sprawdzić aktywne rzeczy do zrobienia i łatwo odróżnić zadania ważne od mniej pilnych.

### Kluczowe decyzje projektowe

* Najważniejsza akcja, czyli dodanie zadania, jest łatwo dostępna.
* Priorytety i kategorie pomagają szybciej rozpoznawać typ zadania.
* Filtry pozwalają ograniczyć liczbę widocznych zadań.
* Wyszukiwarka pozwala szybko znaleźć konkretne zadanie.
* Toasty i loadingi informują użytkownika o stanie systemu.
* Widok mobilny używa drawer menu, aby nie zabierać miejsca na ekranie.
* Tryb ciemny poprawia komfort pracy w różnych warunkach.
* Elementy interaktywne mają widoczny focus i odpowiednie stany hover.
* Kolory zostały poprawione pod kątem kontrastu WCAG.

### Odniesienie do heurystyk Nielsena

| Heurystyka                                 | Realizacja                                                      |
| ------------------------------------------ | --------------------------------------------------------------- |
| Widoczność statusu systemu                 | Toasty, loadingi, komunikaty sukcesu i błędu                    |
| Zgodność z rzeczywistością                 | Kategorie i priorytety odpowiadają typowym zadaniom użytkownika |
| Kontrola i swoboda użytkownika             | Możliwość usuwania, filtrowania i oznaczania zadań              |
| Spójność i standardy                       | Powtarzalne komponenty UI, ikony i układ                        |
| Zapobieganie błędom                        | Walidacja formularzy po stronie klienta i API                   |
| Rozpoznawanie zamiast przypominania        | Widoczne filtry, statusy i kategorie                            |
| Elastyczność i efektywność                 | Wyszukiwarka, filtry, widok listy/siatki                        |
| Estetyka i minimalizm                      | Czytelny dashboard i ograniczona liczba akcji na ekranie        |
| Pomoc w rozpoznawaniu i naprawianiu błędów | Komunikaty walidacyjne i toasty                                 |
| Pomoc i dokumentacja                       | Widok `/help` oraz opis UX w `/about`                           |

## Spełnienie wymagań projektowych

| Wymaganie                       | Realizacja w projekcie                                        |
| ------------------------------- | ------------------------------------------------------------- |
| Prototyp lo-fi                  | Projekt w Figmie                                              |
| Prototyp hi-fi i user flow      | Projekt w Figmie                                              |
| Spójność UI z implementacją     | Interfejs zaimplementowany jako aplikacja Task Manager        |
| Komponenty wielokrotnego użytku | Komponenty shadcn/ui oraz podział widoków                     |
| Routing                         | TanStack Router, kilka osobnych widoków                       |
| Biblioteka UI                   | Tailwind CSS + shadcn/ui + Radix UI jako alternatywa dla MUI  |
| Responsive Design               | Breakpointy, sidebar desktopowy, drawer mobilny               |
| Formularz z walidacją           | React Hook Form + Zod                                         |
| Dostępność                      | Semantyczny HTML, ARIA, focus, obsługa klawiaturą, testy axe  |
| State management                | TanStack Query, useAuth, lokalne stany React                  |
| API / mock                      | REST API + Supabase                                           |
| GET + POST/PATCH/DELETE         | Zaimplementowane endpointy `/api/todos`                       |
| Obsługa błędów                  | Komunikaty UI, toasty, odpowiedzi API                         |
| Animacje                        | Motion, CSS transitions, tw-animate-css                       |
| Deployment                      | Render                                                        |
| Testy                           | Playwright + axe-core, ESLint + jsx-a11y                      |
| Lighthouse                      | Performance 91, Accessibility 94, Best Practices 100, SEO 100 |
| README                          | Ten plik                                                      |
| Publiczne repozytorium          | GitHub                                                        |

## Komendy

Instalacja zależności:

```bash
npm install
```

Uruchomienie developerskie:

```bash
npm run dev
```

Build produkcyjny:

```bash
npm run build
```

Uruchomienie wersji produkcyjnej:

```bash
npm run start
```

Formatowanie kodu:

```bash
npm run format
```

Lint:

```bash
npm run lint
```

Testy E2E:

```bash
npm run test:e2e
```

Testy dostępności:

```bash
npm run test:a11y
```

Testy dostępności z podglądem UI:

```bash
npm run test:a11y:ui
```

Testy dostępności w widocznej przeglądarce:

```bash
npm run test:a11y:headed
```

Raport Playwright:

```bash
npm run test:report
```

Lighthouse dla głównego widoku:

```bash
npm run lighthouse
```

Lighthouse dla logowania:

```bash
npm run lighthouse:login
```

## Najważniejsze pliki

| Plik                                                 | Opis                                                        |
| ---------------------------------------------------- | ----------------------------------------------------------- |
| `src/routes/_app.tsx`                                | Główny layout aplikacji, sidebar, topbar, menu mobilne      |
| `src/routes/_app.index.tsx`                          | Dashboard, lista zadań, filtry, formularz dodawania zadania |
| `src/routes/login.tsx`                               | Logowanie i rejestracja                                     |
| `src/routes/_app.profile.tsx`                        | Profil użytkownika                                          |
| `src/routes/_app.notifications.tsx`                  | Powiadomienia                                               |
| `src/routes/api/todos.ts`                            | API: pobieranie i tworzenie zadań                           |
| `src/routes/api/todos.$id.ts`                        | API: aktualizacja i usuwanie zadań                          |
| `src/lib/todos-api.ts`                               | Schematy walidacji i helpery API                            |
| `src/hooks/use-auth.ts`                              | Hook obsługujący użytkownika i sesję                        |
| `src/integrations/supabase/request-client.server.ts` | Serwerowy klient Supabase dla requestu                      |
| `src/styles.css`                                     | Globalne style, tokeny kolorów, dark mode, accessibility    |
| `tests/a11y.spec.ts`                                 | Testy dostępności Playwright + axe-core                     |
| `render-server.mjs`                                  | Serwer produkcyjny dla Rendera                              |

## Autor

Jakub Wiatr

Projekt indywidualny — Zaawansowany Interfejs Użytkownika

## Status projektu

Projekt został ukończony i jest gotowy do prezentacji oraz oceny.

Zawiera:

* kompletny interfejs użytkownika,
* routing między widokami,
* backend oparty o TanStack Start,
* bazę danych i autoryzację Supabase,
* formularze z walidacją,
* responsywny layout,
* tryb jasny i ciemny,
* animacje i mikrointerakcje,
* testy dostępności Playwright + axe-core,
* audyt Lighthouse,
* deployment publiczny na Renderze,
* dokumentację techniczną i projektową.
