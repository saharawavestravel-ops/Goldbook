import { HistoryList } from "@/components/HistoryList";
import { PageFrame } from "@/components/PageFrame";
import { getHistoryBriefs } from "@/lib/history";
import { getI18n } from "@/lib/i18n/server";

export default async function HistoryPage() {
  const briefs = await getHistoryBriefs();
  const { dict } = await getI18n();

  return (
    <PageFrame
      eyebrow={dict.history.eyebrow}
      title={dict.history.title}
      description={dict.history.description}
    >
      <HistoryList briefs={briefs} />
    </PageFrame>
  );
}
