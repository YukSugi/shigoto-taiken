"use client";

import Image from "next/image";
import type { JobRpg } from "@/data/jobs/types";
import type { PlayerAnswer } from "@/lib/scoring";
import {
  calculateMaxScore,
  calculateScorePercent,
  calculateTotalScore,
  getResultMessage,
} from "@/lib/scoring";
import { jobs } from "@/data/jobs";
import NextJobSuggestions from "./NextJobSuggestions";

type Props = {
  job: JobRpg;
  playerName: string;
  answers: PlayerAnswer[];
  onRetry: () => void;
  onGoTop: () => void;
  onSelectJob: (jobId: string) => void;
};

export default function ResultScreen({
  job,
  playerName,
  answers,
  onRetry,
  onGoTop,
  onSelectJob,
}: Props) {
  const totalScore = calculateTotalScore(answers);
  const maxScore = calculateMaxScore(job);
  const scorePercent = calculateScorePercent(totalScore, maxScore);
  const resultMessage = getResultMessage(job, scorePercent);

  const processFlow = job.questions.map((q) => q.businessProcess);

  const tier =
    scorePercent >= 85
      ? { color: "text-green-600", grad: "from-green-400 to-emerald-500", stars: 5 }
      : scorePercent >= 70
      ? { color: "text-teal-600", grad: "from-teal-400 to-teal-600", stars: 4 }
      : scorePercent >= 55
      ? { color: "text-cyan-600", grad: "from-cyan-400 to-sky-500", stars: 3 }
      : scorePercent >= 40
      ? { color: "text-orange-500", grad: "from-amber-400 to-orange-500", stars: 2 }
      : { color: "text-red-500", grad: "from-rose-400 to-red-500", stars: 1 };

  const finalImgIndex =
    scorePercent >= 85 ? 5
    : scorePercent >= 70 ? 4
    : scorePercent >= 55 ? 3
    : scorePercent >= 40 ? 2
    : 1;
  const finalImg = `/images/empsales_final_fb_${finalImgIndex}.png`;

  return (
    <div className="min-h-screen">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="text-center mb-8 animate-fade-up">
          <p className="text-gray-500 text-sm font-bold mb-1">
            🎉 おつかれさまでした！
          </p>
          <p className="text-xl font-extrabold text-gray-800 mb-5">
            <span className="text-teal-600">{playerName}</span>さんの
            {job.displayName}スコア
          </p>

          {/* 最終評価画像 */}
          <div className="mb-6">
            <Image
              src={finalImg}
              alt={`result ${finalImgIndex}`}
              width={640}
              height={360}
              className="w-full rounded-2xl object-cover ring-1 ring-black/5 shadow-md"
            />
          </div>

          {/* スコアメダル */}
          <div className="relative inline-flex flex-col items-center mb-4">
            <div
              className={`relative grid place-items-center w-40 h-40 rounded-full bg-gradient-to-br ${tier.grad} shadow-xl animate-pop-in`}
            >
              <div className="grid place-items-center w-32 h-32 rounded-full bg-white">
                <div className="flex items-baseline">
                  <span
                    className={`text-6xl font-extrabold tabular-nums ${tier.color}`}
                  >
                    {scorePercent}
                  </span>
                  <span className={`text-xl font-extrabold ml-0.5 ${tier.color}`}>
                    点
                  </span>
                </div>
              </div>
            </div>
            {/* ランク★ */}
            <div className="mt-3 text-xl tracking-widest">
              <span className="text-amber-400">{"★".repeat(tier.stars)}</span>
              <span className="text-gray-200">{"★".repeat(5 - tier.stars)}</span>
            </div>
          </div>

          {resultMessage && (
            <p className="text-lg font-extrabold text-gray-900 mt-2 mb-1">
              {resultMessage.title}
            </p>
          )}
          {resultMessage && (
            <p className="text-sm text-gray-600 leading-relaxed max-w-sm mx-auto">
              {resultMessage.message}
            </p>
          )}
        </div>

        <div className="card-soft p-5 mb-6">
          <p className="text-xs text-gray-400 font-extrabold mb-3">
            今回体験した仕事の流れ
          </p>
          <div className="flex flex-wrap items-center gap-1.5">
            {processFlow.map((p, i) => (
              <span key={i} className="inline-flex items-center gap-1.5">
                <span className="text-xs bg-teal-50 text-teal-700 font-bold px-2.5 py-1 rounded-full">
                  {p}
                </span>
                {i < processFlow.length - 1 && (
                  <span className="text-gray-300 text-xs">›</span>
                )}
              </span>
            ))}
          </div>
        </div>

        {job.nextJobSuggestions && job.nextJobSuggestions.length > 0 && (
          <div className="card-soft p-5 mb-6">
            <NextJobSuggestions
              suggestions={job.nextJobSuggestions}
              allJobs={jobs}
              onSelect={onSelectJob}
            />
          </div>
        )}

        <div className="space-y-3">
          <button onClick={onRetry} className="btn-pop w-full py-4 text-base">
            🔄 もう一度挑戦する
          </button>
          <button onClick={onGoTop} className="btn-ghost w-full py-3.5 text-base">
            職種一覧へ戻る
          </button>
        </div>

        <p className="text-xs text-gray-300 text-center mt-8 leading-relaxed">
          このサイトでは、サービス改善のために、選択肢の選択状況や解答時間などの匿名データを記録する場合があります。
        </p>
      </div>
    </div>
  );
}
