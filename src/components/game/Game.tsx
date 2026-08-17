"use client";

import dynamic from "next/dynamic";
import { useCallback, useMemo, useRef, useState } from "react";
import { OBJECT_LINES, SEARCH_REPLIES } from "@/game/data";
import { useGame } from "@/game/state";
import type { Focus } from "@/components/three/LabScene";
import type { LabObject } from "@/components/three/LabProps";
import Hud from "./Hud";
import Toasts from "./Toasts";
import Boot from "./screens/Boot";
import Diagnosis from "./screens/Diagnosis";
import Quiz from "./screens/Quiz";
import RedFlags from "./screens/RedFlags";
import Applications from "./screens/Applications";
import Intervention from "./screens/Intervention";
import BossFight from "./screens/BossFight";
import Emergency from "./screens/Emergency";
import Prank from "./screens/Prank";
import Results from "./screens/Results";

const LabScene = dynamic(() => import("@/components/three/LabScene"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 grid place-items-center bg-[#2b0a1a]">
      <p className="micro text-blush/40">booting the facility…</p>
    </div>
  ),
});

const FOCUS_BY_STAGE: Record<string, Focus> = {
  boot: "machine",
  diagnosis: "machine",
  quiz: "wide",
  redflags: "belt",
  applications: "shelf",
  intervention: "wide",
  boss: "boss",
  emergency: "alarm",
  prank: "machine",
  results: "wide",
};

export default function Game() {
  const { state, poke, emergency, search, toast } = useGame();

  const [scanning, setScanning] = useState(false);
  const [belt, setBelt] = useState(false);
  const [alarm, setAlarm] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const [bossForm, setBossForm] = useState(0);
  const [bossHit, setBossHit] = useState(0);
  const hitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const focus = FOCUS_BY_STAGE[state.stage] ?? "machine";
  const bossActive = state.stage === "boss";
  const shakeAmt = alarm ? 1 : bossHit > 0 ? 0.4 : 0;

  const daysSingle = useMemo(() => 1247 + Math.floor(state.xp / 400), [state.xp]);

  const onPoke = useCallback(
    (id: LabObject) => {
      if (id === "emergency") {
        emergency();
        const lines = OBJECT_LINES.emergency;
        const i = Math.min(state.emergencyPresses, lines.length - 1);
        toast({ kind: "system", title: "EMERGENCY BUTTON", line: lines[i] });
        return;
      }
      if (id === "machine") {
        poke();
        const lines = OBJECT_LINES.machine;
        const i = Math.min(Math.floor(state.machinePokes / 2), lines.length - 1);
        toast({ kind: "system", title: "EQUIPMENT", line: lines[i] });
        return;
      }
      const lines = OBJECT_LINES[id];
      if (lines) {
        toast({
          kind: "event",
          title: id.toUpperCase(),
          line: lines[Math.floor(Math.random() * lines.length)],
        });
      }
    },
    [emergency, poke, state.emergencyPresses, state.machinePokes, toast]
  );

  const onBossHit = useCallback(() => {
    setBossHit(1);
    if (hitTimer.current) clearTimeout(hitTimer.current);
    hitTimer.current = setTimeout(() => setBossHit(0), 400);
  }, []);

  const findBoyfriend = () => {
    search();
    const lines = SEARCH_REPLIES;
    const i = Math.min(state.searchClicks, lines.length - 1);
    toast({ kind: "event", title: "BOYFRIEND SEARCH", line: lines[i], effect: "+25 SINGLE XP" });
  };

  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* the facility */}
      <div className="absolute inset-0">
        <LabScene
          focus={focus}
          onPoke={onPoke}
          scanning={scanning}
          beltRunning={belt}
          emergencyArmed={alarm || state.emergencyPresses > 0}
          bossActive={bossActive}
          bossForm={bossForm}
          bossHit={bossHit}
          celebrate={celebrate}
          shakeAmt={shakeAmt}
          daysSingle={daysSingle}
        />
      </div>

      {/* red alert wash */}
      {alarm && <div className="pointer-events-none absolute inset-0 z-20 alarm bg-alarm/10" />}

      <Hud />

      {/* the pointless search button — a running gag */}
      {state.stage !== "boot" && state.stage !== "emergency" && state.stage !== "prank" && (
        <button
          onClick={findBoyfriend}
          className="fixed bottom-3 left-3 z-40 rounded-full border-2 border-plum bg-gradient-to-b from-white to-cream px-3.5 py-2 text-plum shadow-[0_4px_0_0_var(--color-plum)] transition-transform active:translate-y-1 sm:bottom-auto sm:top-[124px] sm:left-4"
        >
          <span className="sys text-[0.5rem]">♥ FIND BOYFRIEND</span>
          <span className="sys ml-1.5 text-[0.5rem] text-hotpink">{state.searchClicks}</span>
        </button>
      )}

      {/* stage router */}
      {state.stage === "boot" && <Boot />}
      {state.stage === "diagnosis" && <Diagnosis onScanChange={setScanning} />}
      {state.stage === "quiz" && <Quiz />}
      {state.stage === "redflags" && <RedFlags onBelt={setBelt} />}
      {state.stage === "applications" && <Applications />}
      {state.stage === "intervention" && <Intervention />}
      {state.stage === "boss" && <BossFight onForm={setBossForm} onHit={onBossHit} />}
      {state.stage === "emergency" && <Emergency onAlarm={setAlarm} />}
      {state.stage === "prank" && <Prank onCelebrate={setCelebrate} />}
      {state.stage === "results" && <Results />}

      <Toasts />
    </div>
  );
}
