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
  return (
    <div className="sticky top-0 z-30 backdrop-blur-md bg-[#fffaf2]/85 border-b border-amber-100/80 px-4 py-3">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500 font-bold">{jobName}</span>
          <span className="text-xs font-extrabold text-gray-700 tabular-nums">
            Q<span className="text-teal-600 text-sm">{current}</span> / {total}
          </span>
        </div>

        {/* セグメント進捗バー */}
        <div className="flex gap-1 mb-2">
          {Array.from({ length: total }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                i < current - 1
                  ? "bg-teal-500"
                  : i === current - 1
                  ? "bg-teal-400 animate-pulse"
                  : "bg-gray-200"
              }`}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-extrabold ${phaseColors[phase]}`}
          >
            {phase}
          </span>
          <span className="text-xs text-gray-500 font-medium">
            {businessProcess}
          </span>
        </div>
      </div>
    </div>
  );
}
