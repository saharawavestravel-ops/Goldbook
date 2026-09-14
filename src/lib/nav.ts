export const navItems = [
  { href: "/", label: "Today", id: "today" },
  { href: "/agents", label: "Agents", id: "agents" },
  { href: "/history", label: "History", id: "history" },
  { href: "/you", label: "You", id: "you" },
] as const;

export type NavId = (typeof navItems)[number]["id"];
