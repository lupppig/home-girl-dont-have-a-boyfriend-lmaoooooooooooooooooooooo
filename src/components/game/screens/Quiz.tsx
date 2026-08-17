"use client";

import { useState } from "react";
import { QUIZ } from "@/game/data";
import { useGame } from "@/game/state";
import { Choice, Dialog, Screen } from "@/components/game/Screen";

export default function Quiz() {
  const { go, addXp } = useGame();
  const [q, setQ] = useState(0);
  const [reply, setReply] = useState<{ text: string; xp: number } | null>(null);

  const question = QUIZ[q];
  const last = q === QUIZ.length - 1;

  const pick = (i: number) => {
    const opt = question.options[i];
    addXp(opt.xp);
    setReply({ text: opt.reply, xp: opt.xp });
  };

  const next = () => {
    setReply(null);
    if (last) go("redflags");
    else setQ((n) => n + 1);
  };

  return (
    <Screen>
      <Dialog title={`LEVEL 2 — FIND THE PROBLEM · Q${q + 1}/${QUIZ.length}`}>
        <h2 className="display text-[7.5vw] leading-[0.92] text-plum sm:text-[2.6rem]">{question.q}</h2>

        {!reply ? (
          <div className="mt-4 grid gap-2.5">
            {question.options.map((o, i) => (
              <Choice
                key={o.label}
                label={o.label}
                sub={`option ${String.fromCharCode(65 + i)}`}
                onClick={() => pick(i)}
              />
            ))}
          </div>
        ) : (
          <div className="rise mt-4">
            <div className="crt p-4 sm:p-5">
              <p className="sys text-[0.55rem] text-babypink/70">SYSTEM RESPONSE</p>
              <p className="mt-2 text-[1.02rem] leading-snug text-ivory sm:text-[1.15rem]">{reply.text}</p>
              <p className="sys mt-3 text-[0.65rem] text-hotpink">+{reply.xp} SINGLE XP</p>
            </div>
            <div className="mt-4 flex justify-end">
              <button className="btn btn-pink" onClick={next}>
                {last ? "NEXT LEVEL →" : "NEXT QUESTION →"}
              </button>
            </div>
          </div>
        )}
      </Dialog>
    </Screen>
  );
}
