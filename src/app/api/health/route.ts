import { NextResponse } from "next/server";
import { getMissingSupabaseEnvVars } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const missing = getMissingSupabaseEnvVars();

  return NextResponse.json({
    ok: missing.length === 0,
    supabase_configured: missing.length === 0,
    missing_env: missing,
    hint:
      missing.length > 0
        ? "Add missing variables in Vercel → Settings → Environment Variables, then Redeploy."
        : "Supabase environment variables are configured.",
  });
}
