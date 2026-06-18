import { createFileRoute } from "@tanstack/react-router";
import { Bell, LockKeyhole, Rows3, UserRoundCheck } from "lucide-react";

export const Route = createFileRoute("/_app/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "O TaskFlow" },
      { name: "description", content: "Jak działa TaskFlow i jakie decyzje stoją za aplikacją." },
    ],
  }),
});

const principles = [
  {
    icon: LockKeyhole,
    title: "Prywatne zadania",
    text: "Każde konto widzi tylko swoje taski. Backend używa tokena Supabase Auth, a baza pilnuje dostępu przez RLS.",
  },
  {
    icon: Rows3,
    title: "Szybkie skanowanie",
    text: "Dashboard stawia na filtry, priorytety i terminy zamiast dekoracyjnych sekcji, bo to narzędzie do codziennej pracy.",
  },
  {
    icon: Bell,
    title: "Alerty deadline",
    text: "Powiadomienia wyciągają zadania po terminie, deadline w najbliższych 24 godzinach i świeżą aktywność.",
  },
  {
    icon: UserRoundCheck,
    title: "Profil użytkownika",
    text: "Nazwa i email są przechowywane w Supabase Auth, więc konto i dane profilu są spójne między sesjami.",
  },
];

function AboutPage() {
  return (
    <div className="px-4 py-6 sm:px-6 md:py-8 lg:px-8">
      <header className="mb-8 max-w-3xl">
        <h1 className="text-3xl font-bold text-foreground sm:text-4xl">O TaskFlow</h1>
        <p className="mt-2 text-muted-foreground">
          TaskFlow to prywatny task manager dla osób, które chcą szybko dodawać zadania, pilnować
          terminów i rozdzielać pracę między kontami bez ręcznego porządkowania danych.
        </p>
      </header>

      <section className="grid gap-4 lg:grid-cols-2">
        {principles.map((item) => {
          const Icon = item.icon;
          return (
            <article key={item.title} className="rounded-lg border border-border bg-card p-5">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.text}</p>
            </article>
          );
        })}
      </section>

      <section className="mt-8 max-w-3xl rounded-lg border border-border bg-card p-6">
        <h2 className="text-xl font-semibold text-foreground">Jak to działa technicznie</h2>
        <div className="mt-4 grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
          <p>Frontend: React, TanStack Router, TanStack Query, Tailwind CSS i shadcn/ui.</p>
          <p>
            Backend: server routes `/api/todos` z walidacją Zod i prywatnym tokenem użytkownika.
          </p>
          <p>Baza: Supabase Postgres, tabela `todos`, `user_id` oraz Row Level Security.</p>
          <p>Auth: Supabase email/password, profil zapisany w `user_metadata`.</p>
        </div>
      </section>
    </div>
  );
}
