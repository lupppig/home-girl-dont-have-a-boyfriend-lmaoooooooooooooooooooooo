"use client";

import { useEffect } from "react";
import { useGame, type Toast } from "@/game/state";

function ToastCard({ t, onDone }: { t: Toast; onDone: (id: number) => void }) {
  useEffect(() => {
    const id = setTimeout(() => onDone(t.id), t.kind === "achievement" ? 5200 : 6200);
    return () => clearTimeout(id);
  }, [t, onDone]);

  const skin =
    t.kind === "achievement"
      ? "border-[#f0d3a2] bg-[#2a1608]"
      : t.kind === "system"
        ? "border-alarm bg-[#2a0505]"
        : "border-lavender bg-[#1d0a2a]";

  return (
    <div className={`pop pointer-events-auto w-full rounded-xl border-2 ${skin} px-3.5 py-2.5 shadow-[0_5px_0_0_rgba(0,0,0,0.5)]`}>
      <p className="sys text-[0.55rem] text-blush/70">{t.title}</p>
      <p className="mt-1 text-[0.88rem] leading-snug text-ivory">{t.line}</p>
      {t.effect && <p className="sys mt-1.5 text-[0.6rem] text-hotpink">{t.effect}</p>}
    </div>
  );
}

export default function Toasts() {
  const { state, dropToast } = useGame();
  const shown = state.toasts.slice(-2);

  return (
    <div className="pointer-events-none fixed z-50 hidden flex-col gap-2 sm:inset-x-auto sm:right-4 sm:top-[152px] sm:flex sm:w-[300px] sm:items-stretch">
      {shown.map((t) => (
        <ToastCard key={t.id} t={t} onDone={dropToast} />
      ))}
    </div>
  );
}
