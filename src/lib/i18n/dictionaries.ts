import type { Locale } from "@/lib/i18n/locales";

export type Dictionary = {
  brand: { tagline: string; privateDesk: string };
  nav: { today: string; agents: string; history: string; you: string; run: string };
  common: {
    back: string;
    researchOnly: string;
    disclaimerLong: string;
    loading: string;
    save: string;
    cancel: string;
    refresh: string;
    viewAll: string;
    liveQuote: string;
    sampleData: string;
    gold: string;
    sampleNotice: string;
    liveVia: string;
  };
  login: {
    eyebrow: string;
    title: string;
    blurb: string;
    selectProfile: string;
    pinFor: string;
    enterPin: string;
    signIn: string;
    selectFirst: string;
    disclaimer: string;
  };
  today: {
    noCallTitle: string;
    noCallDesc: string;
    runDesk: string;
    refreshCall: string;
    readBrief: string;
    goldResult: string;
    riskBrake: string;
    deskAgree: string;
    lean: string;
    howSure: string;
    edgeQuality: string;
    riskTemp: string;
    expectedSwing: string;
    leadingPath: string;
    intelligence: string;
    intelligenceHint: string;
    catalyst: string;
    dissent: string;
    specialistTakes: string;
    floor: string;
    ceiling: string;
    stop: string;
    whoBuilt: string;
    tapAgent: string;
    whyDesk: string;
    bigPicture: string;
    newsTone: string;
    doSimple: string;
    dont: string;
    cool: string;
    warm: string;
    hot: string;
  };
  guide: {
    whatToDo: string;
    doThis: string;
    watchThis: string;
    standDownIf: string;
    newsMeaning: string;
    disclaimer: string;
  };
  news: {
    title: string;
    subtitle: string;
    helps: string;
    hurts: string;
    mixed: string;
    forGold: string;
    empty: string;
  };
  agents: {
    eyebrow: string;
    title: string;
    description: string;
    backToday: string;
  };
  history: {
    eyebrow: string;
    title: string;
    description: string;
    gradeYesterday: string;
    scoring: string;
    hits: string;
    misses: string;
    pending: string;
    all: string;
    days: string;
    hitRate: string;
    hint: string;
    emptyTitle: string;
    emptyDesc: string;
    awaitingGrade: string;
  };
  you: {
    eyebrow: string;
    description: string;
    language: string;
    languageHint: string;
    changePin: string;
    signOut: string;
    howTo: string;
    currentPin: string;
    newPin: string;
    confirmPin: string;
    dataHealth: string;
    storage: string;
    durable: string;
    ephemeral: string;
    feedsReady: string;
    feedsIssues: string;
  };
  run: {
    eyebrow: string;
    title: string;
    description: string;
    live: string;
    done: string;
    stopped: string;
    error: string;
    progress: string;
    cancel: string;
    runAgain: string;
    seeResult: string;
    openBrief: string;
  };
  brief: {
    eyebrow: string;
    title: string;
    description: string;
    emptyTitle: string;
    emptyDesc: string;
  };
  bias: {
    bullishTitle: string;
    bearishTitle: string;
    rangeTitle: string;
    leanUp: string;
    leanDown: string;
    wait: string;
    mildlyBullish: string;
    mildlyBearish: string;
    rangeWait: string;
  };
};

