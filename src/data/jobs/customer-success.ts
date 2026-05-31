import type { JobRpg } from "./types";

export const customerSuccess: JobRpg = {
  id: "customer-success",
  version: "1.0.0",
  displayName: "カスタマーサクセス",
  subtitle: "顧客の成果に伴走する仕事",
  description: "顧客がサービスで成果を出せるよう、継続的に支援する仕事です。",
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
