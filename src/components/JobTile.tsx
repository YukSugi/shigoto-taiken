"use client";

import type { JobRpg } from "@/data/jobs/types";

const iconMap: Record<string, string> = {
  briefcase: "💼",
  megaphone: "📣",
  clipboard: "📋",
  code: "💻",
  chart: "📊",
  heart: "🤝",
};

type Props = {
  job: JobRpg;
  onClick: (job: JobRpg) => void;
};

export default function JobTile({ job, onClick }: Props) {
  const isAvailable = job.status === "published";

  return (
    <button
      onClick={() => onClick(job)}
      disabled={!isAvailable}
      className={`
        relative flex flex-col items-center text-center p-6 rounded-2xl border-2 transition-all
        ${
          isAvailable
            ? "border-indigo-100 bg-white hover:border-indigo-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
            : "border-gray-100 bg-gray-50 cursor-default opacity-70"
        }
      `}
    >
      <span className="text-4xl mb-3">{iconMap[job.icon] ?? "🏢"}</span>
      <p className="font-bold text-gray-900 text-base mb-1">{job.displayName}</p>
      <p className="text-gray-500 text-xs leading-snug">{job.subtitle}</p>
      {job.status === "comingSoon" && (
        <span className="mt-3 text-xs bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full font-medium">
          準備中
        </span>
      )}
      {job.status === "published" && (
        <span className="mt-3 text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full font-medium">
          体験できます
        </span>
      )}
    </button>
  );
}
