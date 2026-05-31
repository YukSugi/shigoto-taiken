"use client";

import { useCallback, useEffect, useState } from "react";
import AdminFilters from "@/components/admin/AdminFilters";
import SummaryCards from "@/components/admin/SummaryCards";
import ScoreDistributionTable from "@/components/admin/ScoreDistributionTable";
import JobSummaryTable from "@/components/admin/JobSummaryTable";
import QuestionStatsTable from "@/components/admin/QuestionStatsTable";
import QuestionDetailPanel from "@/components/admin/QuestionDetailPanel";

type Range = "7d" | "30d" | "all";

export default function AdminPage() {
  const [range, setRange] = useState<Range>("30d");
  const [jobId, setJobId] = useState("");
  const [version, setVersion] = useState("");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<{
    jobId: string;
    questionId: string;
  } | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ range });
      if (jobId) params.set("jobId", jobId);
      if (version) params.set("version", version);
      const res = await fetch(`/api/admin/analytics?${params}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [range, jobId, version]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <span className="text-base font-bold text-indigo-700">
            お仕事体験.com — 管理画面
          </span>
          <button
            onClick={fetchData}
            className="text-xs text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg px-3 py-1.5"
          >
            更新
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <AdminFilters
          range={range}
          onRangeChange={setRange}
          jobId={jobId}
          onJobIdChange={setJobId}
          version={version}
          onVersionChange={setVersion}
        />

        {loading && (
          <div className="text-center py-16 text-gray-400">読み込み中...</div>
        )}

        {!loading && data && (
          <>
            <SummaryCards summary={data.summary} />

            {data.scoreDistribution && (
              <ScoreDistributionTable distribution={data.scoreDistribution} />
            )}

            {data.jobSummaries && data.jobSummaries.length > 0 && (
              <JobSummaryTable summaries={data.jobSummaries} />
            )}

            {data.questionStats && data.questionStats.length > 0 && (
              <QuestionStatsTable
                stats={data.questionStats}
                optionStats={data.optionStats ?? []}
                onSelectQuestion={(jid, qid) =>
                  setSelectedQuestion({ jobId: jid, questionId: qid })
                }
              />
            )}

            {data.questionStats?.length === 0 && (
              <div className="text-center py-8 text-gray-400 text-sm">
                まだデータがありません。ゲームをプレイしてみてください。
              </div>
            )}
          </>
        )}

        {!loading && !data && (
          <div className="text-center py-16 text-gray-400">
            <p>データを取得できませんでした。</p>
            <p className="text-xs mt-2">
              Supabaseの環境変数が設定されていることを確認してください。
            </p>
          </div>
        )}
      </main>

      {selectedQuestion && data?.optionStats && (
        <QuestionDetailPanel
          jobId={selectedQuestion.jobId}
          questionId={selectedQuestion.questionId}
          optionStats={data.optionStats}
          onClose={() => setSelectedQuestion(null)}
        />
      )}
    </div>
  );
}
