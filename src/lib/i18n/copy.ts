import type { Locale } from "@/lib/i18n/locales";
import type { AgentId } from "@/lib/agents";

export type CopyPack = {
  runSteps: Record<AgentId, string>;
  runStarting: string;
  runFailed: string;
  runNetwork: string;
  plain: {
    moodBullChip: string;
    moodBullMeaning: string;
    moodBearChip: string;
    moodBearMeaning: string;
    moodWaitChip: string;
    moodWaitMeaning: string;
    confHigh: string;
    confMed: string;
    confLow: string;
    bandHigh: string;
    bandHighHint: string;
    bandMed: string;
    bandMedHint: string;
    bandLow: string;
    bandLowHint: string;
    floorLabel: string;
    floorHelp: string;
    ceilingLabel: string;
    ceilingHelp: string;
    stopLabel: string;
    stopHelp: string;
    sessionAsiaLondon: string;
    sessionLondonNy: string;
    sessionNy: string;
    sessionLondon: string;
    sessionAsia: string;
    sessionFallback: (s: string) => string;
    moveUp: (pct: string) => string;
    moveDown: (pct: string) => string;
    moveFlat: (pct: string) => string;
    placeOnFloor: string;
    placeAtCeiling: string;
    placeLower: string;
    placeUpper: string;
    placeMid: string;
    above: string;
    below: string;
    under: string;
    actionBull: string;
    actionBear: string;
    actionWait: string;
    doBull: [string, string, string];
    doBear: [string, string, string];
    doWait: [string, string, string];
    dontBase: [string, string];
    dontVeto: string;
    dontMild: string;
    vetoStep: string;
    agentJobs: Record<AgentId | "default", string>;
  };
  home: {
    dollar: string;
    yields: string;
    chart: string;
    news: string;
    macro: string;
    dollarEase: (pct: string) => string;
    dollarFirm: (pct: string) => string;
    dollarFlat: (pct: string) => string;
    yieldsHigh: (y: string) => string;
    yieldsSoft: (y: string) => string;
    yieldsMid: (y: string) => string;
    chartHigh: string;
    chartLow: string;
    chartMid: string;
    newsHelp: string;
    newsHurt: string;
    newsMix: string;
    leanHelps: string;
    leanPresses: string;
    leanMixed: string;
    edgeClean: string;
    edgeSoft: string;
    edgeThin: string;
    riskHot: string;
    riskWarm: string;
    riskCool: string;
    readBull: string;
    readBear: string;
    readWait: string;
    driversToday: (bits: string) => string;
    leadingPath: (label: string, pct: number) => string;
    riskBrakeOn: string;
    typicalSwing: (dollars: string, pct: number) => string;
    dissent: (name: string, verdict: string) => string;
  };
  desk: {
    pathUp: string;
    pathUpPlain: string;
    pathBase: string;
    pathBasePlain: string;
    pathDown: string;
    pathDownPlain: string;
    triggerUp: (floor: number, ceil: number) => string;
    triggerBase: (floor: number, ceil: number) => string;
    triggerDown: (ceil: number, floor: number) => string;
    standUp: (stop: number) => string;
    standBase: string;
    standDown: (stop: number) => string;
    netHelp: string;
    netHurt: string;
    netMix: string;
    newsIris: string;
    newsEmpty: string;
    adviceVeto: string;
    adviceBull: string;
    adviceBear: string;
    adviceWait: string;
    timingNy: string;
    timingLondon: string;
    timingQuiet: string;
    machineEdges: [string, string, string, string];
    watchDollar: string;
    watchHeadlines: string;
    primaryPlan: string;
    ifWrong: string;
    sizeMind: string;
    triggerCare: string;
    veraOverride: string;
    veraDetail: string;
    planBull: (floor: number, ceil: number) => string;
    wrongBull: (stop: number) => string;
    sizeConf: (c: number) => string;
    planBear: (ceil: number, floor: number) => string;
    wrongBear: (stop: number) => string;
    sizeBear: (c: number) => string;
    planWait: string;
    triggerWait: (ceil: number, floor: number) => string;
    sizeWait: string;
    zoneStop: string;
    zoneUnderFloor: string;
    zoneAboveCeil: string;
    zoneUpper: string;
    zoneLower: string;
    meanStop: string;
    meanUnder: string;
    meanAbove: string;
    meanUpper: string;
    meanLower: string;
    hintRisk: string;
    hintDownStrong: string;
    hintBasePressure: string;
    hintUpExt: string;
    hintBreakout: string;
    hintHighChop: string;
    hintLowChop: string;
    whyRatePos: string;
    whyRateNeg: string;
    whyDollarPos: string;
    whyDollarNeg: string;
    whyGeo: string;
    whyInflation: string;
    whyGoldDirect: string;
    whyTagged: (reasons: string) => string;
    whyToneHelp: string;
    whyToneHurt: string;
    whyNoise: string;
  };
  ui: {
    sensorsTitle: string;
    dollarHint: string;
    yieldsHint: string;
    usDollar: string;
    us10y: string;
    typicalSwing: string;
    feed: string;
    yieldsSub: string;
    deskSub: string;
    sample: string;
    live: string;
    chartTitle: string;
    chartSubtitle: string;
    candles: string;
    line: string;
    chartUnavailable: string;
    chartAria: string;
    swingAtr: string;
    windowNow: string;
    scenariosTitle: string;
    scenariosSubtitle: string;
    leadingPath: string;
    target: string;
    trigger: string;
    standDown: string;
    whatIfTitle: string;
    whatIfSubtitle: string;
    probePrice: string;
    vsSpot: string;
    probeAria: string;
    resetSpot: string;
    vsFloor: string;
    vsCeiling: string;
    vsStop: string;
    radarTitle: string;
    radarSubtitle: string;
    agreement: string;
    up: string;
    wait: string;
    down: string;
    veraBrake: string;
    adviceTitle: string;
    adviceMachine: string;
    watchNext: string;
    playbook: string;
    trackTitle: string;
    trackHitRate: (rate: number, hits: number, misses: number) => string;
    trackEmpty: string;
    openHistory: string;
    agentReady: string;
    agentThinking: string;
    agentDisagreed: string;
    agentIdle: string;
    jobPlain: string;
    whatTheyWatch: string;
    todaysTake: string;
    watchNextColon: string;
    sources: string;
    deskTrust: string;
    readFullBrief: string;
    backAgents: string;
    briefPlain: string;
    briefShorthand: string;
    howToRead: string;
    why: string;
    someoneDisagrees: string;
    deskDebate: string;
    simplePlan: string;
    lean: string;
    map: string;
    standDownIf: string;
    signedBy: string;
    backToday: string;
    share: string;
    save: string;
    shareTitle: string;
    copied: string;
    shareFail: string;
    saved: string;
    historyMatched: string;
    historyMissed: string;
    historyUngraded: string;
    scoreFail: string;
    scoreHit: string;
    scoreMiss: string;
    scoreNothing: string;
    errorTitle: string;
    retry: string;
    sureOf100: string;
  };
};

