/**
 * Durable key-value persistence for Goldbook.
 * - Local: JSON files under /data (dev / long-lived Node)
 * - Deploy: Upstash Redis or Vercel KV when REST env is set
 */

import { mkdir, readFile, readdir, unlink, writeFile } from "fs/promises";
import path from "path";

export type PersistDriver = "file" | "upstash";

type KvConfig = {
  url: string;
  token: string;
};

function readEnv(name: string) {
  const value = process.env[name]?.trim();
  return value ? value : undefined;
}

export function getKvConfig(): KvConfig | null {
  const url = readEnv("KV_REST_API_URL") ?? readEnv("UPSTASH_REDIS_REST_URL");
  const token = readEnv("KV_REST_API_TOKEN") ?? readEnv("UPSTASH_REDIS_REST_TOKEN");
  if (url && token) return { url: url.replace(/\/$/, ""), token };
  return null;
}

export function getPersistDriver(): PersistDriver {
  return getKvConfig() ? "upstash" : "file";
}

/** True when storage will survive a serverless redeploy. */
export function isDurablePersistReady() {
  return getPersistDriver() === "upstash";
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
        process.env.VERCEL ? " (configure Upstash/Vercel KV for durable storage)" : ""
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
  const kv = getKvConfig();
  if (kv) return upstashGet(kv, key);
  return fileGet(key);
}

export async function persistSet(key: string, value: string) {
  const kv = getKvConfig();
  if (kv) return upstashSet(kv, key, value);
  return fileSet(key, value);
}

export async function persistDel(key: string) {
  const kv = getKvConfig();
  if (kv) return upstashDel(kv, key);
  return fileDel(key);
}

export async function persistKeys(prefix: string): Promise<string[]> {
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
