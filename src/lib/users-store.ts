import { persistGetJson, persistSetJson } from "@/lib/persist";
import { type UserId, users, type DeskUser } from "@/lib/users";

export type StoredUserMeta = {
  id: UserId;
  lastLoginAt?: string;
  pinUpdatedAt?: string;
};

type UserStore = Partial<Record<UserId, StoredUserMeta>>;

const USERS_KEY = "users";

async function readStore(): Promise<UserStore> {
  return (await persistGetJson<UserStore>(USERS_KEY)) ?? {};
}

async function writeStore(store: UserStore) {
  await persistSetJson(USERS_KEY, store);
}

export async function getUserMeta(userId: UserId): Promise<StoredUserMeta> {
  const store = await readStore();
  return store[userId] ?? { id: userId };
}

export async function touchUserLogin(userId: UserId) {
  const store = await readStore();
  const current = store[userId] ?? { id: userId };
  store[userId] = {
    ...current,
    id: userId,
    lastLoginAt: new Date().toISOString(),
  };
  await writeStore(store);
  return store[userId]!;
}

export async function touchUserPinUpdate(userId: UserId) {
  const store = await readStore();
  const current = store[userId] ?? { id: userId };
  store[userId] = {
    ...current,
    id: userId,
    pinUpdatedAt: new Date().toISOString(),
  };
  await writeStore(store);
  return store[userId]!;
}

/** Profile + persisted meta for the You page. */
export async function getDeskUserWithMeta(userId: UserId): Promise<DeskUser & StoredUserMeta> {
  const meta = await getUserMeta(userId);
  return { ...users[userId], ...meta };
}

export async function listUserMetas() {
  const store = await readStore();
  return (Object.keys(users) as UserId[]).map((id) => store[id] ?? { id });
}
