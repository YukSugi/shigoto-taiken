"use client";

import type { JobRpg } from "@/data/jobs/types";

const iconMap: Record<string, string> = {
  briefcase: "💼",
  megaphone: "📣",
  clipboard: "📋",
  code: "💻",
  chart: "📊",
  heart: "🤝",
  calculator: "🧮",
  helmet: "👷",
  factory: "🏭",
};

// アイコンの色に合わせたカラーテーマ
const colorTheme: Record<
  string,
  { button: string; chip: string; badge: string; arrow: string }
> = {
  briefcase: {
    // 💼 カバンの茶色
    button:
      "border-stone-200 border-b-stone-400 hover:border-stone-300 hover:border-b-stone-500",
    chip: "bg-stone-100 text-stone-700",
    badge: "bg-stone-100 text-stone-700",
    arrow: "text-stone-500",
  },
  megaphone: {
    // 📣 メガホンのオレンジ
    button:
      "border-orange-200 border-b-orange-400 hover:border-orange-300 hover:border-b-orange-500",
    chip: "bg-orange-100 text-orange-700",
    badge: "bg-orange-100 text-orange-800",
    arrow: "text-orange-500",
  },
  clipboard: {
    // 📋 クリップボードのイエロー
    button:
      "border-yellow-200 border-b-yellow-400 hover:border-yellow-300 hover:border-b-yellow-500",
    chip: "bg-yellow-100 text-yellow-700",
    badge: "bg-yellow-100 text-yellow-800",
    arrow: "text-yellow-500",
  },
  code: {
    // 💻 PCのインディゴ
    button:
      "border-indigo-200 border-b-indigo-400 hover:border-indigo-300 hover:border-b-indigo-500",
    chip: "bg-indigo-100 text-indigo-700",
    badge: "bg-indigo-100 text-indigo-800",
    arrow: "text-indigo-500",
  },
  chart: {
    // 📊 グラフのグリーン
    button:
      "border-green-200 border-b-green-400 hover:border-green-300 hover:border-b-green-500",
    chip: "bg-green-100 text-green-700",
    badge: "bg-green-100 text-green-800",
    arrow: "text-green-500",
  },
  heart: {
    // 🤝 握手のピンク
    button:
      "border-pink-200 border-b-pink-400 hover:border-pink-300 hover:border-b-pink-500",
    chip: "bg-pink-100 text-pink-700",
    badge: "bg-pink-100 text-pink-800",
    arrow: "text-pink-500",
  },
  calculator: {
    // 🧮 経理のエメラルド
    button:
      "border-emerald-200 border-b-emerald-400 hover:border-emerald-300 hover:border-b-emerald-500",
    chip: "bg-emerald-100 text-emerald-700",
    badge: "bg-emerald-100 text-emerald-800",
    arrow: "text-emerald-500",
  },
  helmet: {
    // 👷 施工管理のアンバー
    button:
      "border-amber-200 border-b-amber-400 hover:border-amber-300 hover:border-b-amber-500",
    chip: "bg-amber-100 text-amber-700",
    badge: "bg-amber-100 text-amber-800",
    arrow: "text-amber-500",
  },
  factory: {
    // 🏭 生産管理のシアン
    button:
      "border-cyan-200 border-b-cyan-400 hover:border-cyan-300 hover:border-b-cyan-500",
    chip: "bg-cyan-100 text-cyan-700",
    badge: "bg-cyan-100 text-cyan-800",
    arrow: "text-cyan-500",
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
        group relative flex flex-col p-4 sm:p-5 rounded-2xl border-2 border-b-[6px] text-left
        transition-all duration-100
        ${
          isAvailable
            ? `bg-white ${theme.button} shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-[4px] active:border-b-2 cursor-pointer`
            : "bg-gray-50/70 border-gray-200 border-b-gray-300 cursor-default opacity-70"
        }
      `}
    >
      {/* アイコン + 職種名 */}
      <div className="flex items-center gap-3 mb-3">
        <span
          className={`grid place-items-center w-11 h-11 rounded-xl text-2xl shrink-0 ${
            isAvailable ? theme.chip : "bg-gray-100 grayscale"
          }`}
        >
          {iconMap[job.icon] ?? "🏢"}
        </span>
        <p className="font-extrabold text-gray-900 text-base leading-tight">
          {job.displayName}
        </p>
      </div>

      {/* バッジ + 矢印 */}
      <div className="flex items-center justify-between">
        {job.status === "comingSoon" ? (
          <span className="text-xs bg-gray-100 text-gray-400 px-2.5 py-1 rounded-full font-bold">
            準備中
          </span>
        ) : (
          <span
            className={`text-xs px-2.5 py-1 rounded-full font-bold ${theme.badge}`}
          >
            体験できます
          </span>
        )}
        {isAvailable && (
          <span
            className={`text-sm font-extrabold ${theme.arrow} transition-transform group-hover:translate-x-1`}
          >
            ▶
          </span>
        )}
      </div>
    </button>
  );
}
