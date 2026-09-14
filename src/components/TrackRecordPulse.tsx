"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/client";
import { getCopy } from "@/lib/i18n/copy";

export function TrackRecordPulse({
  trackRecord,
}: {
  trackRecord?: {
    hitRate: number | null;
    scored: number;
    hits: number;
    misses: number;
  };
}) {
  const { locale } = useI18n();
  const ui = getCopy(locale).ui;
  if (!trackRecord || trackRecord.scored === 0) return null;

  return (
    <section className="gb-fade-up flex flex-wrap items-center justify-between gap-3 rounded-gb-lg border border-gb-line bg-gb-elevated/80 px-4 py-3 sm:px-5">
      <div>
        <p className="text-sm font-medium text-gb-faint">{ui.trackTitle}</p>
        <p className="mt-1 text-sm text-gb-ink-soft">
          {trackRecord.hitRate !== null ? (
            <>
              <span className="gb-display text-2xl text-gb-ink">{trackRecord.hitRate}%</span>
              <span className="ms-2 text-gb-muted">
                {ui.trackHitRate(trackRecord.hitRate, trackRecord.hits, trackRecord.misses)}
              </span>
            </>
          ) : (
            ui.trackEmpty
          )}
        </p>
      </div>
      <Link href="/history" className="text-xs text-gb-muted hover:text-gb-ink">
        {ui.openHistory}
      </Link>
    </section>
  );
}
