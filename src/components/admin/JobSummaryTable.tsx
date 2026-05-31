"use client";

import { formatMs } from "@/lib/analytics";

type JobSummary = {
  jobId: string;
  scenarioVersion: string;
  sessions: number;
  completedSessions: number;
  completionRate: number;
  averageScore: number;
  averageAnswerTimeMs: number;
};

type Props = {
  summaries: JobSummary[];
};

const jobNames: Record<string, string> = {
  "b2b-sales-existing": "法人営業",
  "product-marketing": "プロダクトマーケティング",
  "product-manager": "PM",
  engineer: "エンジニア",
  "corporate-planning": "経営企画",
  "customer-success": "カスタマーサクセス",
};

export default function JobSummaryTable({ summaries }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-6 overflow-x-auto">
      <h3 className="font-bold text-gray-800 mb-4">職種別サマリー</h3>
      <table className="w-full text-sm min-w-[500px]">
        <thead>
          <tr className="text-xs text-gray-400 border-b border-gray-100">
            <th className="text-left pb-2 font-medium">職種</th>
            <th className="text-left pb-2 font-medium">version</th>
            <th className="text-right pb-2 font-medium">開始数</th>
            <th className="text-right pb-2 font-medium">完了率</th>
            <th className="text-right pb-2 font-medium">平均スコア</th>
            <th className="text-right pb-2 font-medium">平均解答時間</th>
          </tr>
        </thead>
        <tbody>
          {summaries.map((s) => (
            <tr
              key={`${s.jobId}-${s.scenarioVersion}`}
              className="border-b border-gray-50"
            >
              <td className="py-2 text-gray-800 font-medium">
                {jobNames[s.jobId] ?? s.jobId}
              </td>
              <td className="py-2 text-gray-400">{s.scenarioVersion}</td>
              <td className="py-2 text-right text-gray-700">{s.sessions}</td>
              <td className="py-2 text-right text-gray-700">
                {s.completionRate.toFixed(1)}%
              </td>
              <td className="py-2 text-right text-gray-700">
                {s.averageScore.toFixed(1)}点
              </td>
              <td className="py-2 text-right text-gray-500">
                {formatMs(s.averageAnswerTimeMs)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