export const en: Dictionary = {
  brand: {
    tagline: "Private gold research desk for Salah & Rayane",
    privateDesk: "Private desk",
  },
  nav: { today: "Today", agents: "Agents", history: "History", you: "You", run: "Run" },
  common: {
    back: "Back",
    researchOnly: "Research desk only — not financial advice. No auto-trading.",
    disclaimerLong:
      "Goldbook is a private research desk for Salah & Rayane. It does not execute trades and is not financial advice.",
    loading: "Loading…",
    save: "Save",
    cancel: "Cancel",
    refresh: "Refresh",
    viewAll: "View all",
    liveQuote: "Live quote",
    sampleData: "Sample data",
    gold: "Gold",
    sampleNotice: "Showing sample market data. Add API keys in .env.local for live quotes.",
    liveVia: "Live via",
  },
  login: {
    eyebrow: "Private desk",
    title: "Goldbook",
    blurb:
      "Gold research for Salah & Rayane. Pick your profile, enter your 4-digit PIN, then read today’s gold call in plain words.",
    selectProfile: "1 · Select profile",
    pinFor: "2 · PIN for",
    enterPin: "Enter your 4-digit PIN",
    signIn: "Sign in",
    selectFirst: "Select your profile first",
    disclaimer: "Research desk only — not financial advice. No auto-trading.",
  },
  today: {
    noCallTitle: "No gold call yet",
    noCallDesc: "Run the desk to get a plain “what to do for gold” plus news explained simply.",
    runDesk: "Run desk",
    refreshCall: "Refresh gold call",
    readBrief: "Read full gold brief",
    goldResult: "Today’s gold result",
    riskBrake: "Risk brake on",
    deskAgree: "desk agree",
    lean: "Lean",
    howSure: "How sure",
    edgeQuality: "Edge quality",
    riskTemp: "Risk temp",
    expectedSwing: "Expected swing today",
    leadingPath: "Leading path",
    intelligence: "Intelligence · what’s driving gold",
    intelligenceHint: "Ranked signals the desk fused at once — hard for one person to track live.",
    catalyst: "Catalyst",
    dissent: "Dissent",
    specialistTakes: "Specialist takes",
    floor: "Floor",
    ceiling: "Ceiling",
    stop: "Stop",
    whoBuilt: "Who built this gold call",
    tapAgent: "Tap a name for their job & take",
    whyDesk: "Why the desk thinks this",
    bigPicture: "Big picture",
    newsTone: "News tone",
    doSimple: "Do (simple)",
    dont: "Don’t",
    cool: "cool",
    warm: "warm",
    hot: "hot",
  },
  guide: {
    whatToDo: "What to do for gold",
    doThis: "Do this",
    watchThis: "Watch this",
    standDownIf: "Stand down if",
    newsMeaning: "News · what it means for gold",
    disclaimer:
      "Research only — not financial advice. “What to do” means how to read the desk call, not an order to buy or sell.",
  },
  news: {
    title: "News for gold · plain words",
    subtitle: "What today’s headlines mean",
    helps: "Helps gold = supportive tone",
    hurts: "Hurts gold = pressure tone",
    mixed: "Mixed = noise / unclear",
    forGold: "For gold",
    empty: "No scored headlines yet. Run the desk so Iris can read today’s news for gold.",
  },
  agents: {
    eyebrow: "Agents",
    title: "Who’s on the desk",
    description: "Six people, six jobs. Tap one to see what they watch and what they think today — in plain words.",
    backToday: "Back to Today",
  },
  history: {
    eyebrow: "History",
    title: "Past gold calls",
    description: "See which days the desk got right. Hit = lean matched gold’s move. Miss = it didn’t.",
    gradeYesterday: "Grade yesterday",
    scoring: "Scoring…",
    hits: "Hits",
    misses: "Misses",
    pending: "Pending",
    all: "All",
    days: "Days",
    hitRate: "Hit rate",
    hint: "Hit = the desk lean matched how gold actually moved. Miss = it didn’t. Pending = not graded yet.",
    emptyTitle: "Nothing in this filter",
    emptyDesc: "Try All, or run the desk and grade more days to fill History.",
    awaitingGrade: "Awaiting grade",
  },
  you: {
    eyebrow: "You",
    description: "Your profile, PIN, language, and sign out.",
    language: "Language",
    languageHint: "English, Français, or العربية — the whole desk follows your choice.",
    changePin: "Change PIN",
    signOut: "Sign out",
    howTo: "How to use Goldbook",
    currentPin: "Current PIN",
    newPin: "New PIN",
    confirmPin: "Confirm new PIN",
    dataHealth: "Data & storage",
    storage: "Storage",
    durable: "Durable (Supabase / KV)",
    ephemeral: "Ephemeral (this instance only)",
    feedsReady: "Feeds look ready",
    feedsIssues: "Issues to fix",
  },
  run: {
    eyebrow: "Desk run",
    title: "Ask the desk about gold",
    description: "Six agents check the dollar, chart, news, crowding, and risk. Aurelia writes one plain call.",
    live: "Live",
    done: "Done",
    stopped: "Stopped",
    error: "Error",
    progress: "Progress",
    cancel: "Cancel run",
    runAgain: "Run again",
    seeResult: "See today’s gold result",
    openBrief: "Open full brief",
  },
  brief: {
    eyebrow: "Daily brief",
    title: "Today’s brief",
    description: "Start with “In plain words”. Then check floor, ceiling, and stop line.",
    emptyTitle: "No brief for today yet",
    emptyDesc: "Run the desk so Aurelia and the specialists can publish today’s call.",
  },
  bias: {
    bullishTitle: "Gold looks a bit stronger today",
    bearishTitle: "Gold looks a bit weaker today",
    rangeTitle: "Gold looks stuck — better to wait",
    leanUp: "Lean up",
    leanDown: "Lean down",
    wait: "Wait",
    mildlyBullish: "Mildly bullish",
    mildlyBearish: "Mildly bearish",
    rangeWait: "Range / wait",
  },
};

