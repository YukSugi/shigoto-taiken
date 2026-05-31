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

type Props = {
  job: JobRpg | null;
  onClose: () => void;
  onStart: (playerName: string) => void;
};

export default function JobModal({ job, onClose, onStart }: Props) {
  const [playerName, setPlayerName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (job) {
      setPlayerName("");
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [job]);

  if (!job) return null;

  const handleStart = () => {
    onStart(playerName.trim() || "プレイヤー");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleStart();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/50" />
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl leading-none"
          aria-label="閉じる"
        >
          ✕
        </button>

        <div className="text-center mb-5">
          <span className="text-5xl mb-3 block">{iconMap[job.icon] ?? "🏢"}</span>
          <h2 className="text-xl font-bold text-gray-900 mb-1">
            {job.displayName}
          </h2>
          <p className="text-sm text-gray-500">{job.subtitle}</p>
        </div>

        <p className="text-sm text-gray-700 leading-relaxed mb-4">
          {job.description}
        </p>

        {job.serviceSetting && (
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            今回の体験では、業務改善クラウド「{job.serviceSetting.serviceName}」を使っている既存顧客に対して、利用率低下の原因を探り、解約リスクを下げる営業の流れを体験します。
          </p>
        )}

        <div className="flex gap-4 text-sm text-gray-500 mb-5">
          <span>📝 {job.questions.length}問</span>
          <span>⏱ 目安{job.estimatedMinutes}分</span>
        </div>

        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">
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
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
          />
          <p className="text-xs text-gray-400 mt-1">
            未入力の場合は「プレイヤー」として表示されます
          </p>
        </div>

        <button
          onClick={handleStart}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 rounded-xl text-base transition-colors"
        >
          ゲームを開始する
        </button>
      </div>
    </div>
  );
}
