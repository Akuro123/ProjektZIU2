import { useEffect, useMemo, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type AuthState = {
  loading: boolean;
  session: Session | null;
  user: User | null;
};

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    loading: true,
    session: null,
    user: null,
  });

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setState({
        loading: false,
        session: data.session,
        user: data.session?.user ?? null,
      });
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setState({
        loading: false,
        session,
        user: session?.user ?? null,
      });
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const profile = useMemo(() => {
    const metadata = state.user?.user_metadata ?? {};
    const displayName =
      getMetadataString(metadata.display_name) ??
      getMetadataString(metadata.full_name) ??
      state.user?.email?.split("@")[0] ??
      "User";

    return {
      displayName,
      email: state.user?.email ?? "",
      initials: getInitials(displayName, state.user?.email),
    };
  }, [state.user]);

  return {
    ...state,
    profile,
  };
}

function getMetadataString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function getInitials(name: string, email?: string) {
  const parts = name
    .split(/\s+/)
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2);

  if (parts.length) return parts.join("").toUpperCase();
  return email?.slice(0, 2).toUpperCase() ?? "U";
}
