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
        relative flex flex-col p-3 sm:p-6 rounded-2xl border-2 transition-all text-left
        ${
          isAvailable
            ? "border-indigo-100 bg-white hover:border-indigo-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
            : "border-gray-100 bg-gray-50 cursor-default opacity-70"
        }
      `}
    >
      {/* 1行目: アイコン + 職種名 を横並び */}
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-2xl sm:text-3xl shrink-0">
          {iconMap[job.icon] ?? "🏢"}
        </span>
        <p className="font-bold text-gray-900 text-sm sm:text-base leading-tight">
          {job.displayName}
        </p>
      </div>
      {/* 2行目: バッジ */}
      {job.status === "comingSoon" && (
        <span className="text-xs bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full font-medium self-start">
          準備中
        </span>
      )}
      {job.status === "published" && (
        <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full font-medium self-start">
          体験できます
        </span>
      )}
    </button>
  );
}
