import { persistGetJson, persistSetJson } from "@/lib/persist";
import type { UserId } from "@/lib/users";

type PinStore = Partial<Record<UserId, string>>;

const PINS_KEY = "pins";

async function readStore(): Promise<PinStore> {
  return (await persistGetJson<PinStore>(PINS_KEY)) ?? {};
}

export async function getStoredPinHash(userId: UserId) {
  const store = await readStore();
  return store[userId] ?? null;
}

export async function setStoredPinHash(userId: UserId, hash: string) {
  const store = await readStore();
  store[userId] = hash;
  await persistSetJson(PINS_KEY, store);
}
