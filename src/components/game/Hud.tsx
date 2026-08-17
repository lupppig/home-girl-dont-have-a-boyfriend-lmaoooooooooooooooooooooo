"use client";

import { STAGE_LEVEL, useGame } from "@/game/state";

function Meter({
  label,
  value,
  max,
  variant,
  display,
}: {
  label: string;
  value: number;
  max: number;
  variant?: "hp" | "hope";
  display: string;
}) {
  return (
    <div className="min-w-0 flex-1">
      <div className="mb-1 flex items-baseline justify-between gap-2">
        <span className="micro text-[0.5rem] text-blush/60">{label}</span>
        <span className="sys text-[0.6rem] text-hotpink">{display}</span>
      </div>
      <div className={`meter ${variant === "hp" ? "is-hp" : variant === "hope" ? "is-hope" : ""}`}>
        <i style={{ width: `${Math.max(2, Math.min(100, (value / max) * 100))}%` }} />
      </div>
    </div>
  );
}

export default function Hud() {
  const { state, level } = useGame();
  const lv = STAGE_LEVEL[state.stage];

  if (state.stage === "boot") return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-40 px-2 pt-2 sm:px-4 sm:pt-4">
      <div className="mx-auto max-w-[1100px] rounded-2xl border-2 border-hotpink bg-[#1c0510]/92 px-3 py-2.5 shadow-[0_6px_0_0_#12030a] backdrop-blur sm:px-5 sm:py-3">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
          <div className="flex items-baseline gap-3">
            <span className="sys text-[0.62rem] text-blush/70">SINGLE XP</span>
            <span className="sys text-[0.95rem] text-ivory sm:text-[1.15rem]">
              {state.xp.toLocaleString()}
            </span>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="sys text-[0.62rem] text-blush/70">LEVEL</span>
            <span className="sys text-[0.95rem] text-hotpink sm:text-[1.15rem]">{level}</span>
          </div>
          {lv && (
            <div className="order-3 w-full sm:order-none sm:w-auto">
              <span className="sys text-[0.58rem] text-lavender">
                LV.{lv.n} — {lv.name}
              </span>
            </div>
          )}
        </div>

        <div className="mt-2.5 flex items-end gap-3 sm:gap-5">
          <Meter
            label="Boyfriend progress"
            value={state.progress}
            max={100}
            display={`${state.progress}%`}
          />
          <Meter label="HP" value={state.hp} max={1000} variant="hp" display={`${state.hp}`} />
          <Meter label="Hope" value={state.hope} max={200} variant="hope" display={`${state.hope}`} />
        </div>
      </div>
    </div>
  );
}
