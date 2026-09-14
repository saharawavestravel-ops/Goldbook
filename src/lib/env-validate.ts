/**
 * Production env validation for Goldbook.
 * Never import into client components.
 */

import { getKvConfig } from "@/lib/persist";

export type EnvIssue = {
  level: "error" | "warn";
  code: string;
  message: string;
};

function read(name: string) {
  const value = process.env[name]?.trim();
  return value ? value : undefined;
}

function isFourDigitPin(value: string | undefined) {
  return Boolean(value && /^\d{4}$/.test(value));
}

/** Collect env issues without throwing. */
export function validateEnv(options?: { production?: boolean }): EnvIssue[] {
  const production = options?.production ?? process.env.NODE_ENV === "production";
  const issues: EnvIssue[] = [];

  const secret = read("AUTH_SECRET");
  if (!secret) {
    issues.push({
      level: "error",
      code: "AUTH_SECRET_MISSING",
      message: "AUTH_SECRET is required for signed sessions.",
    });
  } else if (secret.length < 32) {
    issues.push({
      level: production ? "error" : "warn",
      code: "AUTH_SECRET_WEAK",
      message: "AUTH_SECRET should be at least 32 characters.",
    });
  }

  const salah = read("SALAH_PIN");
  const rayane = read("RAYANE_PIN");
  if (salah && !isFourDigitPin(salah)) {
    issues.push({
      level: "error",
      code: "SALAH_PIN_INVALID",
      message: "SALAH_PIN must be exactly 4 digits when set.",
    });
  }
  if (rayane && !isFourDigitPin(rayane)) {
    issues.push({
      level: "error",
      code: "RAYANE_PIN_INVALID",
      message: "RAYANE_PIN must be exactly 4 digits when set.",
    });
  }

  if (production && !getKvConfig()) {
    issues.push({
      level: process.env.VERCEL ? "error" : "warn",
      code: "PERSIST_EPHEMERAL",
      message:
        "No KV/Upstash configured — briefs, scores, and PIN hashes may not survive serverless deploys. Set KV_REST_API_URL + KV_REST_API_TOKEN (or Upstash equivalents).",
    });
  }

  if (production && !read("SALAH_PIN") && !read("RAYANE_PIN")) {
    issues.push({
      level: "warn",
      code: "DEFAULT_PINS",
      message:
        "SALAH_PIN / RAYANE_PIN not set — default demo PINs may still be active. Set unique 4-digit PINs in production.",
    });
  }

  if (production && !read("GOOGLE_GENERATIVE_AI_API_KEY") && !read("GROQ_API_KEY")) {
    issues.push({
      level: "warn",
      code: "LLM_MISSING",
      message: "No LLM key set — agent takes will use rule-based text only.",
    });
  }

  if (
    production &&
    !read("TWELVEDATA_API_KEY") &&
    !read("POLYGON_API_KEY")
  ) {
    issues.push({
      level: "warn",
      code: "MARKET_SAMPLE",
      message: "No market API key — desk will use sample XAUUSD data.",
    });
  }

  return issues;
}

/** Throw on fatal env errors (production boot / critical paths). */
export function assertEnv(options?: { production?: boolean; hard?: boolean }) {
  const production = options?.production ?? process.env.NODE_ENV === "production";
  const hard = options?.hard ?? production;
  const issues = validateEnv({ production });

  for (const issue of issues) {
    const line = `[goldbook:env] ${issue.code}: ${issue.message}`;
    if (issue.level === "error") console.error(line);
    else console.warn(line);
  }

  const errors = issues.filter((issue) => issue.level === "error");
  if (hard && errors.length > 0) {
    throw new Error(
      `Goldbook env invalid: ${errors.map((issue) => issue.code).join(", ")}`,
    );
  }

  return issues;
}

export function envIsReadyForProduction() {
  return validateEnv({ production: true }).every((issue) => issue.level !== "error");
}
