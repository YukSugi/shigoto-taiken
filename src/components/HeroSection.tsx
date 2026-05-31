"use client";

type Props = {
  onClickCta: () => void;
};

export default function HeroSection({ onClickCta }: Props) {
  return (
    <section className="bg-gradient-to-br from-indigo-50 to-blue-50 py-16 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-4">
          気になる仕事を、
          <br />
          4択ゲームで体験しよう。
        </h1>
        <p className="text-gray-600 text-base sm:text-lg mb-6 leading-relaxed">
          営業、マーケティング、エンジニア、経営企画。
          <br />
          名前を入力して、仕事のリアルな場面を選択肢で進めてみよう。
        </p>
        <p className="text-gray-500 text-sm mb-8">
          正解を当てるだけではなく、
          「その仕事では何を考え、どんな判断をするのか」を知るための職業体験RPGです。
        </p>
        <button
          onClick={onClickCta}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-4 rounded-xl text-base transition-colors shadow-md hover:shadow-lg"
        >
          体験する仕事を選ぶ
        </button>
      </div>
    </section>
  );
}
