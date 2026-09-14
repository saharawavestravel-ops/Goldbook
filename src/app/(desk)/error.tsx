"use client";

import { useRouter } from "next/navigation";
import { ErrorPanel } from "@/components/StatePanels";

export default function DeskError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  return (
    <main className="gb-page flex flex-1 flex-col py-8 lg:py-12">
      <ErrorPanel
        title="Desk hit a snag"
        description={error.message || "An unexpected error stopped this page."}
        onRetry={() => {
          reset();
          router.refresh();
        }}
        retryLabel="Reload page"
      />
      <p className="mt-6 text-xs text-gb-faint">
        Research desk only — not financial advice.
        {error.digest ? ` · Ref ${error.digest}` : null}
      </p>
    </main>
  );
}
