import { env, preferredLlm } from "@/lib/env";
import type { SpecialistReport } from "@/lib/engine/types";
import type { DeskFusion } from "@/lib/engine/fusion";
import type { MarketSnapshot } from "@/lib/market";
import type { ContextSnapshot } from "@/lib/context";
import { agents } from "@/lib/agents";
import { biasFromScore } from "@/lib/engine/scoring";
import type { Locale } from "@/lib/i18n/locales";
import { languageInstruction } from "@/lib/i18n/data";

type LlmProvider = "gemini" | "groq";

type SpecialistEnrichment = {
  agentId: string;
  take: string;
  plainVerdict?: string;
  watchNext?: string;
  /** Optional nudge in [-0.15, 0.15] applied to rules score */
  scoreDelta?: number;
  drivers?: string[];
};

const PERSONA: Record<string, string> = {
  marcus: "Marcus — macro: USD, yields, real yields, Fed path. Calm, precise.",
  nova: "Nova — technicals: structure, levels, ATR, session. Levels first.",
  iris: "Iris — news: only gold-moving headlines. Impact, not noise.",
  felix: "Felix — sentiment: crowding, exhaustion, whether the move is late.",
  vera: "Vera — risk: when not to press. Invalidation, volatility, conflict.",
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function extractJsonArray(text: string): unknown[] | null {
  const match = text.match(/\[[\s\S]*\]/);
  if (!match) return null;
  try {
    const parsed = JSON.parse(match[0]) as unknown;
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function extractJsonObject(text: string): Record<string, unknown> | null {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    const parsed = JSON.parse(match[0]) as unknown;
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? (parsed as Record<string, unknown>)
      : null;
  } catch {
    return null;
  }
}

async function callGemini(prompt: string, maxTokens = 1400): Promise<string> {
  const key = env.llm.geminiKey;
  if (!key) throw new Error("Gemini key missing");
  const model = env.llm.geminiModel;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.25,
        maxOutputTokens: maxTokens,
        responseMimeType: "application/json",
      },
    }),
  });
  if (!response.ok) throw new Error(`Gemini HTTP ${response.status}`);
  const data = (await response.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };
  const parts = data.candidates?.[0]?.content?.parts ?? [];
  return parts.map((part) => part.text ?? "").join("").trim();
}

async function callGroq(prompt: string, maxTokens = 1400): Promise<string> {
  const key = env.llm.groqKey;
  if (!key) throw new Error("Groq key missing");
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: env.llm.groqModel,
      temperature: 0.25,
      max_tokens: maxTokens,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You are the Goldbook desk intelligence layer. Reply with valid JSON only.",
        },
        { role: "user", content: prompt },
      ],
    }),
  });
  if (!response.ok) throw new Error(`Groq HTTP ${response.status}`);
  const data = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  return data.choices?.[0]?.message?.content ?? "";
}

async function callLlm(prompt: string, maxTokens = 1400): Promise<{ text: string; provider: LlmProvider }> {
  const preferred = preferredLlm();
  const order: LlmProvider[] =
    preferred === "groq" ? ["groq", "gemini"] : ["gemini", "groq"];

  const errors: string[] = [];
  for (const provider of order) {
    try {
      if (provider === "gemini" && env.llm.geminiKey) {
        return { text: await callGemini(prompt, maxTokens), provider };
      }
      if (provider === "groq" && env.llm.groqKey) {
        return { text: await callGroq(prompt, maxTokens), provider };
      }
    } catch (error) {
      errors.push(`${provider}: ${error instanceof Error ? error.message : "failed"}`);
    }
  }
  throw new Error(errors.join(" · ") || "No LLM available");
}

/**
 * Deepen specialist takes (and optional tiny score nudges) with LLM analysis.
 * Rules remain the spine — nudges are capped at ±0.15.
 */
