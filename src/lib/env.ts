/**
 * Server-side env access for Goldbook integrations.
 * Never import this into client components.
 */

function read(name: string) {
  const value = process.env[name]?.trim();
  return value ? value : undefined;
}

function present(name: string) {
  return Boolean(read(name));
}

export const env = {
  auth: {
    secret: read("AUTH_SECRET"),
    salahPin: read("SALAH_PIN") ?? "2001",
    rayanePin: read("RAYANE_PIN") ?? "1357",
  },
  llm: {
    geminiKey: read("GOOGLE_GENERATIVE_AI_API_KEY"),
    groqKey: read("GROQ_API_KEY"),
    geminiModel: read("GEMINI_MODEL") ?? "gemini-flash-lite-latest",
    groqModel: read("GROQ_MODEL") ?? "openai/gpt-oss-20b",
  },
  market: {
    twelveDataKey: read("TWELVEDATA_API_KEY"),
    polygonKey: read("POLYGON_API_KEY"),
  },
  macro: {
    fredKey: read("FRED_API_KEY"),
  },
  news: {
    finnhubKey: read("FINNHUB_API_KEY"),
    newsApiKey: read("NEWS_API_KEY"),
  },
  persist: {
    kvUrl: read("KV_REST_API_URL") ?? read("UPSTASH_REDIS_REST_URL"),
    kvToken: read("KV_REST_API_TOKEN") ?? read("UPSTASH_REDIS_REST_TOKEN"),
    prefix: read("GOLDBOOK_KV_PREFIX") ?? "goldbook:",
  },
} as const;

export type IntegrationStatus = {
  id: string;
  label: string;
  ready: boolean;
  requiredFor: string;
};

/** Non-secret readiness map for desk diagnostics. */
export function getIntegrationStatus(): IntegrationStatus[] {
  return [
    {
      id: "auth",
      label: "Auth secret",
      ready: present("AUTH_SECRET"),
      requiredFor: "Login sessions",
    },
    {
      id: "gemini",
      label: "Gemini LLM",
      ready: present("GOOGLE_GENERATIVE_AI_API_KEY"),
      requiredFor: "Agent reasoning (primary)",
    },
    {
      id: "groq",
      label: "Groq LLM",
      ready: present("GROQ_API_KEY"),
      requiredFor: "Agent reasoning (fallback)",
    },
    {
      id: "twelvedata",
      label: "Twelve Data",
      ready: present("TWELVEDATA_API_KEY"),
      requiredFor: "XAUUSD market prices",
    },
    {
      id: "polygon",
      label: "Polygon",
      ready: present("POLYGON_API_KEY"),
      requiredFor: "Alternate market prices",
    },
    {
      id: "fred",
      label: "FRED",
      ready: present("FRED_API_KEY"),
      requiredFor: "Macro / yields",
    },
    {
      id: "finnhub",
      label: "Finnhub",
      ready: present("FINNHUB_API_KEY"),
      requiredFor: "News headlines",
    },
    {
      id: "newsapi",
      label: "NewsAPI",
      ready: present("NEWS_API_KEY"),
      requiredFor: "Alternate news",
    },
    {
      id: "persist",
      label: "Durable storage",
      ready:
        present("DATABASE_URL") ||
        present("SUPABASE_DB_URL") ||
        (present("SUPABASE_URL") &&
          present("SUPABASE_ANON_KEY") &&
          present("GOLDBOOK_KV_SECRET")) ||
        (present("KV_REST_API_URL") && present("KV_REST_API_TOKEN")) ||
        (present("UPSTASH_REDIS_REST_URL") && present("UPSTASH_REDIS_REST_TOKEN")),
      requiredFor: "Briefs / scores / pins on Vercel",
    },
  ];
}

export function hasAnyLlm() {
  return Boolean(env.llm.geminiKey || env.llm.groqKey);
}

export function hasMarketData() {
  return Boolean(env.market.twelveDataKey || env.market.polygonKey);
}

export function preferredLlm(): "gemini" | "groq" | null {
  if (env.llm.geminiKey) return "gemini";
  if (env.llm.groqKey) return "groq";
  return null;
}
