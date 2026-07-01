import { NextResponse } from "next/server";
import { aggregateUsageByProject } from "@/lib/dashboard-aggregator";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { UsageEventRow } from "@/types/usage";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("usage_events")
      .select(
        "id, project_name, model, input_tokens, output_tokens, cost, timestamp, created_at"
      )
      .order("timestamp", { ascending: false });

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

    const dashboard = aggregateUsageByProject((data ?? []) as UsageEventRow[]);

    return NextResponse.json(dashboard);
  } catch (error) {
    console.error("[GET /api/dashboard]", error);
    const message =
      error instanceof Error ? error.message : "Internal server error.";
    const status = message.includes("Missing NEXT_PUBLIC_SUPABASE_URL")
      ? 503
      : 500;

    return NextResponse.json({ error: message }, { status });
  }
}
