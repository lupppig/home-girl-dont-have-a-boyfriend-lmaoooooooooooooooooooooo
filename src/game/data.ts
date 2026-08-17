export const HER = "Pikachu";

/* ------------------------------------------------------------------ boot */

export const BOOT_LINES = [
  "INITIALIZING SYSTEM",
  "LOADING SUBJECT FILE: PIKACHU",
  "ANALYZING USER: PIKACHU",
  "CROSS-REFERENCING GROUP CHAT",
  "CHECKING RELATIONSHIP STATUS OF PIKACHU",
];

/* ------------------------------------------- level 1 — the diagnosis */

export const DIAGNOSIS = [
  { label: "FACE CARD", value: 99, ok: true },
  { label: "AURA", value: 94, ok: true },
  { label: "SOCIAL SKILLS", value: 88, ok: true },
  { label: "SENSE OF HUMOUR", value: 91, ok: true },
  { label: "STANDARDS", value: 412, ok: false, suffix: "%", note: "out of range" },
  { label: "BOYFRIEND", value: 0, ok: false },
];

/* ------------------------------------------- level 2 — find the problem */

export type QuizQuestion = {
  q: string;
  options: { label: string; reply: string; xp: number }[];
};

export const QUIZ: QuizQuestion[] = [
  {
    q: "WHY ARE YOU SINGLE?",
    options: [
      {
        label: "“Men are intimidated by me.”",
        reply: "Classic. Bold. Unverifiable. Pikachu, the committee has heard this one 41 times. 😐",
        xp: 50,
      },
      {
        label: "“I haven't found the right one.”",
        reply: "You found four. You blocked three of them for texting back too fast. 💀",
        xp: 50,
      },
      {
        label: "“I like my peace.”",
        reply: "Fascinating. You have chosen peace over companionship. Respectfully… noted. 🕊️",
        xp: 50,
      },
      {
        label: "“Next question.”",
        reply: "Deflection logged. Escalating to the committee. 📋",
        xp: 75,
      },
    ],
  },
  {
    q: "WHEN WAS YOUR LAST DATE?",
    options: [
      { label: "Recently.", reply: "Define recently. We checked. It was a group hangout. You brought your friend.", xp: 50 },
      { label: "This year… ish.", reply: "“Ish” is doing a LOT of work in that sentence.", xp: 60 },
      { label: "I don't remember.", reply: "The system does. It was so long ago it is archived on a different server. 🗄️", xp: 80 },
      { label: "That's private.", reply: "Nothing is private here, Pikachu. You clicked START INTERVENTION yourself. 🤷🏽", xp: 70 },
    ],
  },
  {
    q: "A DECENT, EMPLOYED, 5'9\" MAN ASKS YOU OUT. YOU:",
    options: [
      { label: "Say yes.", reply: "SYSTEM ERROR. This response has never been recorded from you. Restarting… 😳", xp: 100 },
      { label: "Say maybe and never reply.", reply: "There it is. There is the pattern. Screenshot taken. 📸", xp: 60 },
      { label: "Ask the group chat for 4 days.", reply: "By the time we finished voting he had a girlfriend. We were there. It was painful. 😭", xp: 60 },
      { label: "“He's 5'9” though.”", reply: "PIKACHU. He is TALLER THAN YOU. Be so serious right now. 📏", xp: 90 },
    ],
  },
];

/* ------------------------------------------- level 3 — red flag minigame */

export type FlagCard = { trait: string; red: boolean };

export const FLAG_CARDS: FlagCard[] = [
  { trait: "Says “wyd” every single day", red: true },
  { trait: "Replies after 19 business days", red: true },
  { trait: "Calls himself an entrepreneur", red: true },
  { trait: "Still lives with his ex", red: true },
  { trait: "Actually emotionally available", red: false },
  { trait: "Has a job, a car, and a therapist", red: false },
  { trait: "“I don't really do labels”", red: true },
  { trait: "Remembers your coffee order", red: false },
  { trait: "Four different baby mamas", red: true },
  { trait: "Calls his mum every Sunday", red: false },
  { trait: "Posts gym mirror selfies hourly", red: true },
  { trait: "Asks how your day actually went", red: false },
  { trait: "Says “you're not like other girls”", red: true },
  { trait: "Plans dates in advance", red: false },
  { trait: "Owes his cousin £4,000", red: true },
  { trait: "Turns up when he says he will", red: false },
  { trait: "“My ex was crazy”", red: true },
  { trait: "Reads books. Real ones.", red: false },
  { trait: "Airdropped you a photo at the party", red: true },
  { trait: "Texts back within the hour", red: false },
];

