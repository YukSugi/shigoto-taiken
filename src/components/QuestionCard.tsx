"use client";

import { useMemo } from "react";
import Image from "next/image";
import type { Option, Question } from "@/data/jobs/types";
import type { Gender } from "./JobModal";
import OptionButton from "./OptionButton";

const LABELS = ["ア", "イ", "ウ", "エ"];

type Props = {
  question: Question;
  questionIndex: number;
  playerName: string;
  gender: Gender;
  onSelect: (option: Option) => void;
  disabled: boolean;
  sceneImagePrefix?: string;
};

export default function QuestionCard({
  question,
  questionIndex,
  playerName,
  gender,
  onSelect,
  disabled,
  sceneImagePrefix,
}: Props) {
  const effectiveGender = gender;
  const sceneImg = sceneImagePrefix
    ? `/images/${sceneImagePrefix}_scene_${questionIndex}_${effectiveGender}.png`
    : null;

  // 問題が変わるたびに1回だけシャッフル
  const shuffledOptions = useMemo(
    () => [...question.options].sort(() => Math.random() - 0.5),
    [question.id] // eslint-disable-line react-hooks/exhaustive-deps
  );

  return (
    <div className="max-w-2xl mx-auto w-full px-4 py-6 animate-fade-in">
      <h2 className="text-xl font-extrabold text-gray-900 mb-4 leading-snug">
        {question.title}
      </h2>

      {/* シーン画像 */}
      {sceneImg && (
        <div className="mb-5">
          <Image
            src={sceneImg}
            alt={`scene ${questionIndex}`}
            width={640}
            height={360}
            className="w-full rounded-2xl object-cover ring-1 ring-black/5 shadow-md"
            priority
          />
        </div>
      )}

      {/* 状況 */}
      <div className="relative card-soft p-5 mb-6 border-l-4 border-l-teal-400">
        <p className="inline-flex items-center gap-1 text-xs text-teal-600 font-extrabold mb-1.5">
          📋 状況
        </p>
        <p className="text-sm text-gray-800 leading-relaxed">
          {question.situation}
        </p>
      </div>

      {/* 設問 + 選択肢 */}
      <div className="mb-6">
        <p className="text-base font-extrabold text-gray-900 mb-4">
          <span className="text-teal-600">{playerName}</span>さん、
          {question.question}
        </p>
        <div className="space-y-3">
          {shuffledOptions.map((option, index) => (
            <OptionButton
              key={option.id}
              option={option}
              label={LABELS[index]}
              onClick={onSelect}
              disabled={disabled}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
