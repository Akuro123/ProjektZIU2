import { supabase } from "@/integrations/supabase/client";

export async function getAuthHeaders(extra: HeadersInit = {}) {
  const headers = new Headers(extra);
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return headers;
}

export async function readApiError(response: Response, fallback: string) {
  const payload = (await response.json().catch(() => null)) as { error?: string } | null;
  return payload?.error ?? fallback;
}
