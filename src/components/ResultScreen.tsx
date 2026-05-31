"use client";

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

  const scoreColor =
    scorePercent >= 85
      ? "text-green-600"
      : scorePercent >= 70
      ? "text-indigo-600"
      : scorePercent >= 55
      ? "text-blue-600"
      : scorePercent >= 40
      ? "text-orange-500"
      : "text-red-500";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <p className="text-gray-500 text-sm mb-1">おつかれさまでした！</p>
          <p className="text-xl font-bold text-gray-800 mb-4">
            {playerName}さんの{job.displayName}スコア
          </p>
          <div
            className={`text-7xl font-bold mb-2 ${scoreColor} tabular-nums`}
          >
            {scorePercent}
            <span className="text-3xl ml-1">点</span>
          </div>
          {resultMessage && (
            <p className="text-lg font-bold text-gray-900 mt-2 mb-1">
              {resultMessage.title}
            </p>
          )}
          {resultMessage && (
            <p className="text-sm text-gray-600 leading-relaxed max-w-sm mx-auto">
              {resultMessage.message}
            </p>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
          <p className="text-xs text-gray-400 font-medium mb-3">
            今回体験した仕事の流れ
          </p>
          <div className="flex flex-wrap gap-1.5">
            {processFlow.map((p, i) => (
              <span
                key={i}
                className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full"
              >
                {p}
              </span>
            ))}
          </div>
        </div>

        {job.nextJobSuggestions && job.nextJobSuggestions.length > 0 && (
          <div className="mb-6">
            <NextJobSuggestions
              suggestions={job.nextJobSuggestions}
              allJobs={jobs}
              onSelect={onSelectJob}
            />
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={onRetry}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 rounded-xl text-base transition-colors"
          >
            もう一度挑戦する
          </button>
          <button
            onClick={onGoTop}
            className="w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-4 rounded-xl text-base transition-colors border-2 border-gray-200 hover:border-gray-300"
          >
            職種一覧へ戻る
          </button>
        </div>

        <p className="text-xs text-gray-300 text-center mt-8">
          このサイトでは、サービス改善のために、選択肢の選択状況や解答時間などの匿名データを記録する場合があります。
        </p>
      </div>
    </div>
  );
}
