"use client";

import { useEffect, useState } from "react";
import { HOMEBOY_NOTE } from "@/game/data";
import { useGame } from "@/game/state";

type Phase = "found" | "party" | "glitch" | "lol" | "burn" | "done";

export default function Prank({ onCelebrate }: { onCelebrate: (on: boolean) => void }) {
  const { go, addXp } = useGame();
  const [phase, setPhase] = useState<Phase>("found");

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    onCelebrate(true);
    timers.push(setTimeout(() => setPhase("party"), 900));
    timers.push(
      setTimeout(() => {
        setPhase("glitch");
        onCelebrate(false);
      }, 3200)
    );
    timers.push(setTimeout(() => setPhase("lol"), 4100));
    timers.push(setTimeout(() => setPhase("burn"), 5600));
    timers.push(
      setTimeout(() => {
        setPhase("done");
        addXp(10000);
      }, 7200)
    );
    return () => {
      timers.forEach(clearTimeout);
      onCelebrate(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const celebrating = phase === "found" || phase === "party";

  return (
    <div className="pointer-events-none fixed inset-0 z-40 flex min-h-[100dvh] flex-col items-center justify-center overflow-y-auto px-4 py-6 text-center sm:px-5">
      {celebrating && (
        <div className="rise">
          <p className="sys text-[0.7rem] text-lime sm:text-[0.95rem]">PROTOCOL COMPLETE</p>
          <h2 className="display mt-3 text-[15vw] leading-[0.85] text-ivory sm:text-[6.5rem]">
            Boyfriend found.
          </h2>
          <p className="mt-4 text-[1.5rem] sm:text-[2.2rem]">💖🎊💖</p>
          {phase === "party" && (
            <>
              <p className="pop mt-5 text-[1.4rem] text-hotpink sm:text-[2.2rem]">
                🎉🥳 CONGRATULATIONS!!! 🥳🎉
              </p>
              <p className="pop mt-3 text-[1.6rem] sm:text-[2.4rem]">💐💍✨🕺🏽💕</p>
            </>
          )}
        </div>
      )}

      {phase === "glitch" && (
        <div className="glitch">
          <h2 className="display text-[15vw] leading-[0.85] text-hotpink sm:text-[6.5rem]">
            Boyfr█end f▓und.
          </h2>
          <p className="sys mt-4 text-[0.8rem] text-alarm">ERR0R — RECORD N0T F0UND</p>
        </div>
      )}

      {(phase === "lol" || phase === "burn" || phase === "done") && (
        <div className="pop">
          <h2 className="display text-[26vw] leading-[0.82] text-hotpink sm:text-[11rem]">LOL.</h2>
          {(phase === "burn" || phase === "done") && (
            <h3 className="display rise mt-2 text-[9vw] leading-[0.9] text-ivory sm:text-[3.4rem]">
              There is no boyfriend.
            </h3>
          )}
          {phase === "done" && (
            <div className="rise mt-6 flex flex-col items-center gap-4">
              <p className="text-[1.8rem] leading-none sm:text-[2.6rem]">😭😭😭💀😂</p>
              <p className="deck max-w-[30ch] text-[1.15rem] leading-snug text-blush sm:text-[1.6rem]">
                You really thought we&rsquo;d find you one through a website? 🤣
              </p>

              <div className="panel-dark max-w-[34rem] px-5 py-4">
                <p className="sys text-[0.55rem] text-blush/60">MESSAGE FROM YOUR HOMEBOY</p>
                <p className="mt-2 text-[1.02rem] leading-snug text-ivory sm:text-[1.2rem]">{HOMEBOY_NOTE}</p>
              </div>

              <div className="panel-dark px-5 py-3">
                <p className="sys text-[0.6rem] text-blush/70">SINGLE STATUS</p>
                <p className="sys mt-1 text-[1.1rem] text-alarm sm:text-[1.4rem]">UNCHANGED 💅🏽</p>
                <p className="sys mt-2 text-[0.7rem] text-hotpink">+10,000 SINGLE XP</p>
              </div>

              <button className="btn btn-pink pointer-events-auto mt-1" onClick={() => go("results")}>
                SEE FINAL RESULTS →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
