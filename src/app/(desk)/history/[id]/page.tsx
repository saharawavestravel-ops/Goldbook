import { notFound } from "next/navigation";
import { HistoryBriefView } from "@/components/HistoryBriefView";
import { PageFrame } from "@/components/PageFrame";
import { getHistoryBrief, historyBriefs } from "@/lib/history";
import { getData } from "@/lib/i18n/data";
import { getI18n } from "@/lib/i18n/server";

type Props = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return [{ id: "today" }, ...historyBriefs.map((brief) => ({ id: brief.id }))];
}

export default async function HistoryDetailPage({ params }: Props) {
  const { id } = await params;
  const { locale } = await getI18n();
  const brief = await getHistoryBrief(id);
  if (!brief) notFound();
  const data = getData(locale);

  return (
    <PageFrame
      eyebrow={data.engine.pastBrief}
      title={brief.dateLabel}
      description={data.engine.pastBriefDesc}
    >
      <HistoryBriefView brief={brief} />
    </PageFrame>
  );
}
