import type { JobRpg } from "./types";

export const se: JobRpg = {
  id: "se",
  version: "1.0.0",
  displayName: "SE",
  subtitle: "システムを設計・開発する仕事",
  description: "要件を整理し、システムを設計・開発する仕事です。",
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
