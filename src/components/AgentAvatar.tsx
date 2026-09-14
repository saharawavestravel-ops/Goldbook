import type { AgentId } from "@/lib/agents";

const sizeClass = {
  sm: "h-8 w-8",
  md: "h-11 w-11",
  lg: "h-14 w-14",
  xl: "h-16 w-16",
} as const;

export function AgentAvatar({
  agentId,
  name,
  initials,
  accent,
  size = "md",
  className = "",
}: {
  agentId: AgentId | string;
  name: string;
  initials?: string;
  accent?: string;
  size?: keyof typeof sizeClass;
  className?: string;
}) {
  return (
    <span
      className={`relative inline-flex shrink-0 overflow-hidden rounded-full border border-gb-line bg-gb-accent-wash ${sizeClass[size]} ${className}`}
      style={accent ? { boxShadow: `0 0 0 2px ${accent}22` } : undefined}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/avatars/${agentId}.svg`}
        alt=""
        className="h-full w-full object-cover"
        loading="lazy"
      />
      <span className="sr-only">{name}{initials ? ` (${initials})` : ""}</span>
    </span>
  );
}
