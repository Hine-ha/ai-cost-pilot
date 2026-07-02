import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const apiKey = process.env.TOKENLENS_API_KEY?.trim() ?? null;

  return NextResponse.json({
    api_key: apiKey,
    configured: Boolean(apiKey),
  });
}
