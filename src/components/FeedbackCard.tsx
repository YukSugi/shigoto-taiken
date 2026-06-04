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
  { label: string; bgColor: string; textColor: string; icon: string }
> = {
  good: {
    label: "良い判断です",
    bgColor: "bg-green-50 border-green-200",
    textColor: "text-green-700",
    icon: "✓",
  },
  normal: {
    label: "まずまずの判断です",
    bgColor: "bg-yellow-50 border-yellow-200",
    textColor: "text-yellow-700",
    icon: "△",
  },
  bad: {
    label: "注意が必要です",
    bgColor: "bg-red-50 border-red-200",
    textColor: "text-red-700",
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
      <div className="mb-4">
        <Image
          src={feedbackImg}
          alt={`feedback ${feedbackType}`}
          width={640}
          height={360}
          className="w-full rounded-2xl object-cover"
        />
      </div>

      <div className={`rounded-2xl border-2 p-5 mb-5 ${config.bgColor}`}>
        <div className="flex items-center gap-2 mb-3">
          <span
            className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm border-2 ${config.bgColor} ${config.textColor} border-current`}
          >
            {config.icon}
          </span>
          <span className={`font-bold text-base ${config.textColor}`}>
            {config.label}
          </span>
        </div>

        <div className="bg-white/70 rounded-xl px-4 py-3 mb-4">
          <p className="text-xs text-gray-500 mb-1">あなたの選択</p>
          <p className="text-sm text-gray-800 font-medium">
            <span className="text-indigo-500 font-bold mr-1">
              {selectedOption.id}.
            </span>
            {selectedOption.text}
          </p>
        </div>

        <p className="text-sm text-gray-700 leading-relaxed">
          {selectedOption.feedback}
        </p>
      </div>

      <button
        onClick={onNext}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 rounded-xl text-base transition-colors"
      >
        {isLast ? "結果を見る" : "次へ"}
      </button>
    </div>
  );
}
