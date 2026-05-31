import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { computeQuestionStatus } from "@/lib/analytics";
import { getJobById } from "@/data/jobs";

function getDateFilter(range: string): string | null {
  if (range === "7d") {
    return new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  }
  if (range === "30d") {
    return new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  }
  return null;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const jobIdFilter = searchParams.get("jobId") || null;
    const versionFilter = searchParams.get("version") || null;
    const range = searchParams.get("range") || "30d";
    const dateFrom = getDateFilter(range);
    const cutoff = new Date(Date.now() - 30 * 60 * 1000).toISOString();

    let sessionQuery = supabaseAdmin
      .from("play_sessions")
      .select("*")
      .lt("started_at", cutoff);
    if (jobIdFilter) sessionQuery = sessionQuery.eq("job_id", jobIdFilter);
    if (versionFilter)
      sessionQuery = sessionQuery.eq("scenario_version", versionFilter);
    if (dateFrom) sessionQuery = sessionQuery.gte("started_at", dateFrom);
    const { data: sessions } = await sessionQuery;

    const completed = (sessions ?? []).filter((s) => s.completed);
    const totalSessions = (sessions ?? []).length;
    const completedSessions = completed.length;
    const completionRate =
      totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0;
    const averageScore =
      completedSessions > 0
        ? completed.reduce((sum, s) => sum + (s.result_score_percent ?? 0), 0) /
          completedSessions
        : 0;

    const playTimes = completed
      .filter((s) => s.completed_at && s.started_at)
      .map(
        (s) =>
          new Date(s.completed_at).getTime() - new Date(s.started_at).getTime()
      );
    const averagePlayTimeMs =
      playTimes.length > 0
        ? playTimes.reduce((a, b) => a + b, 0) / playTimes.length
        : 0;

    let answerQuery = supabaseAdmin
      .from("question_answers")
      .select("*")
      .gte("answer_time_ms", 1000)
      .lte("answer_time_ms", 300000);
    if (jobIdFilter) answerQuery = answerQuery.eq("job_id", jobIdFilter);
    if (versionFilter)
      answerQuery = answerQuery.eq("scenario_version", versionFilter);
    if (dateFrom) answerQuery = answerQuery.gte("answered_at", dateFrom);
    const { data: answers } = await answerQuery;

    const averageAnswerTimeMs =
      (answers ?? []).length > 0
        ? (answers ?? []).reduce((sum, a) => sum + a.answer_time_ms, 0) /
          (answers ?? []).length
        : 0;

    const scoreBands = [
      { label: "85-100", min: 85, max: 100 },
      { label: "70-84", min: 70, max: 84 },
      { label: "55-69", min: 55, max: 69 },
      { label: "40-54", min: 40, max: 54 },
      { label: "0-39", min: 0, max: 39 },
    ];
    const scoreDistribution = scoreBands.map((band) => {
      const count = completed.filter(
        (s) =>
          (s.result_score_percent ?? 0) >= band.min &&
          (s.result_score_percent ?? 0) <= band.max
      ).length;
      return {
        label: band.label,
        count,
        rate: completedSessions > 0 ? (count / completedSessions) * 100 : 0,
      };
    });

    type SessionRow = NonNullable<typeof sessions>[number];
    const jobGroups: Record<string, Record<string, SessionRow[]>> = {};
    for (const s of sessions ?? []) {
      if (!jobGroups[s.job_id]) jobGroups[s.job_id] = {};
      if (!jobGroups[s.job_id][s.scenario_version])
        jobGroups[s.job_id][s.scenario_version] = [];
      jobGroups[s.job_id][s.scenario_version]!.push(s);
    }
    const jobSummaries = Object.entries(jobGroups).flatMap(([jid, versions]) =>
      Object.entries(versions).map(([ver, sess]) => {
        const comp = sess.filter((s) => s.completed);
        const answerSubset = (answers ?? []).filter(
          (a) => a.job_id === jid && a.scenario_version === ver
        );
        const avgAnswer =
          answerSubset.length > 0
            ? answerSubset.reduce((sum, a) => sum + a.answer_time_ms, 0) /
              answerSubset.length
            : 0;
        return {
          jobId: jid,
          scenarioVersion: ver,
          sessions: sess.length,
          completedSessions: comp.length,
          completionRate:
            sess.length > 0 ? (comp.length / sess.length) * 100 : 0,
          averageScore:
            comp.length > 0
              ? comp.reduce((s, r) => s + (r.result_score_percent ?? 0), 0) /
                comp.length
              : 0,
          averageAnswerTimeMs: avgAnswer,
        };
      })
    );

    let viewQuery = supabaseAdmin
      .from("question_views")
      .select("*")
      .lt("viewed_at", cutoff);
    if (jobIdFilter) viewQuery = viewQuery.eq("job_id", jobIdFilter);
    if (versionFilter) viewQuery = viewQuery.eq("scenario_version", versionFilter);
    if (dateFrom) viewQuery = viewQuery.gte("viewed_at", dateFrom);
    const { data: views } = await viewQuery;

    const questionKeys = Array.from(
      new Set(
        (views ?? []).map((v) => `${v.job_id}||${v.scenario_version}||${v.question_id}||${v.question_index}`)
      )
    );

    const questionStats = questionKeys.map((key) => {
      const [jid, ver, qid, qi] = key.split("||");
      const qViews = (views ?? []).filter(
        (v) =>
          v.job_id === jid &&
          v.scenario_version === ver &&
          v.question_id === qid
      );
      const qAnswers = (answers ?? []).filter(
        (a) =>
          a.job_id === jid &&
          a.scenario_version === ver &&
          a.question_id === qid
      );
      const viewCount = qViews.length;
      const answerCount = qAnswers.length;
      const dropoffRate =
        viewCount > 0
          ? ((viewCount - qViews.filter((v) => v.answered).length) /
              viewCount) *
            100
          : 0;
      const goodCount = qAnswers.filter((a) => a.feedback_type === "good").length;
      const normalCount = qAnswers.filter(
        (a) => a.feedback_type === "normal"
      ).length;
      const badCount = qAnswers.filter((a) => a.feedback_type === "bad").length;
      const avgTime =
        qAnswers.length > 0
          ? qAnswers.reduce((s, a) => s + a.answer_time_ms, 0) / qAnswers.length
          : 0;

      const job = getJobById(jid);
      const question = job?.questions.find((q) => q.id === qid);

      const stat = {
        jobId: jid,
        scenarioVersion: ver,
        questionId: qid,
        questionIndex: parseInt(qi, 10),
        title: question?.title,
        phase: question?.phase,
        businessProcess: question?.businessProcess,
        views: viewCount,
        answers: answerCount,
        dropoffRate,
        goodRate:
          answerCount > 0 ? (goodCount / answerCount) * 100 : 0,
        normalRate:
          answerCount > 0 ? (normalCount / answerCount) * 100 : 0,
        badRate:
          answerCount > 0 ? (badCount / answerCount) * 100 : 0,
        averageAnswerTimeMs: avgTime,
        status: "needsReview" as const,
      };
      return { ...stat, status: computeQuestionStatus(stat) };
    });

    questionStats.sort((a, b) => a.questionIndex - b.questionIndex);

    const optionKeys = Array.from(
      new Set(
        (answers ?? []).map(
          (a) =>
            `${a.job_id}||${a.scenario_version}||${a.question_id}||${a.selected_option_id}`
        )
      )
    );
    const optionStats = optionKeys.map((key) => {
      const [jid, ver, qid, oid] = key.split("||");
      const subset = (answers ?? []).filter(
        (a) =>
          a.job_id === jid &&
          a.scenario_version === ver &&
          a.question_id === qid &&
          a.selected_option_id === oid
      );
      const total = (answers ?? []).filter(
        (a) =>
          a.job_id === jid &&
          a.scenario_version === ver &&
          a.question_id === qid
      ).length;
      const avgTime =
        subset.length > 0
          ? subset.reduce((s, a) => s + a.answer_time_ms, 0) / subset.length
          : 0;
      return {
        jobId: jid,
        scenarioVersion: ver,
        questionId: qid,
        optionId: oid,
        selectedCount: subset.length,
        selectedRate: total > 0 ? (subset.length / total) * 100 : 0,
        averageAnswerTimeMs: avgTime,
      };
    });

    return NextResponse.json({
      summary: {
        totalSessions,
        completedSessions,
        completionRate,
        averageScore,
        averagePlayTimeMs,
        averageAnswerTimeMs,
      },
      scoreDistribution,
      jobSummaries,
      questionStats,
      optionStats,
    });
  } catch (err) {
    console.error("[admin/analytics]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
