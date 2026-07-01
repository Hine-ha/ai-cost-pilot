import { createClient, SupabaseClient } from "@supabase/supabase-js";

let supabaseAdmin: SupabaseClient | null = null;

export function getMissingSupabaseEnvVars(): string[] {
  const missing: string[] = [];
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()) {
    missing.push("NEXT_PUBLIC_SUPABASE_URL");
  }
  if (
    !process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() &&
    !process.env.SUPABASE_SECRET_KEY?.trim()
  ) {
    missing.push("SUPABASE_SECRET_KEY (or SUPABASE_SERVICE_ROLE_KEY)");
  }
  return missing;
}

export function getSupabaseAdmin(): SupabaseClient {
  if (supabaseAdmin) return supabaseAdmin;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ??
    process.env.SUPABASE_SECRET_KEY?.trim();

  if (!url || !serviceRoleKey) {
    const missing = getMissingSupabaseEnvVars();
    throw new Error(
      `Missing Supabase environment variables: ${missing.join(", ")}`
    );
  }

  supabaseAdmin = createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return supabaseAdmin;
}