export const copyEn: CopyPack = {
  runSteps: {
    marcus: "Marcus checking the dollar & interest rates…",
    nova: "Nova reading the gold chart (floor & ceiling)…",
    iris: "Iris scanning news that can move gold…",
    felix: "Felix checking if everyone already piled in…",
    vera: "Vera asking: is it safer to wait?…",
    aurelia: "Aurelia writing today’s call in plain words…",
  },
  runStarting: "Waking up the desk…",
  runFailed: "The desk run didn’t finish. Try again.",
  runNetwork: "Connection problem — the desk couldn’t be reached.",
  plain: {
    moodBullChip: "Soft up lean",
    moodBullMeaning:
      "The desk thinks gold has a mild chance to grind higher — not a moonshot.",
    moodBearChip: "Soft down lean",
    moodBearMeaning:
      "The desk thinks gold has a mild chance to ease lower — not a crash call.",
    moodWaitChip: "Wait mode",
    moodWaitMeaning: "The desk sees no clean edge. Waiting is the smart move today.",
    confHigh: "The desk is fairly sure about this view.",
    confMed: "The desk has a mild lean — not a sure thing.",
    confLow: "The desk is unsure — treat this as a soft read only.",
    bandHigh: "Higher conviction",
    bandHighHint: "Still research — not a promise.",
    bandMed: "Medium conviction",
    bandMedHint: "Useful lean, easy to change.",
    bandLow: "Low conviction",
    bandLowHint: "Noise is high — keep it light.",
    floorLabel: "Floor",
    floorHelp:
      "Zone where buyers often show up. If price holds here, a soft-up view stays alive.",
    ceilingLabel: "Ceiling",
    ceilingHelp:
      "Zone to watch for a push higher. Getting stuck under it often means wait.",
    stopLabel: "Stop line",
    stopHelp: "If gold closes under this, the desk’s idea is wrong — stand down.",
    sessionAsiaLondon: "Market handoff: Asia into London.",
    sessionLondonNy:
      "Market handoff: London into New York (often the busiest part).",
    sessionNy: "New York hours — moves can get sharper.",
    sessionLondon: "London hours — main European liquidity.",
    sessionAsia: "Asia hours — usually quieter for gold.",
    sessionFallback: (s) => `Session: ${s}`,
    moveUp: (pct) => `Gold is up about ${pct}% today.`,
    moveDown: (pct) => `Gold is down about ${pct}% today.`,
    moveFlat: (pct) => `Gold is almost flat today (${pct}%).`,
    placeOnFloor: "Gold is sitting on / under the floor — fragile.",
    placeAtCeiling: "Gold is pressing the ceiling — stretch risk is higher.",
    placeLower: "Gold is in the lower part of today’s range (closer to the floor).",
    placeUpper: "Gold is in the upper part of today’s range (closer to the ceiling).",
    placeMid: "Gold is roughly mid-range between floor and ceiling.",
    above: "above",
    below: "below",
    under: "under",
    actionBull:
      "If you follow the desk: respect the soft-up lean only while the floor holds.",
    actionBear:
      "If you follow the desk: respect the soft-down lean, and don’t chase near the ceiling.",
    actionWait: "If you follow the desk: do nothing directional — wait for clarity.",
    doBull: [
      "Keep the idea simple: mild grind higher, not a rocket.",
      "Watch whether the floor keeps holding on dips.",
      "Use the stop line as your “idea is wrong” switch.",
    ],
    doBear: [
      "Keep the idea simple: mild ease lower, not a collapse.",
      "Watch whether gold fails under the ceiling.",
      "If the floor snaps, the soft-down story gets louder — still use the stop line for risk.",
    ],
    doWait: [
      "Stay flat in your head: no forced lean today.",
      "Watch for a clean break of floor or ceiling before caring.",
      "Let Vera’s wait call win until the map clears.",
    ],
    dontBase: [
      "Don’t treat this as financial advice or a guaranteed move.",
      "Don’t ignore the stop line if price closes beyond it.",
    ],
    dontVeto: "Don’t force a lean while Vera’s risk brake is on.",
    dontMild: "Don’t over-size a mild lean — confidence is not 100.",
    vetoStep: "Risk agent (Vera) put a brake on: prefer wait over forcing a call.",
    agentJobs: {
      aurelia: "Boss of the desk — writes the final simple call.",
      marcus: "Watches the dollar & interest rates (big drivers of gold).",
      nova: "Looks at the gold chart: floor, ceiling, trend.",
      iris: "Reads news that can actually move gold.",
      felix: "Checks if everyone is already piled into the same idea.",
      vera: "Says when it’s safer to wait than to lean.",
      default: "Desk specialist.",
    },
  },
  home: {
    dollar: "US dollar",
    yields: "US 10Y yields",
    chart: "Chart map",
    news: "News stack",
    macro: "Big picture",
    dollarEase: (pct) => `Dollar easing (${pct}%) — often gives gold room.`,
    dollarFirm: (pct) => `Dollar firming (${pct}%) — often presses gold.`,
    dollarFlat: (pct) => `Dollar roughly flat (${pct}%).`,
    yieldsHigh: (y) => `Yields elevated (~${y}%) — gold often feels pressure.`,
    yieldsSoft: (y) => `Yields softer (~${y}%) — can support gold.`,
    yieldsMid: (y) => `Yields mid (~${y}%) — not a clean driver alone.`,
    chartHigh: "Price sits high in the range — stretch risk near the ceiling.",
    chartLow: "Price sits low in the range — closer to the floor.",
    chartMid: "Price is mid-range between floor and ceiling.",
    newsHelp: "Headlines lean a bit helpful for gold.",
    newsHurt: "Headlines lean a bit heavy against gold.",
    newsMix: "Headlines are mixed for gold.",
    leanHelps: "helps gold",
    leanPresses: "presses gold",
    leanMixed: "mixed",
    edgeClean: "Cleaner edge",
    edgeSoft: "Soft edge",
    edgeThin: "Thin edge — stay light",
    riskHot: "Hot tape — Vera-style caution",
    riskWarm: "Warm — moves can still surprise",
    riskCool: "Cooler — map is more readable",
    readBull: "Desk leans soft-up while the floor holds.",
    readBear: "Desk leans soft-down while capped under the ceiling.",
    readWait: "Desk sees no clean edge — waiting is the call.",
    driversToday: (bits) => `Drivers today: ${bits}.`,
    leadingPath: (label, pct) => `Leading path: ${label} (~${pct}%).`,
    riskBrakeOn: "Risk brake is on — prefer wait over forcing a lean.",
    typicalSwing: (dollars, pct) => `Typical swing ~$${dollars} (${pct}%).`,
    dissent: (name, verdict) => `${name} pushes back: ${verdict}`,
  },
  desk: {
    pathUp: "Soft up path",
    pathUpPlain: "Gold grinds toward / through the ceiling zone.",
    pathBase: "Base / chop path",
    pathBasePlain: "Gold stays sticky between floor and ceiling — waiting wins.",
    pathDown: "Soft down path",
    pathDownPlain: "Gold eases toward the floor / soft-down zone.",
    triggerUp: (floor, ceil) => `Holds above ~${floor} and pushes ~${ceil}`,
    triggerBase: (floor, ceil) => `Chops between ~${floor} and ~${ceil}`,
    triggerDown: (ceil, floor) => `Fails under ~${ceil} and slips toward ~${floor}`,
    standUp: (stop) => `Closes under ~${stop}`,
    standBase: "A clean break of either side that you refuse to re-map",
    standDown: (stop) => `Closes under ~${stop} (hard risk line)`,
    netHelp: "Today’s news stack leans a bit helpful for gold.",
    netHurt: "Today’s news stack leans a bit heavy against gold.",
    netMix: "Today’s news stack is mixed — no single clean push.",
    newsIris: "Iris scored headlines for gold relevance and direction.",
    newsEmpty: "No scored headlines yet — run the desk.",
    adviceVeto: "Risk brake is on — waiting beats forcing a lean.",
    adviceBull: "Follow a soft-up map only while the floor holds.",
    adviceBear: "Follow a soft-down map — don’t chase near the ceiling.",
    adviceWait: "No clean edge — the advice is to wait for a break.",
    timingNy:
      "New York hours: moves can accelerate — keep the stop line close in your head.",
    timingLondon: "London hours: main liquidity window — level breaks matter more.",
    timingQuiet:
      "Quieter session window — noise can fake breakouts; wait for holds.",
    machineEdges: [
      "Scores dollar, yields, chart levels, news, crowding, and risk in one pass.",
      "Builds three prediction paths with probabilities — not one emotional guess.",
      "Tags each headline for gold lean + why it matters, faster than a manual skim.",
      "Draws floor / ceiling / stop on the live chart so the map stays visual.",
    ],
    watchDollar: "US dollar tone",
    watchHeadlines: "Whether top headlines stay hot or fade",
    primaryPlan: "Primary plan",
    ifWrong: "If wrong",
    sizeMind: "Size mindset",
    triggerCare: "Trigger to care",
    veraOverride: "Vera override",
    veraDetail:
      "Risk brake active — prefer wait over any forced directional story.",
    planBull: (floor, ceil) =>
      `Respect soft-up while gold holds above ~${floor}. Target zone near ~${ceil}.`,
    wrongBull: (stop) =>
      `Close under ~${stop} = idea dead. Stand down — don’t average in.`,
    sizeConf: (c) => `Conviction ${c}/100 — treat as a mild lean, not a max bet.`,
    planBear: (ceil, floor) =>
      `Respect soft-down while capped under ~${ceil}. Soft target toward ~${floor}.`,
    wrongBear: (stop) =>
      `A strong reclaim above ceiling, or chaos past stop ~${stop}, ends the lean.`,
    sizeBear: (c) => `Conviction ${c}/100 — mild lean only; news can reverse fast.`,
    planWait: "Stay mentally flat. Let floor/ceiling decide the next lean.",
    triggerWait: (ceil, floor) =>
      `Hold above ~${ceil} → soft-up candidate. Hold under ~${floor} → soft-down candidate.`,
    sizeWait: "Zero directional urgency until a path clears.",
    zoneStop: "Past stop line",
    zoneUnderFloor: "Under the floor",
    zoneAboveCeil: "Above the ceiling",
    zoneUpper: "Upper half of range",
    zoneLower: "Lower half of range",
    meanStop: "Desk idea is wrong here. Stand down — don’t argue with the map.",
    meanUnder: "Soft-up stories are fragile. Soft-down / wait gets louder.",
    meanAbove: "Stretch zone — upside chase risk rises; wait for a hold.",
    meanUpper:
      "Closer to ceiling — soft-up needs a clean push; soft-down watches for fails.",
    meanLower: "Closer to floor — soft-up watches holds; soft-down watches breaks.",
    hintRisk: "Risk path active",
    hintDownStrong: "Down path strengthening",
    hintBasePressure: "Base path under pressure",
    hintUpExt: "Up path extended",
    hintBreakout: "Breakout needs confirmation",
    hintHighChop: "Mid-to-high chop",
    hintLowChop: "Mid-to-low chop",
    whyRatePos: "Rate / yield talk can cool the dollar and give gold room.",
    whyRateNeg: "Hotter rates / yields usually squeeze gold via a stronger dollar.",
    whyDollarPos: "A softer dollar often lifts gold in the same breath.",
    whyDollarNeg: "A firmer dollar is one of gold’s fastest headwinds.",
    whyGeo:
      "Geopolitical stress can spike safe-haven demand for gold — fast and noisy.",
    whyInflation:
      "Inflation / jobs prints reprice rate bets — gold reacts through yields and the dollar.",
    whyGoldDirect:
      "Direct gold flow / ETF talk can move spot even without a macro shock.",
    whyTagged: (reasons) => `Desk tagged this as gold-relevant (${reasons}).`,
    whyToneHelp: "Tone leans supportive for gold today.",
    whyToneHurt: "Tone leans pressuring for gold today.",
    whyNoise: "On the radar, but not a clean gold driver by itself.",
  },
  ui: {
    sensorsTitle: "Desk sensors",
    dollarHint:
      "Gold’s fastest counterweight — a firmer dollar usually presses gold.",
    yieldsHint: "Higher interest rates make holding gold feel more expensive.",
    usDollar: "US dollar",
    us10y: "US 10Y",
    typicalSwing: "Typical swing",
    feed: "Feed",
    yieldsSub: "Interest-rate backdrop",
    deskSub: "Six specialists, one plain call",
    sample: "Sample",
    live: "Live",
    chartTitle: "Gold chart with the desk map",
    chartSubtitle: "Floor, ceiling and stop line drawn on live price.",
    candles: "Candles",
    line: "Line",
    chartUnavailable: "Chart data isn’t available right now.",
    chartAria: "Gold price chart with desk levels",
    swingAtr: "Typical day swing",
    windowNow: "Session window",
    scenariosTitle: "Three paths, weighted",
    scenariosSubtitle: "Not one guess — the desk weighs up, chop and down.",
    leadingPath: "Leading path",
    target: "Target",
    trigger: "Trigger",
    standDown: "Stand down",
    whatIfTitle: "What if gold goes here?",
    whatIfSubtitle: "Move the price to see where it lands on the desk map.",
    probePrice: "Test price",
    vsSpot: "vs spot",
    probeAria: "Test price slider",
    resetSpot: "Reset to spot",
    vsFloor: "vs floor",
    vsCeiling: "vs ceiling",
    vsStop: "vs stop line",
    radarTitle: "Desk radar",
    radarSubtitle: "Where each specialist stands today.",
    agreement: "Agreement",
    up: "Up",
    wait: "Wait",
    down: "Down",
    veraBrake: "Vera’s risk brake",
    adviceTitle: "What the desk would watch",
    adviceMachine: "What a machine desk catches in one pass",
    watchNext: "Watch next",
    playbook: "Playbook",
    trackTitle: "Track record",
    trackHitRate: (rate, hits, misses) =>
      `${rate}% matched — ${hits} hits, ${misses} misses.`,
    trackEmpty: "No graded days yet. Run the desk, then grade tomorrow.",
    openHistory: "Open history",
    agentReady: "Ready",
    agentThinking: "Thinking…",
    agentDisagreed: "Disagreed",
    agentIdle: "Idle",
    jobPlain: "Job, in plain words",
    whatTheyWatch: "What they watch",
    todaysTake: "Today’s take",
    watchNextColon: "Watch next:",
    sources: "Sources",
    deskTrust: "What the desk tracks for you",
    readFullBrief: "Read the full brief",
    backAgents: "Back to agents",
    briefPlain: "Plain words",
    briefShorthand: "Desk shorthand",
    howToRead: "How to read this",
    why: "Why",
    someoneDisagrees: "Someone disagrees",
    deskDebate: "Desk debate",
    simplePlan: "Simple plan",
    lean: "Lean",
    map: "Map",
    standDownIf: "Stand down if",
    signedBy: "Signed by",
    backToday: "Back to Today",
    share: "Share",
    save: "Save",
    shareTitle: "Goldbook — today’s gold call",
    copied: "Copied to clipboard.",
    shareFail: "Couldn’t share — try copying instead.",
    saved: "Saved",
    historyMatched: "Matched the move",
    historyMissed: "Missed the move",
    historyUngraded: "Not graded yet",
    scoreFail: "Grading failed — try again.",
    scoreHit: "Graded: the desk matched the move.",
    scoreMiss: "Graded: the desk missed the move.",
    scoreNothing: "Nothing new to grade.",
    errorTitle: "Something went wrong",
    retry: "Try again",
    sureOf100: "sure out of 100",
  },
};

