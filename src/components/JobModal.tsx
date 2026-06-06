"use client";

import { useEffect, useRef, useState } from "react";
import type { JobRpg } from "@/data/jobs/types";

const iconMap: Record<string, string> = {
  briefcase: "💼",
  megaphone: "📣",
  clipboard: "📋",
  code: "💻",
  chart: "📊",
  heart: "🤝",
};

export type Gender = "male" | "female";

type Props = {
  job: JobRpg | null;
  onClose: () => void;
  onStart: (playerName: string, gender: Gender) => void;
};

export default function JobModal({ job, onClose, onStart }: Props) {
  const [playerName, setPlayerName] = useState("");
  const [gender, setGender] = useState<Gender>("male");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (job) {
      setPlayerName("");
      setGender("male");
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [job]);

  if (!job) return null;

  const handleStart = () => {
    onStart(playerName.trim() || "プレイヤー", gender);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleStart();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-gray-900/55 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ヘッダー帯 */}
        <div className="relative bg-gradient-to-br from-teal-400 to-teal-600 px-6 pt-7 pb-6 text-center">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 grid place-items-center w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white text-sm leading-none transition-colors"
            aria-label="閉じる"
          >
            ✕
          </button>
          <span className="grid place-items-center w-16 h-16 mx-auto rounded-2xl bg-white/95 text-4xl shadow-md mb-3">
            {iconMap[job.icon] ?? "🏢"}
          </span>
          <h2 className="text-xl font-extrabold text-white mb-0.5">
            {job.displayName}
          </h2>
          <p className="text-sm text-teal-50">{job.subtitle}</p>
        </div>

        <div className="p-6">
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            {job.description}
          </p>

          {job.scenarioDescription && (
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              {job.scenarioDescription}
            </p>
          )}

          <div className="flex gap-2 mb-5">
            <span className="flex-1 text-center text-sm font-bold text-gray-700 bg-gray-50 border border-gray-100 rounded-xl py-2">
              📝 {job.questions.length}問
            </span>
            <span className="flex-1 text-center text-sm font-bold text-gray-700 bg-gray-50 border border-gray-100 rounded-xl py-2">
              ⏱ 目安{job.estimatedMinutes}分
            </span>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              主人公の性別
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setGender("male")}
                className={`flex-1 py-3 rounded-xl border-2 font-bold text-sm transition-all ${
                  gender === "male"
                    ? "border-teal-500 bg-teal-50 text-teal-700 shadow-sm"
                    : "border-gray-200 text-gray-500 hover:border-gray-300"
                }`}
              >
                👨 男性
              </button>
              <button
                type="button"
                onClick={() => setGender("female")}
                className={`flex-1 py-3 rounded-xl border-2 font-bold text-sm transition-all ${
                  gender === "female"
                    ? "border-pink-500 bg-pink-50 text-pink-700 shadow-sm"
                    : "border-gray-200 text-gray-500 hover:border-gray-300"
                }`}
              >
                👩 女性
              </button>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              ゲームで使う名前
            </label>
            <input
              ref={inputRef}
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="例：ゆうき"
              maxLength={30}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-base font-medium focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-300 transition"
            />
            <p className="text-xs text-gray-400 mt-1.5">
              未入力の場合は「プレイヤー」として表示されます
            </p>
          </div>

          <button onClick={handleStart} className="btn-pop w-full py-4 text-base">
            ゲームを開始する
          </button>
        </div>
      </div>
    </div>
  );
}
