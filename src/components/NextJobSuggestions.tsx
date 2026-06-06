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
    <div>
      <p className="text-sm font-extrabold text-gray-700 mb-3">
        🧭 次に体験してみよう
      </p>
      <div className="space-y-2.5">
        {available.map(({ job, reason }) => {
          const published = job.status === "published";
          return (
            <button
              key={job.id}
              onClick={() => onSelect(job.id)}
              disabled={!published}
              className={`group w-full text-left flex items-center gap-3 bg-white border-2 rounded-2xl px-4 py-3 transition-all ${
                published
                  ? "border-gray-200 border-b-4 hover:border-teal-300 hover:border-b-teal-400 hover:-translate-y-0.5 shadow-sm hover:shadow"
                  : "border-gray-100 opacity-60 cursor-default"
              }`}
            >
              <span
                className={`grid place-items-center w-10 h-10 rounded-xl text-xl shrink-0 ${
                  published ? "bg-teal-50" : "bg-gray-100 grayscale"
                }`}
              >
                {iconMap[job.icon] ?? "🏢"}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-extrabold text-sm text-gray-900">
                  {job.displayName}
                </p>
                <p className="text-xs text-gray-500 truncate">{reason}</p>
              </div>
              {published ? (
                <span className="text-teal-500 font-extrabold shrink-0 transition-transform group-hover:translate-x-1">
                  ▶
                </span>
              ) : (
                <span className="text-xs text-gray-400 shrink-0 font-bold">
                  準備中
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
