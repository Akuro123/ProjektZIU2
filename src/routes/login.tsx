import { createFileRoute, useNavigate } from "@tanstack/react-router";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { CheckSquare, Loader2, LogIn, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: typeof search.redirect === "string" ? search.redirect : "/",
  }),
  head: () => ({
    meta: [
      { title: "TaskFlow - Login" },
      { name: "description", content: "Zaloguj się do TaskFlow." },
    ],
  }),
});

function LoginPage() {
  const navigate = useNavigate();
  const { redirect } = Route.useSearch();
  const { user, loading } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      navigate({ to: redirect || "/", replace: true });
    }
  }, [loading, navigate, redirect, user]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);

    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) throw error;
        toast.success("Zalogowano");
        navigate({ to: redirect || "/", replace: true });
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            display_name: displayName.trim() || email.trim().split("@")[0],
          },
        },
      });

      if (error) throw error;

      if (data.session) {
        toast.success("Konto utworzone");
        navigate({ to: redirect || "/", replace: true });
      } else {
        toast.success("Konto utworzone. Możesz się teraz zalogować.");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Nie udało się zalogować");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <section className="w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-[var(--shadow-md)]">
        <div className="mb-6 flex items-center gap-3">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-lg shadow-sm"
            style={{ background: "var(--gradient-brand)" }}
          >
            <CheckSquare className="h-5 w-5 text-white" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">TaskFlow</h1>
            <p className="text-sm text-muted-foreground">
              {mode === "login" ? "Zaloguj się do swojego konta." : "Utwórz konto w TaskFlow."}
            </p>
          </div>
        </div>

        <div className="mb-5 grid grid-cols-2 rounded-lg border border-border bg-muted p-1">
          <button
            type="button"
            onClick={() => setMode("login")}
            aria-pressed={mode === "login"}
            className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              mode === "login"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setMode("signup")}
            aria-pressed={mode === "signup"}
            className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              mode === "signup"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Sign up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div className="space-y-1.5">
              <Label htmlFor="display-name">Nazwa</Label>
              <Input
                id="display-name"
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                autoComplete="name"
                placeholder="Jakub"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password">Hasło</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              minLength={6}
              required
            />
          </div>

          <Button type="submit" className="h-11 w-full" disabled={submitting || loading}>
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : mode === "login" ? (
              <LogIn className="h-4 w-4" aria-hidden="true" />
            ) : (
              <UserPlus className="h-4 w-4" aria-hidden="true" />
            )}
            {mode === "login" ? "Zaloguj" : "Utwórz konto"}
          </Button>
        </form>
      </section>
    </main>
  );
}
