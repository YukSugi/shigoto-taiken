"use client";

import { formatMs } from "@/lib/analytics";
import type { QuestionStat } from "@/lib/analytics";
import StatusBadge from "./StatusBadge";

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
  stats: QuestionStat[];
  optionStats: OptionStat[];
  onSelectQuestion: (jobId: string, questionId: string) => void;
};

export default function QuestionStatsTable({
  stats,
  optionStats,
  onSelectQuestion,
}: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-6 overflow-x-auto">
      <h3 className="font-bold text-gray-800 mb-4">問題別分析</h3>
      <table className="w-full text-sm min-w-[700px]">
        <thead>
          <tr className="text-xs text-gray-400 border-b border-gray-100">
            <th className="text-left pb-2 font-medium">問</th>
            <th className="text-left pb-2 font-medium">タイトル</th>
            <th className="text-right pb-2 font-medium">表示</th>
            <th className="text-right pb-2 font-medium">回答</th>
            <th className="text-right pb-2 font-medium">離脱率</th>
            <th className="text-right pb-2 font-medium">good</th>
            <th className="text-right pb-2 font-medium">normal</th>
            <th className="text-right pb-2 font-medium">bad</th>
            <th className="text-right pb-2 font-medium">平均時間</th>
            <th className="text-left pb-2 font-medium pl-3">判定</th>
          </tr>
        </thead>
        <tbody>
          {stats.map((s) => (
            <tr
              key={`${s.jobId}-${s.questionId}`}
              className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer"
              onClick={() => onSelectQuestion(s.jobId, s.questionId)}
            >
              <td className="py-2.5 text-gray-500">Q{s.questionIndex}</td>
              <td className="py-2.5 text-gray-800 font-medium max-w-[160px] truncate">
                {s.title ?? s.questionId}
              </td>
              <td className="py-2.5 text-right text-gray-600">{s.views}</td>
              <td className="py-2.5 text-right text-gray-600">{s.answers}</td>
              <td
                className={`py-2.5 text-right ${
                  s.dropoffRate >= 15 ? "text-red-500 font-bold" : "text-gray-600"
                }`}
              >
                {s.dropoffRate.toFixed(1)}%
              </td>
              <td className="py-2.5 text-right text-green-600">
                {s.goodRate.toFixed(1)}%
              </td>
              <td className="py-2.5 text-right text-yellow-600">
                {s.normalRate.toFixed(1)}%
              </td>
              <td className="py-2.5 text-right text-red-500">
                {s.badRate.toFixed(1)}%
              </td>
              <td className="py-2.5 text-right text-gray-500">
                {formatMs(s.averageAnswerTimeMs)}
              </td>
              <td className="py-2.5 pl-3">
                <StatusBadge status={s.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-xs text-gray-300 mt-3">
        行をクリックすると選択肢別の詳細を表示します
      </p>
    </div>
  );
}
