const GOLD_KEYWORDS = [
  "gold",
  "xau",
  "bullion",
  "fed",
  "federal reserve",
  "interest rate",
  "yield",
  "treasury",
  "dollar",
  "dxy",
  "inflation",
  "cpi",
  "geopolit",
  "war",
  "sanction",
  "central bank",
  "ecb",
  "safe haven",
  "precious metal",
];

const BULLISH_HINTS = [
  "rate cut",
  "dovish",
  "weak dollar",
  "safe haven",
  "escalat",
  "war",
  "buy gold",
  "record high",
];

const BEARISH_HINTS = [
  "rate hike",
  "hawkish",
  "strong dollar",
  "yields rise",
  "risk on",
  "sell gold",
  "profit taking",
];

export function isGoldRelevant(title: string) {
  const text = title.toLowerCase();
  return GOLD_KEYWORDS.some((keyword) => text.includes(keyword));
}

export function scoreHeadline(title: string) {
  const text = title.toLowerCase();
  if (!isGoldRelevant(text)) {
    return { score: 0, reasons: [] as string[] };
  }

  let score = 0.15;
  const reasons: string[] = ["gold-relevant"];

  for (const hint of BULLISH_HINTS) {
    if (text.includes(hint)) {
      score += 0.2;
      reasons.push(`+ ${hint}`);
    }
  }
  for (const hint of BEARISH_HINTS) {
    if (text.includes(hint)) {
      score -= 0.2;
      reasons.push(`− ${hint}`);
    }
  }

  if (text.includes("gold")) {
    score += 0.1;
    reasons.push("mentions gold");
  }

  return {
    score: Math.max(-1, Math.min(1, Math.round(score * 100) / 100)),
    reasons,
  };
}

export function averageSentiment(scores: number[]) {
  if (scores.length === 0) return 0;
  // Recency-weighted: earlier list items (usually newer) get more weight
  let weightSum = 0;
  let weighted = 0;
  scores.forEach((score, index) => {
    const weight = 1 / (1 + index * 0.35);
    weighted += score * weight;
    weightSum += weight;
  });
  return Math.round((weighted / weightSum) * 100) / 100;
}
