import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { isValidUuid } from "@/lib/validators";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId, totalScore, maxScore, resultScorePercent } = body;

    if (!isValidUuid(sessionId)) {
      return NextResponse.json({ error: "Invalid sessionId" }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from("play_sessions")
      .update({
        completed: true,
        completed_at: new Date().toISOString(),
        total_score: totalScore,
        max_score: maxScore,
        result_score_percent: resultScorePercent,
        abandoned_question_id: null,
      })
      .eq("id", sessionId);

    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[sessions/complete]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
