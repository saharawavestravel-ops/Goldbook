import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Bias } from "@/lib/today-shared";

export function biasTitleFromDict(bias: Bias, dict: Dictionary) {
  if (bias === "bullish") return dict.bias.bullishTitle;
  if (bias === "bearish") return dict.bias.bearishTitle;
  return dict.bias.rangeTitle;
}

export function biasSimpleFromDict(bias: Bias, dict: Dictionary) {
  if (bias === "bullish") return dict.bias.leanUp;
  if (bias === "bearish") return dict.bias.leanDown;
  return dict.bias.wait;
}

export function biasFullFromDict(bias: Bias, dict: Dictionary) {
  if (bias === "bullish") return dict.bias.mildlyBullish;
  if (bias === "bearish") return dict.bias.mildlyBearish;
  return dict.bias.rangeWait;
}

export function numberLocale(locale: string) {
  if (locale === "fr") return "fr-FR";
  if (locale === "ar") return "ar";
  return "en-US";
}
