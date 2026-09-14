import Link from "next/link";
import { EmptyState } from "@/components/StatePanels";
import { DailyBriefView } from "@/components/DailyBriefView";
import { PageFrame } from "@/components/PageFrame";
import { loadDailyBrief } from "@/lib/brief-store";
import { getI18n } from "@/lib/i18n/server";

export default async function BriefPage() {
  const { locale, dict } = await getI18n();
  const brief = await loadDailyBrief(undefined, locale);

  return (
    <PageFrame
      eyebrow={dict.brief.eyebrow}
      title={dict.brief.title}
      description={dict.brief.description}
    >
      {brief ? (
        <DailyBriefView brief={brief} />
      ) : (
        <div className="flex flex-col gap-6">
          <EmptyState
            title={dict.brief.emptyTitle}
            description={dict.brief.emptyDesc}
            actionHref="/run"
            actionLabel={dict.today.runDesk}
          />
          <Link href="/" className="gb-btn gb-btn-ghost justify-center sm:self-start">
            {dict.agents.backToday}
          </Link>
        </div>
      )}
    </PageFrame>
  );
}
