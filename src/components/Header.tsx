"use client";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[#fffaf2]/85 border-b border-amber-100/80">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <span className="inline-flex items-center gap-2 text-lg font-extrabold text-gray-900 tracking-tight">
          <span className="grid place-items-center w-8 h-8 rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 text-white text-base shadow-sm">
            🎮
          </span>
          お仕事体験
          <span className="text-teal-600">.com</span>
        </span>
        <span className="hidden sm:inline text-xs font-bold text-amber-700/80 bg-amber-100/70 px-3 py-1 rounded-full">
          職業体験 RPG
        </span>
      </div>
    </header>
  );
}
