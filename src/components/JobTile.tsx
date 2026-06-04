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

// アイコンの色に合わせたカラーテーマ
const colorTheme: Record<string, {
  button: string;
  badge: string;
}> = {
  briefcase: {
    // 💼 カバンの茶色
    button: "border-stone-300 border-b-stone-500 hover:bg-stone-50 hover:border-stone-400 hover:border-b-stone-600",
    badge: "bg-stone-100 text-stone-700",
  },
  megaphone: {
    // 📣 メガホンのオレンジ
    button: "border-orange-200 border-b-orange-500 hover:bg-orange-50 hover:border-orange-300 hover:border-b-orange-600",
    badge: "bg-orange-100 text-orange-800",
  },
  clipboard: {
    // 📋 クリップボードのイエロー
    button: "border-yellow-200 border-b-yellow-500 hover:bg-yellow-50 hover:border-yellow-300 hover:border-b-yellow-600",
    badge: "bg-yellow-100 text-yellow-800",
  },
  code: {
    // 💻 PCのインディゴ
    button: "border-indigo-200 border-b-indigo-500 hover:bg-indigo-50 hover:border-indigo-300 hover:border-b-indigo-600",
    badge: "bg-indigo-100 text-indigo-800",
  },
  chart: {
    // 📊 グラフのグリーン
    button: "border-green-200 border-b-green-500 hover:bg-green-50 hover:border-green-300 hover:border-b-green-600",
    badge: "bg-green-100 text-green-800",
  },
  heart: {
    // 🤝 握手のピンク
    button: "border-pink-200 border-b-pink-500 hover:bg-pink-50 hover:border-pink-300 hover:border-b-pink-600",
    badge: "bg-pink-100 text-pink-800",
  },
};

type Props = {
  job: JobRpg;
  onClick: (job: JobRpg) => void;
};

export default function JobTile({ job, onClick }: Props) {
  const isAvailable = job.status === "published";
  const theme = colorTheme[job.icon] ?? colorTheme.briefcase;

  return (
    <button
      onClick={() => onClick(job)}
      disabled={!isAvailable}
      className={`
        relative flex flex-col p-3 sm:p-5 rounded-xl border-2 border-b-4 text-left
        transition-all duration-100
        ${
          isAvailable
            ? `bg-white ${theme.button} active:translate-y-[3px] active:border-b-2 cursor-pointer`
            : "bg-gray-50 border-gray-200 border-b-gray-300 cursor-default opacity-60"
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
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium self-start ${theme.badge}`}>
          体験できます
        </span>
      )}
    </button>
  );
}
