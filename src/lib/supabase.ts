import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let _browserClient: SupabaseClient | null = null;

/**
 * Returns the shared browser-side Supabase client.
 * Auth state is persisted in localStorage on the client.
 * Call only in "use client" components.
 */
export function getBrowserClient(): SupabaseClient {
  if (_browserClient) return _browserClient;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url) throw new Error("Missing required environment variable: NEXT_PUBLIC_SUPABASE_URL");
  if (!anonKey) throw new Error("Missing required environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY");
  _browserClient = createClient(url, anonKey);
  return _browserClient;
}

/**
 * Creates a short-lived server-side Supabase client for API routes.
 * Sets the caller's JWT in the Authorization header so RLS is enforced.
 * Use `supabase.auth.getUser(accessToken)` to verify the caller's identity.
 */
export function createServerClient(authHeader: string | null): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url) throw new Error("Missing required environment variable: NEXT_PUBLIC_SUPABASE_URL");
  if (!anonKey) throw new Error("Missing required environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY");
  const accessToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  return createClient(url, anonKey, {
    global: {
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

/**
 * Extracts the raw Bearer token from an Authorization header.
 * Returns null when the header is absent or malformed.
 */
export function extractAccessToken(authHeader: string | null): string | null {
  if (!authHeader?.startsWith("Bearer ")) return null;
  return authHeader.slice(7);
}
