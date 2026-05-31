"use client";

type ScoreBand = {
  label: string;
  count: number;
  rate: number;
};

type Props = {
  distribution: ScoreBand[];
};

export default function ScoreDistributionTable({ distribution }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-6">
      <h3 className="font-bold text-gray-800 mb-4">スコア分布</h3>
      <div className="space-y-2">
        {distribution.map((band) => (
          <div key={band.label} className="flex items-center gap-3">
            <span className="text-sm text-gray-600 w-16 shrink-0">
              {band.label}点
            </span>
            <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-400 rounded-full"
                style={{ width: `${band.rate}%` }}
              />
            </div>
            <span className="text-sm text-gray-500 w-20 text-right shrink-0">
              {band.count}人 ({band.rate.toFixed(1)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
