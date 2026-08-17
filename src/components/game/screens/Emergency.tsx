"use client";

import { useEffect, useState } from "react";
import { EMERGENCY_LINES } from "@/game/data";
import { useGame } from "@/game/state";

export default function Emergency({ onAlarm }: { onAlarm: (on: boolean) => void }) {
  const { go } = useGame();
  const [line, setLine] = useState(-1);
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    onAlarm(true);
    const timers: ReturnType<typeof setTimeout>[] = [];
    EMERGENCY_LINES.forEach((_, i) => timers.push(setTimeout(() => setLine(i), 500 + i * 1300)));
    const base = 500 + EMERGENCY_LINES.length * 1300 + 600;
    [5, 4, 3, 2, 1].forEach((n, i) => timers.push(setTimeout(() => setCount(n), base + i * 800)));
    timers.push(
      setTimeout(() => {
        setCount(0);
        onAlarm(false);
      }, base + 5 * 800)
    );
    timers.push(setTimeout(() => go("prank"), base + 5 * 800 + 900));
    return () => {
      timers.forEach(clearTimeout);
      onAlarm(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-40 flex min-h-[100dvh] flex-col items-center justify-center overflow-y-auto px-5 py-6 text-center">
      <div className="alarm absolute inset-0" />
      <div className="absolute inset-x-0 top-0 h-2.5 warning-tape" />
      <div className="absolute inset-x-0 bottom-0 h-2.5 warning-tape" />

      <div className="relative shake">
        <p className="sys text-[0.7rem] text-alarm sm:text-[1rem]">⚠ SYSTEM ALERT ⚠</p>
        <h2 className="display mt-3 text-[13vw] leading-[0.85] text-ivory sm:text-[5rem]">
          Pikachu. This is getting serious.
        </h2>
      </div>

      <div className="relative mt-7 min-h-[6.5rem] space-y-2">
        {EMERGENCY_LINES.slice(0, line + 1).map((l) => (
          <p key={l} className="sys rise text-[0.68rem] text-alarm sm:text-[0.9rem]">
            {l}
          </p>
        ))}
      </div>

      {count !== null && count > 0 && (
        <p key={count} className="pop sys text-[22vw] leading-none text-ivory sm:text-[9rem]">
          {count}
        </p>
      )}
      {count === 0 && <p className="sys text-[1rem] text-blush blink sm:text-[1.4rem]">…</p>}
    </div>
  );
}
