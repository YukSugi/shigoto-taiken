"use client";

import type { QuestionStatus } from "@/lib/analytics";

const config: Record<
  QuestionStatus,
  { label: string; className: string }
> = {
  good: { label: "良問", className: "bg-green-100 text-green-700" },
  tooEasy: { label: "簡単すぎる可能性", className: "bg-yellow-100 text-yellow-700" },
  tooHard: { label: "難しすぎる可能性", className: "bg-red-100 text-red-700" },
  highDropoff: { label: "離脱注意", className: "bg-orange-100 text-orange-700" },
  needsReview: { label: "要確認", className: "bg-gray-100 text-gray-500" },
};

type Props = {
  status: QuestionStatus;
};

export default function StatusBadge({ status }: Props) {
  const c = config[status];
  return (
    <span
      className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${c.className}`}
    >
      {c.label}
    </span>
  );
}