export const copyFr: CopyPack = {
  runSteps: {
    marcus: "Marcus regarde le dollar et les taux d’intérêt…",
    nova: "Nova lit le graphique de l’or (plancher et plafond)…",
    iris: "Iris parcourt les infos qui peuvent bouger l’or…",
    felix: "Felix vérifie si tout le monde est déjà positionné…",
    vera: "Vera demande : est-il plus sûr d’attendre ?…",
    aurelia: "Aurelia écrit l’appel du jour en mots simples…",
  },
  runStarting: "Réveil du bureau…",
  runFailed: "Le lancement du bureau n’a pas abouti. Réessayez.",
  runNetwork: "Problème de connexion — le bureau est injoignable.",
  plain: {
    moodBullChip: "Léger biais haussier",
    moodBullMeaning:
      "Le bureau pense que l’or a une petite chance de monter doucement — pas une envolée.",
    moodBearChip: "Léger biais baissier",
    moodBearMeaning:
      "Le bureau pense que l’or a une petite chance de glisser doucement — pas un krach.",
    moodWaitChip: "Mode attente",
    moodWaitMeaning:
      "Le bureau ne voit pas de signal net. Aujourd’hui, attendre est le bon choix.",
    confHigh: "Le bureau est plutôt sûr de cette lecture.",
    confMed: "Le bureau a un léger penchant — rien de garanti.",
    confLow: "Le bureau n’est pas sûr — à prendre comme une lecture très souple.",
    bandHigh: "Conviction plus forte",
    bandHighHint: "Toujours de la recherche — pas une promesse.",
    bandMed: "Conviction moyenne",
    bandMedHint: "Penchant utile, facile à changer.",
    bandLow: "Conviction faible",
    bandLowHint: "Beaucoup de bruit — restez léger.",
    floorLabel: "Plancher",
    floorHelp:
      "Zone où les acheteurs apparaissent souvent. Si le prix tient ici, le léger biais haussier reste valable.",
    ceilingLabel: "Plafond",
    ceilingHelp:
      "Zone à surveiller pour une poussée vers le haut. Rester bloqué dessous veut souvent dire : attendre.",
    stopLabel: "Ligne stop",
    stopHelp:
      "Si l’or clôture sous ce niveau, l’idée du bureau est fausse — on arrête.",
    sessionAsiaLondon: "Passage de relais : l’Asie vers Londres.",
    sessionLondonNy:
      "Passage de relais : Londres vers New York (souvent le moment le plus actif).",
    sessionNy: "Heures de New York — les mouvements peuvent devenir plus brusques.",
    sessionLondon: "Heures de Londres — principale liquidité européenne.",
    sessionAsia: "Heures d’Asie — d’habitude plus calme pour l’or.",
    sessionFallback: (s) => `Séance : ${s}`,
    moveUp: (pct) => `L’or monte d’environ ${pct}% aujourd’hui.`,
    moveDown: (pct) => `L’or baisse d’environ ${pct}% aujourd’hui.`,
    moveFlat: (pct) => `L’or est presque stable aujourd’hui (${pct}%).`,
    placeOnFloor: "L’or est posé sur le plancher, voire dessous — fragile.",
    placeAtCeiling:
      "L’or appuie sur le plafond — le risque d’étirement est plus élevé.",
    placeLower:
      "L’or est dans le bas de la fourchette du jour (plus près du plancher).",
    placeUpper:
      "L’or est dans le haut de la fourchette du jour (plus près du plafond).",
    placeMid: "L’or est à peu près au milieu, entre plancher et plafond.",
    above: "au-dessus du",
    below: "en dessous du",
    under: "sous le",
    actionBull:
      "Si vous suivez le bureau : respectez le léger biais haussier seulement tant que le plancher tient.",
    actionBear:
      "Si vous suivez le bureau : respectez le léger biais baissier, et ne courez pas après le prix près du plafond.",
    actionWait:
      "Si vous suivez le bureau : rien de directionnel — attendez que ce soit clair.",
    doBull: [
      "Gardez l’idée simple : une montée lente, pas une fusée.",
      "Regardez si le plancher continue de tenir sur les replis.",
      "Servez-vous de la ligne stop comme bouton « l’idée est fausse ».",
    ],
    doBear: [
      "Gardez l’idée simple : une baisse lente, pas un effondrement.",
      "Regardez si l’or échoue sous le plafond.",
      "Si le plancher casse, le scénario baissier devient plus net — gardez quand même la ligne stop pour le risque.",
    ],
    doWait: [
      "Restez neutre dans votre tête : aucun biais forcé aujourd’hui.",
      "Attendez une cassure nette du plancher ou du plafond avant de vous en occuper.",
      "Laissez gagner l’appel « attendre » de Vera jusqu’à ce que la carte s’éclaircisse.",
    ],
    dontBase: [
      "Ne prenez pas ceci pour un conseil financier ni pour un mouvement garanti.",
      "N’ignorez pas la ligne stop si le prix clôture au-delà.",
    ],
    dontVeto:
      "Ne forcez pas un biais tant que le frein risque de Vera est activé.",
    dontMild:
      "Ne surdimensionnez pas un léger biais — la confiance n’est pas de 100.",
    vetoStep:
      "L’agent risque (Vera) a mis un frein : mieux vaut attendre que forcer un appel.",
    agentJobs: {
      aurelia: "Cheffe du bureau — écrit l’appel final, en simple.",
      marcus: "Surveille le dollar et les taux (grands moteurs de l’or).",
      nova: "Regarde le graphique de l’or : plancher, plafond, tendance.",
      iris: "Lit les infos qui peuvent vraiment bouger l’or.",
      felix: "Vérifie si tout le monde est déjà sur la même idée.",
      vera: "Dit quand il est plus sûr d’attendre que de prendre un biais.",
      default: "Spécialiste du bureau.",
    },
  },
  home: {
    dollar: "Dollar US",
    yields: "Taux US 10 ans",
    chart: "Carte du graphique",
    news: "Bloc d’infos",
    macro: "Vue d’ensemble",
    dollarEase: (pct) =>
      `Dollar qui se détend (${pct}%) — laisse souvent de la place à l’or.`,
    dollarFirm: (pct) =>
      `Dollar qui se raffermit (${pct}%) — pèse souvent sur l’or.`,
    dollarFlat: (pct) => `Dollar à peu près stable (${pct}%).`,
    yieldsHigh: (y) => `Taux élevés (~${y}%) — l’or subit souvent une pression.`,
    yieldsSoft: (y) => `Taux plus bas (~${y}%) — peut soutenir l’or.`,
    yieldsMid: (y) => `Taux au milieu (~${y}%) — pas un moteur net à lui seul.`,
    chartHigh:
      "Le prix est haut dans la fourchette — risque d’étirement près du plafond.",
    chartLow: "Le prix est bas dans la fourchette — plus près du plancher.",
    chartMid: "Le prix est au milieu, entre plancher et plafond.",
    newsHelp: "Les titres penchent plutôt en faveur de l’or.",
    newsHurt: "Les titres penchent plutôt contre l’or.",
    newsMix: "Les titres sont mitigés pour l’or.",
    leanHelps: "aide l’or",
    leanPresses: "pèse sur l’or",
    leanMixed: "mitigé",
    edgeClean: "Signal plus net",
    edgeSoft: "Signal léger",
    edgeThin: "Signal mince — restez léger",
    riskHot: "Marché nerveux — prudence façon Vera",
    riskWarm: "Tiède — les mouvements peuvent surprendre",
    riskCool: "Plus calme — la carte se lit mieux",
    readBull: "Le bureau penche légèrement à la hausse tant que le plancher tient.",
    readBear:
      "Le bureau penche légèrement à la baisse tant que le plafond bloque.",
    readWait: "Le bureau ne voit pas de signal net — l’appel est d’attendre.",
    driversToday: (bits) => `Moteurs du jour : ${bits}.`,
    leadingPath: (label, pct) => `Scénario principal : ${label} (~${pct}%).`,
    riskBrakeOn: "Frein risque activé — mieux vaut attendre que forcer un biais.",
    typicalSwing: (dollars, pct) =>
      `Variation typique ~${dollars} $ (${pct}%).`,
    dissent: (name, verdict) => `${name} n’est pas d’accord : ${verdict}`,
  },
  desk: {
    pathUp: "Scénario légère hausse",
    pathUpPlain: "L’or grimpe doucement vers la zone du plafond, voire au-delà.",
    pathBase: "Scénario stagnation",
    pathBasePlain:
      "L’or reste collé entre plancher et plafond — attendre est gagnant.",
    pathDown: "Scénario légère baisse",
    pathDownPlain: "L’or glisse vers le plancher / la zone basse.",
    triggerUp: (floor, ceil) =>
      `Tient au-dessus de ~${floor} et pousse vers ~${ceil}`,
    triggerBase: (floor, ceil) => `Oscille entre ~${floor} et ~${ceil}`,
    triggerDown: (ceil, floor) =>
      `Échoue sous ~${ceil} et glisse vers ~${floor}`,
    standUp: (stop) => `Clôture sous ~${stop}`,
    standBase: "Une cassure nette d’un côté que vous refusez de re-cartographier",
    standDown: (stop) => `Clôture sous ~${stop} (ligne de risque ferme)`,
    netHelp: "Le bloc d’infos du jour penche plutôt en faveur de l’or.",
    netHurt: "Le bloc d’infos du jour penche plutôt contre l’or.",
    netMix: "Le bloc d’infos du jour est mitigé — aucune poussée nette.",
    newsIris:
      "Iris a noté les titres selon leur lien avec l’or et leur direction.",
    newsEmpty: "Pas encore de titres notés — lancez le bureau.",
    adviceVeto: "Frein risque activé — attendre vaut mieux que forcer un biais.",
    adviceBull:
      "Suivez une carte légèrement haussière seulement tant que le plancher tient.",
    adviceBear:
      "Suivez une carte légèrement baissière — ne courez pas après le prix près du plafond.",
    adviceWait: "Pas de signal net — le conseil est d’attendre une cassure.",
    timingNy:
      "Heures de New York : les mouvements peuvent s’accélérer — gardez la ligne stop en tête.",
    timingLondon:
      "Heures de Londres : principale fenêtre de liquidité — les cassures de niveaux comptent plus.",
    timingQuiet:
      "Séance plus calme — le bruit peut créer de fausses cassures ; attendez que ça tienne.",
    machineEdges: [
      "Note le dollar, les taux, les niveaux du graphique, les infos, la foule et le risque d’un seul coup.",
      "Construit trois scénarios avec des probabilités — pas une seule intuition émotionnelle.",
      "Étiquette chaque titre avec son biais pour l’or et pourquoi il compte, plus vite qu’une lecture manuelle.",
      "Trace plancher / plafond / stop sur le graphique en direct pour garder la carte visuelle.",
    ],
    watchDollar: "Ton du dollar US",
    watchHeadlines: "Si les gros titres restent chauds ou s’essoufflent",
    primaryPlan: "Plan principal",
    ifWrong: "Si c’est faux",
    sizeMind: "État d’esprit sur la taille",
    triggerCare: "Déclencheur à surveiller",
    veraOverride: "Veto de Vera",
    veraDetail:
      "Frein risque actif — mieux vaut attendre que forcer une histoire directionnelle.",
    planBull: (floor, ceil) =>
      `Respectez la légère hausse tant que l’or tient au-dessus de ~${floor}. Zone cible vers ~${ceil}.`,
    wrongBull: (stop) =>
      `Clôture sous ~${stop} = idée morte. On arrête — pas de moyenne à la baisse.`,
    sizeConf: (c) =>
      `Conviction ${c}/100 — à traiter comme un léger biais, pas un pari maximal.`,
    planBear: (ceil, floor) =>
      `Respectez la légère baisse tant que le plafond ~${ceil} bloque. Cible souple vers ~${floor}.`,
    wrongBear: (stop) =>
      `Une reprise franche au-dessus du plafond, ou le chaos au-delà du stop ~${stop}, met fin au biais.`,
    sizeBear: (c) =>
      `Conviction ${c}/100 — léger biais seulement ; les infos peuvent tout retourner vite.`,
    planWait:
      "Restez neutre dans votre tête. Laissez plancher et plafond décider du prochain biais.",
    triggerWait: (ceil, floor) =>
      `Tenue au-dessus de ~${ceil} → candidat légère hausse. Tenue sous ~${floor} → candidat légère baisse.`,
    sizeWait: "Aucune urgence directionnelle avant qu’un scénario se dégage.",
    zoneStop: "Au-delà de la ligne stop",
    zoneUnderFloor: "Sous le plancher",
    zoneAboveCeil: "Au-dessus du plafond",
    zoneUpper: "Moitié haute de la fourchette",
    zoneLower: "Moitié basse de la fourchette",
    meanStop:
      "Ici, l’idée du bureau est fausse. On arrête — on ne discute pas avec la carte.",
    meanUnder:
      "Les scénarios haussiers deviennent fragiles. La baisse / l’attente prend le dessus.",
    meanAbove:
      "Zone d’étirement — le risque de courir après la hausse augmente ; attendez que ça tienne.",
    meanUpper:
      "Plus près du plafond — la hausse a besoin d’une poussée nette ; la baisse guette les échecs.",
    meanLower:
      "Plus près du plancher — la hausse guette les tenues ; la baisse guette les cassures.",
    hintRisk: "Scénario risque actif",
    hintDownStrong: "Scénario baissier qui se renforce",
    hintBasePressure: "Scénario stagnation sous pression",
    hintUpExt: "Scénario haussier étiré",
    hintBreakout: "La cassure demande confirmation",
    hintHighChop: "Oscillation moyenne-haute",
    hintLowChop: "Oscillation moyenne-basse",
    whyRatePos:
      "Les discussions sur les taux peuvent refroidir le dollar et laisser de la place à l’or.",
    whyRateNeg:
      "Des taux plus chauds serrent en général l’or, via un dollar plus fort.",
    whyDollarPos: "Un dollar plus faible soulève souvent l’or dans le même élan.",
    whyDollarNeg:
      "Un dollar plus fort est l’un des vents contraires les plus rapides pour l’or.",
    whyGeo:
      "Les tensions géopolitiques peuvent faire bondir la demande de valeur refuge — vite et de façon bruyante.",
    whyInflation:
      "Les chiffres d’inflation et d’emploi changent les paris sur les taux — l’or réagit via les taux et le dollar.",
    whyGoldDirect:
      "Les flux directs sur l’or / les ETF peuvent bouger le prix même sans choc économique.",
    whyTagged: (reasons) =>
      `Le bureau a marqué ce titre comme lié à l’or (${reasons}).`,
    whyToneHelp: "Le ton penche en soutien de l’or aujourd’hui.",
    whyToneHurt: "Le ton penche en pression sur l’or aujourd’hui.",
    whyNoise: "Sur le radar, mais pas un moteur net pour l’or à lui seul.",
  },
  ui: {
    sensorsTitle: "Capteurs du bureau",
    dollarHint:
      "Le contrepoids le plus rapide de l’or — un dollar plus fort pèse d’habitude sur l’or.",
    yieldsHint:
      "Des taux plus élevés rendent la détention d’or plus coûteuse à porter.",
    usDollar: "Dollar US",
    us10y: "US 10 ans",
    typicalSwing: "Variation typique",
    feed: "Source",
    yieldsSub: "Contexte des taux d’intérêt",
    deskSub: "Six spécialistes, un appel en mots simples",
    sample: "Exemple",
    live: "En direct",
    chartTitle: "Graphique de l’or avec la carte du bureau",
    chartSubtitle: "Plancher, plafond et ligne stop tracés sur le prix en direct.",
    candles: "Chandeliers",
    line: "Ligne",
    chartUnavailable: "Les données du graphique ne sont pas disponibles maintenant.",
    chartAria: "Graphique du prix de l’or avec les niveaux du bureau",
    swingAtr: "Variation typique du jour",
    windowNow: "Fenêtre de séance",
    scenariosTitle: "Trois scénarios, pondérés",
    scenariosSubtitle:
      "Pas une seule intuition — le bureau pèse hausse, stagnation et baisse.",
    leadingPath: "Scénario principal",
    target: "Cible",
    trigger: "Déclencheur",
    standDown: "On arrête",
    whatIfTitle: "Et si l’or allait là ?",
    whatIfSubtitle:
      "Déplacez le prix pour voir où il tombe sur la carte du bureau.",
    probePrice: "Prix test",
    vsSpot: "vs prix actuel",
    probeAria: "Curseur du prix test",
    resetSpot: "Revenir au prix actuel",
    vsFloor: "vs plancher",
    vsCeiling: "vs plafond",
    vsStop: "vs ligne stop",
    radarTitle: "Radar du bureau",
    radarSubtitle: "Où se situe chaque spécialiste aujourd’hui.",
    agreement: "Accord",
    up: "Hausse",
    wait: "Attendre",
    down: "Baisse",
    veraBrake: "Frein risque de Vera",
    adviceTitle: "Ce que le bureau surveillerait",
    adviceMachine: "Ce qu’un bureau machine capte d’un seul coup",
    watchNext: "À surveiller ensuite",
    playbook: "Plan de jeu",
    trackTitle: "Historique de résultats",
    trackHitRate: (rate, hits, misses) =>
      `${rate}% de réussite — ${hits} hits, ${misses} misses.`,
    trackEmpty:
      "Aucun jour noté pour l’instant. Lancez le bureau, puis notez demain.",
    openHistory: "Ouvrir l’historique",
    agentReady: "Prêt",
    agentThinking: "Réflexion…",
    agentDisagreed: "Pas d’accord",
    agentIdle: "En attente",
    jobPlain: "Son rôle, en mots simples",
    whatTheyWatch: "Ce qu’il surveille",
    todaysTake: "Son avis du jour",
    watchNextColon: "À surveiller ensuite :",
    sources: "Sources",
    deskTrust: "Ce que le bureau suit pour vous",
    readFullBrief: "Lire le brief complet",
    backAgents: "Retour aux agents",
    briefPlain: "Mots simples",
    briefShorthand: "Langage du bureau",
    howToRead: "Comment lire ceci",
    why: "Pourquoi",
    someoneDisagrees: "Quelqu’un n’est pas d’accord",
    deskDebate: "Débat du bureau",
    simplePlan: "Plan simple",
    lean: "Biais",
    map: "Carte",
    standDownIf: "On arrête si",
    signedBy: "Signé par",
    backToday: "Retour à Aujourd’hui",
    share: "Partager",
    save: "Enregistrer",
    shareTitle: "Goldbook — l’appel or du jour",
    copied: "Copié dans le presse-papiers.",
    shareFail: "Partage impossible — essayez de copier à la place.",
    saved: "Enregistré",
    historyMatched: "A suivi le mouvement",
    historyMissed: "A raté le mouvement",
    historyUngraded: "Pas encore noté",
    scoreFail: "La notation a échoué — réessayez.",
    scoreHit: "Noté : le bureau a suivi le mouvement.",
    scoreMiss: "Noté : le bureau a raté le mouvement.",
    scoreNothing: "Rien de nouveau à noter.",
    errorTitle: "Un problème est survenu",
    retry: "Réessayer",
    sureOf100: "de confiance sur 100",
  },
};

