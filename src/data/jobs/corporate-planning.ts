import type { JobRpg } from "./types";

export const corporatePlanning: JobRpg = {
  id: "corporate-planning",
  version: "1.0.0",
  displayName: "経営企画",
  subtitle: "会社の数字と戦略を考える仕事",
  description: "会社全体の数字を見ながら、経営の意思決定を支える仕事です。",
  icon: "chart",
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
