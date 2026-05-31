import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { sanitizePlayerName } from "@/lib/validators";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { jobId, scenarioVersion, playerName, userAgent, referrer } = body;

    if (!jobId || !scenarioVersion) {
      return NextResponse.json(
        { error: "jobId and scenarioVersion are required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("play_sessions")
      .insert({
        job_id: jobId,
        scenario_version: scenarioVersion,
        player_name: sanitizePlayerName(playerName),
        user_agent: userAgent ?? null,
        referrer: referrer ?? null,
      })
      .select("id")
      .single();

    if (error) throw error;

    return NextResponse.json({ sessionId: data.id });
  } catch (err) {
    console.error("[sessions/start]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
