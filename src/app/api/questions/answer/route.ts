import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import {
  isValidFeedbackType,
  isValidOptionId,
  isValidScore,
  isValidUuid,
} from "@/lib/validators";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      sessionId,
      jobId,
      scenarioVersion,
      questionId,
      questionIndex,
      selectedOptionId,
      selectedScore,
      feedbackType,
      questionStartedAt,
      answeredAt,
      answerTimeMs,
    } = body;

    if (
      !isValidUuid(sessionId) ||
      !jobId ||
      !scenarioVersion ||
      !questionId ||
      !isValidOptionId(selectedOptionId) ||
      !isValidScore(selectedScore) ||
      !isValidFeedbackType(feedbackType)
    ) {
      return NextResponse.json({ error: "Invalid params" }, { status: 400 });
    }

    const { error: answerError } = await supabaseAdmin
      .from("question_answers")
      .insert({
        session_id: sessionId,
        job_id: jobId,
        scenario_version: scenarioVersion,
        question_id: questionId,
        question_index: questionIndex,
        selected_option_id: selectedOptionId,
        selected_score: selectedScore,
        feedback_type: feedbackType,
        question_started_at: questionStartedAt,
        answered_at: answeredAt,
        answer_time_ms: answerTimeMs,
      });

    if (answerError) throw answerError;

    const { error: viewError } = await supabaseAdmin
      .from("question_views")
      .update({ answered: true, answered_at: answeredAt })
      .eq("session_id", sessionId)
      .eq("question_id", questionId);

    if (viewError) console.warn("[questions/answer] view update:", viewError);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[questions/answer]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
