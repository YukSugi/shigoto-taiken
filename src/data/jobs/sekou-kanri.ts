import type { JobRpg } from "./types";

export const sekouKanri: JobRpg = {
  id: "sekou-kanri",
  version: "1.0.0",
  displayName: "施工管理",
  subtitle: "建設現場を動かす仕事",
  description: "工程・品質・安全を管理し、建物を作り上げる仕事です。",
  icon: "helmet",
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
