import type { Locale } from "@/lib/i18n/locales";
import type { AgentId } from "@/lib/agents";
import type { Bias } from "@/lib/today-shared";

export type AgentCopy = {
  role: string;
  oneLiner: string;
  bio: string;
  watches: [string, string, string];
};

export type EngineData = {
  leanHigher: string;
  leanLower: string;
  leanWait: string;
  plainBull: string;
  plainBear: string;
  plainWait: string;
  watchMarcus: string;
  watchNova: (floor: number, ceil: number) => string;
  watchIrisHot: string;
  watchIrisEmpty: string;
  watchFelix: string;
  watchVera: (stop: number) => string;
  takeMarcus: (lean: string, score: string, narrative: string, beBit: string) => string;
  takeNova: (
    lean: string,
    score: string,
    price: number,
    floor: number,
    ceil: number,
    atr: number,
    trend: string,
  ) => string;
  takeIris: (lean: string, score: string, narrative: string, top: string) => string;
  takeFelix: (lean: string, score: string, crowded: boolean, dayMove: string) => string;
  takeVera: (risk: string, score: string, atrPct: number, stop: number) => string;
  veraPreferWait: string;
  veraNoBrake: string;
  felixCrowded: string;
  felixClear: string;
  beUp: (n: number) => string;
  beDown: (n: number) => string;
  vetoVol: string;
  vetoExtreme: string;
  vetoSplit: string;
  summaryBull: string;
  summaryBear: string;
  summaryWait: string;
  summaryScore: (score: string, agreePct: number) => string;
  dissent: (name: string) => string;
  srcFusion: string;
  srcAgreement: string;
  srcVera: string;
  srcVeraVeto: string;
  srcVeraOk: string;
  srcLevels: string;
  srcMacroPressure: string;
  srcUsd: string;
  srcBreakeven: string;
  srcMacroSource: string;
  srcSupport: string;
  srcWatch: string;
  srcAtr: string;
  srcTrend: string;
  srcMarketSource: string;
  srcNewsSentiment: string;
  srcTopHeadline: string;
  srcNoHeadline: string;
  srcHeadlineCount: string;
  srcNewsSource: string;
  srcNewsLean: string;
  srcDayMove: string;
  srcMode: string;
  srcModeDetail: string;
  srcInvalidation: string;
  srcAtrPct: string;
  srcSession: string;
  srcRiskScan: string;
  srcRiskDetail: string;
  planLevels: (floor: number, ceil: number, stop: number) => string;
  planDont: (stop: number) => string;
  srcFusionDetail: (score: number, conf: number) => string;
  srcMarketSample: string;
  srcMarketLive: (source: string) => string;
  srcMacro: string;
  srcNews: string;
  srcDesk: string;
  srcDeskDetail: string;
  srcMarketLabel: string;
  idleTake: string;
  idleSource: string;
  idleDetail: string;
  aureliaWatch: (floor: number, ceil: number, stop: number) => string;
  todayEmptySummary: string;
  todayEmptyMacro: string;
  todayEmptyNews: string;
  hit: string;
  miss: string;
  pending: string;
  hitPlain: string;
  missPlain: string;
  pendingPlain: string;
  userRole: string;
  agentEyebrow: string;
  pastBrief: string;
  pastBriefDesc: string;
  languageNames: { en: string; fr: string; ar: string };
  /** Instruction sentence handed to the LLM so prose comes back in this locale. */
  llmLanguageRule: string;
};

export type DataPack = {
  agents: Record<AgentId, AgentCopy>;
  engine: EngineData;
};

