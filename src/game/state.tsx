"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type ReactNode,
} from "react";
import { ACHIEVEMENTS, RANDOM_EVENTS, type GameEvent } from "./data";

export const STAGES = [
  "boot",
  "diagnosis",
  "quiz",
  "redflags",
  "applications",
  "intervention",
  "boss",
  "emergency",
  "prank",
  "results",
] as const;

export type Stage = (typeof STAGES)[number];

/** Levels 1..7 map onto the playable stages; boot/prank/results sit outside. */
export const STAGE_LEVEL: Partial<Record<Stage, { n: number; name: string }>> = {
  diagnosis: { n: 1, name: "THE DIAGNOSIS" },
  quiz: { n: 2, name: "FIND THE PROBLEM" },
  redflags: { n: 3, name: "RED FLAG DETECTION" },
  applications: { n: 4, name: "THE APPLICATIONS" },
  intervention: { n: 5, name: "THE INTERVENTION" },
  boss: { n: 6, name: "BOSS FIGHT" },
  emergency: { n: 7, name: "EMERGENCY PROTOCOL" },
};

export type Toast = {
  id: number;
  kind: "event" | "achievement" | "system";
  title: string;
  line: string;
  effect?: string;
};

type State = {
  stage: Stage;
  xp: number;
  hp: number;
  hope: number;
  progress: number;
  redFlagsCaught: number;
  greenFlagsSaved: number;
  rejected: number;
  accepted: number;
  searchClicks: number;
  machinePokes: number;
  emergencyPresses: number;
  commonSense: number;
  achievements: string[];
  toasts: Toast[];
  eventsEnabled: boolean;
};

const initial: State = {
  stage: "boot",
  xp: 4820,
  hp: 1000,
  hope: 40,
  progress: 0,
  redFlagsCaught: 0,
  greenFlagsSaved: 0,
  rejected: 0,
  accepted: 0,
  searchClicks: 0,
  machinePokes: 0,
  emergencyPresses: 0,
  commonSense: 50,
  achievements: [],
  toasts: [],
  eventsEnabled: false,
};

type Action =
  | { type: "STAGE"; stage: Stage }
  | { type: "XP"; amount: number }
  | { type: "HP"; amount: number }
  | { type: "HOPE"; amount: number }
  | { type: "SENSE"; amount: number }
  | { type: "PROGRESS"; amount: number }
  | { type: "FLAG"; correct: boolean; wasRed: boolean }
  | { type: "DECIDE"; kind: "accept" | "reject" | "block"; green: boolean }
  | { type: "SEARCH" }
  | { type: "POKE" }
  | { type: "EMERGENCY" }
  | { type: "UNLOCK"; id: string }
  | { type: "TOAST"; toast: Omit<Toast, "id"> }
  | { type: "DROP_TOAST"; id: number }
  | { type: "EVENTS"; on: boolean }
  | { type: "RESET" };

let toastSeq = 1;

function unlock(state: State, id: string): State {
  if (state.achievements.includes(id)) return state;
  const a = ACHIEVEMENTS[id];
  return {
    ...state,
    achievements: [...state.achievements, id],
    toasts: [
      ...state.toasts,
      { id: toastSeq++, kind: "achievement", title: `${a.icon} ACHIEVEMENT UNLOCKED`, line: a.name, effect: a.desc },
    ],
  };
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "STAGE": {
      let next = { ...state, stage: action.stage };
      if (action.stage === "results") next = unlock(next, "stillSingle");
      if (action.stage === "prank") next = unlock(next, "delusional");
      if (action.stage === "emergency") next = unlock(next, "finalBoss");
      return next;
    }
    case "XP":
      return { ...state, xp: Math.max(0, state.xp + action.amount) };
    case "HP":
      return { ...state, hp: Math.max(0, Math.min(1000, state.hp + action.amount)) };
    case "HOPE":
      return { ...state, hope: Math.max(0, Math.min(999, state.hope + action.amount)) };
    case "SENSE":
      return { ...state, commonSense: Math.max(0, Math.min(100, state.commonSense + action.amount)) };
    case "PROGRESS":
      return { ...state, progress: Math.max(0, Math.min(4, state.progress + action.amount)) };
    case "FLAG": {
      let next = {
        ...state,
        xp: state.xp + (action.correct ? 120 : 40),
        hp: action.correct ? state.hp : Math.max(0, state.hp - 60),
        redFlagsCaught: state.redFlagsCaught + (action.correct && action.wasRed ? 1 : 0),
        greenFlagsSaved: state.greenFlagsSaved + (action.correct && !action.wasRed ? 1 : 0),
        commonSense: Math.max(0, Math.min(100, state.commonSense + (action.correct ? 3 : -4))),
      };
      if (next.redFlagsCaught >= 8) next = unlock(next, "redFlag");
      return next;
    }
    case "DECIDE": {
      const rejecting = action.kind !== "accept";
      let next = {
        ...state,
        xp: state.xp + (rejecting ? 250 : 150),
        rejected: state.rejected + (rejecting ? 1 : 0),
        accepted: state.accepted + (rejecting ? 0 : 1),
        commonSense: Math.max(
          0,
          Math.min(100, state.commonSense + (action.green === !rejecting ? 6 : -6))
        ),
      };
      if (rejecting && action.green) next = unlock(next, "peace");
      if (!rejecting && action.green) next = unlock(next, "growth");
      if (next.rejected >= 5) next = unlock(next, "standards");
      return next;
    }
    case "SEARCH": {
      const n = state.searchClicks + 1;
      let next = { ...state, searchClicks: n, xp: state.xp + 25 };
      if (n >= 8) next = unlock(next, "downBad");
      return next;
    }
    case "POKE": {
      const n = state.machinePokes + 1;
      let next = { ...state, machinePokes: n };
      if (n >= 5) next = unlock(next, "toucher");
      return next;
    }
    case "EMERGENCY": {
      const n = state.emergencyPresses + 1;
      let next = { ...state, emergencyPresses: n };
      if (n >= 2) next = unlock(next, "emergency");
      return next;
    }
    case "UNLOCK":
      return unlock(state, action.id);
    case "TOAST":
      return { ...state, toasts: [...state.toasts, { ...action.toast, id: toastSeq++ }] };
    case "DROP_TOAST":
      return { ...state, toasts: state.toasts.filter((t) => t.id !== action.id) };
    case "EVENTS":
      return { ...state, eventsEnabled: action.on };
    case "RESET":
      return { ...initial, xp: 4820 };
    default:
      return state;
  }
}

