"use client";

import Image from "next/image";

type Props = {
  onClickCta: () => void;
};

export default function HeroSection({ onClickCta }: Props) {
  return (
    <section className="relative overflow-hidden px-4 py-12 sm:py-20">
      {/* 背景の柔らかな光 */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-amber-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-teal-200/40 blur-3xl" />

      <div className="relative max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-8 sm:gap-10">
        {/* テキスト側 */}
        <div className="flex-1 text-center sm:text-left order-2 sm:order-1 animate-fade-up">
          <span className="inline-flex items-center gap-1.5 text-amber-800 text-xs font-extrabold mb-4 tracking-wider bg-amber-100/80 border border-amber-200 px-3 py-1.5 rounded-full">
            🎮 職業体験 RPG
          </span>
          <h1 className="text-3xl sm:text-[2.6rem] font-extrabold text-gray-900 leading-[1.25] mb-4">
            気になる仕事を、
            <br />
            <span className="bg-gradient-to-r from-teal-500 to-emerald-600 bg-clip-text text-transparent">
              4択ゲーム
            </span>
            で体験しよう。
          </h1>
          <p className="text-gray-700 text-sm sm:text-base mb-2 leading-relaxed font-medium">
            名前を入力して、仕事のリアルな場面を選択肢で進めよう。
          </p>
          <p className="text-gray-500 text-sm mb-7 leading-relaxed">
            「その仕事では何を考え、どう判断するか」を体で知るための職業体験ゲームです。
          </p>

          <button
            onClick={onClickCta}
            className="btn-pop px-8 py-4 text-base sm:text-lg"
          >
            ▶ 体験する仕事を選ぶ
          </button>

          {/* 特徴チップ */}
          <div className="mt-6 flex flex-wrap justify-center sm:justify-start gap-2 text-xs font-bold text-gray-600">
            <span className="bg-white/80 border border-gray-100 px-3 py-1.5 rounded-full shadow-sm">
              ⏱ 1プレイ 約7〜10分
            </span>
            <span className="bg-white/80 border border-gray-100 px-3 py-1.5 rounded-full shadow-sm">
              📱 登録なしですぐ遊べる
            </span>
            <span className="bg-white/80 border border-gray-100 px-3 py-1.5 rounded-full shadow-sm">
              🎯 全問にフィードバック
            </span>
          </div>
        </div>

        {/* 画像側 */}
        <div className="flex-1 w-full order-1 sm:order-2 animate-fade-in">
          <div className="relative">
            <div className="absolute inset-0 -rotate-2 rounded-[1.75rem] bg-gradient-to-br from-teal-300/40 to-amber-200/40" />
            <Image
              src="/images/shokugyo-taiken-topimage.png"
              alt="お仕事体験ゲームのシーン"
              width={640}
              height={360}
              className="relative w-full rounded-[1.5rem] ring-1 ring-black/5 shadow-xl"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