const agentsEn: Record<AgentId, AgentCopy> = {
  aurelia: {
    role: "Chief",
    oneLiner: "I turn the debate into one clear call you can actually understand.",
    bio: "Boss of the desk. She listens to everyone, then writes the final view in calm language — including a plain “what’s going on” note for beginners.",
    watches: ["Desk consensus", "Confidence", "Stop line"],
  },
  marcus: {
    role: "Macro",
    oneLiner: "I watch the dollar and interest rates — big drivers of gold.",
    bio: "Looks at the big economy picture: US dollar strength, yields, and inflation expectations. When money gets tighter, gold often feels pressure.",
    watches: ["US dollar", "Interest rates", "Inflation expectations"],
  },
  nova: {
    role: "Technical",
    oneLiner: "I read the gold chart: floor, ceiling, and trend.",
    bio: "Maps where buyers and sellers tend to show up on the gold chart. Floor = support, ceiling = watch zone, stop line = idea is wrong.",
    watches: ["Gold chart", "Floor & ceiling", "Day swing size"],
  },
  iris: {
    role: "News",
    oneLiner: "I only keep headlines that can actually move gold.",
    bio: "Filters geopolitics and central-bank news into what matters for gold — not noise.",
    watches: ["Geopolitics", "Central banks", "Surprise headlines"],
  },
  felix: {
    role: "Sentiment",
    oneLiner: "I ask if everyone already piled into the same idea.",
    bio: "Checks crowding and exhaustion. If the move looks late and crowded, he often pushes back.",
    watches: ["Crowding", "Fear", "Day momentum"],
  },
  vera: {
    role: "Risk",
    oneLiner: "I say when it’s safer to wait than to lean.",
    bio: "Guards the stop line, big swings, and messy days. When the desk is split or volatility is high, she hits the brake.",
    watches: ["Stop line", "Volatility", "Messy sessions"],
  },
};

