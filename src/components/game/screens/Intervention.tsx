"use client";

import { useState } from "react";
import { INTERVENTION } from "@/game/data";
import { useGame } from "@/game/state";
import { Dialog, Screen } from "@/components/game/Screen";

const AVATAR: Record<string, { bg: string; face: string }> = {
  bestie: { bg: "bg-hotpink", face: "😌" },
  concerned: { bg: "bg-lavender", face: "🥺" },
  hater: { bg: "bg-burgundy", face: "😏" },
  system: { bg: "bg-alarm", face: "⚠" },
};

export default function Intervention() {
  const { go, addXp } = useGame();
  const [i, setI] = useState(0);
  const line = INTERVENTION[i];
  const last = i === INTERVENTION.length - 1;
  const a = AVATAR[line.tone];

  const advance = () => {
    if (last) {
      addXp(400);
      go("boss");
    } else {
      setI((n) => n + 1);
    }
  };

  return (
    <Screen>
      <Dialog title={`LEVEL 5 — THE INTERVENTION · ${i + 1}/${INTERVENTION.length}`} tone="dark">
        {i === 0 && (
          <h2 className="display mb-4 text-[8vw] leading-[0.9] text-ivory sm:text-[2.6rem]">
            Your friends have joined the session.
          </h2>
        )}

        <div key={i} className="pop flex gap-3.5">
          <div
            className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-plum text-2xl ${a.bg}`}
          >
            {a.face}
          </div>
          <div className="min-w-0 flex-1">
            <p className="sys text-[0.6rem] text-hotpink">
              {line.who}
              {line.role && <span className="ml-2 text-blush/40">· {line.role}</span>}
            </p>
            <p
              className={`mt-1.5 leading-snug ${
                line.tone === "system"
                  ? "sys text-[0.95rem] text-alarm sm:text-[1.2rem]"
                  : "text-[1.05rem] text-ivory sm:text-[1.25rem]"
              }`}
            >
              {line.line}
            </p>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between gap-3">
          <div className="flex gap-1.5">
            {INTERVENTION.map((_, n) => (
              <span
                key={n}
                className={`h-1.5 w-4 rounded-full ${n <= i ? "bg-hotpink" : "bg-blush/20"}`}
              />
            ))}
          </div>
          <button className="btn btn-pink" onClick={advance}>
            {last ? "ENTER BOSS FIGHT →" : "CONTINUE →"}
          </button>
        </div>
      </Dialog>
    </Screen>
  );
}
