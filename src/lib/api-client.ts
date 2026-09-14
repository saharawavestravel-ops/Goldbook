/** Client-safe helpers for the unified `{ ok, data, error }` API envelope. */

export function readApiError(json: unknown, fallback = "Request failed"): string {
  if (!json || typeof json !== "object") return fallback;
  const body = json as { error?: unknown };
  if (typeof body.error === "string") return body.error;
  if (
    body.error &&
    typeof body.error === "object" &&
    "message" in body.error &&
    typeof (body.error as { message: unknown }).message === "string"
  ) {
    return (body.error as { message: string }).message;
  }
  return fallback;
}

export function readApiData<T>(json: unknown): T | null {
  if (!json || typeof json !== "object") return null;
  const body = json as { ok?: boolean; data?: T };
  if (body.ok === true && body.data !== undefined) return body.data;
  /** Legacy flat payloads (pre-envelope). */
  if (body.ok === undefined) return json as T;
  return null;
}
