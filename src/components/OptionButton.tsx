"use client";

import type { Option } from "@/data/jobs/types";

type Props = {
  option: Option;
  label: string;
  onClick: (option: Option) => void;
  disabled: boolean;
};

export default function OptionButton({
  option,
  label,
  onClick,
  disabled,
}: Props) {
  return (
    <button
      onClick={() => onClick(option)}
      disabled={disabled}
      className="group w-full text-left flex items-center gap-3 bg-white hover:bg-teal-50/60 border-2 border-gray-200 border-b-4 hover:border-teal-300 hover:border-b-teal-400 rounded-2xl pl-3 pr-4 py-3.5 text-sm text-gray-800 leading-relaxed transition-all active:translate-y-[2px] active:border-b-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm hover:shadow"
    >
      <span className="grid place-items-center w-8 h-8 shrink-0 rounded-lg bg-teal-100 text-teal-600 font-extrabold text-sm group-hover:bg-teal-500 group-hover:text-white transition-colors">
        {label}
      </span>
      <span className="flex-1">{option.text}</span>
    </button>
  );
}