export const fr: Dictionary = {
  brand: {
    tagline: "Bureau privé de recherche sur l’or pour Salah & Rayane",
    privateDesk: "Bureau privé",
  },
  nav: { today: "Aujourd’hui", agents: "Agents", history: "Historique", you: "Vous", run: "Lancer" },
  common: {
    back: "Retour",
    researchOnly: "Bureau de recherche uniquement — pas un conseil financier. Pas de trading auto.",
    disclaimerLong:
      "Goldbook est un bureau de recherche privé pour Salah & Rayane. Il n’exécute pas de trades et n’est pas un conseil financier.",
    loading: "Chargement…",
    save: "Enregistrer",
    cancel: "Annuler",
    refresh: "Actualiser",
    viewAll: "Tout voir",
    liveQuote: "Cours en direct",
    sampleData: "Données d’exemple",
    gold: "Or",
    sampleNotice:
      "Données de marché d’exemple. Ajoutez des clés API dans .env.local pour les cours en direct.",
    liveVia: "En direct via",
  },
  login: {
    eyebrow: "Bureau privé",
    title: "Goldbook",
    blurb:
      "Recherche sur l’or pour Salah & Rayane. Choisissez votre profil, entrez votre code à 4 chiffres, puis lisez l’appel du jour en mots simples.",
    selectProfile: "1 · Choisir le profil",
    pinFor: "2 · Code pour",
    enterPin: "Entrez votre code à 4 chiffres",
    signIn: "Se connecter",
    selectFirst: "Choisissez d’abord votre profil",
    disclaimer: "Bureau de recherche uniquement — pas un conseil financier. Pas de trading auto.",
  },
  today: {
    noCallTitle: "Pas encore d’appel sur l’or",
    noCallDesc: "Lancez le bureau pour obtenir un “que faire pour l’or” clair et les infos expliquées simplement.",
    runDesk: "Lancer le bureau",
    refreshCall: "Actualiser l’appel",
    readBrief: "Lire le brief complet",
    goldResult: "Résultat or du jour",
    riskBrake: "Frein risque activé",
    deskAgree: "d’accord au bureau",
    lean: "Biais",
    howSure: "Confiance",
    edgeQuality: "Qualité du signal",
    riskTemp: "Risque",
    expectedSwing: "Variation typique du jour",
    leadingPath: "Scénario principal",
    intelligence: "Intelligence · ce qui pousse l’or",
    intelligenceHint: "Signaux classés que le bureau fusionne d’un coup — difficile à suivre seul en direct.",
    catalyst: "Catalyseur",
    dissent: "Désaccord",
    specialistTakes: "Avis des spécialistes",
    floor: "Plancher",
    ceiling: "Plafond",
    stop: "Stop",
    whoBuilt: "Qui a construit cet appel",
    tapAgent: "Touchez un nom pour son rôle et son avis",
    whyDesk: "Pourquoi le bureau pense cela",
    bigPicture: "Vue d’ensemble",
    newsTone: "Ton des infos",
    doSimple: "À faire (simple)",
    dont: "À éviter",
    cool: "calme",
    warm: "chaud",
    hot: "très chaud",
  },
  guide: {
    whatToDo: "Que faire pour l’or",
    doThis: "Faites ceci",
    watchThis: "Surveillez ceci",
    standDownIf: "Arrêtez si",
    newsMeaning: "Infos · ce que ça veut dire pour l’or",
    disclaimer:
      "Recherche uniquement — pas un conseil financier. “Que faire” explique l’appel du bureau, ce n’est pas un ordre d’achat ou de vente.",
  },
  news: {
    title: "Infos pour l’or · mots simples",
    subtitle: "Ce que les titres du jour veulent dire",
    helps: "Aide l’or = ton favorable",
    hurts: "Pèse sur l’or = ton de pression",
    mixed: "Mitigé = bruit / flou",
    forGold: "Pour l’or",
    empty: "Pas encore de titres notés. Lancez le bureau pour qu’Iris lise les infos du jour.",
  },
  agents: {
    eyebrow: "Agents",
    title: "Qui est au bureau",
    description: "Six personnes, six rôles. Touchez-en un pour voir ce qu’il surveille et ce qu’il pense aujourd’hui.",
    backToday: "Retour à Aujourd’hui",
  },
  history: {
    eyebrow: "Historique",
    title: "Appels passés sur l’or",
    description: "Voyez les jours où le bureau a eu raison. Hit = le biais a suivi le mouvement. Miss = non.",
    gradeYesterday: "Noter hier",
    scoring: "Notation…",
    hits: "Hits",
    misses: "Misses",
    pending: "En attente",
    all: "Tout",
    days: "Jours",
    hitRate: "Taux de réussite",
    hint: "Hit = le biais du bureau a suivi le mouvement de l’or. Miss = non. En attente = pas encore noté.",
    emptyTitle: "Rien dans ce filtre",
    emptyDesc: "Essayez Tout, ou lancez le bureau et notez plus de jours pour remplir l’historique.",
    awaitingGrade: "En attente de note",
  },
  you: {
    eyebrow: "Vous",
    description: "Profil, code PIN, langue et déconnexion.",
    language: "Langue",
    languageHint: "English, Français ou العربية — tout le bureau suit votre choix.",
    changePin: "Changer le PIN",
    signOut: "Se déconnecter",
    howTo: "Comment utiliser Goldbook",
    currentPin: "PIN actuel",
    newPin: "Nouveau PIN",
    confirmPin: "Confirmer le PIN",
    dataHealth: "Données et stockage",
    storage: "Stockage",
    durable: "Durable (Supabase / KV)",
    ephemeral: "Éphémère (cette instance seulement)",
    feedsReady: "Flux prêts",
    feedsIssues: "Points à corriger",
  },
  run: {
    eyebrow: "Lancement",
    title: "Demandez au bureau sur l’or",
    description: "Six agents regardent le dollar, le graphique, les infos, la foule et le risque. Aurelia écrit un appel simple.",
    live: "En cours",
    done: "Terminé",
    stopped: "Arrêté",
    error: "Erreur",
    progress: "Progression",
    cancel: "Annuler",
    runAgain: "Relancer",
    seeResult: "Voir le résultat or du jour",
    openBrief: "Ouvrir le brief",
  },
  brief: {
    eyebrow: "Brief du jour",
    title: "Brief d’aujourd’hui",
    description: "Commencez par les mots simples. Puis plancher, plafond et ligne stop.",
    emptyTitle: "Pas encore de brief aujourd’hui",
    emptyDesc: "Lancez le bureau pour qu’Aurelia publie l’appel du jour.",
  },
  bias: {
    bullishTitle: "L’or paraît un peu plus fort aujourd’hui",
    bearishTitle: "L’or paraît un peu plus faible aujourd’hui",
    rangeTitle: "L’or paraît bloqué — mieux vaut attendre",
    leanUp: "Biais haussier",
    leanDown: "Biais baissier",
    wait: "Attendre",
    mildlyBullish: "Légèrement haussier",
    mildlyBearish: "Légèrement baissier",
    rangeWait: "Range / attendre",
  },
};

