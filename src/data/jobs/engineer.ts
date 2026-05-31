import type { JobRpg } from "./types";

export const engineer: JobRpg = {
  id: "engineer",
  version: "1.0.0",
  displayName: "エンジニア",
  subtitle: "サービスを実装する仕事",
  description: "技術的な判断をしながら、サービスを作り上げる仕事です。",
  icon: "code",
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
