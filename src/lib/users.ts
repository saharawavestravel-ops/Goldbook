import type { Locale } from "@/lib/i18n/locales";
import { getData } from "@/lib/i18n/data";

export type UserId = "salah" | "rayane";

export type DeskUser = {
  id: UserId;
  name: string;
  role: string;
  initials: string;
  accent: string;
};

export const users: Record<UserId, DeskUser> = {
  salah: {
    id: "salah",
    name: "Salah",
    role: "Co-founder of the desk",
    initials: "SA",
    accent: "#0b0d10",
  },
  rayane: {
    id: "rayane",
    name: "Rayane",
    role: "Co-founder of the desk",
    initials: "RA",
    accent: "#2563eb",
  },
};

export const userList = Object.values(users);

export function localizeUser(user: DeskUser, locale: Locale = "en"): DeskUser {
  return { ...user, role: getData(locale).engine.userRole };
}

export function isUserId(value: string): value is UserId {
  return value === "salah" || value === "rayane";
}
