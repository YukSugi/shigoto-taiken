"use client";

import type { JobRpg } from "@/data/jobs/types";

type Props = {
  job: JobRpg;
  playerName: string;
  onStart: () => void;
};

export default function ScenarioIntro({ job, playerName, onStart }: Props) {
  const s = job.serviceSetting;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="max-w-2xl mx-auto w-full px-4 py-10 flex flex-col flex-1">
        <div className="mb-6">
          <p className="text-sm text-indigo-600 font-semibold mb-1">
            {job.displayName}
          </p>
          <h1 className="text-2xl font-bold text-gray-900">今回のミッション</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6 space-y-4 text-sm text-gray-700 leading-relaxed flex-1">
          {s ? (
            <>
              <p>
                あなたは、業務改善クラウド「{s.serviceName}」を販売する会社の{job.displayName}です。
              </p>
              <p>
                {s.serviceName}は、{s.serviceDescription}
              </p>
              <p>
                今回あなたが担当するのは、{s.customerDescription}
              </p>
              <p>{s.currentProblem}</p>
              <div className="bg-indigo-50 rounded-xl p-4">
                <p className="font-semibold text-indigo-800 mb-1">
                  あなたのミッション
                </p>
                <p className="text-indigo-700">{s.mission}</p>
              </div>
            </>
          ) : (
            <p className="text-gray-500">シナリオ情報がありません。</p>
          )}
        </div>

        <div className="text-sm text-gray-400 text-center mb-4">
          {playerName}さんとして体験します
        </div>

        <button
          onClick={onStart}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 rounded-xl text-base transition-colors"
        >
          仕事を始める
        </button>
      </div>
    </div>
  );
}
