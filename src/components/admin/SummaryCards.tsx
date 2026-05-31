"use client";

import { formatMs } from "@/lib/analytics";

type Summary = {
  totalSessions: number;
  completedSessions: number;
  completionRate: number;
  averageScore: number;
  averagePlayTimeMs: number;
  averageAnswerTimeMs: number;
};

type Props = {
  summary: Summary;
};

export default function SummaryCards({ summary }: Props) {
  const cards = [
    { label: "総プレイ数", value: `${summary.totalSessions}回` },
    { label: "完了数", value: `${summary.completedSessions}回` },
    { label: "完了率", value: `${summary.completionRate.toFixed(1)}%` },
    { label: "平均スコア", value: `${summary.averageScore.toFixed(1)}点` },
    {
      label: "平均プレイ時間",
      value: formatMs(summary.averagePlayTimeMs),
    },
    {
      label: "平均解答時間",
      value: formatMs(summary.averageAnswerTimeMs),
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-white rounded-xl border border-gray-100 shadow-sm p-4"
        >
          <p className="text-xs text-gray-400 mb-1">{card.label}</p>
          <p className="text-xl font-bold text-gray-900">{card.value}</p>
        </div>
      ))}
    </div>
  );
}
