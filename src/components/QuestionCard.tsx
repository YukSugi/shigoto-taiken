"use client";

import type { Option, Question } from "@/data/jobs/types";
import OptionButton from "./OptionButton";

type Props = {
  question: Question;
  playerName: string;
  onSelect: (option: Option) => void;
  disabled: boolean;
};

export default function QuestionCard({
  question,
  playerName,
  onSelect,
  disabled,
}: Props) {
  return (
    <div className="max-w-2xl mx-auto w-full px-4 py-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4">{question.title}</h2>

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
          {question.options.map((option) => (
            <OptionButton
              key={option.id}
              option={option}
              onClick={onSelect}
              disabled={disabled}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
