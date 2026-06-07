import type { JobRpg } from "./types";

export const keiri: JobRpg = {
  id: "keiri",
  version: "1.0.0",
  displayName: "経理",
  subtitle: "会社のお金を管理する仕事",
  description: "数字を正確に扱い、会社の経営を支える仕事です。",
  icon: "calculator",
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
