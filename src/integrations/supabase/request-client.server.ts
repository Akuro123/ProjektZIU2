import { createClient } from "@supabase/supabase-js";
import type { User } from "@supabase/supabase-js";
import type { Database } from "./types";
import WebSocket from "ws";
export type SupabaseRequestContext = {
  supabase: ReturnType<typeof createSupabaseRequestClient>;
  user: User;
};

export async function getSupabaseRequestContext(
  request: Request,
): Promise<SupabaseRequestContext | Response> {
  const token = getBearerToken(request);
  if (!token) return authError("Musisz być zalogowany, aby zarządzać zadaniami.");

  const supabase = createSupabaseRequestClient(token);
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    return authError("Sesja wygasła. Zaloguj się ponownie.");
  }

  return {
    supabase,
    user: data.user,
  };
}

function createSupabaseRequestClient(token: string) {
  const SUPABASE_URL =
    process.env.SUPABASE_URL ??
    process.env.VITE_SUPABASE_URL ??
    process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_PUBLISHABLE_KEY =
    process.env.SUPABASE_PUBLISHABLE_KEY ??
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
    throw new Error("Missing Supabase URL or publishable key.");
  }

  return createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    auth: {
      storage: undefined,
      persistSession: false,
      autoRefreshToken: false,
    },
    realtime: {
      transport: WebSocket as never,
    },
  });
}

function getBearerToken(request: Request) {
  const header = request.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) return null;
  return header.slice("Bearer ".length).trim() || null;
}

function authError(message: string) {
  return Response.json(
    { error: message, code: "AUTH_REQUIRED" },
    {
      status: 401,
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
