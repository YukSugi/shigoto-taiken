"use client";

import type { Option } from "@/data/jobs/types";

type Props = {
  option: Option;
  onClick: (option: Option) => void;
  disabled: boolean;
};

export default function OptionButton({ option, onClick, disabled }: Props) {
  return (
    <button
      onClick={() => onClick(option)}
      disabled={disabled}
      className="w-full text-left bg-white hover:bg-indigo-50 active:bg-indigo-100 border-2 border-gray-200 hover:border-indigo-300 rounded-xl px-5 py-4 text-sm text-gray-800 leading-relaxed transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
    >
      <span className="text-indigo-500 font-bold mr-2">{option.id}.</span>
      {option.text}
    </button>
  );
}
