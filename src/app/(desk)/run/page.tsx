import { DeskRun } from "@/components/DeskRun";
import { PageFrame } from "@/components/PageFrame";
import { getI18n } from "@/lib/i18n/server";

export default async function RunPage() {
  const { dict } = await getI18n();

  return (
    <PageFrame
      eyebrow={dict.run.eyebrow}
      title={dict.run.title}
      description={dict.run.description}
    >
      <DeskRun />
    </PageFrame>
  );
}
