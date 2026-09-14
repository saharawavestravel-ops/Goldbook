import type { Bias, DailyBriefPreview } from "@/lib/today-shared";
import { simplifyJargon } from "@/lib/plain-language";
import type { HomeIntel } from "@/lib/home-intel";
import type { Locale } from "@/lib/i18n/locales";

export type WhatToDoPack = {
  headline: string;
  oneLine: string;
  forGold: string[];
  watch: string[];
  stopIf: string;
  newsMeaning: string;
};

function newsMeaningPlain(preview: DailyBriefPreview, locale: Locale): string {
  const narrative = simplifyJargon(preview.newsNarrative || "");
  const top = preview.topHeadlines[0];
  if (!preview.topHeadlines.length && !narrative) {
    if (locale === "fr") {
      return "Pas encore de titres notés. Lancez le bureau pour qu’Iris lise les infos du jour pour l’or.";
    }
    if (locale === "ar") {
      return "لا عناوين مُقيَّمة بعد. شغّل المكتب ليقرأ Iris أخبار اليوم للذهب.";
    }
    return "No scored headlines yet. Run the desk so Iris can read today’s news for gold.";
  }

  const scores = preview.topHeadlines.map((h) => h.score);
  const avg =
    scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;

  let tone: string;
  if (locale === "fr") {
    tone =
      avg >= 0.2
        ? "Dans l’ensemble, les infos du jour aident un peu l’or."
        : avg <= -0.2
          ? "Dans l’ensemble, les infos du jour pèsent un peu sur l’or."
          : "Dans l’ensemble, les infos sont mitigées — pas de poussée claire pour l’or.";
  } else if (locale === "ar") {
    tone =
      avg >= 0.2
        ? "إجمالاً، أخبار اليوم تميل لمساعدة الذهب قليلاً."
        : avg <= -0.2
          ? "إجمالاً، أخبار اليوم تميل للضغط على الذهب قليلاً."
          : "إجمالاً، الأخبار مختلطة — لا دفعة واضحة للذهب.";
  } else {
    tone =
      avg >= 0.2
        ? "Overall, today’s news leans a bit helpful for gold."
        : avg <= -0.2
          ? "Overall, today’s news leans a bit heavy against gold."
          : "Overall, today’s news is mixed — no single clean push for gold.";
  }

  const example = top
    ? locale === "fr"
      ? ` Histoire principale : « ${top.title} » (${top.source}).`
      : locale === "ar"
        ? ` القصة الرئيسية: «${top.title}» (${top.source}).`
        : ` Main story to know: “${top.title}” (${top.source}).`
    : "";

  const deskNote =
    narrative
      ? locale === "fr"
        ? ` Note du bureau : ${narrative}`
        : locale === "ar"
          ? ` ملاحظة المكتب: ${narrative}`
          : ` Desk note: ${narrative}`
      : "";

  return `${tone}${example}${deskNote}`;
}