export const FLAG_MISS_LINES = [
  "PIKACHU. YOU WERE SUPPOSED TO RUN. 🏃🏽‍♀️",
  "You let that one through. On purpose?? 😳",
  "That is the exact type. THE. EXACT. TYPE. 🚩",
  "We watched you do that. In real time. 👀",
];

export const FLAG_WRONG_RUN_LINES = [
  "He was FINE. You ran from a green flag. 💚",
  "That man had a pension, Pikachu. You RAN. 🏦",
  "This is the behaviour we came here about.",
  "He was normal. That is exactly why you panicked. 😵‍💫",
];

/* ------------------------------------------- level 4 — applications */

export type Application = {
  id: string;
  name: string;
  occupation: string;
  comms: number;
  eq: string;
  intentions: string;
  motherApproval: number;
  green: boolean;
  onAccept: string;
  onReject: string;
  onBlock: string;
};

export const APPLICATIONS: Application[] = [
  {
    id: "0341",
    name: "Kevin",
    occupation: "“Entrepreneur”",
    comms: 3,
    eq: "Loading…",
    intentions: "“let's see where things go”",
    motherApproval: -14,
    green: false,
    onAccept: "Bold. Kevin has already asked to borrow your car.",
    onReject: "Correct. Kevin has left the chat to go post a motivational quote.",
    onBlock: "Kevin blocked. Kevin is unbothered. Kevin has 9 other applications open.",
  },
  {
    id: "0342",
    name: "Daniel",
    occupation: "Structural engineer",
    comms: 88,
    eq: "84 / 100",
    intentions: "“I'd like to take you to dinner on Friday”",
    motherApproval: 96,
    green: true,
    onAccept: "…Wait. You actually said yes? Committee is stunned. XP awarded.",
    onReject: "REJECTED?? He said DINNER. On a SPECIFIC DAY. Pikachu.",
    onBlock: "You blocked a structural engineer. The bridge is out. We are all stranded.",
  },
  {
    id: "0343",
    name: "Tyrese",
    occupation: "“Between opportunities”",
    comms: 41,
    eq: "she'll fix me",
    intentions: "“wyd tn”",
    motherApproval: 8,
    green: false,
    onAccept: "You picked him. Obviously. We'll see you in six weeks with snacks.",
    onReject: "Growth. Genuine growth. The committee is emotional.",
    onBlock: "Blocked, reported, and screenshotted for the group chat. Beautiful.",
  },
  {
    id: "0344",
    name: "Marcus",
    occupation: "Nurse",
    comms: 79,
    eq: "91 / 100",
    intentions: "“something serious, if that's okay”",
    motherApproval: 99,
    green: true,
    onAccept: "Correct answer. Your mum has already told the whole family.",
    onReject: "You said he was “too available”. That's the whole point of a man.",
    onBlock: "You blocked a NURSE. Who will take your blood pressure now.",
  },
  {
    id: "0345",
    name: "The One From 2019",
    occupation: "Unknown",
    comms: 12,
    eq: "n/a",
    intentions: "“yo”",
    motherApproval: -60,
    green: false,
    onAccept: "ABSOLUTELY NOT. Committee overrides. Application shredded.",
    onReject: "Finally. It only took six years.",
    onBlock: "Blocked. The group chat has erupted. Someone is crying.",
  },
];

/* ------------------------------------------- level 5 — the intervention */

export type CommitteeLine = { who: string; role: string; line: string; tone: "bestie" | "concerned" | "hater" | "system" };

