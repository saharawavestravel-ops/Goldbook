import { createHmac, scryptSync, timingSafeEqual, randomBytes } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getStoredPinHash, setStoredPinHash } from "@/lib/pin-store";
import { SESSION_COOKIE } from "@/lib/session";
import { isUserId, type UserId, users, type DeskUser } from "@/lib/users";

const SESSION_DAYS = 30;

function getSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET is not set");
  }
  return secret;
}

export function hashPin(pin: string, salt = randomBytes(16).toString("hex")) {
  const hash = scryptSync(pin, salt, 32).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPinHash(pin: string, stored: string) {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const next = scryptSync(pin, salt, 32);
  const current = Buffer.from(hash, "hex");
  if (current.length !== next.length) return false;
  return timingSafeEqual(current, next);
}

function getEnvPin(userId: UserId) {
  if (userId === "salah") return process.env.SALAH_PIN ?? "2001";
  return process.env.RAYANE_PIN ?? "1357";
}

function verifyEnvPin(userId: UserId, pin: string) {
  const expected = getEnvPin(userId);
  const a = Buffer.from(pin);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/** Verify PIN against stored hash, else env defaults. Migrates env PIN → hash on success. */
export async function verifyUserPin(userId: UserId, pin: string) {
  if (!/^\d{4}$/.test(pin)) return false;
  const stored = await getStoredPinHash(userId);
  if (stored && verifyPinHash(pin, stored)) return true;

  const ok = verifyEnvPin(userId, pin);
  if (ok) {
    // Env PIN is the recovery source of truth (redeploy / forgot changed PIN).
    await setStoredPinHash(userId, hashPin(pin)).catch(() => null);
  }
  return ok;
}

export async function changeUserPin(userId: UserId, currentPin: string, nextPin: string) {
  if (!/^\d{4}$/.test(nextPin)) {
    return { ok: false as const, error: "New PIN must be 4 digits" };
  }
  if (!(await verifyUserPin(userId, currentPin))) {
    return { ok: false as const, error: "Current PIN is wrong" };
  }
  if (currentPin === nextPin) {
    return { ok: false as const, error: "Choose a different PIN" };
  }
  await setStoredPinHash(userId, hashPin(nextPin));
  const { touchUserPinUpdate } = await import("@/lib/users-store");
  await touchUserPinUpdate(userId);
  return { ok: true as const };
}

type SessionPayload = {
  userId: UserId;
  exp: number;
};

function sign(payload: string) {
  return createHmac("sha256", getSecret()).update(payload).digest("hex");
}

export function createSessionToken(userId: UserId) {
  const exp = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  const payload = Buffer.from(JSON.stringify({ userId, exp } satisfies SessionPayload)).toString(
    "base64url",
  );
  return `${payload}.${sign(payload)}`;
}

export function readSessionToken(token: string): SessionPayload | null {
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;
  const expected = sign(payload);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as SessionPayload;
    if (!isUserId(data.userId) || typeof data.exp !== "number") return null;
    if (data.exp < Date.now()) return null;
    return data;
  } catch {
    return null;
  }
}

export async function getSessionUser(): Promise<DeskUser | null> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const session = readSessionToken(token);
    if (!session) return null;
    return users[session.userId];
  } catch {
    return null;
  }
}

export async function requireSessionUser() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  return user;
}

export function sessionCookieOptions(token: string) {
  return {
    name: SESSION_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  };
}