const engineEn: EngineData = {
  leanHigher: "lean a bit higher",
  leanLower: "lean a bit lower",
  leanWait: "wait / no clear lean",
  plainBull: "Lean a bit higher on gold.",
  plainBear: "Lean a bit lower on gold.",
  plainWait: "No clear lean — wait.",
  watchMarcus: "Watch the US dollar and interest-rate headlines.",
  watchNova: (floor, ceil) => `Watch floor ${floor} and ceiling ${ceil}.`,
  watchIrisHot: "Watch whether today’s top headline stays hot or fades.",
  watchIrisEmpty: "Watch for a gold-moving headline.",
  watchFelix: "Watch if the day move keeps extending without a pause.",
  watchVera: (stop) => `Stand down if gold closes under ${stop}.`,
  takeMarcus: (lean, score, narrative, beBit) =>
    `Marcus: gold should ${lean} (score ${score}). Big-picture: ${narrative}${beBit}`,
  takeNova: (lean, score, price, floor, ceil, atr, trend) =>
    `Nova: chart says ${lean} (score ${score}). Price ${price} sits between floor ${floor} and ceiling ${ceil}. Typical swing (ATR) ${atr}. Trend lean ${trend}.`,
  takeIris: (lean, score, narrative, top) =>
    `Iris: news says ${lean} (score ${score}). ${narrative}${top ? ` Biggest headline: “${top}”.` : ""}`,
  takeFelix: (lean, score, crowded, dayMove) =>
    `Felix: sentiment says ${lean} (score ${score}). ${
      crowded ? engineEn.felixCrowded : engineEn.felixClear
    } Day move ${dayMove}%.`,
  takeVera: (risk, score, atrPct, stop) =>
    `Vera: risk says ${risk} (score ${score}). Typical swing ≈${atrPct}%. Stop line ${stop}.`,
  veraPreferWait: "prefer wait",
  veraNoBrake: "no hard brake",
  felixCrowded: "Many people already piled into the same side — be careful chasing.",
  felixClear: "No obvious crowd pile-up.",
  beUp: (n) => ` Inflation expectations moved up (${n}).`,
  beDown: (n) => ` Inflation expectations moved down (${n}).`,
  vetoVol: "Vera veto: volatility elevated — prefer wait / smaller risk.",
  vetoExtreme: "Vera veto: extreme day move — let the tape settle.",
  vetoSplit: "Vera veto: specialists split — force range until clarity.",
  summaryBull: "Mildly bullish after desk fusion.",
  summaryBear: "Mildly bearish after desk fusion.",
  summaryWait: "Range / wait after desk fusion.",
  summaryScore: (score, agreePct) => `Weighted score ${score} · agreement ${agreePct}%.`,
  dissent: (name) => `${name} still dissents.`,
  srcFusion: "Fusion",
  srcAgreement: "Agreement",
  srcVera: "Vera",
  srcVeraVeto: "Veto applied",
  srcVeraOk: "No hard veto",
  srcLevels: "Levels",
  srcMacroPressure: "Macro pressure",
  srcUsd: "USD / DXY",
  srcBreakeven: "Breakeven",
  srcMacroSource: "Macro source",
  srcSupport: "Support",
  srcWatch: "Watch",
  srcAtr: "ATR",
  srcTrend: "Trend",
  srcMarketSource: "Market source",
  srcNewsSentiment: "News sentiment",
  srcTopHeadline: "Top headline",
  srcNoHeadline: "No headline",
  srcHeadlineCount: "Headline count",
  srcNewsSource: "News source",
  srcNewsLean: "News lean",
  srcDayMove: "Day move",
  srcMode: "Mode",
  srcModeDetail: "Crowding / exhaustion check",
  srcInvalidation: "Invalidation",
  srcAtrPct: "ATR %",
  srcSession: "Session",
  srcRiskScan: "Risk scan",
  srcRiskDetail: "Vol · conflict · late NY",
  planLevels: (floor, ceil, stop) => `Floor ${floor} · Ceiling ${ceil} · Stop line ${stop}`,
  planDont: (stop) =>
    `If gold closes under ${stop}, the idea is wrong — stand down. Also wait on a sudden strong-dollar shock.`,
  srcFusionDetail: (score, conf) => `score ${score} · conf ${conf}`,
  srcMarketSample: "Sample snapshot",
  srcMarketLive: (source) => `Live via ${source}`,
  srcMacro: "Macro",
  srcNews: "News",
  srcDesk: "Desk",
  srcDeskDetail: "Signed by Aurelia after fusion",
  srcMarketLabel: "Market",
  idleTake: "Waiting for today’s desk run. Open Run desk to collect this agent’s take.",
  idleSource: "Desk",
  idleDetail: "No brief saved for today yet",
  aureliaWatch: (floor, ceil, stop) => `Floor ${floor} · Ceiling ${ceil} · Stop ${stop}`,
  todayEmptySummary: "No saved brief yet. Run the desk to get today’s call from Aurelia.",
  todayEmptyMacro: "Macro context arrives after a desk run.",
  todayEmptyNews: "Headlines arrive after a desk run.",
  hit: "Hit",
  miss: "Miss",
  pending: "Pending",
  hitPlain: "Call matched the move",
  missPlain: "Call missed the move",
  pendingPlain: "Not scored yet",
  userRole: "Co-founder of the desk",
  agentEyebrow: "Agent",
  pastBrief: "Past brief",
  pastBriefDesc: "How the desk called the day — and how gold answered.",
  languageNames: { en: "English", fr: "French", ar: "Arabic" },
  llmLanguageRule: "Write ALL user-facing strings in English.",
};