export const copyAr: CopyPack = {
  runSteps: {
    marcus: "ماركوس يتابع الدولار وأسعار الفائدة…",
    nova: "نوفا تقرأ شارت الذهب (الأرضية والسقف)…",
    iris: "إيريس تفحص الأخبار التي قد تحرّك الذهب…",
    felix: "فيليكس يتأكد إن كان الجميع قد دخل بنفس الفكرة…",
    vera: "فيرا تسأل: هل الانتظار أكثر أماناً؟…",
    aurelia: "أوريليا تكتب نداء اليوم بكلمات بسيطة…",
  },
  runStarting: "جاري إيقاظ المكتب…",
  runFailed: "لم يكتمل تشغيل المكتب. حاول مرة أخرى.",
  runNetwork: "مشكلة في الاتصال — لم نتمكن من الوصول إلى المكتب.",
  plain: {
    moodBullChip: "ميل صاعد خفيف",
    moodBullMeaning:
      "المكتب يرى فرصة بسيطة لصعود هادئ في الذهب — وليس انفجاراً سعرياً.",
    moodBearChip: "ميل هابط خفيف",
    moodBearMeaning:
      "المكتب يرى فرصة بسيطة لتراجع هادئ في الذهب — وليس انهياراً.",
    moodWaitChip: "وضع الانتظار",
    moodWaitMeaning: "المكتب لا يرى ميزة واضحة. الانتظار هو الخيار الذكي اليوم.",
    confHigh: "المكتب واثق إلى حد جيد من هذه القراءة.",
    confMed: "لدى المكتب ميل خفيف — وليس أمراً مؤكداً.",
    confLow: "المكتب غير متأكد — اعتبرها قراءة مرنة فقط.",
    bandHigh: "اقتناع أعلى",
    bandHighHint: "ما زال بحثاً — ليس وعداً.",
    bandMed: "اقتناع متوسط",
    bandMedHint: "ميل مفيد، ويمكن أن يتغيّر بسهولة.",
    bandLow: "اقتناع منخفض",
    bandLowHint: "الضجيج مرتفع — خفّف من ثقتك.",
    floorLabel: "الأرضية",
    floorHelp:
      "منطقة يظهر فيها المشترون عادة. إذا ثبت السعر هنا، يبقى الميل الصاعد الخفيف قائماً.",
    ceilingLabel: "السقف",
    ceilingHelp:
      "منطقة نراقبها لدفعة صاعدة. البقاء عالقاً تحتها يعني غالباً: انتظر.",
    stopLabel: "خط التوقف",
    stopHelp: "إذا أغلق الذهب تحت هذا المستوى، ففكرة المكتب خاطئة — نتوقف.",
    sessionAsiaLondon: "تسليم بين الأسواق: من آسيا إلى لندن.",
    sessionLondonNy: "تسليم بين الأسواق: من لندن إلى نيويورك (غالباً الأكثر حركة).",
    sessionNy: "ساعات نيويورك — الحركات قد تصبح أعنف.",
    sessionLondon: "ساعات لندن — أهم سيولة أوروبية.",
    sessionAsia: "ساعات آسيا — عادة أهدأ للذهب.",
    sessionFallback: (s) => `الجلسة: ${s}`,
    moveUp: (pct) => `الذهب مرتفع بنحو ${pct}% اليوم.`,
    moveDown: (pct) => `الذهب منخفض بنحو ${pct}% اليوم.`,
    moveFlat: (pct) => `الذهب شبه ثابت اليوم (${pct}%).`,
    placeOnFloor: "الذهب يجلس على الأرضية أو تحتها — وضع هشّ.",
    placeAtCeiling: "الذهب يضغط على السقف — خطر التمدد أعلى.",
    placeLower: "الذهب في الجزء السفلي من نطاق اليوم (أقرب إلى الأرضية).",
    placeUpper: "الذهب في الجزء العلوي من نطاق اليوم (أقرب إلى السقف).",
    placeMid: "الذهب تقريباً في منتصف المسافة بين الأرضية والسقف.",
    above: "فوق",
    below: "تحت",
    under: "دون",
    actionBull:
      "إذا اتبعت المكتب: احترم الميل الصاعد الخفيف فقط ما دامت الأرضية ثابتة.",
    actionBear:
      "إذا اتبعت المكتب: احترم الميل الهابط الخفيف، ولا تلاحق السعر قرب السقف.",
    actionWait: "إذا اتبعت المكتب: لا تتخذ أي اتجاه — انتظر الوضوح.",
    doBull: [
      "أبقِ الفكرة بسيطة: صعود هادئ، لا صاروخ.",
      "راقب إن كانت الأرضية تستمر في الصمود عند التراجعات.",
      "استخدم خط التوقف كزر «الفكرة خاطئة».",
    ],
    doBear: [
      "أبقِ الفكرة بسيطة: تراجع هادئ، لا انهيار.",
      "راقب إن فشل الذهب تحت السقف.",
      "إذا انكسرت الأرضية، تصبح قصة الهبوط أوضح — واستمر في استخدام خط التوقف للمخاطر.",
    ],
    doWait: [
      "ابقَ محايداً في ذهنك: لا ميل مفروض اليوم.",
      "انتظر كسراً واضحاً للأرضية أو السقف قبل أن يهمّك الأمر.",
      "اترك نداء الانتظار من فيرا يفوز حتى تتضح الخريطة.",
    ],
    dontBase: [
      "لا تعتبر هذا نصيحة مالية أو حركة مضمونة.",
      "لا تتجاهل خط التوقف إذا أغلق السعر خارجه.",
    ],
    dontVeto: "لا تفرض ميلاً ما دام فرامل المخاطر عند فيرا مفعّلة.",
    dontMild: "لا تبالغ في حجم ميل خفيف — الثقة ليست 100.",
    vetoStep: "وكيلة المخاطر (فيرا) وضعت الفرامل: الانتظار أفضل من فرض نداء.",
    agentJobs: {
      aurelia: "رئيسة المكتب — تكتب النداء النهائي ببساطة.",
      marcus: "يتابع الدولار وأسعار الفائدة (محرّكات كبيرة للذهب).",
      nova: "تقرأ شارت الذهب: الأرضية، السقف، الاتجاه.",
      iris: "تقرأ الأخبار التي يمكن أن تحرّك الذهب فعلاً.",
      felix: "يتحقق إن كان الجميع قد دخل بنفس الفكرة.",
      vera: "تقول متى يكون الانتظار أكثر أماناً من اتخاذ ميل.",
      default: "متخصص في المكتب.",
    },
  },
  home: {
    dollar: "الدولار الأمريكي",
    yields: "عائد 10 سنوات الأمريكي",
    chart: "خريطة الشارت",
    news: "حزمة الأخبار",
    macro: "الصورة الكبيرة",
    dollarEase: (pct) => `الدولار يتراجع (${pct}%) — غالباً يفتح مجالاً للذهب.`,
    dollarFirm: (pct) => `الدولار يتقوّى (${pct}%) — غالباً يضغط على الذهب.`,
    dollarFlat: (pct) => `الدولار شبه ثابت (${pct}%).`,
    yieldsHigh: (y) => `العوائد مرتفعة (~${y}%) — الذهب يشعر بالضغط عادة.`,
    yieldsSoft: (y) => `العوائد أهدأ (~${y}%) — قد تدعم الذهب.`,
    yieldsMid: (y) => `العوائد في المنتصف (~${y}%) — ليست محرّكاً واضحاً بمفردها.`,
    chartHigh: "السعر مرتفع داخل النطاق — خطر التمدد قرب السقف.",
    chartLow: "السعر منخفض داخل النطاق — أقرب إلى الأرضية.",
    chartMid: "السعر في منتصف النطاق بين الأرضية والسقف.",
    newsHelp: "العناوين تميل قليلاً لصالح الذهب.",
    newsHurt: "العناوين تميل قليلاً ضد الذهب.",
    newsMix: "العناوين مختلطة بالنسبة للذهب.",
    leanHelps: "يدعم الذهب",
    leanPresses: "يضغط على الذهب",
    leanMixed: "مختلط",
    edgeClean: "ميزة أوضح",
    edgeSoft: "ميزة خفيفة",
    edgeThin: "ميزة ضعيفة — ابقَ خفيفاً",
    riskHot: "سوق ساخن — حذر على طريقة فيرا",
    riskWarm: "دافئ — الحركات قد تفاجئ",
    riskCool: "أهدأ — الخريطة أسهل في القراءة",
    readBull: "المكتب يميل صعوداً بهدوء ما دامت الأرضية ثابتة.",
    readBear: "المكتب يميل هبوطاً بهدوء ما دام السقف يكبح السعر.",
    readWait: "المكتب لا يرى ميزة واضحة — النداء هو الانتظار.",
    driversToday: (bits) => `محرّكات اليوم: ${bits}.`,
    leadingPath: (label, pct) => `المسار الأرجح: ${label} (~${pct}%).`,
    riskBrakeOn: "فرامل المخاطر مفعّلة — الانتظار أفضل من فرض ميل.",
    typicalSwing: (dollars, pct) => `التحرّك المعتاد ~${dollars}$ (${pct}%).`,
    dissent: (name, verdict) => `${name} يعترض: ${verdict}`,
  },
  desk: {
    pathUp: "مسار صعود خفيف",
    pathUpPlain: "الذهب يزحف نحو منطقة السقف أو يعبرها.",
    pathBase: "مسار التذبذب",
    pathBasePlain: "الذهب يبقى لاصقاً بين الأرضية والسقف — الانتظار هو الفائز.",
    pathDown: "مسار هبوط خفيف",
    pathDownPlain: "الذهب يتراجع نحو الأرضية / المنطقة السفلية.",
    triggerUp: (floor, ceil) => `يثبت فوق ~${floor} ويدفع نحو ~${ceil}`,
    triggerBase: (floor, ceil) => `يتذبذب بين ~${floor} و~${ceil}`,
    triggerDown: (ceil, floor) => `يفشل تحت ~${ceil} وينزلق نحو ~${floor}`,
    standUp: (stop) => `يغلق تحت ~${stop}`,
    standBase: "كسر واضح لأي من الجهتين ترفض إعادة رسم الخريطة بعده",
    standDown: (stop) => `يغلق تحت ~${stop} (خط مخاطر صارم)`,
    netHelp: "حزمة أخبار اليوم تميل قليلاً لصالح الذهب.",
    netHurt: "حزمة أخبار اليوم تميل قليلاً ضد الذهب.",
    netMix: "حزمة أخبار اليوم مختلطة — لا دفعة واضحة واحدة.",
    newsIris: "إيريس قيّمت العناوين حسب صلتها بالذهب واتجاهها.",
    newsEmpty: "لا عناوين مقيّمة بعد — شغّل المكتب.",
    adviceVeto: "فرامل المخاطر مفعّلة — الانتظار أفضل من فرض ميل.",
    adviceBull: "اتبع خريطة الصعود الخفيف فقط ما دامت الأرضية ثابتة.",
    adviceBear: "اتبع خريطة الهبوط الخفيف — ولا تلاحق السعر قرب السقف.",
    adviceWait: "لا ميزة واضحة — النصيحة هي انتظار كسر.",
    timingNy: "ساعات نيويورك: الحركات قد تتسارع — أبقِ خط التوقف حاضراً في ذهنك.",
    timingLondon: "ساعات لندن: نافذة السيولة الأساسية — كسر المستويات أهم.",
    timingQuiet: "جلسة أهدأ — الضجيج قد يصنع كسوراً كاذبة؛ انتظر التثبيت.",
    machineEdges: [
      "يقيّم الدولار، العوائد، مستويات الشارت، الأخبار، تجمّع الناس، والمخاطر في مرور واحد.",
      "يبني ثلاثة مسارات متوقعة مع احتمالات — لا تخميناً عاطفياً واحداً.",
      "يضع لكل عنوان ميله تجاه الذهب وسبب أهميته، أسرع من قراءة يدوية.",
      "يرسم الأرضية والسقف وخط التوقف على الشارت المباشر لتبقى الخريطة مرئية.",
    ],
    watchDollar: "نبرة الدولار الأمريكي",
    watchHeadlines: "هل تبقى العناوين الكبيرة ساخنة أم تخبو",
    primaryPlan: "الخطة الأساسية",
    ifWrong: "إذا كانت خاطئة",
    sizeMind: "عقلية الحجم",
    triggerCare: "المُحفّز الذي يستحق الانتباه",
    veraOverride: "اعتراض فيرا",
    veraDetail: "فرامل المخاطر نشطة — الانتظار أفضل من أي قصة اتجاهية مفروضة.",
    planBull: (floor, ceil) =>
      `احترم الصعود الخفيف ما دام الذهب فوق ~${floor}. منطقة الهدف قرب ~${ceil}.`,
    wrongBull: (stop) =>
      `إغلاق تحت ~${stop} = الفكرة ميتة. توقف — ولا تزد على الخسارة.`,
    sizeConf: (c) => `الاقتناع ${c}/100 — تعامل معها كميل خفيف، لا كأقصى مراهنة.`,
    planBear: (ceil, floor) =>
      `احترم الهبوط الخفيف ما دام السقف ~${ceil} يكبح السعر. هدف مرن نحو ~${floor}.`,
    wrongBear: (stop) =>
      `استعادة قوية فوق السقف، أو فوضى تتجاوز خط التوقف ~${stop}، تنهي هذا الميل.`,
    sizeBear: (c) => `الاقتناع ${c}/100 — ميل خفيف فقط؛ الأخبار قد تعكس الوضع سريعاً.`,
    planWait: "ابقَ محايداً ذهنياً. اترك الأرضية والسقف يحدّدان الميل القادم.",
    triggerWait: (ceil, floor) =>
      `تثبيت فوق ~${ceil} → مرشّح صعود خفيف. تثبيت تحت ~${floor} → مرشّح هبوط خفيف.`,
    sizeWait: "لا استعجال اتجاهي حتى يتضح أحد المسارات.",
    zoneStop: "خلف خط التوقف",
    zoneUnderFloor: "تحت الأرضية",
    zoneAboveCeil: "فوق السقف",
    zoneUpper: "النصف الأعلى من النطاق",
    zoneLower: "النصف الأدنى من النطاق",
    meanStop: "فكرة المكتب خاطئة هنا. توقف — لا تجادل الخريطة.",
    meanUnder: "قصص الصعود تصبح هشّة. الهبوط أو الانتظار يعلو صوته.",
    meanAbove: "منطقة تمدد — خطر ملاحقة الصعود يرتفع؛ انتظر التثبيت.",
    meanUpper: "أقرب إلى السقف — الصعود يحتاج دفعة واضحة؛ الهبوط يراقب الفشل.",
    meanLower: "أقرب إلى الأرضية — الصعود يراقب الثبات؛ الهبوط يراقب الكسر.",
    hintRisk: "مسار المخاطر نشط",
    hintDownStrong: "مسار الهبوط يتقوّى",
    hintBasePressure: "مسار التذبذب تحت ضغط",
    hintUpExt: "مسار الصعود ممتد",
    hintBreakout: "الكسر يحتاج تأكيداً",
    hintHighChop: "تذبذب في النصف الأعلى",
    hintLowChop: "تذبذب في النصف الأدنى",
    whyRatePos: "الحديث عن الفائدة والعوائد قد يبرّد الدولار ويفتح مجالاً للذهب.",
    whyRateNeg: "ارتفاع الفائدة والعوائد يضغط الذهب عادة عبر دولار أقوى.",
    whyDollarPos: "دولار أضعف يرفع الذهب غالباً في نفس اللحظة.",
    whyDollarNeg: "دولار أقوى من أسرع العوائق أمام الذهب.",
    whyGeo: "التوتر الجيوسياسي قد يرفع الطلب على الملاذ الآمن — بسرعة وبضجيج.",
    whyInflation:
      "بيانات التضخم والوظائف تعيد تسعير توقعات الفائدة — والذهب يتفاعل عبر العوائد والدولار.",
    whyGoldDirect:
      "تدفقات الذهب المباشرة وصناديق المؤشرات قد تحرّك السعر حتى بدون صدمة اقتصادية.",
    whyTagged: (reasons) => `المكتب صنّف هذا الخبر كمرتبط بالذهب (${reasons}).`,
    whyToneHelp: "النبرة تميل لدعم الذهب اليوم.",
    whyToneHurt: "النبرة تميل للضغط على الذهب اليوم.",
    whyNoise: "على الرادار، لكنه ليس محرّكاً واضحاً للذهب بمفرده.",
  },
  ui: {
    sensorsTitle: "مجسّات المكتب",
    dollarHint: "أسرع موازِن للذهب — دولار أقوى يضغط عليه عادة.",
    yieldsHint: "الفائدة الأعلى تجعل الاحتفاظ بالذهب أغلى.",
    usDollar: "الدولار الأمريكي",
    us10y: "عائد 10 سنوات",
    typicalSwing: "التحرّك المعتاد",
    feed: "المصدر",
    yieldsSub: "خلفية أسعار الفائدة",
    deskSub: "ستة متخصصين، ونداء واحد بكلمات بسيطة",
    sample: "تجريبي",
    live: "مباشر",
    chartTitle: "شارت الذهب مع خريطة المكتب",
    chartSubtitle: "الأرضية والسقف وخط التوقف مرسومة على السعر المباشر.",
    candles: "شموع",
    line: "خط",
    chartUnavailable: "بيانات الشارت غير متوفرة حالياً.",
    chartAria: "شارت سعر الذهب مع مستويات المكتب",
    swingAtr: "التحرّك المعتاد لليوم",
    windowNow: "نافذة الجلسة",
    scenariosTitle: "ثلاثة مسارات بأوزان",
    scenariosSubtitle: "ليس تخميناً واحداً — المكتب يوازن الصعود والتذبذب والهبوط.",
    leadingPath: "المسار الأرجح",
    target: "الهدف",
    trigger: "المُحفّز",
    standDown: "التوقف",
    whatIfTitle: "ماذا لو وصل الذهب إلى هنا؟",
    whatIfSubtitle: "حرّك السعر لترى موقعه على خريطة المكتب.",
    probePrice: "سعر اختباري",
    vsSpot: "مقابل السعر الحالي",
    probeAria: "شريط تحريك السعر الاختباري",
    resetSpot: "العودة للسعر الحالي",
    vsFloor: "مقابل الأرضية",
    vsCeiling: "مقابل السقف",
    vsStop: "مقابل خط التوقف",
    radarTitle: "رادار المكتب",
    radarSubtitle: "موقف كل متخصص اليوم.",
    agreement: "نسبة الاتفاق",
    up: "صعود",
    wait: "انتظار",
    down: "هبوط",
    veraBrake: "فرامل المخاطر عند فيرا",
    adviceTitle: "ما سيراقبه المكتب",
    adviceMachine: "ما يلتقطه مكتب آلي في مرور واحد",
    watchNext: "راقب بعد ذلك",
    playbook: "خطة العمل",
    trackTitle: "سجل النتائج",
    trackHitRate: (rate, hits, misses) =>
      `${rate}% إصابة — ${hits} صحيحة، ${misses} خاطئة.`,
    trackEmpty: "لا أيام مقيّمة بعد. شغّل المكتب، ثم قيّم غداً.",
    openHistory: "فتح السجل",
    agentReady: "جاهز",
    agentThinking: "يفكّر…",
    agentDisagreed: "غير موافق",
    agentIdle: "في الانتظار",
    jobPlain: "مهمته بكلمات بسيطة",
    whatTheyWatch: "ما يراقبه",
    todaysTake: "رأيه اليوم",
    watchNextColon: "راقب بعد ذلك:",
    sources: "المصادر",
    deskTrust: "ما يتابعه المكتب من أجلك",
    readFullBrief: "اقرأ الملخّص الكامل",
    backAgents: "رجوع إلى الوكلاء",
    briefPlain: "كلمات بسيطة",
    briefShorthand: "لغة المكتب",
    howToRead: "كيف تقرأ هذا",
    why: "لماذا",
    someoneDisagrees: "هناك من يعترض",
    deskDebate: "نقاش المكتب",
    simplePlan: "خطة بسيطة",
    lean: "الميل",
    map: "الخريطة",
    standDownIf: "نتوقف إذا",
    signedBy: "بتوقيع",
    backToday: "رجوع إلى اليوم",
    share: "مشاركة",
    save: "حفظ",
    shareTitle: "Goldbook — نداء الذهب اليوم",
    copied: "تم النسخ إلى الحافظة.",
    shareFail: "تعذّرت المشاركة — جرّب النسخ بدلاً منها.",
    saved: "تم الحفظ",
    historyMatched: "وافق الحركة",
    historyMissed: "أخطأ الحركة",
    historyUngraded: "لم يُقيّم بعد",
    scoreFail: "فشل التقييم — حاول مرة أخرى.",
    scoreHit: "تم التقييم: المكتب وافق الحركة.",
    scoreMiss: "تم التقييم: المكتب أخطأ الحركة.",
    scoreNothing: "لا شيء جديد للتقييم.",
    errorTitle: "حدث خطأ ما",
    retry: "حاول مرة أخرى",
    sureOf100: "ثقة من 100",
  },
};

export function getCopy(locale: Locale): CopyPack {
  if (locale === "fr") return copyFr;
  if (locale === "ar") return copyAr;
  return copyEn;
}