export const ar: Dictionary = {
  brand: {
    tagline: "مكتب بحث خاص عن الذهب لصلاح وريان",
    privateDesk: "مكتب خاص",
  },
  nav: { today: "اليوم", agents: "الوكلاء", history: "السجل", you: "أنت", run: "تشغيل" },
  common: {
    back: "رجوع",
    researchOnly: "مكتب بحث فقط — ليس نصيحة مالية. لا تداول آلي.",
    disclaimerLong:
      "Goldbook مكتب بحث خاص لصلاح وريان. لا ينفّذ صفقات وليس نصيحة مالية.",
    loading: "جاري التحميل…",
    save: "حفظ",
    cancel: "إلغاء",
    refresh: "تحديث",
    viewAll: "عرض الكل",
    liveQuote: "سعر مباشر",
    sampleData: "بيانات تجريبية",
    gold: "الذهب",
    sampleNotice: "بيانات سوق تجريبية. أضف مفاتيح API في .env.local للأسعار المباشرة.",
    liveVia: "مباشر عبر",
  },
  login: {
    eyebrow: "مكتب خاص",
    title: "Goldbook",
    blurb:
      "بحث عن الذهب لصلاح وريان. اختر ملفك، أدخل الرمز من 4 أرقام، ثم اقرأ نداء اليوم بكلمات بسيطة.",
    selectProfile: "1 · اختر الملف",
    pinFor: "2 · الرمز لـ",
    enterPin: "أدخل الرمز من 4 أرقام",
    signIn: "دخول",
    selectFirst: "اختر ملفك أولاً",
    disclaimer: "مكتب بحث فقط — ليس نصيحة مالية. لا تداول آلي.",
  },
  today: {
    noCallTitle: "لا يوجد نداء ذهب بعد",
    noCallDesc: "شغّل المكتب لتحصل على “ماذا تفعل للذهب” بوضوح مع شرح الأخبار ببساطة.",
    runDesk: "تشغيل المكتب",
    refreshCall: "تحديث النداء",
    readBrief: "قراءة الملخص الكامل",
    goldResult: "نتيجة الذهب اليوم",
    riskBrake: "فرامل المخاطر مفعّلة",
    deskAgree: "اتفاق المكتب",
    lean: "الميل",
    howSure: "مستوى الثقة",
    edgeQuality: "جودة الإشارة",
    riskTemp: "درجة المخاطر",
    expectedSwing: "التذبذب المتوقع اليوم",
    leadingPath: "المسار الأرجح",
    intelligence: "الذكاء · ما الذي يحرّك الذهب",
    intelligenceHint: "إشارات مرتّبة يدمجها المكتب دفعة واحدة — يصعب على شخص واحد متابعتها مباشرة.",
    catalyst: "المحفّز",
    dissent: "اعتراض",
    specialistTakes: "آراء المتخصصين",
    floor: "الأرضية",
    ceiling: "السقف",
    stop: "وقف",
    whoBuilt: "من بنى هذا النداء",
    tapAgent: "اضغط اسماً لترى دوره ورأيه",
    whyDesk: "لماذا يرى المكتب ذلك",
    bigPicture: "الصورة الكبيرة",
    newsTone: "نبرة الأخبار",
    doSimple: "افعل (ببساطة)",
    dont: "لا تفعل",
    cool: "هادئ",
    warm: "دافئ",
    hot: "ساخن",
  },
  guide: {
    whatToDo: "ماذا تفعل للذهب",
    doThis: "افعل هذا",
    watchThis: "راقب هذا",
    standDownIf: "توقف إذا",
    newsMeaning: "الأخبار · ماذا تعني للذهب",
    disclaimer:
      "بحث فقط — ليس نصيحة مالية. “ماذا تفعل” يشرح نداء المكتب، وليس أمراً بالشراء أو البيع.",
  },
  news: {
    title: "أخبار الذهب · بكلمات بسيطة",
    subtitle: "ماذا تعني عناوين اليوم",
    helps: "يساعد الذهب = نبرة داعمة",
    hurts: "يضغط على الذهب = نبرة ضغط",
    mixed: "مختلط = ضوضاء / غير واضح",
    forGold: "للذهب",
    empty: "لا عناوين مُقيَّمة بعد. شغّل المكتب ليقرأ Iris أخبار اليوم.",
  },
  agents: {
    eyebrow: "الوكلاء",
    title: "من في المكتب",
    description: "ستة أشخاص، ست مهام. اضغط واحداً لترى ماذا يراقب وماذا يفكر اليوم.",
    backToday: "العودة إلى اليوم",
  },
  history: {
    eyebrow: "السجل",
    title: "نداءات الذهب السابقة",
    description: "أيام أصاب فيها المكتب. إصابة = الميل طابق حركة الذهب. خطأ = لم يطابق.",
    gradeYesterday: "قيّم أمس",
    scoring: "جاري التقييم…",
    hits: "إصابات",
    misses: "أخطاء",
    pending: "قيد الانتظار",
    all: "الكل",
    days: "أيام",
    hitRate: "نسبة الإصابة",
    hint: "إصابة = ميل المكتب طابق حركة الذهب. خطأ = لم يطابق. قيد الانتظار = لم يُقيَّم بعد.",
    emptyTitle: "لا شيء في هذا الفلتر",
    emptyDesc: "جرّب الكل، أو شغّل المكتب وقيّم أياماً أكثر لملء السجل.",
    awaitingGrade: "بانتظار التقييم",
  },
  you: {
    eyebrow: "أنت",
    description: "ملفك، الرمز، اللغة، وتسجيل الخروج.",
    language: "اللغة",
    languageHint: "English أو Français أو العربية — المكتب كله يتبع اختيارك.",
    changePin: "تغيير الرمز",
    signOut: "تسجيل الخروج",
    howTo: "كيف تستخدم Goldbook",
    currentPin: "الرمز الحالي",
    newPin: "الرمز الجديد",
    confirmPin: "تأكيد الرمز",
    dataHealth: "البيانات والتخزين",
    storage: "التخزين",
    durable: "دائم (Supabase / KV)",
    ephemeral: "مؤقت (هذه النسخة فقط)",
    feedsReady: "المصادر جاهزة",
    feedsIssues: "مشكلات يجب إصلاحها",
  },
  run: {
    eyebrow: "تشغيل المكتب",
    title: "اسأل المكتب عن الذهب",
    description: "ستة وكلاء يفحصون الدولار والرسم والأخبار والزحام والمخاطر. Aurelia تكتب نداءً بسيطاً.",
    live: "جاري",
    done: "تم",
    stopped: "توقف",
    error: "خطأ",
    progress: "التقدم",
    cancel: "إلغاء التشغيل",
    runAgain: "أعد التشغيل",
    seeResult: "شاهد نتيجة الذهب اليوم",
    openBrief: "افتح الملخص الكامل",
  },
  brief: {
    eyebrow: "الملخص اليومي",
    title: "ملخص اليوم",
    description: "ابدأ بالكلمات البسيطة. ثم الأرضية والسقف وخط الوقف.",
    emptyTitle: "لا ملخص لليوم بعد",
    emptyDesc: "شغّل المكتب لتنشر Aurelia نداء اليوم.",
  },
  bias: {
    bullishTitle: "الذهب يبدو أقوى قليلاً اليوم",
    bearishTitle: "الذهب يبدو أضعف قليلاً اليوم",
    rangeTitle: "الذهب يبدو عالقاً — الأفضل الانتظار",
    leanUp: "ميل صاعد",
    leanDown: "ميل هابط",
    wait: "انتظار",
    mildlyBullish: "صاعد بخفة",
    mildlyBearish: "هابط بخفة",
    rangeWait: "نطاق / انتظار",
  },
};

const map: Record<Locale, Dictionary> = { en, fr, ar };

export function getDictionary(locale: Locale): Dictionary {
  return map[locale] ?? en;
}
