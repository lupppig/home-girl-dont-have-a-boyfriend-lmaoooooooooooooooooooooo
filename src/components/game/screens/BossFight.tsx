"use client";

import { useEffect, useRef, useState } from "react";
import { BOSS_FORMS, BOSS_HIT_LINES, BOSS_TAUNTS, BOSS_WEAKNESSES } from "@/game/data";
import { useGame } from "@/game/state";
import { Dialog, Screen } from "@/components/game/Screen";

export default function BossFight({
  onForm,
  onHit,
}: {
  onForm: (n: number) => void;
  onHit: () => void;
}) {
  const { go, addXp, damage, toast } = useGame();
  const [started, setStarted] = useState(false);
  const [bossHp, setBossHp] = useState(100);
  const [form, setForm] = useState(0);
  const [exposed, setExposed] = useState(0);
  const [taunt, setTaunt] = useState(BOSS_TAUNTS[0]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [beaten, setBeaten] = useState(false);
  const hpRef = useRef(100);

  // the boss keeps changing what he is
  useEffect(() => {
    if (!started || beaten) return;
    const id = setInterval(() => {
      setForm((f) => {
        const n = (f + 1) % BOSS_FORMS.length;
        onForm(n);
        return n;
      });
      setExposed(Math.floor(Math.random() * BOSS_WEAKNESSES.length));
      setTaunt(BOSS_TAUNTS[Math.floor(Math.random() * BOSS_TAUNTS.length)]);
    }, 2400);
    return () => clearInterval(id);
  }, [started, beaten, onForm]);

  // he chips away at you while you think
  useEffect(() => {
    if (!started || beaten) return;
    const id = setInterval(() => {
      damage(-45);
    }, 5200);
    return () => clearInterval(id);
  }, [started, beaten, damage]);

  const attack = (i: number) => {
    if (beaten) return;
    const crit = i === exposed;
    const dmg = crit ? 26 : 9;
    hpRef.current = Math.max(0, hpRef.current - dmg);
    setBossHp(hpRef.current);
    onHit();
    setFeedback(
      crit
        ? BOSS_HIT_LINES[Math.floor(Math.random() * BOSS_HIT_LINES.length)]
        : `Weak hit. He said “haha” and changed the subject.`
    );
    addXp(crit ? 180 : 60);
    setTimeout(() => setFeedback(null), 1400);

    if (hpRef.current <= 0) {
      setBeaten(true);
      toast({
        kind: "system",
        title: "BOSS DEFEATED",
        line: "The Ideal Man has been dismantled. He is telling everyone you're crazy.",
        effect: "+1,500 SINGLE XP",
      });
      addXp(1500);
    }
  };

  if (!started) {
    return (
      <Screen>
        <Dialog title="LEVEL 6 — BOSS FIGHT" tone="dark">
          <h2 className="display text-[9vw] leading-[0.9] text-ivory sm:text-[3rem]">The ideal man</h2>
          <p className="mt-3 text-[0.95rem] leading-snug text-blush">
            He is everything you have ever described to us, Pikachu. Which is the problem, because
            he keeps changing every two seconds.
          </p>
          <p className="mt-2 text-[0.85rem] text-blush/60">
            Attack whichever red flag is <span className="text-alarm">EXPOSED</span>. Hitting the
            wrong one barely scratches him.
          </p>
          <div className="mt-5 flex justify-end">
            <button className="btn btn-danger" onClick={() => setStarted(true)}>
              FIGHT HIM →
            </button>
          </div>
        </Dialog>
      </Screen>
    );
  }

  return (
    <Screen>
      <Dialog title="LEVEL 6 — BOSS FIGHT" tone="dark">
        <div className="flex items-baseline justify-between gap-3">
          <p className="sys text-[0.72rem] text-alarm sm:text-[0.95rem]">{BOSS_FORMS[form]}</p>
          <p className="sys text-[0.6rem] text-blush/60">{bossHp}%</p>
        </div>
        <div className="meter is-hp mt-2">
          <i style={{ width: `${bossHp}%` }} />
        </div>

        <div key={taunt} className="pop mt-3 text-[1rem] italic text-blush/80">
          he says: {taunt}
        </div>

        {beaten ? (
          <div className="rise mt-4 rounded-xl border-2 border-lime bg-[#082a1a] p-4 text-center">
            <p className="sys text-[1.05rem] text-lime sm:text-[1.4rem]">HE&rsquo;S GONE</p>
            <p className="mt-2 text-[0.98rem] leading-snug text-ivory">
              You defeated the imaginary man. Unfortunately the real ones are still out there,
              typing &ldquo;wyd&rdquo;.
            </p>
            <button className="btn btn-pink mt-4" onClick={() => go("emergency")}>
              CONTINUE →
            </button>
          </div>
        ) : (
          <>
            {feedback && <p className="pop mt-3 text-[0.95rem] text-hotpink">{feedback}</p>}
            <div className="mt-4 grid grid-cols-2 gap-2.5">
              {BOSS_WEAKNESSES.map((w, i) => (
                <button
                  key={w.key}
                  onClick={() => attack(i)}
                  className={`btn !min-h-[58px] !px-3 !text-[0.58rem] sm:!text-[0.64rem] ${
                    i === exposed ? "btn-danger blink" : "btn-cream"
                  }`}
                >
                  {w.emoji} {w.label}
                </button>
              ))}
            </div>
            <p className="micro mt-3 text-center text-[0.5rem] text-blush/40">
              he is attacking your HP while you deliberate. as usual.
            </p>
          </>
        )}
      </Dialog>
    </Screen>
  );
}
