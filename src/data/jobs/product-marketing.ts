import type { JobRpg } from "./types";

export const productMarketing: JobRpg = {
  id: "product-marketing",
  version: "1.0.0",
  displayName: "プロダクトマーケティング",
  subtitle: "売れる理由を作る仕事",
  description: "顧客課題を市場向けの言葉に変え、売れる仕組みを作る仕事です。",
  icon: "megaphone",
  status: "comingSoon",
  estimatedMinutes: 7,
  targetUser: "高校生・大学生",
  scoring: {
    maxScorePerQuestion: 10,
    scoreMap: { good: 10, normal: 5, bad: 0 },
    showScoreDuringGame: false,
  },
  questions: [],
  resultMessages: [],
};
