"use client";

import { useMemo } from "react";
import Image from "next/image";
import type { Option, Question } from "@/data/jobs/types";
import type { Gender } from "./JobModal";
import OptionButton from "./OptionButton";

// scene_5_maleが未作成のためfemaleにfallback
const MISSING_MALE_SCENES = [5];
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
  const effectiveGender =
    gender === "male" && MISSING_MALE_SCENES.includes(questionIndex)
      ? "female"
      : gender;
  const sceneImg = sceneImagePrefix
    ? `/images/${sceneImagePrefix}_scene_${questionIndex}_${effectiveGender}.png`
    : null;

  // 問題が変わるたびに1回だけシャッフル
  const shuffledOptions = useMemo(
    () => [...question.options].sort(() => Math.random() - 0.5),
    [question.id] // eslint-disable-line react-hooks/exhaustive-deps
  );

  return (
    <div className="max-w-2xl mx-auto w-full px-4 py-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4">{question.title}</h2>

      {/* シーン画像 */}
      {sceneImg && (
        <div className="mb-4">
          <Image
            src={sceneImg}
            alt={`scene ${questionIndex}`}
            width={640}
            height={360}
            className="w-full rounded-2xl object-cover"
            priority
          />
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-5">
        <p className="text-sm text-gray-500 font-medium mb-2 uppercase tracking-wide">
          状況
        </p>
        <p className="text-sm text-gray-800 leading-relaxed">
          {question.situation}
        </p>
      </div>

      <div className="mb-5">
        <p className="text-base font-semibold text-gray-900 mb-4">
          {playerName}さん、{question.question}
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