export const INTERVENTION: CommitteeLine[] = [
  { who: "SYSTEM", role: "", line: "PIKACHU — YOUR FRIENDS HAVE JOINED THE SESSION.", tone: "system" },
  { who: "THE BESTIE", role: "founding member", line: "Pikachu. Respectfully. 😌", tone: "bestie" },
  { who: "THE CONCERNED FRIEND", role: "note taker", line: "When was your last date? And be honest, we have the timeline.", tone: "concerned" },
  { who: "THE HATER", role: "invited by accident", line: "I said this would happen back in 2022. Nobody listened. 😏", tone: "hater" },
  { who: "THE BESTIE", role: "founding member", line: "We've discussed the situation. At length. Several times. Without you.", tone: "bestie" },
  { who: "THE CONCERNED FRIEND", role: "note taker", line: "We're running out of options. My cousin is starting to look viable.", tone: "concerned" },
  { who: "THE HATER", role: "invited by accident", line: "Her standards aren't high, they're just… decorative.", tone: "hater" },
  { who: "THE BESTIE", role: "founding member", line: "You cannot keep doing this. Please cooperate with the investigation.", tone: "bestie" },
  { who: "SYSTEM", role: "", line: "THE MATTER HAS BEEN OFFICIALLY ESCALATED.", tone: "system" },
];

/* ------------------------------------------- level 6 — boss fight */

export const BOSS_FORMS = [
  "6'2\" WITH A BUSINESS",
  "EMOTIONALLY UNAVAILABLE",
  "TOO FINE TO TRUST",
  "5'9\" BUT ACTUALLY NICE",
  "DEFINITELY TOXIC",
  "HAS A GIRLFRIEND",
  "LIVES 4 HOURS AWAY",
  "PERFECT BUT BROKE",
];

export const BOSS_WEAKNESSES = [
  { key: "communication", label: "Communication", emoji: "🚩" },
  { key: "commitment", label: "Commitment", emoji: "🚩" },
  { key: "consistency", label: "Consistency", emoji: "🚩" },
  { key: "availability", label: "Emotional availability", emoji: "🚩" },
];

export const BOSS_TAUNTS = [
  "“hey stranger”",
  "“my bad, been busy”",
  "“you up?”",
  "“I'm not looking for anything serious”",
  "“wyd”",
  "“let's see where things go”",
  "“I don't really text much”",
];

export const BOSS_HIT_LINES = [
  "DIRECT HIT. He has left you on read out of respect.",
  "CRITICAL. He said “fair enough” and logged off.",
  "MASSIVE DAMAGE. He is telling his friends you're “different”.",
  "He's typing… he's stopped… he's typing… he's stopped.",
];

/* ------------------------------------------- level 7 — emergency */

export const EMERGENCY_LINES = [
  "SINGLE STATUS HAS EXCEEDED RECOMMENDED LIMITS.",
  "STRUCTURAL INTEGRITY OF THE GROUP CHAT: FAILING.",
  "INITIATING EMERGENCY BOYFRIEND PROTOCOL.",
];

/* ------------------------------------------- random events */

export type GameEvent = {
  title: string;
  line: string;
  effect: string;
  hp?: number;
  hope?: number;
  xp?: number;
  followUp?: { line: string; effect: string; hope?: number; hp?: number };
};

export const RANDOM_EVENTS: GameEvent[] = [
  {
    title: "RANDOM EVENT",
    line: "Your mother just asked when you're getting married.",
    effect: "−500 HP",
    hp: -500,
  },
  {
    title: "RANDOM EVENT",
    line: "Someone from school posted their anniversary photos.",
    effect: "EMOTIONAL DAMAGE · −200 HP",
    hp: -200,
  },
  {
    title: "RANDOM EVENT",
    line: "Your ex has viewed your story. Twice.",
    effect: "−300 HP · +120 SINGLE XP",
    hp: -300,
    xp: 120,
  },
  {
    title: "RANDOM EVENT",
    line: "Your friend just said “I know someone.”",
    effect: "+50 HOPE",
    hope: 50,
    followUp: {
      line: "He's 37, lives in another country, and has a podcast.",
      effect: "−900 HOPE",
      hope: -900,
    },
  },
  {
    title: "RANDOM EVENT",
    line: "A wedding invitation arrived. Plus one: blank.",
    effect: "−400 HP · +200 SINGLE XP",
    hp: -400,
    xp: 200,
  },
  {
    title: "RANDOM EVENT",
    line: "You reorganised your whole room instead of replying to him.",
    effect: "+300 SINGLE XP",
    xp: 300,
  },
  {
    title: "RANDOM EVENT",
    line: "He liked your post from 2021. On purpose.",
    effect: "+80 HOPE",
    hope: 80,
    followUp: { line: "He then liked four other people's posts from 2021.", effect: "−200 HOPE", hope: -200 },
  },
];

