"use client";

import { useRouter } from "next/navigation";
import { Disclaimer, ErrorPanel } from "@/components/StatePanels";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  return (
    <html lang="en">
      <body className="flex min-h-full flex-col bg-[#f7f6f4] text-[#1c1b19]">
        <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-5 py-12">
          <ErrorPanel
            title="Goldbook couldn’t load"
            description={error.message || "A critical error stopped the app."}
            onRetry={() => {
              reset();
              router.refresh();
            }}
          />
          <Disclaimer className="mt-8" />
        </main>
      </body>
    </html>
  );
}
