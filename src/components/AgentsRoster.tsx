"use client";

import Link from "next/link";
import type { Agent } from "@/lib/agents";
import { AgentAvatar } from "@/components/AgentAvatar";
import { useI18n } from "@/lib/i18n/client";
import { agentJobPlain } from "@/lib/plain-language";

export function AgentsRoster({ agents }: { agents: Agent[] }) {
  const { locale } = useI18n();
  return (
    <div className="gb-stagger grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
      {agents.map((agent) => (
        <Link
          key={agent.id}
          href={`/agents/${agent.id}`}
          className="gb-surface flex items-start gap-4 p-4 transition duration-[var(--gb-duration)] hover:-translate-y-0.5 hover:border-gb-line-strong hover:shadow-gb-md md:p-5"
        >
          <AgentAvatar
            agentId={agent.id}
            name={agent.name}
            initials={agent.initials}
            accent={agent.accent}
            size="lg"
          />
          <span className="min-w-0 flex-1">
            <span className="flex items-baseline justify-between gap-3">
              <span className="text-lg font-medium text-gb-ink">{agent.name}</span>
              <span className="shrink-0 text-xs text-gb-faint">{agent.role}</span>
            </span>
            <span className="mt-1.5 block text-sm leading-relaxed text-gb-ink-soft">
              {agentJobPlain(agent.id, locale)}
            </span>
          </span>
        </Link>
      ))}
    </div>
  );
}