const agentsFr: Record<AgentId, AgentCopy> = {
  aurelia: {
    role: "Cheffe",
    oneLiner:
      "Je transforme le débat en un seul appel clair, que vous pouvez vraiment comprendre.",
    bio: "Cheffe du bureau. Elle écoute tout le monde, puis écrit la vision finale dans un langage calme — avec une note « ce qui se passe » en mots simples pour les débutants.",
    watches: ["Consensus du bureau", "Confiance", "Ligne stop"],
  },
  marcus: {
    role: "Macro",
    oneLiner:
      "Je surveille le dollar et les taux d’intérêt — de grands moteurs de l’or.",
    bio: "Regarde la grande photo de l’économie : la force du dollar US, les taux, et les anticipations d’inflation. Quand l’argent devient plus rare, l’or subit souvent une pression.",
    watches: ["Dollar US", "Taux d’intérêt", "Anticipations d’inflation"],
  },
  nova: {
    role: "Technique",
    oneLiner: "Je lis le graphique de l’or : plancher, plafond et tendance.",
    bio: "Repère où acheteurs et vendeurs apparaissent d’habitude sur le graphique de l’or. Plancher = soutien, plafond = zone à surveiller, ligne stop = l’idée est fausse.",
    watches: ["Graphique de l’or", "Plancher et plafond", "Taille du mouvement du jour"],
  },
  iris: {
    role: "Actualités",
    oneLiner: "Je ne garde que les titres capables de vraiment bouger l’or.",
    bio: "Filtre la géopolitique et les nouvelles des banques centrales pour ne garder que ce qui compte pour l’or — pas le bruit.",
    watches: ["Géopolitique", "Banques centrales", "Titres surprises"],
  },
  felix: {
    role: "Sentiment",
    oneLiner: "Je demande si tout le monde s’est déjà rué sur la même idée.",
    bio: "Vérifie l’encombrement et l’essoufflement. Si le mouvement semble tardif et encombré, il s’y oppose souvent.",
    watches: ["Encombrement", "Peur", "Élan du jour"],
  },
  vera: {
    role: "Risque",
    oneLiner: "Je dis quand il est plus sûr d’attendre que de prendre un biais.",
    bio: "Garde la ligne stop, les gros mouvements et les journées désordonnées. Quand le bureau est divisé ou que la volatilité est forte, elle freine.",
    watches: ["Ligne stop", "Volatilité", "Séances désordonnées"],
  },
};

