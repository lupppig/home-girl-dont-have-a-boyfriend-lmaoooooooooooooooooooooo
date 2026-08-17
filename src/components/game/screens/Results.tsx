"use client";

import { useMemo, useState } from "react";
import { ACHIEVEMENTS, HOMEBOY_NOTE, RATING_QUIP } from "@/game/data";
import { useGame } from "@/game/state";
import { Dialog, Screen } from "@/components/game/Screen";

export default function Results() {
  const { state, level, reset, go } = useGame();
  const [copied, setCopied] = useState(false);

  const redFlagScore = Math.min(100, 40 + state.redFlagsCaught * 7);
  const rating = useMemo(
    () => [...RATING_QUIP].reverse().find((r) => state.xp >= r.min)!.label,
    [state.xp]
  );

  const rows: [string, string][] = [
    ["HOT GIRL SCORE", "98% 🔥"],
    ["COMMON SENSE", `${state.commonSense}%`],
    ["RED FLAG DETECTION", `${redFlagScore}%`],
    ["MEN REJECTED", `${state.rejected}`],
    ["BOYFRIEND ACQUIRED", "0% 💀"],
    ["SINGLE XP", state.xp.toLocaleString()],
    ["FINAL LEVEL", `${level}`],
  ];

  const share = async () => {
    const text = [
      "FINAL RESULTS — BOYFRIEND FINDER 3000",
      ...rows.map(([k, v]) => `${k}: ${v}`),
      `RATING: ⭐⭐⭐⭐⭐ ${rating}`,
      "",
      "Pikachu is still single 😭 but the website goes crazy.",
    ].join("\n");
    try {
      if (navigator.share) await navigator.share({ title: "My single results", text });
      else {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      /* she cancelled the share sheet — fine */
    }
  };

  const unlocked = state.achievements.map((id) => ACHIEVEMENTS[id]).filter(Boolean);

  return (
    <Screen wide>
      <Dialog title="GAME OVER — FINAL RESULTS">
        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <h2 className="display text-[10vw] leading-[0.88] text-plum sm:text-[3.4rem]">Final results 🫠</h2>
            <div className="mt-4 border-y-2 border-plum py-1">
              {rows.map(([k, v]) => (
                <div key={k} className="flex items-baseline gap-2 border-b border-plum/12 py-2 last:border-0">
                  <span className="sys text-[0.55rem] text-plum/60 sm:text-[0.62rem]">{k}</span>
                  <span className="flex-1 border-b border-dotted border-plum/25" />
                  <span className="sys text-[0.82rem] text-hotpink sm:text-[0.95rem]">{v}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-xl border-2 border-plum bg-ivory p-4 text-center">
              <p className="text-2xl tracking-[0.2em]">⭐⭐⭐⭐⭐</p>
              <p className="deck mt-1.5 text-[1.15rem] text-burgundy sm:text-[1.35rem]">{rating}</p>
            </div>
          </div>

          <div>
            <p className="sys text-[0.6rem] text-hotpink">
              ACHIEVEMENTS · {unlocked.length}/{Object.keys(ACHIEVEMENTS).length}
            </p>
            <ul className="mt-3 space-y-2">
              {Object.values(ACHIEVEMENTS).map((a) => {
                const got = state.achievements.includes(a.id);
                return (
                  <li
                    key={a.id}
                    className={`flex items-start gap-3 rounded-lg border-2 px-3 py-2 ${
                      got ? "border-plum bg-ivory" : "border-plum/20 bg-plum/5 opacity-55"
                    }`}
                  >
                    <span className="text-lg leading-none">{got ? a.icon : "🔒"}</span>
                    <span className="min-w-0">
                      <span className="sys block text-[0.58rem] text-plum">{a.name}</span>
                      <span className="block text-[0.8rem] leading-snug text-plum/65">{a.desc}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
          <button
            className="btn btn-cream flex-1"
            onClick={() => {
              reset();
              go("boot");
            }}
          >
            PLAY AGAIN
          </button>
          <button className="btn btn-pink flex-1" onClick={share}>
            {copied ? "COPIED ♡" : "SEND TO THE FRIENDS"}
          </button>
        </div>

        <div className="mt-5 rounded-xl border-2 border-plum bg-plum px-4 py-4 text-center sm:px-6">
          <p className="sys text-[0.55rem] text-babypink/70">FINAL MESSAGE — FROM YOUR HOMEBOY</p>
          <p className="mt-2 text-[1.05rem] leading-snug text-ivory sm:text-[1.25rem]">{HOMEBOY_NOTE}</p>
          <p className="mt-3 text-[1.4rem]">😭💀🤣💅🏽🫡</p>
        </div>

        <p className="hand mt-4 text-center text-[1.15rem]">
          made this whole game just to roast you, Pikachu. love you. sort it out. ♡
        </p>
      </Dialog>
    </Screen>
  );
}
