import { createFileRoute } from "@tanstack/react-router";
import { AlertCircle, Bell, KeyRound, ListChecks, UserRound } from "lucide-react";

export const Route = createFileRoute("/_app/help")({
  component: HelpPage,
  head: () => ({
    meta: [
      { title: "Pomoc - TaskFlow" },
      { name: "description", content: "Pomoc dotycząca kont, zadań i powiadomień w TaskFlow." },
    ],
  }),
});

const topics = [
  {
    icon: KeyRound,
    q: "Nie mogę się zalogować. Co sprawdzić?",
    a: "Upewnij się, że konto istnieje w Supabase Authentication, używasz właściwego emaila i hasła oraz że Email provider jest włączony. Jeśli konto powstało przed wyłączeniem potwierdzeń email, najprościej utworzyć je ponownie.",
  },
  {
    icon: ListChecks,
    q: "Dlaczego nie widzę tasków z drugiego konta?",
    a: "To celowe. Taski są przypisane do `user_id`, a RLS w Supabase pozwala czytać i edytować wyłącznie zadania aktualnie zalogowanego użytkownika.",
  },
  {
    icon: Bell,
    q: "Skąd biorą się powiadomienia?",
    a: "Aplikacja analizuje Twoje taski: nowe zadania, ukończone zadania, deadline w ciągu 24 godzin oraz zadania po terminie. Dzwonek pokazuje skrót, a ekran Notifications pełną listę.",
  },
  {
    icon: UserRound,
    q: "Jak zmienić nazwę albo email?",
    a: "Wejdź w Profile, wpisz nową nazwę lub email i zapisz. Nazwa zmienia się od razu, a zmiana emaila może zależeć od ustawień Supabase Auth.",
  },
  {
    icon: AlertCircle,
    q: "Widzę pustą listę po migracji user_id.",
    a: "Starsze taski utworzone przed prywatnymi kontami nie miały `user_id`, więc RLS je ukrywa. Nowe zadania będą już automatycznie przypisane do Twojego konta.",
  },
];

function HelpPage() {
  return (
    <div className="px-4 py-6 sm:px-6 md:py-8 lg:px-8">
      <header className="mb-6 max-w-3xl">
        <h1 className="text-3xl font-bold text-foreground">Help & Support</h1>
        <p className="mt-2 text-muted-foreground">
          Krótka instrukcja obsługi kont, prywatnych tasków, deadline'ów i typowych błędów.
        </p>
      </header>

      <section className="max-w-3xl space-y-3">
        {topics.map((topic) => {
          const Icon = topic.icon;
          return (
            <details
              key={topic.q}
              className="group rounded-lg border border-border bg-card p-4 shadow-[var(--shadow-sm)]"
            >
              <summary className="flex cursor-pointer list-none items-center gap-3 font-medium text-foreground">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <span>{topic.q}</span>
              </summary>
              <p className="mt-3 pl-12 text-sm leading-6 text-muted-foreground">{topic.a}</p>
            </details>
          );
        })}
      </section>
    </div>
  );
}