const engineFr: EngineData = {
  leanHigher: "de pencher un peu à la hausse",
  leanLower: "de pencher un peu à la baisse",
  leanWait: "d’attendre — pas de biais net",
  plainBull: "Léger biais haussier sur l’or.",
  plainBear: "Léger biais baissier sur l’or.",
  plainWait: "Pas de biais net — attendre.",
  watchMarcus: "Surveillez le dollar US et les titres sur les taux d’intérêt.",
  watchNova: (floor, ceil) => `Surveillez le plancher ${floor} et le plafond ${ceil}.`,
  watchIrisHot: "Surveillez si le titre principal du jour reste chaud ou s’essouffle.",
  watchIrisEmpty: "Guettez un titre capable de bouger l’or.",
  watchFelix: "Regardez si le mouvement du jour continue de s’étirer sans pause.",
  watchVera: (stop) => `On arrête si l’or clôture sous ${stop}.`,
  takeMarcus: (lean, score, narrative, beBit) =>
    `Marcus : la macro dit ${lean} (score ${score}). Vue d’ensemble : ${narrative}${beBit}`,
  takeNova: (lean, score, price, floor, ceil, atr, trend) =>
    `Nova : le graphique dit ${lean} (score ${score}). Le prix ${price} se situe entre le plancher ${floor} et le plafond ${ceil}. Variation typique (ATR) ${atr}. Tendance ${trend}.`,
  takeIris: (lean, score, narrative, top) =>
    `Iris : les infos disent ${lean} (score ${score}). ${narrative}${
      top ? ` Titre le plus important : « ${top} ».` : ""
    }`,
  takeFelix: (lean, score, crowded, dayMove) =>
    `Felix : le sentiment dit ${lean} (score ${score}). ${
      crowded ? engineFr.felixCrowded : engineFr.felixClear
    } Mouvement du jour ${dayMove}%.`,
  takeVera: (risk, score, atrPct, stop) =>
    `Vera : le risque dit ${risk} (score ${score}). Variation typique ≈${atrPct}%. Ligne stop ${stop}.`,
  veraPreferWait: "qu’il vaut mieux attendre",
  veraNoBrake: "qu’il n’y a pas de frein ferme",
  felixCrowded:
    "Beaucoup de monde est déjà du même côté — attention à ne pas courir après le prix.",
  felixClear: "Pas d’encombrement évident.",
  beUp: (n) => ` Les anticipations d’inflation sont montées (${n}).`,
  beDown: (n) => ` Les anticipations d’inflation sont descendues (${n}).`,
  vetoVol: "Veto de Vera : volatilité élevée — mieux vaut attendre / réduire le risque.",
  vetoExtreme:
    "Veto de Vera : mouvement du jour extrême — laissons le marché se calmer.",
  vetoSplit:
    "Veto de Vera : spécialistes divisés — on force l’attente jusqu’à ce que ce soit clair.",
  summaryBull: "Légèrement haussier après la fusion du bureau.",
  summaryBear: "Légèrement baissier après la fusion du bureau.",
  summaryWait: "Fourchette / attente après la fusion du bureau.",
  summaryScore: (score, agreePct) => `Score pondéré ${score} · accord ${agreePct}%.`,
  dissent: (name) => `${name} n’est toujours pas d’accord.`,
  srcFusion: "Fusion",
  srcAgreement: "Accord",
  srcVera: "Vera",
  srcVeraVeto: "Veto appliqué",
  srcVeraOk: "Pas de veto ferme",
  srcLevels: "Niveaux",
  srcMacroPressure: "Pression macro",
  srcUsd: "Dollar US / DXY",
  srcBreakeven: "Point mort d’inflation",
  srcMacroSource: "Source macro",
  srcSupport: "Plancher",
  srcWatch: "Plafond",
  srcAtr: "ATR",
  srcTrend: "Tendance",
  srcMarketSource: "Source du marché",
  srcNewsSentiment: "Ton des infos",
  srcTopHeadline: "Titre principal",
  srcNoHeadline: "Aucun titre",
  srcHeadlineCount: "Nombre de titres",
  srcNewsSource: "Source des infos",
  srcNewsLean: "Biais des infos",
  srcDayMove: "Mouvement du jour",
  srcMode: "Mode",
  srcModeDetail: "Contrôle encombrement / essoufflement",
  srcInvalidation: "Ligne stop",
  srcAtrPct: "ATR %",
  srcSession: "Séance",
  srcRiskScan: "Scan risque",
  srcRiskDetail: "Volatilité · conflit · fin de séance NY",
  planLevels: (floor, ceil, stop) =>
    `Plancher ${floor} · Plafond ${ceil} · Ligne stop ${stop}`,
  planDont: (stop) =>
    `Si l’or clôture sous ${stop}, l’idée est fausse — on arrête. Attendez aussi en cas de choc soudain de dollar fort.`,
  srcFusionDetail: (score, conf) => `score ${score} · confiance ${conf}`,
  srcMarketSample: "Aperçu d’exemple",
  srcMarketLive: (source) => `En direct via ${source}`,
  srcMacro: "Macro",
  srcNews: "Infos",
  srcDesk: "Bureau",
  srcDeskDetail: "Signé par Aurelia après la fusion",
  srcMarketLabel: "Marché",
  idleTake:
    "En attente du lancement du bureau aujourd’hui. Ouvrez « Lancer le bureau » pour récupérer l’avis de cet agent.",
  idleSource: "Bureau",
  idleDetail: "Aucun brief enregistré pour aujourd’hui",
  aureliaWatch: (floor, ceil, stop) =>
    `Plancher ${floor} · Plafond ${ceil} · Stop ${stop}`,
  todayEmptySummary:
    "Pas encore de brief enregistré. Lancez le bureau pour recevoir l’appel du jour d’Aurelia.",
  todayEmptyMacro: "Le contexte macro arrive après un lancement du bureau.",
  todayEmptyNews: "Les titres arrivent après un lancement du bureau.",
  hit: "Réussi",
  miss: "Manqué",
  pending: "En attente",
  hitPlain: "L’appel a suivi le mouvement",
  missPlain: "L’appel a raté le mouvement",
  pendingPlain: "Pas encore noté",
  userRole: "Cofondateur du bureau",
  agentEyebrow: "Agent",
  pastBrief: "Brief passé",
  pastBriefDesc: "Comment le bureau a lu la journée — et comment l’or a répondu.",
  languageNames: { en: "Anglais", fr: "Français", ar: "Arabe" },
  llmLanguageRule:
    "Écris TOUTES les chaînes visibles en français (France). Pas d’anglais sauf noms propres (Aurelia, Marcus, etc.).",
};

