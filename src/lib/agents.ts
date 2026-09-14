import type { Locale } from "@/lib/i18n/locales";
import { getData } from "@/lib/i18n/data";

export type AgentId =
  | "aurelia"
  | "marcus"
  | "nova"
  | "iris"
  | "felix"
  | "vera";

export type AgentStatus = "idle" | "thinking" | "ready" | "disagreed";

export type Agent = {
  id: AgentId;
  name: string;
  role: string;
  oneLiner: string;
  bio: string;
  watches: string[];
  initials: string;
  accent: string;
  avatar: string;
};

const baseAgents: Omit<Agent, "role" | "oneLiner" | "bio" | "watches">[] = [
  { id: "aurelia", name: "Aurelia", initials: "AU", accent: "#0b0d10", avatar: "/avatars/aurelia.svg" },
  { id: "marcus", name: "Marcus", initials: "MA", accent: "#1d4ed8", avatar: "/avatars/marcus.svg" },
  { id: "nova", name: "Nova", initials: "NO", accent: "#2563eb", avatar: "/avatars/nova.svg" },
  { id: "iris", name: "Iris", initials: "IR", accent: "#3b82f6", avatar: "/avatars/iris.svg" },
  { id: "felix", name: "Felix", initials: "FE", accent: "#64748b", avatar: "/avatars/felix.svg" },
  { id: "vera", name: "Vera", initials: "VE", accent: "#0f172a", avatar: "/avatars/vera.svg" },
];

export function localizeAgents(locale: Locale = "en"): Agent[] {
  const pack = getData(locale).agents;
  return baseAgents.map((agent) => {
    const copy = pack[agent.id];
    return {
      ...agent,
      role: copy.role,
      oneLiner: copy.oneLiner,
      bio: copy.bio,
      watches: [...copy.watches],
    };
  });
}

export function localizeAgent(id: AgentId, locale: Locale = "en"): Agent | undefined {
  return localizeAgents(locale).find((agent) => agent.id === id);
}

/** English default roster (back-compat). Prefer localizeAgents(locale). */
export const agents: Agent[] = localizeAgents("en");

export function getAgent(id: AgentId) {
  return agents.find((agent) => agent.id === id);
}

export function isAgentId(value: string): value is AgentId {
  return baseAgents.some((agent) => agent.id === value);
}
