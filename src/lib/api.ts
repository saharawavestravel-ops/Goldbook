import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import type { DeskUser } from "@/lib/users";

export type ApiErrorBody = {
  ok: false;
  error: {
    code: string;
    message: string;
  };
};

export type ApiOkBody<T> = {
  ok: true;
  data: T;
  meta?: Record<string, unknown>;
};

export function apiError(
  status: number,
  code: string,
  message: string,
  headers?: HeadersInit,
) {
  const body: ApiErrorBody = { ok: false, error: { code, message } };
  return NextResponse.json(body, { status, headers });
}

export function apiOk<T>(data: T, meta?: Record<string, unknown>, init?: ResponseInit) {
  const body: ApiOkBody<T> = meta ? { ok: true, data, meta } : { ok: true, data };
  return NextResponse.json(body, init);
}

/** Require a signed-in user; returns JSON 401 for API clients. */
export async function requireApiUser(): Promise<
  { user: DeskUser; error?: undefined } | { user?: undefined; error: NextResponse }
> {
  const user = await getSessionUser();
  if (!user) {
    return {
      error: apiError(401, "UNAUTHORIZED", "Not signed in"),
    };
  }
  return { user };
}

export function readLimitEnv(name: string, fallback: number) {
  const raw = process.env[name]?.trim();
  if (!raw) return fallback;
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
}
