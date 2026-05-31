export type QuestionStatus =
  | "good"
  | "tooEasy"
  | "tooHard"
  | "highDropoff"
  | "needsReview";

export type QuestionStat = {
  jobId: string;
  scenarioVersion: string;
  questionId: string;
  questionIndex: number;
  title?: string;
  phase?: string;
  businessProcess?: string;
  views: number;
  answers: number;
  dropoffRate: number;
  goodRate: number;
  normalRate: number;
  badRate: number;
  averageAnswerTimeMs: number;
  status: QuestionStatus;
};

export function computeQuestionStatus(stat: QuestionStat): QuestionStatus {
  if (stat.answers < 30) return "needsReview";

  if (stat.dropoffRate >= 15) return "highDropoff";

  if (
    stat.goodRate >= 75 &&
    stat.averageAnswerTimeMs <= 8000 &&
    stat.badRate < 5
  )
    return "tooEasy";

  if (stat.badRate >= 30 || stat.averageAnswerTimeMs >= 30000) return "tooHard";

  if (
    stat.goodRate >= 40 &&
    stat.goodRate <= 60 &&
    stat.normalRate >= 30 &&
    stat.normalRate <= 55 &&
    stat.badRate >= 5 &&
    stat.badRate <= 20 &&
    stat.averageAnswerTimeMs >= 10000 &&
    stat.averageAnswerTimeMs <= 20000 &&
    stat.dropoffRate <= 10
  )
    return "good";

  return "needsReview";
}

export function formatMs(ms: number): string {
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}秒`;
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.round((ms % 60000) / 1000);
  return `${minutes}分${seconds}秒`;
}
