import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { isValidUuid } from "@/lib/validators";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId, jobId, scenarioVersion, questionId, questionIndex } = body;

    if (!isValidUuid(sessionId) || !jobId || !scenarioVersion || !questionId) {
      return NextResponse.json({ error: "Invalid params" }, { status: 400 });
    }

    const { error: viewError } = await supabaseAdmin
      .from("question_views")
      .upsert(
        {
          session_id: sessionId,
          job_id: jobId,
          scenario_version: scenarioVersion,
          question_id: questionId,
          question_index: questionIndex,
        },
        { onConflict: "session_id,question_id", ignoreDuplicates: true }
      );

    if (viewError) throw viewError;

    const { error: sessionError } = await supabaseAdmin
      .from("play_sessions")
      .update({ last_question_id: questionId })
      .eq("id", sessionId);

    if (sessionError) console.warn("[questions/view] session update:", sessionError);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[questions/view]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
