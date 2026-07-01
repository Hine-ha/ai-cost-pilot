import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { buildDashboardResponse } from "@/lib/dashboard-aggregator";
import {
  getMissingSupabaseEnvVars,
  getSupabaseAdmin,
} from "@/lib/supabase/server";
import { UsageEventRow } from "@/types/usage";

export const dynamic = "force-dynamic";

const BASE_SELECT =
  "id, project_name, model, input_tokens, output_tokens, cost, timestamp, user_id, created_at";
const EXTENDED_SELECT = `${BASE_SELECT}, status, cache_saved`;

export async function GET(request: NextRequest) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const supabase = getSupabaseAdmin();
    const projectFilter = request.nextUrl.searchParams.get("project");

    let data: UsageEventRow[] | null = null;
    let error: { message?: string; hint?: string } | null = null;

    const extended = await supabase
      .from("usage_events")
      .select(EXTENDED_SELECT)
      .eq("user_id", userId)
      .order("timestamp", { ascending: false });

    data = (extended.data ?? null) as UsageEventRow[] | null;
    error = extended.error;

    if (
      error?.message?.includes("cache_saved") ||
      error?.message?.includes("status") ||
      error?.message?.includes("user_id")
    ) {
      const fallback = await supabase
        .from("usage_events")
        .select(BASE_SELECT)
        .eq("user_id", userId)
        .order("timestamp", { ascending: false });

      data = (fallback.data ?? null) as UsageEventRow[] | null;
      error = fallback.error;
    }

    if (error) {
      console.error("[GET /api/dashboard]", error);
      return NextResponse.json(
        {
          error: "Failed to load usage statistics.",
          ...(process.env.NODE_ENV === "development" && {
            detail: error.message,
            hint: error.hint,
          }),
        },
        { status: 500 }
      );
    }

    const allRows = (data ?? []) as UsageEventRow[];
    const availableProjects = Array.from(
      new Set(allRows.map((row) => row.project_name))
    ).sort();

    const filteredRows =
      projectFilter && projectFilter !== "all"
        ? allRows.filter((row) => row.project_name === projectFilter)
        : allRows;

    const dashboard = buildDashboardResponse(filteredRows);

    return NextResponse.json({
      ...dashboard,
      available_projects: availableProjects,
      selected_project:
        projectFilter && projectFilter !== "all" ? projectFilter : null,
    });
  } catch (error) {
    console.error("[GET /api/dashboard]", error);
    const message =
      error instanceof Error ? error.message : "Internal server error.";
    const missing = getMissingSupabaseEnvVars();
    const status = missing.length > 0 ? 503 : 500;

    return NextResponse.json(
      {
        error: message,
        missing_env: missing,
        hint: "Vercel → Settings → Environment Variables → add variables → Redeploy",
      },
      { status }
    );
  }
}
