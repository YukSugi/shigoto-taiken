import type { JobRpg } from "@/data/jobs/types";

export type PlayerAnswer = {
  questionId: string;
  questionIndex: number;
  selectedOptionId: "A" | "B" | "C" | "D";
  score: number;
  feedbackType: "good" | "strong_normal" | "normal" | "risky_bad" | "bad";
  questionStartedAt: string;
  answeredAt: string;
  answerTimeMs: number;
};

export const calculateTotalScore = (answers: PlayerAnswer[]): number => {
  return answers.reduce((sum, answer) => sum + answer.score, 0);
};

export const calculateMaxScore = (job: JobRpg): number => {
  return job.questions.length * job.scoring.maxScorePerQuestion;
};

export const calculateScorePercent = (
  totalScore: number,
  maxScore: number
): number => {
  if (maxScore <= 0) return 0;
  return Math.round((totalScore / maxScore) * 100);
};

export const getResultMessage = (job: JobRpg, scorePercent: number) => {
  return job.resultMessages.find(
    (message) =>
      scorePercent >= message.minScorePercent &&
      scorePercent <= message.maxScorePercent
  );
};
