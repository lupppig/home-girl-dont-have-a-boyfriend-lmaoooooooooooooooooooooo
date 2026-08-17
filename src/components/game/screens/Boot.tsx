"use client";

import { useEffect, useRef, useState } from "react";
import { BOOT_LINES } from "@/game/data";
import { useGame } from "@/game/state";

export default function Boot() {
  const { go, setEvents } = useGame();
  const [phase, setPhase] = useState<"loading" | "oh" | "single" | "talk" | "cta">("loading");
  const [lineIndex, setLineIndex] = useState(0);
  const [pct, setPct] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const scheduled = timers.current;
    const push = (fn: () => void, ms: number) => scheduled.push(setTimeout(fn, ms));

    BOOT_LINES.forEach((_, i) => push(() => setLineIndex(i), i * 620));

    const total = BOOT_LINES.length * 620 + 500;
    const tick = setInterval(() => setPct((p) => Math.min(100, p + 3)), total / 40);
    scheduled.push(tick as unknown as ReturnType<typeof setTimeout>);

    push(() => setPct(100), total);
    push(() => setPhase("oh"), total + 700);
    push(() => setPhase("single"), total + 1900);
    push(() => setPhase("talk"), total + 3400);
    push(() => setPhase("cta"), total + 4400);

    return () => {
      scheduled.forEach((t) => clearTimeout(t));
      clearInterval(tick);
    };
  }, []);

  const skip = () => {
    timers.current.forEach((t) => clearTimeout(t));
    setPct(100);
    setPhase("cta");
  };

  const bars = Math.round(pct / 5);

  return (
    <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-[#07020a] px-5 text-center">
      {phase === "loading" && (
        <div className="w-full max-w-[520px] text-left">
          <ul className="sys space-y-1.5 text-[0.62rem] text-lime sm:text-[0.72rem]">
            {BOOT_LINES.slice(0, lineIndex + 1).map((l, i) => (
              <li key={l} className="rise">
                &gt; {l}
                {i < lineIndex ? " … OK" : <span className="blink"> …</span>}
              </li>
            ))}
          </ul>
          <p className="sys mt-6 text-[0.7rem] text-blush sm:text-[0.85rem]">
            {"█".repeat(bars)}
            <span className="text-blush/25">{"░".repeat(20 - bars)}</span> {pct}%
          </p>
          <button onClick={skip} className="micro mt-8 rounded-sm px-2 py-1 text-[0.6rem] text-blush/80 underline underline-offset-4">
            skip
          </button>
        </div>
      )}

      {phase !== "loading" && (
        <div className="w-full max-w-[820px]">
          <h1 className="display pop text-[22vw] leading-[0.82] text-ivory sm:text-[9rem]">Oh.</h1>

          {phase !== "oh" && (
            <h2 className="display pop mt-2 text-[11vw] leading-[0.88] text-hotpink sm:text-[4.6rem]">
              You&rsquo;re still single.
            </h2>
          )}

          {(phase === "talk" || phase === "cta") && (
            <p className="deck rise mt-6 text-[1.4rem] text-blush sm:text-[2rem]">We need to talk.</p>
          )}

          {phase === "cta" && (
            <div className="rise mt-9 flex flex-col items-center gap-3">
              <button
                className="btn btn-pink !min-h-[60px] !px-9 !text-[0.8rem]"
                onClick={() => {
                  setEvents(true);
                  go("diagnosis");
                }}
              >
                START INTERVENTION →
              </button>
              <p className="micro text-[0.56rem] text-blush/75">7 levels · no escape · you clicked it yourself</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
