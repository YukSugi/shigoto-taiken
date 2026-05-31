"use client";

import type { Phase } from "@/data/jobs/types";

type Props = {
  current: number;
  total: number;
  phase: Phase;
  businessProcess: string;
  jobName: string;
};

const phaseColors: Record<Phase, string> = {
  起: "bg-blue-100 text-blue-700",
  承: "bg-green-100 text-green-700",
  転: "bg-orange-100 text-orange-700",
  結: "bg-purple-100 text-purple-700",
};

export default function ProgressIndicator({
  current,
  total,
  phase,
  businessProcess,
  jobName,
}: Props) {
  const percent = ((current - 1) / total) * 100;

  return (
    <div className="bg-white border-b border-gray-100 px-4 py-3">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500 font-medium">{jobName}</span>
          <span className="text-xs font-semibold text-gray-700">
            Q{current} / {total}
          </span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-2">
          <div
            className="h-full bg-indigo-500 rounded-full transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-medium ${phaseColors[phase]}`}
          >
            {phase}
          </span>
          <span className="text-xs text-gray-500">{businessProcess}</span>
        </div>
      </div>
    </div>
  );
}