const agentsAr: Record<AgentId, AgentCopy> = {
  aurelia: {
    role: "الرئيسة",
    oneLiner: "أحوّل النقاش إلى نداء واحد واضح يمكنك فهمه فعلاً.",
    bio: "رئيسة المكتب. تسمع الجميع، ثم تكتب الرأي النهائي بلغة هادئة — مع ملاحظة «ما الذي يحدث» بكلمات بسيطة للمبتدئين.",
    watches: ["توافق المكتب", "الثقة", "خط التوقف"],
  },
  marcus: {
    role: "الاقتصاد الكلي",
    oneLiner: "أراقب الدولار وأسعار الفائدة — أكبر محرّكات الذهب.",
    bio: "ينظر إلى الصورة الاقتصادية الكبيرة: قوة الدولار الأمريكي، العوائد، وتوقعات التضخم. وعندما يصبح المال أضيق، يشعر الذهب بالضغط غالباً.",
    watches: ["الدولار الأمريكي", "أسعار الفائدة", "توقعات التضخم"],
  },
  nova: {
    role: "التحليل الفني",
    oneLiner: "أقرأ شارت الذهب: الأرضية، السقف، والاتجاه.",
    bio: "ترسم أين يظهر المشترون والبائعون عادة على شارت الذهب. الأرضية = دعم، السقف = منطقة مراقبة، خط التوقف = الفكرة خاطئة.",
    watches: ["شارت الذهب", "الأرضية والسقف", "حجم تحرّك اليوم"],
  },
  iris: {
    role: "الأخبار",
    oneLiner: "لا أُبقي إلا العناوين القادرة فعلاً على تحريك الذهب.",
    bio: "تُصفّي أخبار الجغرافيا السياسية والبنوك المركزية لتُبقي ما يهم الذهب — لا الضجيج.",
    watches: ["الجغرافيا السياسية", "البنوك المركزية", "العناوين المفاجئة"],
  },
  felix: {
    role: "مزاج السوق",
    oneLiner: "أسأل إن كان الجميع قد اندفع بالفعل إلى نفس الفكرة.",
    bio: "يتحقق من ازدحام السوق وإنهاك الحركة. إذا بدت الحركة متأخرة ومزدحمة، فغالباً يعترض.",
    watches: ["ازدحام السوق", "الخوف", "زخم اليوم"],
  },
  vera: {
    role: "المخاطر",
    oneLiner: "أقول متى يكون الانتظار أكثر أماناً من اتخاذ ميل.",
    bio: "تحمي خط التوقف، وتراقب التحركات الكبيرة والأيام المضطربة. وعندما ينقسم المكتب أو ترتفع التقلبات، تضغط على الفرامل.",
    watches: ["خط التوقف", "التقلبات", "الجلسات المضطربة"],
  },
};

