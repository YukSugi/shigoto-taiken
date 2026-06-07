import type { JobRpg } from "./types";

export const seisanKanri: JobRpg = {
  id: "seisan-kanri",
  version: "1.0.0",
  displayName: "生産管理",
  subtitle: "ものづくりの流れを管理する仕事",
  description: "生産計画を立て、ものづくりの流れを最適化する仕事です。",
  icon: "factory",
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