export async function enrichSpecialistsWithLlm(
  reports: SpecialistReport[],
  market: MarketSnapshot,
  context: ContextSnapshot,
  locale: Locale = "en",
): Promise<{ reports: SpecialistReport[]; warnings: string[]; provider?: LlmProvider }> {
  if (!env.llm.geminiKey && !env.llm.groqKey) {
    return { reports, warnings: [] };
  }

  const prompt = `You are the intelligence layer for Goldbook, a private gold (XAUUSD) research desk (research only, not advice).

LANGUAGE RULE (mandatory): ${languageInstruction(locale)}

Audience: a beginner who does not know trading jargon. Write like a calm teacher.

For EACH specialist, write a take with EXACTLY this shape:
1) First sentence: plain words — what this means for gold today (higher lean / lower lean / wait).
2) Second sentence: the main reason, using everyday words (dollar, interest rates, chart floor/ceiling, news, crowding, risk).
3) Optional third sentence: one thing to watch.
Also return:
- plainVerdict: one short sentence
- watchNext: one concrete watch item for a beginner

If this agent disagrees with the others, say so clearly in plain words.
Do not invent fake data. Use only the market/macro/news provided.

Avoid: ATR, DXY, invalidation, basis points, “tape”, “regime” unless you immediately explain them in parentheses.
Keep their bias direction unless evidence clearly conflicts — then stay cautious.
Optional scoreDelta in [-0.15, 0.15] only if rules missed an obvious driver. Prefer 0.
drivers: 1–3 short plain phrases.

Personas (jobs in plain words):
- marcus: dollar & interest rates
- nova: gold chart levels & trend
- iris: news that can move gold
- felix: is everyone already piled into the same idea?
- vera: when it is safer to wait

Market:
${JSON.stringify({
  price: market.price,
  changePct: market.changePct,
  session: market.session,
  levels: market.levels,
  helpers: market.helpers,
  source: market.source,
})}

Macro:
${JSON.stringify({
  goldPressure: context.macro.goldPressure,
  narrative: context.macro.narrative,
  points: context.macro.points,
  source: context.macro.source,
})}

News:
${JSON.stringify({
  sentiment: context.news.sentiment,
  narrative: context.news.narrative,
  headlines: context.news.items.slice(0, 5).map((item) => ({
    title: item.title,
    score: item.score,
    source: item.source,
  })),
})}

Specialist rules output:
${JSON.stringify(
  reports.map((r) => ({
    agentId: r.agentId,
    bias: r.bias,
    score: r.score,
    confidence: r.confidence,
    take: r.take,
    persona: PERSONA[r.agentId],
    name: agents.find((a) => a.id === r.agentId)?.name,
  })),
)}

Return JSON object:
{"analyses":[{"agentId":"marcus","take":"...","plainVerdict":"...","watchNext":"...","scoreDelta":0,"drivers":["..."]}]}`;

  try {
    const { text, provider } = await callLlm(prompt, 1600);
    const obj = extractJsonObject(text);
    const list = (obj?.analyses as SpecialistEnrichment[] | undefined) ??
      (extractJsonArray(text) as SpecialistEnrichment[] | null);

    if (!list || list.length === 0) {
      return { reports, warnings: [`${provider} analysis returned no usable JSON`], provider };
    }

    const map = new Map(list.map((row) => [row.agentId, row]));

    const next = reports.map((report) => {
      const row = map.get(report.agentId);
      if (!row?.take) return report;

      const delta = clamp(Number(row.scoreDelta) || 0, -0.15, 0.15);
      const score = clamp(Math.round((report.score + delta) * 100) / 100, -1, 1);
      const bias = biasFromScore(score);
      const drivers =
        row.drivers && row.drivers.length > 0
          ? [{ label: "LLM drivers", detail: row.drivers.slice(0, 3).join(" · ") }]
          : [];

      return {
        ...report,
        score,
        bias,
        take: row.take.trim(),
        plainVerdict: row.plainVerdict?.trim() || report.plainVerdict,
        watchNext: row.watchNext?.trim() || report.watchNext,
        sources: [...report.sources, ...drivers],
        engine: "rules+llm" as const,
        confidence: clamp(
          report.confidence + (Math.abs(delta) > 0.05 ? 2 : 0),
          40,
          86,
        ),
      };
    });

    return { reports: next, warnings: [], provider };
  } catch (error) {
    return {
      reports,
      warnings: [error instanceof Error ? error.message : "LLM specialist analysis failed"],
    };
  }
}

