import Link from "next/link";
import { Disclaimer } from "@/components/StatePanels";

export default function DeskNotFound() {
  return (
    <main className="gb-page flex flex-1 flex-col py-8 lg:py-12">
      <p className="gb-eyebrow">Missing</p>
      <h1 className="gb-display mt-3 text-4xl text-gb-ink sm:text-5xl">Not found</h1>
      <p className="mt-3 max-w-md text-base leading-relaxed text-gb-muted">
        That page or brief isn’t in the desk. It may have been removed or the link is stale.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/" className="gb-btn gb-btn-primary sm:w-auto">
          Back to Today
        </Link>
        <Link href="/history" className="gb-btn gb-btn-secondary sm:w-auto">
          Open History
        </Link>
      </div>
      <Disclaimer className="mt-10" />
    </main>
  );
}
