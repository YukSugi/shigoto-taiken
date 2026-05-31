"use client";

import type { JobRpg, NextJobSuggestion } from "@/data/jobs/types";

const iconMap: Record<string, string> = {
  briefcase: "💼",
  megaphone: "📣",
  clipboard: "📋",
  code: "💻",
  chart: "📊",
  heart: "🤝",
};

type Props = {
  suggestions: NextJobSuggestion[];
  allJobs: JobRpg[];
  onSelect: (jobId: string) => void;
};

export default function NextJobSuggestions({
  suggestions,
  allJobs,
  onSelect,
}: Props) {
  const available = suggestions
    .map((s) => {
      const job = allJobs.find((j) => j.id === s.jobId);
      return job ? { job, reason: s.reason } : null;
    })
    .filter(Boolean) as { job: JobRpg; reason: string }[];

  if (available.length === 0) return null;

  return (
    <div className="mb-4">
      <p className="text-sm text-gray-500 mb-3">次に体験してみよう</p>
      <div className="space-y-2">
        {available.map(({ job, reason }) => (
          <button
            key={job.id}
            onClick={() => onSelect(job.id)}
            disabled={job.status !== "published"}
            className={`w-full text-left flex items-center gap-3 bg-white border-2 rounded-xl px-4 py-3 transition-all ${
              job.status === "published"
                ? "border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50"
                : "border-gray-100 opacity-60 cursor-default"
            }`}
          >
            <span className="text-2xl">{iconMap[job.icon] ?? "🏢"}</span>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-gray-900">
                {job.displayName}
              </p>
              <p className="text-xs text-gray-500 truncate">{reason}</p>
            </div>
            {job.status === "comingSoon" && (
              <span className="text-xs text-gray-400 shrink-0">準備中</span>
            )}
            {job.status === "published" && (
              <span className="text-xs text-indigo-500 shrink-0">→</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