/** Aurelia writes the desk call from fused numbers + specialist debate. */
export async function synthesizeAureliaWithLlm(
  fusion: DeskFusion,
  reports: SpecialistReport[],
  market: MarketSnapshot,
  locale: Locale = "en",
): Promise<{
  summary: string;
  take: string;
  plainTitle?: string;
  plainExplain?: string;
  warnings: string[];
  provider?: LlmProvider;
}> {
  if (!env.llm.geminiKey && !env.llm.groqKey) {
    return { summary: fusion.summary, take: fusion.aurelia.take, warnings: [] };
  }

  const prompt = `You are Aurelia, chief of the Goldbook gold research desk.

LANGUAGE RULE (mandatory): ${languageInstruction(locale)}

Write for a beginner who feels lost looking at trading screens.
Research only — no trade orders, no hype.

Rules:
- Respect fused bias (${fusion.bias}) and Vera risk brake (${fusion.veto.applied ? fusion.veto.reason : "none"}).
- Agreement is ${Math.round(fusion.agreement * 100)}%.
- Use everyday words. Prefer "lean higher / lean lower / wait" over bullish/bearish.
- Explain floor (support), ceiling (watch), stop line (invalidation) in plain words if you mention levels.

Return JSON:
{
  "plainTitle": "one short line a beginner understands",
  "plainExplain": "2–3 sentences: what is going on with gold today and what the desk thinks — zero jargon",
  "summary": "3–5 calm sentences for the daily brief (can be a bit richer)",
  "take": "Aurelia's signed note (editorial, still clear)"
}

Fused numbers:
${JSON.stringify({
  bias: fusion.bias,
  score: fusion.score,
  confidence: fusion.confidence,
  agreement: fusion.agreement,
  veto: fusion.veto,
  levels: fusion.levels,
  price: market.price,
  session: market.session,
})}

Specialists:
${JSON.stringify(
  reports.map((r) => ({
    agentId: r.agentId,
    bias: r.bias,
    score: r.score,
    take: r.take,
  })),
)}`;

  try {
    const { text, provider } = await callLlm(prompt, 1100);
    const obj = extractJsonObject(text);
    const summary = typeof obj?.summary === "string" ? obj.summary.trim() : "";
    const take = typeof obj?.take === "string" ? obj.take.trim() : summary;
    const plainTitle = typeof obj?.plainTitle === "string" ? obj.plainTitle.trim() : undefined;
    const plainExplain =
      typeof obj?.plainExplain === "string" ? obj.plainExplain.trim() : undefined;
    if (!summary) {
      return {
        summary: fusion.summary,
        take: fusion.aurelia.take,
        warnings: [`${provider} Aurelia synthesis returned empty summary`],
        provider,
      };
    }
    return {
      summary,
      take: take || summary,
      plainTitle,
      plainExplain,
      warnings: [],
      provider,
    };
  } catch (error) {
    return {
      summary: fusion.summary,
      take: fusion.aurelia.take,
      warnings: [error instanceof Error ? error.message : "Aurelia synthesis failed"],
    };
  }
}

/** @deprecated Prefer enrichSpecialistsWithLlm with market+context. */
export async function polishTakesWithLlm(
  reports: SpecialistReport[],
): Promise<{ reports: SpecialistReport[]; warnings: string[] }> {
  return { reports, warnings: [] };
}
