"use client";

import type { JobRpg } from "@/data/jobs/types";

const iconMap: Record<string, string> = {
  briefcase: "💼",
  megaphone: "📣",
  clipboard: "📋",
  code: "💻",
  chart: "📊",
  heart: "🤝",
  calculator: "🧮",
  helmet: "👷",
  factory: "🏭",
};

type Props = {
  job: JobRpg;
  playerName: string;
  onStart: () => void;
};

function BriefRow({
  icon,
  label,
  children,
}: {
  icon: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-3">
      <span className="grid place-items-center w-9 h-9 shrink-0 rounded-xl bg-teal-50 text-lg">
        {icon}
      </span>
      <div className="flex-1 pt-0.5">
        <p className="text-xs font-extrabold text-teal-500 mb-0.5">{label}</p>
        <p className="text-sm text-gray-700 leading-relaxed">{children}</p>
      </div>
    </div>
  );
}

export default function ScenarioIntro({ job, playerName, onStart }: Props) {
  const s = job.serviceSetting;
  const b = job.scenarioBriefing;

  return (
    <div className="min-h-screen flex flex-col">
      <div className="max-w-2xl mx-auto w-full px-4 py-10 flex flex-col flex-1">
        <div className="text-center mb-6 animate-fade-up">
          <span className="inline-flex items-center gap-2 text-sm font-extrabold text-teal-600 bg-white border border-teal-100 rounded-full px-4 py-1.5 shadow-sm mb-3">
            <span className="text-base">{iconMap[job.icon] ?? "🏢"}</span>
            {job.displayName}
          </span>
          <h1 className="text-2xl font-extrabold text-gray-900">
            今回のミッション
          </h1>
        </div>

        <div className="card-soft p-6 mb-6 animate-fade-in">
          {s ? (
            <div className="space-y-5">
              <BriefRow icon="🧑‍💼" label="あなたの役割">
                あなたは、業務改善クラウド「{s.serviceName}
                」を販売する会社の{job.displayName}です。
              </BriefRow>
              <BriefRow icon="☁️" label="扱うサービス">
                {s.serviceName}は、{s.serviceDescription}
              </BriefRow>
              <BriefRow icon="🏢" label="担当する顧客">
                今回あなたが担当するのは、{s.customerDescription}
              </BriefRow>
              <BriefRow icon="⚠️" label="現状の課題">
                {s.currentProblem}
              </BriefRow>

              <div className="rounded-2xl bg-gradient-to-br from-teal-400 to-teal-600 p-5 text-white shadow-md">
                <p className="flex items-center gap-2 font-extrabold mb-1.5">
                  <span>🎯</span>あなたのミッション
                </p>
                <p className="text-teal-50 leading-relaxed text-sm">
                  {s.mission}
                </p>
              </div>
            </div>
          ) : b ? (
            <div className="space-y-4">
              {b.paragraphs.map((p, i) => (
                <p key={i} className="text-sm text-gray-700 leading-relaxed">
                  {p}
                </p>
              ))}

              <div className="rounded-2xl bg-gradient-to-br from-teal-400 to-teal-600 p-5 text-white shadow-md">
                <p className="flex items-center gap-2 font-extrabold mb-1.5">
                  <span>🎯</span>あなたのミッション
                </p>
                <p className="text-teal-50 leading-relaxed text-sm">
                  {b.mission}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">シナリオ情報がありません。</p>
          )}
        </div>

        <div className="text-sm text-gray-500 text-center mb-4">
          <span className="font-bold text-gray-700">{playerName}</span>
          さんとして体験します
        </div>

        <button onClick={onStart} className="btn-pop w-full py-4 text-base">
          仕事を始める ▶
        </button>
      </div>
    </div>
  );
}
