import type { JobRpg } from "./types";

export const jinji: JobRpg = {
  id: "jinji",
  version: "1.0.0",
  displayName: "人事",
  subtitle: "人と組織を支える仕事",
  description: "採用や制度を通じて、人と組織の力を引き出す仕事です。",
  icon: "heart",
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
