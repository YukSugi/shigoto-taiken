"use client";

import Image from "next/image";
import type { FeedbackType, Option } from "@/data/jobs/types";
import type { Gender } from "./JobModal";

// feedback_normal_maleが未作成のためfemaleにfallback
const MISSING_MALE_FEEDBACKS: FeedbackType[] = ["normal"];

type Props = {
  selectedOption: Option;
  currentIndex: number;
  totalQuestions: number;
  gender: Gender;
  onNext: () => void;
};

const feedbackConfig: Record<
  FeedbackType,
  { label: string; card: string; text: string; badge: string; icon: string }
> = {
  good: {
    label: "良い判断です",
    card: "bg-green-50 border-green-200",
    text: "text-green-700",
    badge: "bg-green-500",
    icon: "✓",
  },
  strong_normal: {
    label: "かなり良い判断です",
    card: "bg-blue-50 border-blue-200",
    text: "text-blue-700",
    badge: "bg-blue-500",
    icon: "◎",
  },
  normal: {
    label: "まずまずの判断です",
    card: "bg-yellow-50 border-yellow-200",
    text: "text-yellow-700",
    badge: "bg-yellow-500",
    icon: "△",
  },
  risky_bad: {
    label: "危険な判断です",
    card: "bg-orange-50 border-orange-200",
    text: "text-orange-700",
    badge: "bg-orange-500",
    icon: "⚠",
  },
  bad: {
    label: "注意が必要です",
    card: "bg-red-50 border-red-200",
    text: "text-red-700",
    badge: "bg-red-500",
    icon: "!",
  },
};

export default function FeedbackCard({
  selectedOption,
  currentIndex,
  totalQuestions,
  gender,
  onNext,
}: Props) {
  const config = feedbackConfig[selectedOption.feedbackType];
  const isLast = currentIndex >= totalQuestions;

  const feedbackType = selectedOption.feedbackType;
  const effectiveGender =
    gender === "male" && MISSING_MALE_FEEDBACKS.includes(feedbackType)
      ? "female"
      : gender;
  const feedbackImg = `/images/feedback_${feedbackType}_${effectiveGender}.png`;

  return (
    <div className="max-w-2xl mx-auto w-full px-4 py-6 animate-fade-in">
      {/* フィードバック画像 */}
      <div className="mb-5">
        <Image
          src={feedbackImg}
          alt={`feedback ${feedbackType}`}
          width={640}
          height={360}
          className="w-full rounded-2xl object-cover ring-1 ring-black/5 shadow-md"
        />
      </div>

      <div className={`rounded-2xl border-2 p-5 mb-6 shadow-sm ${config.card}`}>
        <div className="flex items-center gap-2.5 mb-3">
          <span
            className={`grid place-items-center w-9 h-9 rounded-full text-white font-extrabold text-base shadow ${config.badge} animate-pop-in`}
          >
            {config.icon}
          </span>
          <span className={`font-extrabold text-lg ${config.text}`}>
            {config.label}
          </span>
        </div>

        <div className="bg-white/80 rounded-xl px-4 py-3 mb-4 border border-white">
          <p className="text-xs text-gray-400 font-bold mb-1">あなたの選択</p>
          <p className="text-sm text-gray-800 font-bold">
            {selectedOption.text}
          </p>
        </div>

        <p className="text-sm text-gray-700 leading-relaxed">
          {selectedOption.feedback}
        </p>
      </div>

      <button onClick={onNext} className="btn-pop w-full py-4 text-base">
        {isLast ? "結果を見る 🏁" : "次へ ▶"}
      </button>
    </div>
  );
}
