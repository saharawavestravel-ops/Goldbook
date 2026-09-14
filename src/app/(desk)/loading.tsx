import { LoadingBlock } from "@/components/StatePanels";

export default function DeskLoading() {
  return (
    <main className="gb-page flex flex-1 flex-col py-8 lg:py-12">
      <LoadingBlock label="Loading desk…" />
    </main>
  );
}
