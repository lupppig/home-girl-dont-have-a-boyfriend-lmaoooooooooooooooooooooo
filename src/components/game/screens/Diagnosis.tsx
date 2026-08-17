"use client";

import { useEffect, useState } from "react";
import { DIAGNOSIS } from "@/game/data";
import { useGame } from "@/game/state";
import { Dialog, Screen } from "@/components/game/Screen";

export default function Diagnosis({ onScanChange }: { onScanChange: (on: boolean) => void }) {
  const { go, addXp } = useGame();
  const [row, setRow] = useState(-1);
  const [done, setDone] = useState(false);

  useEffect(() => {
    onScanChange(true);
    const timers = DIAGNOSIS.map((_, i) => setTimeout(() => setRow(i), 500 + i * 700));
    const end = setTimeout(() => {
      setDone(true);
      onScanChange(false);
      addXp(250);
    }, 500 + DIAGNOSIS.length * 700 + 400);
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(end);
      onScanChange(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Screen>
      <Dialog title="LEVEL 1 — THE DIAGNOSIS · SUBJECT: PIKACHU" tone="dark">
        <h2 className="display text-[9vw] leading-[0.9] text-ivory sm:text-[3.2rem]">Why are we here?</h2>
        <p className="mt-2 text-[0.88rem] text-blush/70">
          Stand still, Pikachu. This scanner cost your homeboy a lot of money he did not have.
        </p>

        <div className="mt-5 space-y-2">
          {DIAGNOSIS.map((d, i) => {
            const shown = i <= row;
            return (
              <div
                key={d.label}
                className={`flex items-center gap-3 transition-opacity duration-300 ${shown ? "opacity-100" : "opacity-20"}`}
              >
                <span className="sys w-[9.5rem] shrink-0 text-[0.58rem] text-blush/80 sm:w-[13rem] sm:text-[0.66rem]">
                  {d.label}
                </span>
                <span className="hidden flex-1 border-b border-dotted border-blush/25 sm:block" />
                <span
                  className={`sys text-[0.8rem] sm:text-[0.95rem] ${
                    d.ok ? "text-lime" : "text-alarm"
                  }`}
                >
                  {shown ? `${d.value.toString().padStart(2, "0")}${d.suffix ?? "%"}` : "··"}
                </span>
                {d.note && shown && <span className="sys text-[0.5rem] text-alarm">{d.note}</span>}
              </div>
            );
          })}
        </div>

        {done && (
          <div className="rise mt-6 border-2 border-alarm bg-[#2a0505] p-4">
            <p className="sys text-[1.1rem] text-alarm sm:text-[1.5rem]">⚠ CRITICAL FAILURE</p>
            <p className="mt-2 text-[0.92rem] leading-snug text-blush">
              Everything appears to be working except the boyfriend department. Repeat:
              <span className="text-ivory"> everything else is fine.</span> This is the confusing part.
            </p>
            <p className="sys mt-3 text-[0.6rem] text-hotpink">+250 SINGLE XP</p>
          </div>
        )}

        <div className="mt-5 flex justify-end">
          <button className="btn btn-pink" disabled={!done} onClick={() => go("quiz")}>
            {done ? "CONTINUE →" : "SCANNING…"}
          </button>
        </div>
      </Dialog>
    </Screen>
  );
}