type Ctx = {
  state: State;
  level: number;
  go: (s: Stage) => void;
  addXp: (n: number) => void;
  damage: (n: number) => void;
  hope: (n: number) => void;
  sense: (n: number) => void;
  flag: (correct: boolean, wasRed: boolean) => void;
  decide: (kind: "accept" | "reject" | "block", green: boolean) => void;
  search: () => void;
  poke: () => void;
  emergency: () => void;
  toast: (t: Omit<Toast, "id">) => void;
  dropToast: (id: number) => void;
  setEvents: (on: boolean) => void;
  reset: () => void;
};

const GameCtx = createContext<Ctx | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initial);
  const eventIndex = useRef(0);

  const toast = useCallback((t: Omit<Toast, "id">) => dispatch({ type: "TOAST", toast: t }), []);

  // random events drip in while she is actually playing
  useEffect(() => {
    if (!state.eventsEnabled) return;
    let cancelled = false;
    const fire = () => {
      if (cancelled) return;
      const ev: GameEvent = RANDOM_EVENTS[eventIndex.current % RANDOM_EVENTS.length];
      eventIndex.current += 1;
      dispatch({ type: "TOAST", toast: { kind: "event", title: ev.title, line: ev.line, effect: ev.effect } });
      if (ev.hp) dispatch({ type: "HP", amount: ev.hp });
      if (ev.hope) dispatch({ type: "HOPE", amount: ev.hope });
      if (ev.xp) dispatch({ type: "XP", amount: ev.xp });
      if (ev.followUp) {
        setTimeout(() => {
          if (cancelled) return;
          dispatch({
            type: "TOAST",
            toast: { kind: "event", title: "…UPDATE", line: ev.followUp!.line, effect: ev.followUp!.effect },
          });
          if (ev.followUp!.hope) dispatch({ type: "HOPE", amount: ev.followUp!.hope });
          if (ev.followUp!.hp) dispatch({ type: "HP", amount: ev.followUp!.hp });
        }, 3200);
      }
    };
    const id = setInterval(fire, 21000);
    const first = setTimeout(fire, 9000);
    return () => {
      cancelled = true;
      clearInterval(id);
      clearTimeout(first);
    };
  }, [state.eventsEnabled]);

  const value = useMemo<Ctx>(
    () => ({
      state,
      level: 27 + Math.floor((state.xp - 4820) / 1200),
      go: (s) => dispatch({ type: "STAGE", stage: s }),
      addXp: (n) => dispatch({ type: "XP", amount: n }),
      damage: (n) => dispatch({ type: "HP", amount: n }),
      hope: (n) => dispatch({ type: "HOPE", amount: n }),
      sense: (n) => dispatch({ type: "SENSE", amount: n }),
      flag: (correct, wasRed) => dispatch({ type: "FLAG", correct, wasRed }),
      decide: (kind, green) => dispatch({ type: "DECIDE", kind, green }),
      search: () => dispatch({ type: "SEARCH" }),
      poke: () => dispatch({ type: "POKE" }),
      emergency: () => dispatch({ type: "EMERGENCY" }),
      toast,
      dropToast: (id) => dispatch({ type: "DROP_TOAST", id }),
      setEvents: (on) => dispatch({ type: "EVENTS", on }),
      reset: () => dispatch({ type: "RESET" }),
    }),
    [state, toast]
  );

  return <GameCtx.Provider value={value}>{children}</GameCtx.Provider>;
}

export function useGame() {
  const ctx = useContext(GameCtx);
  if (!ctx) throw new Error("useGame must be used inside GameProvider");
  return ctx;
}
