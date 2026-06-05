"use client";

import { formatMs } from "@/lib/analytics";
import { getJobById } from "@/data/jobs";

type OptionStat = {
  jobId: string;
  scenarioVersion: string;
  questionId: string;
  optionId: string;
  selectedCount: number;
  selectedRate: number;
  averageAnswerTimeMs: number;
};

type Props = {
  jobId: string;
  questionId: string;
  optionStats: OptionStat[];
  onClose: () => void;
};

export default function QuestionDetailPanel({
  jobId,
  questionId,
  optionStats,
  onClose,
}: Props) {
  const job = getJobById(jobId);
  const question = job?.questions.find((q) => q.id === questionId);
  const filtered = optionStats.filter(
    (s) => s.jobId === jobId && s.questionId === questionId
  );

  if (!question) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 overflow-y-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
        <h3 className="font-bold text-gray-900 mb-1">{question.title}</h3>
        <p className="text-xs text-gray-400 mb-4">選択肢別分析</p>

        <div className="space-y-3">
          {filtered.map((s) => {
            const option = question.options.find((o) => o.id === s.optionId);
            const feedbackColors: Record<string, string> = {
              good: "bg-green-100 text-green-700",
              strong_normal: "bg-blue-100 text-blue-700",
              normal: "bg-yellow-100 text-yellow-700",
              risky_bad: "bg-orange-100 text-orange-700",
              bad: "bg-red-100 text-red-600",
            };
            const colorClass = option
              ? (feedbackColors[option.feedbackType] ?? "bg-gray-100 text-gray-500")
              : "bg-gray-100 text-gray-500";

            return (
              <div
                key={s.optionId}
                className="border border-gray-100 rounded-xl p-4"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-start gap-2 flex-1 min-w-0">
                    <span className="font-bold text-indigo-500 shrink-0">
                      {s.optionId}.
                    </span>
                    <p className="text-sm text-gray-700 leading-snug">
                      {option?.text ?? s.optionId}
                    </p>
                  </div>
                  {option && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${colorClass}`}
                    >
                      {option.score}点
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-400 rounded-full"
                      style={{ width: `${s.selectedRate}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-gray-700 w-12 text-right shrink-0">
                    {s.selectedRate.toFixed(1)}%
                  </span>
                  <span className="text-xs text-gray-400 w-16 text-right shrink-0">
                    {formatMs(s.averageAnswerTimeMs)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
