"use client";

import Image from "next/image";

type Props = {
  onClickCta: () => void;
};

export default function HeroSection({ onClickCta }: Props) {
  return (
    <section className="bg-amber-50 px-4 py-10 sm:py-16">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-8">

        {/* テキスト側 */}
        <div className="flex-1 text-center sm:text-left order-2 sm:order-1">
          <p className="text-amber-700 text-xs font-bold mb-3 tracking-widest uppercase">
            職業体験 RPG
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-4">
            気になる仕事を、
            <br />
            4択ゲームで体験しよう。
          </h1>
          <p className="text-gray-600 text-sm sm:text-base mb-2 leading-relaxed">
            名前を入力して、仕事のリアルな場面を選択肢で進めよう。
          </p>
          <p className="text-gray-500 text-sm mb-8 leading-relaxed">
            「その仕事では何を考え、どう判断するか」を体で知るための職業体験ゲームです。
          </p>
          <button
            onClick={onClickCta}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-4 rounded-xl text-base transition-colors shadow-md hover:shadow-lg"
          >
            ▶ 体験する仕事を選ぶ
          </button>
        </div>

        {/* 画像側 */}
        <div className="flex-1 w-full order-1 sm:order-2">
          <Image
            src="/images/empsales_scene_1_female.png"
            alt="お仕事体験ゲームのシーン"
            width={640}
            height={360}
            className="w-full rounded-2xl shadow-lg"
            priority
          />
        </div>

      </div>
    </section>
  );
}
