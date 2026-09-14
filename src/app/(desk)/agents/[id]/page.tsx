import { notFound } from "next/navigation";
import { AgentProfile } from "@/components/AgentProfile";
import { PageFrame } from "@/components/PageFrame";
import { getAgentReport } from "@/lib/agent-reports";
import { agents, localizeAgent, type AgentId } from "@/lib/agents";
import { getData } from "@/lib/i18n/data";
import { getI18n } from "@/lib/i18n/server";

type Props = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return agents.map((agent) => ({ id: agent.id }));
}

export default async function AgentProfilePage({ params }: Props) {
  const { id } = await params;
  const { locale } = await getI18n();
  const agent = localizeAgent(id as AgentId, locale);
  if (!agent) notFound();

  const report = await getAgentReport(agent.id, locale);
  const data = getData(locale);

  return (
    <PageFrame
      eyebrow={data.engine.agentEyebrow}
      title={agent.name}
      description={agent.oneLiner}
    >
      <AgentProfile agent={agent} report={report} />
    </PageFrame>
  );
}