/** Crystal-clear “what to do for gold” — research only. */
export function buildWhatToDoForGold(
  preview: DailyBriefPreview,
  intel?: HomeIntel | null,
  locale: Locale = "en",
): WhatToDoPack {
  const floor = preview.levels.support;
  const ceiling = preview.levels.watch;
  const stop = preview.levels.invalidation;
  const bias: Bias = preview.bias;
  const newsMeaning = newsMeaningPlain(preview, locale);

  if (preview.vetoApplied) {
    if (locale === "fr") {
      return {
        headline: "Attendez sur l’or aujourd’hui",
        oneLine:
          "Le risque est élevé. Le bon geste pour l’or aujourd’hui : attendre — ne forcez pas un biais.",
        forGold: [
          "Ne prenez pas de direction sur l’or pour l’instant.",
          "Surveillez plancher et plafond, mais ne courez pas derrière le prix.",
          "Revenez quand le marché se calme, ou après un nouveau lancement.",
        ],
        watch: [
          `Plancher autour de ${floor}`,
          `Plafond autour de ${ceiling}`,
          "Si les infos de risque se calment",
        ],
        stopIf: `Si l’or clôture sous ${stop}, restez totalement plat — l’idée est invalidée.`,
        newsMeaning,
      };
    }
    if (locale === "ar") {
      return {
        headline: "انتظر الذهب اليوم",
        oneLine: "المخاطر مرتفعة. القرار الذكي للذهب اليوم: الانتظار — لا تفرض ميلاً.",
        forGold: [
          "لا تأخذ اتجاهاً على الذهب الآن.",
          "راقب الأرضية والسقف، لكن لا تطارد السعر.",
          "عد بعد هدوء السوق، أو بعد تشغيل جديد للمكتب.",
        ],
        watch: [
          `الأرضية حول ${floor}`,
          `السقف حول ${ceiling}`,
          "هل تهدأ أخبار المخاطر",
        ],
        stopIf: `إذا أغلق الذهب تحت ${stop}، ابقَ مسطحاً تماماً — الفكرة ملغاة.`,
        newsMeaning,
      };
    }
    return {
      headline: "Wait on gold today",
      oneLine:
        "Risk is high. The smart move for gold today is to wait — not force a lean.",
      forGold: [
        "Do nothing directional on gold for now.",
        "Keep watching Floor and Ceiling, but don’t chase.",
        "Come back after the tape calms, or after a fresh desk run.",
      ],
      watch: [
        `Floor around ${floor}`,
        `Ceiling around ${ceiling}`,
        "Whether risk news cools down",
      ],
      stopIf: `If gold closes under ${stop}, stay fully flat — idea is off.`,
      newsMeaning,
    };
  }

  if (bias === "bullish") {
    if (locale === "fr") {
      return {
        headline: "Légère hausse sur l’or — restez simple",
        oneLine:
          "Si vous suivez le bureau : pensez légère montée, seulement tant que le plancher tient.",
        forGold: [
          `Respectez une idée légère à la hausse seulement tant que l’or reste au-dessus de ~${floor} (Plancher).`,
          `Surveillez une poussée vers ~${ceiling} (Plafond) — pas de fusée.`,
          "Gardez une taille petite. C’est un biais léger, pas une certitude.",
          "Si vous doutez — attendre est toujours permis.",
        ],
        watch: [
          `Le plancher (~${floor}) tient-il sur les baisses ?`,
          intel?.catalyst ? `Infos : ${intel.catalyst}` : "Si les infos favorables restent ou s’estompent",
          `Ligne stop ~${stop}`,
        ],
        stopIf: `Si l’or clôture sous ~${stop}, l’idée légère à la hausse est fausse. Arrêtez.`,
        newsMeaning,
      };
    }
    if (locale === "ar") {
      return {
        headline: "ميل صاعد خفيف على الذهب — ابقَ بسيطاً",
        oneLine: "إذا تابعت المكتب: فكّر بصعود خفيف، فقط طالما الأرضية تصمد.",
        forGold: [
          `احترم فكرة الصعود الخفيف فقط طالما الذهب فوق ~${floor} (الأرضية).`,
          `راقب دفعاً نحو ~${ceiling} (السقف) — لا تتوقع انطلاقاً صاروخياً.`,
          "أبقِ الحجم صغيراً. هذا ميل خفيف وليس يقيناً.",
          "إن كنت غير متأكد — الانتظار مسموح دائماً.",
        ],
        watch: [
          `هل تصمد الأرضية (~${floor}) عند الهبوط؟`,
          intel?.catalyst ? `أخبار: ${intel.catalyst}` : "هل تبقى الأخبار الداعمة أو تتلاشى",
          `خط الوقف ~${stop}`,
        ],
        stopIf: `إذا أغلق الذهب تحت ~${stop}، فكرة الصعود الخفيف خاطئة. توقّف.`,
        newsMeaning,
      };
    }
    return {
      headline: "Soft up on gold — keep it simple",
      oneLine:
        "If you follow the desk: think mild grind higher, only while the floor holds.",
      forGold: [
        `Respect a soft-up idea only while gold holds above ~${floor} (Floor).`,
        `Watch for a push toward ~${ceiling} (Ceiling) — don’t expect a moonshot.`,
        "Keep size small. This is a mild lean, not a sure thing.",
        "If you are unsure — waiting is always allowed.",
      ],
      watch: [
        `Does the Floor (~${floor}) keep holding on dips?`,
        intel?.catalyst ? `News: ${intel.catalyst}` : "Whether helpful news fades or stays hot",
        `Stop line ~${stop}`,
      ],
      stopIf: `If gold closes under ~${stop}, the soft-up idea is wrong. Stand down.`,
      newsMeaning,
    };
  }

  if (bias === "bearish") {
    if (locale === "fr") {
      return {
        headline: "Légère baisse sur l’or — restez simple",
        oneLine:
          "Si vous suivez le bureau : pensez légère baisse, et ne courez pas près du plafond.",
        forGold: [
          `Respectez une idée légère à la baisse tant que l’or reste sous ~${ceiling} (Plafond).`,
          `Surveillez un glissement vers ~${floor} (Plancher) — pas un krach.`,
          "Gardez une taille petite. Les infos peuvent inverser un biais léger vite.",
          "Si vous doutez — attendre est toujours permis.",
        ],
        watch: [
          `L’or échoue-t-il sous le plafond (~${ceiling}) ?`,
          intel?.catalyst ? `Infos : ${intel.catalyst}` : "Si les infos lourdes continuent de peser",
          `Ligne stop ~${stop}`,
        ],
        stopIf: `Si l’or clôture sous ~${stop}, traitez-le comme risque fort — arrêtez et remappez.`,
        newsMeaning,
      };
    }
    if (locale === "ar") {
      return {
        headline: "ميل هابط خفيف على الذهب — ابقَ بسيطاً",
        oneLine: "إذا تابعت المكتب: فكّر بهبوط خفيف، ولا تطارد قرب السقف.",
        forGold: [
          `احترم فكرة الهبوط الخفيف طالما الذهب تحت ~${ceiling} (السقف).`,
          `راقب انزلاقاً نحو ~${floor} (الأرضية) — ليس نداء انهيار.`,
          "أبقِ الحجم صغيراً. الأخبار قد تعكس الميل الخفيف بسرعة.",
          "إن كنت غير متأكد — الانتظار مسموح دائماً.",
        ],
        watch: [
          `هل يفشل الذهب تحت السقف (~${ceiling})؟`,
          intel?.catalyst ? `أخبار: ${intel.catalyst}` : "هل تواصل الأخبار الثقيلة الضغط",
          `خط الوقف ~${stop}`,
        ],
        stopIf: `إذا أغلق الذهب تحت ~${stop}، اعتبره مخاطر عالية — توقّف وأعد الخريطة.`,
        newsMeaning,
      };
    }
    return {
      headline: "Soft down on gold — keep it simple",
      oneLine:
        "If you follow the desk: think mild ease lower, and don’t chase near the ceiling.",
      forGold: [
        `Respect a soft-down idea while gold stays capped under ~${ceiling} (Ceiling).`,
        `Watch for a slip toward ~${floor} (Floor) — not a crash call.`,
        "Keep size small. News can reverse a soft lean fast.",
        "If you are unsure — waiting is always allowed.",
      ],
      watch: [
        `Does gold fail under the Ceiling (~${ceiling})?`,
        intel?.catalyst ? `News: ${intel.catalyst}` : "Whether heavy news keeps pressing gold",
        `Stop line ~${stop}`,
      ],
      stopIf: `If gold closes under ~${stop}, treat it as hard risk — stand down and re-map.`,
      newsMeaning,
    };
  }

  if (locale === "fr") {
    return {
      headline: "Mode attente sur l’or",
      oneLine:
        "Pas d’avantage clair aujourd’hui. Souvent le mieux pour l’or : ne rien faire encore.",
      forGold: [
        "Restez plat mentalement — pas de biais forcé.",
        `Ne réagissez que si l’or tient clairement au-dessus de ~${ceiling} (alors haussier léger).`,
        `Ou clairement sous ~${floor} (alors baissier léger).`,
        "En attendant, surveiller est le travail.",
      ],
      watch: [
        `Cassure et maintien au-dessus du plafond ~${ceiling}`,
        `Cassure et maintien sous le plancher ~${floor}`,
        intel?.catalyst ? `Changement d’infos : ${intel.catalyst}` : "Une poussée d’infos plus claire",
      ],
      stopIf: `Si le prix devient chaotique autour de ~${stop}, restez plat et attendez un nouveau lancement.`,
      newsMeaning,
    };
  }

  if (locale === "ar") {
    return {
      headline: "وضع الانتظار على الذهب",
      oneLine: "لا ميزة واضحة اليوم. غالباً أفضل «ماذا تفعل للذهب»: لا تفعل شيئاً بعد.",
      forGold: [
        "ابقَ مسطحاً ذهنياً — بلا ميل مفروض.",
        `اهتم فقط إذا تماسك الذهب بوضوح فوق ~${ceiling} (عندها مرشح صعود خفيف).`,
        `أو بوضوح تحت ~${floor} (عندها مرشح هبوط خفيف).`,
        "حتى ذلك الحين، المراقبة هي المهمة.",
      ],
      watch: [
        `كسر وتماسك فوق السقف ~${ceiling}`,
        `كسر وتماسك تحت الأرضية ~${floor}`,
        intel?.catalyst ? `تحوّل أخبار: ${intel.catalyst}` : "دفعة أخبار أوضح بأي اتجاه",
      ],
      stopIf: `إذا أصبح السعر فوضوياً عبر ~${stop}، ابقَ مسطحاً وانتظر تشغيلاً جديداً.`,
      newsMeaning,
    };
  }

  return {
    headline: "Wait mode on gold",
    oneLine:
      "No clean edge today. The best “what to do for gold” is often: do nothing yet.",
    forGold: [
      "Stay mentally flat — no forced up or down lean.",
      `Only care if gold clearly holds above ~${ceiling} (then soft-up candidate).`,
      `Or clearly holds under ~${floor} (then soft-down candidate).`,
      "Until then, watching is the job.",
    ],
    watch: [
      `Break & hold above Ceiling ~${ceiling}`,
      `Break & hold under Floor ~${floor}`,
      intel?.catalyst ? `News shift: ${intel.catalyst}` : "A clearer news push either way",
    ],
    stopIf: `If price goes chaotic through ~${stop}, stay flat and wait for a new desk run.`,
    newsMeaning,
  };
}
