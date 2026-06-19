import { createFileRoute, useNavigate } from "@tanstack/react-router";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { Loader2, LogOut, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/_app/profile")({
  component: ProfilePage,
  head: () => ({
    meta: [
      { title: "TaskFlow - Profile" },
      { name: "description", content: "Zarządzaj profilem użytkownika TaskFlow." },
    ],
  }),
});

function ProfilePage() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [displayName, setDisplayName] = useState(profile.displayName);
  const [email, setEmail] = useState(profile.email);
  const [saving, setSaving] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    setDisplayName(profile.displayName);
    setEmail(profile.email);
  }, [profile.displayName, profile.email]);

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user) return;

    const nextName = displayName.trim();
    const nextEmail = email.trim();

    if (!nextName) {
      toast.error("Podaj nazwę profilu");
      return;
    }

    if (!nextEmail) {
      toast.error("Podaj email");
      return;
    }

    setSaving(true);

    try {
      const updates: Parameters<typeof supabase.auth.updateUser>[0] = {
        data: {
          display_name: nextName,
        },
      };

      if (nextEmail !== user.email) {
        updates.email = nextEmail;
      }

      const { error } = await supabase.auth.updateUser(updates);
      if (error) throw error;

      if (nextEmail !== user.email) {
        toast.success("Zapisano profil. Potwierdź zmianę emaila w wiadomości od Supabase.");
      } else {
        toast.success("Profil zapisany");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Nie udało się zapisać profilu");
    } finally {
      setSaving(false);
    }
  }

  async function handleSignOut() {
    setSigningOut(true);
    const { error } = await supabase.auth.signOut();
    setSigningOut(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Wylogowano");
    navigate({ to: "/login", replace: true });
  }

  return (
    <div className="px-4 py-6 sm:px-6 md:py-8 lg:px-8">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Profile</h1>
        <p className="mt-2 text-muted-foreground">Zarządzaj swoim kontem i danymi profilu.</p>
      </header>

      <section className="max-w-xl rounded-lg border border-border bg-card p-6 shadow-[var(--shadow-sm)]">
        <div className="mb-6 flex items-center gap-4">
          <div
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-xl font-semibold text-white"
            style={{ background: "var(--gradient-brand)" }}
            aria-hidden="true"
          >
            {profile.initials}
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold text-foreground">{profile.displayName}</p>
            <p className="truncate text-sm text-muted-foreground">{profile.email}</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Nazwa</Label>
            <Input
              id="name"
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              autoComplete="name"
              required
            />
          </div>

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
            <p className="text-xs text-muted-foreground">
              Zmiana emaila może wymagać potwierdzenia linkiem wysłanym przez Supabase.
            </p>
          </div>

          <div className="flex flex-col gap-2 pt-2 sm:flex-row">
            <Button type="submit" className="h-10" disabled={saving}>
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <Save className="h-4 w-4" aria-hidden="true" />
              )}
              Zapisz zmiany
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-10"
              onClick={handleSignOut}
              disabled={signingOut}
            >
              {signingOut ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <LogOut className="h-4 w-4" aria-hidden="true" />
              )}
              Wyloguj
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}
