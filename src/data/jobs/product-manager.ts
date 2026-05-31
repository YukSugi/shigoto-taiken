import type { JobRpg } from "./types";

export const productManager: JobRpg = {
  id: "product-manager",
  version: "1.0.0",
  displayName: "PM",
  subtitle: "作るものの優先順位を決める仕事",
  description: "顧客要望と開発リソースを見ながら、プロダクトの方向を決める仕事です。",
  icon: "clipboard",
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
