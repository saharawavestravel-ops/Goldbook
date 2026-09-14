/**
 * Durable key-value persistence for Goldbook.
 * - Preferred: Supabase (RPC over HTTPS, or DATABASE_URL Postgres)
 * - Alternate: Upstash Redis / Vercel KV REST
 * - Local fallback: JSON files under /data (ephemeral on Vercel /tmp)
 */

import { mkdir, readFile, readdir, unlink, writeFile } from "fs/promises";
import path from "path";
import postgres from "postgres";

export type PersistDriver = "supabase" | "upstash" | "file";

type KvConfig = {
  url: string;
  token: string;
};

function readEnv(name: string) {
  const value = process.env[name]?.trim();
  return value ? value : undefined;
}

export function getDatabaseUrl() {
  return readEnv("DATABASE_URL") ?? readEnv("SUPABASE_DB_URL");
}

export function getSupabaseRestConfig() {
  const url = readEnv("SUPABASE_URL");
  const anon = readEnv("SUPABASE_ANON_KEY");
  const secret = readEnv("GOLDBOOK_KV_SECRET");
  if (!url || !anon || !secret) return null;
  return { url: url.replace(/\/$/, ""), anon, secret };
}

export function getKvConfig(): KvConfig | null {
  const url = readEnv("KV_REST_API_URL") ?? readEnv("UPSTASH_REDIS_REST_URL");
  const token = readEnv("KV_REST_API_TOKEN") ?? readEnv("UPSTASH_REDIS_REST_TOKEN");
  if (url && token) return { url: url.replace(/\/$/, ""), token };
  return null;
}

export function getPersistDriver(): PersistDriver {
  if (getDatabaseUrl() || getSupabaseRestConfig()) return "supabase";
  if (getKvConfig()) return "upstash";
  return "file";
}

/** True when storage will survive a serverless redeploy. */
export function isDurablePersistReady() {
  const driver = getPersistDriver();
  return driver === "supabase" || driver === "upstash";
}

const memoryStore = new Map<string, string>();

const dataRoot = process.env.VERCEL
  ? path.join("/tmp", "goldbook-data")
  : path.join(process.cwd(), "data");

function filePathForKey(key: string) {
  if (key.startsWith("brief:")) {
    return path.join(dataRoot, "briefs", `${key.slice("brief:".length)}.json`);
  }
  return path.join(dataRoot, `${key}.json`);
}

async function fileGet(key: string): Promise<string | null> {
  if (memoryStore.has(key)) return memoryStore.get(key) ?? null;
  try {
    return await readFile(filePathForKey(key), "utf8");
  } catch {
    return null;
  }
}

async function fileSet(key: string, value: string) {
  const normalized = value.endsWith("\n") ? value : `${value}\n`;
  memoryStore.set(key, normalized);
  try {
    const target = filePathForKey(key);
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, normalized, "utf8");
  } catch (error) {
    const reason = error instanceof Error ? error.message : "write failed";
    console.warn(
      `[goldbook:persist] ephemeral write for "${key}" — ${reason}. Value kept in memory only${
        process.env.VERCEL ? " (set SUPABASE_URL + GOLDBOOK_KV_SECRET for durable storage)" : ""
      }.`,
    );
  }
}

async function fileDel(key: string) {
  memoryStore.delete(key);
  try {
    await unlink(filePathForKey(key));
  } catch {
    // ignore missing
  }
}

async function fileKeys(prefix: string): Promise<string[]> {
  const fromMemory = [...memoryStore.keys()].filter((key) => key.startsWith(prefix));

  if (prefix.startsWith("brief:")) {
    try {
      const files = await readdir(path.join(dataRoot, "briefs"));
      const fromDisk = files
        .filter((name) => name.endsWith(".json"))
        .map((name) => `brief:${name.replace(/\.json$/, "")}`)
        .filter((key) => key.startsWith(prefix));
      return [...new Set([...fromMemory, ...fromDisk])].sort().reverse();
    } catch {
      return [...new Set(fromMemory)].sort().reverse();
    }
  }

  try {
    const files = await readdir(dataRoot);
    const fromDisk = files
      .filter((name) => name.endsWith(".json"))
      .map((name) => name.replace(/\.json$/, ""))
      .filter((key) => key.startsWith(prefix));
    return [...new Set([...fromMemory, ...fromDisk])];
  } catch {
    return [...new Set(fromMemory)];
  }
}

function namespace() {
  return readEnv("GOLDBOOK_KV_PREFIX") ?? "goldbook:";
}

function namespaced(key: string) {
  return `${namespace()}${key}`;
}

let sqlClient: ReturnType<typeof postgres> | null = null;

function getSql() {
  const url = getDatabaseUrl();
  if (!url) return null;
  if (!sqlClient) {
    sqlClient = postgres(url, {
      prepare: false,
      max: 1,
      idle_timeout: 20,
      connect_timeout: 10,
      ssl: "require",
    });
  }
  return sqlClient;
}