/* ------------------------------------------- achievements */

export type Achievement = { id: string; name: string; desc: string; icon: string };

export const ACHIEVEMENTS: Record<string, Achievement> = {
  stillSingle: { id: "stillSingle", name: "STILL SINGLE", desc: "Completed: being single.", icon: "🏆" },
  peace: { id: "peace", name: "PEACE OVER EVERYTHING", desc: "Rejected a perfectly reasonable man.", icon: "🕊️" },
  redFlag: { id: "redFlag", name: "RED FLAG SPECIALIST", desc: "Detected 8 red flags.", icon: "🚩" },
  delusional: { id: "delusional", name: "DELUSIONAL OPTIMIST", desc: "Believed a website would find you a boyfriend.", icon: "🫠" },
  standards: { id: "standards", name: "THE STANDARDS ARE HIGH", desc: "Rejected literally everyone.", icon: "📏" },
  downBad: { id: "downBad", name: "DOWN BAD", desc: "Clicked FIND BOYFRIEND far too many times.", icon: "📉" },
  finalBoss: { id: "finalBoss", name: "FINAL BOSS", desc: "Survived the intervention.", icon: "👑" },
  growth: { id: "growth", name: "CHARACTER GROWTH", desc: "Accepted a green flag. Unprecedented.", icon: "🌱" },
  toucher: { id: "toucher", name: "PLEASE STOP TOUCHING THAT", desc: "Poked the equipment repeatedly.", icon: "🖐️" },
  emergency: { id: "emergency", name: "NOT AN EMERGENCY", desc: "Pressed the emergency button anyway.", icon: "🚨" },
};

/* ------------------------------------------- prank interaction lines */

export const SEARCH_REPLIES = [
  "No.",
  "Still no.",
  "Searching… no.",
  "We looked. Nothing.",
  "GIRL WE ALREADY CHECKED.",
  "Stop it.",
  "The machine is tired.",
  "Please. Have some dignity.",
];

export const OBJECT_LINES: Record<string, string[]> = {
  machine: [
    "Please stop touching the equipment.",
    "Ma'am. The equipment.",
    "You've now touched this machine more than you've touched a man this year.",
  ],
  emergency: ["This is not an emergency.", "Okay. Maybe it is.", "Fine. IT'S AN EMERGENCY."],
  trophy: [
    "Trophy cabinet: 0 relationships, 14 situationships, 1 restraining order (not yours).",
    "That plaque says “PARTICIPATION”.",
  ],
  arcade: ["High score: still single.", "This machine only plays one game and you're losing it."],
  scoreboard: ["Days single: yes.", "The counter broke in 2021. We never fixed it."],
  certificate: ["“Certified Baddie” — issued by us, backed by nobody.", "It's laminated. That makes it official."],
};

/* ------------------------------------------- results */

export const RATING_QUIP = [
  { min: 0, label: "“DOING GREAT. JUST SINGLE.” 💅🏽" },
  { min: 6000, label: "“ELITE PERFORMANCE. STILL SINGLE.” 🏅" },
  { min: 12000, label: "“LEGENDARY. TERRIFYINGLY SINGLE.” 👑" },
];

/** The homeboy's sign-off. The actual point of the whole website. */
export const HOMEBOY_NOTE =
  "Like son you legit thought you getting a boyfriend lmaooooooooo 😭😭😭 we gon be single till I get a girlfriend first 💀🤝";
