import Link from "next/link";
import { AgentsRoster } from "@/components/AgentsRoster";
import { PageFrame } from "@/components/PageFrame";
import { localizeAgents } from "@/lib/agents";
import { getI18n } from "@/lib/i18n/server";

export default async function AgentsPage() {
  const { locale, dict } = await getI18n();
  const roster = localizeAgents(locale);

  return (
    <PageFrame
      eyebrow={dict.agents.eyebrow}
      title={dict.agents.title}
      description={dict.agents.description}
    >
      <AgentsRoster agents={roster} />
      <p className="mt-8 text-center text-sm text-gb-faint">
        <Link href="/" className="hover:text-gb-ink">
          {dict.agents.backToday}
        </Link>
      </p>
    </PageFrame>
  );
}