async function rpc<T>(fn: string, args: Record<string, unknown>): Promise<T> {
  const config = getSupabaseRestConfig();
  if (!config) throw new Error("Supabase REST not configured");
  const response = await fetch(`${config.url}/rest/v1/rpc/${fn}`, {
    method: "POST",
    headers: {
      apikey: config.anon,
      Authorization: `Bearer ${config.anon}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(args),
    cache: "no-store",
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Supabase RPC ${fn} failed ${response.status}: ${text.slice(0, 200)}`);
  }
  if (response.status === 204) return undefined as T;
  const text = await response.text();
  if (!text) return undefined as T;
  return JSON.parse(text) as T;
}

async function supabaseRestGet(key: string): Promise<string | null> {
  const config = getSupabaseRestConfig();
  if (!config) return null;
  const value = await rpc<string | null>("goldbook_kv_get", {
    p_key: namespaced(key),
    p_secret: config.secret,
  });
  return value ?? null;
}

async function supabaseRestSet(key: string, value: string) {
  const config = getSupabaseRestConfig();
  if (!config) return;
  const normalized = value.endsWith("\n") ? value : `${value}\n`;
  await rpc<null>("goldbook_kv_set", {
    p_key: namespaced(key),
    p_value: normalized,
    p_secret: config.secret,
  });
}

async function supabaseRestDel(key: string) {
  const config = getSupabaseRestConfig();
  if (!config) return;
  await rpc<null>("goldbook_kv_del", {
    p_key: namespaced(key),
    p_secret: config.secret,
  });
}

async function supabaseRestKeys(prefix: string): Promise<string[]> {
  const config = getSupabaseRestConfig();
  if (!config) return [];
  const ns = namespace();
  const rows = await rpc<string[]>("goldbook_kv_keys", {
    p_prefix: namespaced(prefix),
    p_secret: config.secret,
  });
  return (rows ?? [])
    .map((key) => (key.startsWith(ns) ? key.slice(ns.length) : key))
    .filter((key) => key.startsWith(prefix));
}

async function supabaseSqlGet(key: string): Promise<string | null> {
  const sql = getSql();
  if (!sql) return null;
  const rows = await sql<{ value: string }[]>`
    select value from public.goldbook_kv where key = ${namespaced(key)} limit 1
  `;
  return rows[0]?.value ?? null;
}

async function supabaseSqlSet(key: string, value: string) {
  const sql = getSql();
  if (!sql) return;
  const normalized = value.endsWith("\n") ? value : `${value}\n`;
  await sql`
    insert into public.goldbook_kv as kv (key, value, updated_at)
    values (${namespaced(key)}, ${normalized}, now())
    on conflict (key) do update
      set value = excluded.value,
          updated_at = now()
  `;
}

async function supabaseSqlDel(key: string) {
  const sql = getSql();
  if (!sql) return;
  await sql`delete from public.goldbook_kv where key = ${namespaced(key)}`;
}

async function supabaseSqlKeys(prefix: string): Promise<string[]> {
  const sql = getSql();
  if (!sql) return [];
  const ns = namespace();
  const like = `${namespaced(prefix)}%`;
  const rows = await sql<{ key: string }[]>`
    select key from public.goldbook_kv
    where key like ${like}
    order by key desc
  `;
  return rows
    .map((row) => row.key)
    .map((key) => (key.startsWith(ns) ? key.slice(ns.length) : key))
    .filter((key) => key.startsWith(prefix));
}

async function upstash(config: KvConfig, command: (string | number)[]) {
  const response = await fetch(config.url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    cache: "no-store",
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`KV error ${response.status}: ${text.slice(0, 200)}`);
  }

  return (await response.json()) as { result?: unknown };
}

async function upstashGet(config: KvConfig, key: string): Promise<string | null> {
  const data = await upstash(config, ["GET", namespaced(key)]);
  if (data.result === null || data.result === undefined) return null;
  return typeof data.result === "string" ? data.result : JSON.stringify(data.result);
}

async function upstashSet(config: KvConfig, key: string, value: string) {
  await upstash(config, ["SET", namespaced(key), value]);
}

async function upstashDel(config: KvConfig, key: string) {
  await upstash(config, ["DEL", namespaced(key)]);
}

async function upstashKeys(config: KvConfig, prefix: string): Promise<string[]> {
  const data = await upstash(config, ["KEYS", `${namespaced(prefix)}*`]);
  const raw = Array.isArray(data.result) ? data.result : [];
  const ns = namespace();
  return raw
    .map((item) => String(item))
    .map((key) => (key.startsWith(ns) ? key.slice(ns.length) : key))
    .filter((key) => key.startsWith(prefix))
    .sort()
    .reverse();
}

export async function persistGet(key: string): Promise<string | null> {
  if (getDatabaseUrl()) return supabaseSqlGet(key);
  if (getSupabaseRestConfig()) return supabaseRestGet(key);
  const kv = getKvConfig();
  if (kv) return upstashGet(kv, key);
  return fileGet(key);
}

export async function persistSet(key: string, value: string) {
  if (getDatabaseUrl()) return supabaseSqlSet(key, value);
  if (getSupabaseRestConfig()) return supabaseRestSet(key, value);
  const kv = getKvConfig();
  if (kv) return upstashSet(kv, key, value);
  return fileSet(key, value);
}

export async function persistDel(key: string) {
  if (getDatabaseUrl()) return supabaseSqlDel(key);
  if (getSupabaseRestConfig()) return supabaseRestDel(key);
  const kv = getKvConfig();
  if (kv) return upstashDel(kv, key);
  return fileDel(key);
}

export async function persistKeys(prefix: string): Promise<string[]> {
  if (getDatabaseUrl()) return supabaseSqlKeys(prefix);
  if (getSupabaseRestConfig()) return supabaseRestKeys(prefix);
  const kv = getKvConfig();
  if (kv) return upstashKeys(kv, prefix);
  return fileKeys(prefix);
}

export async function persistGetJson<T>(key: string): Promise<T | null> {
  const raw = await persistGet(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function persistSetJson(key: string, value: unknown) {
  await persistSet(key, `${JSON.stringify(value, null, 2)}\n`);
}