const engineAr: EngineData = {
  leanHigher: "ميل خفيف إلى الصعود",
  leanLower: "ميل خفيف إلى الهبوط",
  leanWait: "الانتظار — لا ميل واضح",
  plainBull: "ميل صاعد خفيف على الذهب.",
  plainBear: "ميل هابط خفيف على الذهب.",
  plainWait: "لا ميل واضح — انتظر.",
  watchMarcus: "راقب الدولار الأمريكي وعناوين أسعار الفائدة.",
  watchNova: (floor, ceil) => `راقب الأرضية ${floor} والسقف ${ceil}.`,
  watchIrisHot: "راقب إن بقي عنوان اليوم الأبرز ساخناً أم خبا.",
  watchIrisEmpty: "راقب ظهور عنوان قادر على تحريك الذهب.",
  watchFelix: "راقب إن استمر تحرّك اليوم في الامتداد بلا توقف.",
  watchVera: (stop) => `توقف إذا أغلق الذهب تحت ${stop}.`,
  takeMarcus: (lean, score, narrative, beBit) =>
    `ماركوس: الاقتصاد الكلي يشير إلى ${lean} (الدرجة ${score}). الصورة الكبيرة: ${narrative}${beBit}`,
  takeNova: (lean, score, price, floor, ceil, atr, trend) =>
    `نوفا: الشارت يشير إلى ${lean} (الدرجة ${score}). السعر ${price} يقع بين الأرضية ${floor} والسقف ${ceil}. التحرّك المعتاد (ATR) ${atr}. ميل الاتجاه ${trend}.`,
  takeIris: (lean, score, narrative, top) =>
    `إيريس: الأخبار تشير إلى ${lean} (الدرجة ${score}). ${narrative}${
      top ? ` أبرز عنوان: «${top}».` : ""
    }`,
  takeFelix: (lean, score, crowded, dayMove) =>
    `فيليكس: مزاج السوق يشير إلى ${lean} (الدرجة ${score}). ${
      crowded ? engineAr.felixCrowded : engineAr.felixClear
    } تحرّك اليوم ${dayMove}%.`,
  takeVera: (risk, score, atrPct, stop) =>
    `فيرا: المخاطر تقول ${risk} (الدرجة ${score}). التحرّك المعتاد ≈${atrPct}%. خط التوقف ${stop}.`,
  veraPreferWait: "إن الانتظار أفضل",
  veraNoBrake: "إنه لا توجد فرامل صارمة",
  felixCrowded: "كثيرون دخلوا بالفعل من نفس الجهة — احذر من ملاحقة السعر.",
  felixClear: "لا يوجد ازدحام واضح.",
  beUp: (n) => ` توقعات التضخم ارتفعت (${n}).`,
  beDown: (n) => ` توقعات التضخم انخفضت (${n}).`,
  vetoVol: "اعتراض فيرا: التقلبات مرتفعة — الأفضل الانتظار أو تصغير المخاطرة.",
  vetoExtreme: "اعتراض فيرا: تحرّك اليوم عنيف — لندع السوق يهدأ.",
  vetoSplit: "اعتراض فيرا: المتخصصون منقسمون — نفرض الانتظار حتى يتضح الأمر.",
  summaryBull: "ميل صاعد خفيف بعد دمج آراء المكتب.",
  summaryBear: "ميل هابط خفيف بعد دمج آراء المكتب.",
  summaryWait: "نطاق / انتظار بعد دمج آراء المكتب.",
  summaryScore: (score, agreePct) => `الدرجة المرجّحة ${score} · الاتفاق ${agreePct}%.`,
  dissent: (name) => `${name} لا يزال يعترض.`,
  srcFusion: "الدمج",
  srcAgreement: "نسبة الاتفاق",
  srcVera: "فيرا",
  srcVeraVeto: "تم تطبيق الاعتراض",
  srcVeraOk: "لا اعتراض صارم",
  srcLevels: "المستويات",
  srcMacroPressure: "ضغط الاقتصاد الكلي",
  srcUsd: "الدولار / مؤشر DXY",
  srcBreakeven: "تعادل التضخم",
  srcMacroSource: "مصدر الاقتصاد الكلي",
  srcSupport: "الأرضية",
  srcWatch: "السقف",
  srcAtr: "ATR",
  srcTrend: "الاتجاه",
  srcMarketSource: "مصدر السوق",
  srcNewsSentiment: "نبرة الأخبار",
  srcTopHeadline: "العنوان الأبرز",
  srcNoHeadline: "لا عناوين",
  srcHeadlineCount: "عدد العناوين",
  srcNewsSource: "مصدر الأخبار",
  srcNewsLean: "ميل الأخبار",
  srcDayMove: "تحرّك اليوم",
  srcMode: "الوضع",
  srcModeDetail: "فحص الازدحام / الإنهاك",
  srcInvalidation: "خط التوقف",
  srcAtrPct: "ATR %",
  srcSession: "الجلسة",
  srcRiskScan: "فحص المخاطر",
  srcRiskDetail: "التقلب · التعارض · نهاية جلسة نيويورك",
  planLevels: (floor, ceil, stop) =>
    `الأرضية ${floor} · السقف ${ceil} · خط التوقف ${stop}`,
  planDont: (stop) =>
    `إذا أغلق الذهب تحت ${stop} فالفكرة خاطئة — نتوقف. وانتظر أيضاً إذا حدثت صدمة مفاجئة لدولار قوي.`,
  srcFusionDetail: (score, conf) => `الدرجة ${score} · الثقة ${conf}`,
  srcMarketSample: "لقطة تجريبية",
  srcMarketLive: (source) => `مباشر عبر ${source}`,
  srcMacro: "الاقتصاد الكلي",
  srcNews: "الأخبار",
  srcDesk: "المكتب",
  srcDeskDetail: "بتوقيع أوريليا بعد الدمج",
  srcMarketLabel: "السوق",
  idleTake:
    "في انتظار تشغيل المكتب اليوم. افتح «تشغيل المكتب» لجمع رأي هذا الوكيل.",
  idleSource: "المكتب",
  idleDetail: "لا يوجد ملخّص محفوظ لليوم بعد",
  aureliaWatch: (floor, ceil, stop) =>
    `الأرضية ${floor} · السقف ${ceil} · التوقف ${stop}`,
  todayEmptySummary:
    "لا يوجد ملخّص محفوظ بعد. شغّل المكتب لتحصل على نداء اليوم من أوريليا.",
  todayEmptyMacro: "سياق الاقتصاد الكلي يظهر بعد تشغيل المكتب.",
  todayEmptyNews: "العناوين تظهر بعد تشغيل المكتب.",
  hit: "صحيح",
  miss: "خاطئ",
  pending: "في الانتظار",
  hitPlain: "النداء وافق الحركة",
  missPlain: "النداء أخطأ الحركة",
  pendingPlain: "لم يُقيّم بعد",
  userRole: "شريك مؤسِّس للمكتب",
  agentEyebrow: "الوكيل",
  pastBrief: "ملخّص سابق",
  pastBriefDesc: "كيف قرأ المكتب اليوم — وكيف ردّ الذهب.",
  languageNames: { en: "الإنجليزية", fr: "الفرنسية", ar: "العربية" },
  llmLanguageRule:
    "اكتب كل النصوص الظاهرة بالعربية الفصحى المبسطة. لا تستخدم الإنجليزية إلا لأسماء الوكلاء.",
};

export const dataEn: DataPack = { agents: agentsEn, engine: engineEn };
export const dataFr: DataPack = { agents: agentsFr, engine: engineFr };
export const dataAr: DataPack = { agents: agentsAr, engine: engineAr };

export function getData(locale: Locale): DataPack {
  if (locale === "fr") return dataFr;
  if (locale === "ar") return dataAr;
  return dataEn;
}

export function languageInstruction(locale: Locale): string {
  return getData(locale).engine.llmLanguageRule;
}

/** Lean fragment used inside specialist takes. */
export function leanFor(bias: Bias, data: DataPack) {
  if (bias === "bullish") return data.engine.leanHigher;
  if (bias === "bearish") return data.engine.leanLower;
  return data.engine.leanWait;
}

/** Beginner-friendly one-line verdict per specialist. */
export function plainVerdictFor(bias: Bias, data: DataPack) {
  if (bias === "bullish") return data.engine.plainBull;
  if (bias === "bearish") return data.engine.plainBear;
  return data.engine.plainWait;
}
