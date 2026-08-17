"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FLAG_CARDS, FLAG_MISS_LINES, FLAG_WRONG_RUN_LINES, type FlagCard } from "@/game/data";
import { useGame } from "@/game/state";
import { Dialog, Screen } from "@/components/game/Screen";

const ROUNDS = 10;

function shuffle<T>(arr: T[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function RedFlags({ onBelt }: { onBelt: (on: boolean) => void }) {
  const { go, flag, toast } = useGame();
  const deck = useMemo<FlagCard[]>(() => shuffle(FLAG_CARDS).slice(0, ROUNDS), []);
  const [round, setRound] = useState(0);
  const [started, setStarted] = useState(false);
  const [time, setTime] = useState(1);
  const [result, setResult] = useState<{ ok: boolean; line: string } | null>(null);
  const [score, setScore] = useState(0);
  const answered = useRef(false);

  const card = deck[round];
  const limit = Math.max(1900, 3400 - round * 140);

  const finishRound = useCallback(
    (correct: boolean, line: string) => {
      if (answered.current) return;
      answered.current = true;
      flag(correct, card.red);
      if (correct) setScore((s) => s + 1);
      setResult({ ok: correct, line });
      setTimeout(() => {
        setResult(null);
        answered.current = false;
        if (round + 1 >= ROUNDS) {
          onBelt(false);
          go("applications");
        } else {
          setRound((r) => r + 1);
        }
      }, 1500);
    },
    [card, flag, go, onBelt, round]
  );

  // countdown
  useEffect(() => {
    if (!started || result) return;
    answered.current = false;
    setTime(1);
    const t0 = Date.now();
    const id = setInterval(() => {
      const p = 1 - (Date.now() - t0) / limit;
      setTime(Math.max(0, p));
      if (p <= 0) {
        clearInterval(id);
        finishRound(false, "TOO SLOW. He's already in your DMs.");
      }
    }, 60);
    return () => clearInterval(id);
  }, [started, round, result, limit, finishRound]);

  useEffect(() => {
    onBelt(started);
    return () => onBelt(false);
  }, [started, onBelt]);

  const answer = (run: boolean) => {
    const correct = run === card.red;
    const line = correct
      ? run
        ? "CORRECT. You ran. Growth."
        : "CORRECT. That one was actually fine."
      : run
        ? FLAG_WRONG_RUN_LINES[Math.floor(Math.random() * FLAG_WRONG_RUN_LINES.length)]
        : FLAG_MISS_LINES[Math.floor(Math.random() * FLAG_MISS_LINES.length)];
    if (!correct) toast({ kind: "system", title: "MISTAKE LOGGED", line, effect: "−60 HP" });
    finishRound(correct, line);
  };

  if (!started) {
    return (
      <Screen>
        <Dialog title="LEVEL 3 — RED FLAG DETECTION" tone="dark">
          <h2 className="display text-[9vw] leading-[0.9] text-ivory sm:text-[3rem]">
            The conveyor belt
          </h2>
          <p className="mt-3 text-[0.95rem] leading-snug text-blush">
            Men are coming down the belt. You get about three seconds each. Hit{" "}
            <span className="text-lime">GREEN FLAG</span> to keep him, or{" "}
            <span className="text-alarm">RUN</span> to get rid of him.
          </p>
          <p className="mt-2 text-[0.85rem] text-blush/60">
            10 rounds. We are recording every answer, Pikachu, and yes we will bring them up later. 📝
          </p>
          <div className="mt-5 flex justify-end">
            <button className="btn btn-pink" onClick={() => setStarted(true)}>
              START THE BELT →
            </button>
          </div>
        </Dialog>
      </Screen>
    );
  }

  return (
    <Screen>
      <Dialog title={`LEVEL 3 — ROUND ${round + 1}/${ROUNDS} · CAUGHT ${score}`} tone="dark">
        {result ? (
          <div
            className={`pop rounded-xl border-2 p-5 text-center ${
              result.ok ? "border-lime bg-[#082a1a]" : "border-alarm bg-[#2a0505]"
            }`}
          >
            <p className={`sys text-[1.05rem] sm:text-[1.4rem] ${result.ok ? "text-lime" : "text-alarm"}`}>
              {result.ok ? "GOOD CALL" : "OH NO"}
            </p>
            <p className="mt-2 text-[1rem] leading-snug text-ivory">{result.line}</p>
          </div>
        ) : (
          <>
            <div className="meter is-hp mb-4">
              <i style={{ width: `${time * 100}%`, transition: "none" }} />
            </div>

            <div key={round} className="pop crt px-4 py-6 text-center sm:px-6 sm:py-8">
              <p className="sys text-[0.55rem] text-babypink/70">INCOMING SUBJECT #{String(round + 1).padStart(3, "0")}</p>
              <p className="mt-3 text-[1.25rem] leading-snug text-ivory sm:text-[1.7rem]">
                &ldquo;{card.trait}&rdquo;
              </p>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <button className="btn btn-lime !min-h-[64px] !px-3 !text-[0.62rem] sm:!text-[0.72rem]" onClick={() => answer(false)}>
                💚 GREEN FLAG
              </button>
              <button className="btn btn-danger !min-h-[64px] !px-3 !text-[0.62rem] sm:!text-[0.72rem]" onClick={() => answer(true)}>
                🚩 RUN FOR YOUR LIFE
              </button>
            </div>
          </>
        )}
      </Dialog>
    </Screen>
  );
}
