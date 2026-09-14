"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/client";
import { getCopy } from "@/lib/i18n/copy";

export function Disclaimer({ className = "" }: { className?: string }) {
  const { dict } = useI18n();
  return (
    <p className={`text-xs leading-relaxed text-gb-faint ${className}`}>
      {dict.common.disclaimerLong}
    </p>
  );
}

export function EmptyState({
  title,
  description,
  actionHref,
  actionLabel,
}: {
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="gb-surface flex flex-col items-start gap-4 p-6 sm:p-8">
      <div>
        <p className="text-base font-medium text-gb-ink">{title}</p>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-gb-muted">{description}</p>
      </div>
      {actionHref && actionLabel ? (
        <Link href={actionHref} className="gb-btn gb-btn-primary">
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}

export function ErrorPanel({
  title,
  description,
  onRetry,
  retryLabel,
}: {
  title?: string;
  description: string;
  onRetry?: () => void;
  retryLabel?: string;
}) {
  const { locale } = useI18n();
  const ui = getCopy(locale).ui;
  const resolvedTitle = title ?? ui.errorTitle;
  const resolvedRetry = retryLabel ?? ui.retry;
  return (
    <div className="gb-surface flex flex-col items-start gap-4 border-gb-danger/30 p-6 sm:p-8">
      <div>
        <p className="text-base font-medium text-gb-danger">{resolvedTitle}</p>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-gb-muted">{description}</p>
      </div>
      {onRetry ? (
        <button type="button" onClick={onRetry} className="gb-btn gb-btn-secondary">
          {resolvedRetry}
        </button>
      ) : null}
    </div>
  );
}

export function LoadingBlock({ label }: { label?: string }) {
  const { dict } = useI18n();
  const resolved = label ?? dict.common.loading;
  return (
    <div className="flex flex-col gap-4" role="status" aria-live="polite" aria-label={resolved}>
      <div className="h-3 w-24 animate-pulse rounded-full bg-gb-line" />
      <div className="h-10 w-2/3 max-w-sm animate-pulse rounded-gb-md bg-gb-line/80" />
      <div className="h-4 w-full max-w-md animate-pulse rounded-full bg-gb-line/60" />
      <div className="h-4 w-5/6 max-w-sm animate-pulse rounded-full bg-gb-line/50" />
      <div className="mt-4 grid grid-cols-3 gap-2">
        <div className="h-16 animate-pulse rounded-gb-md bg-gb-line/40" />
        <div className="h-16 animate-pulse rounded-gb-md bg-gb-line/40" />
        <div className="h-16 animate-pulse rounded-gb-md bg-gb-line/40" />
      </div>
      <span className="sr-only">{resolved}</span>
    </div>
  );
}

export function DataNotice({
  source,
  warnings = [],
  samples,
}: {
  source?: string;
  warnings?: string[];
  /** Named feeds that are still on sample data */
  samples?: { market?: boolean; macro?: boolean; news?: boolean };
}) {
  const { dict } = useI18n();
  const usingSample =
    samples?.market ||
    samples?.macro ||
    samples?.news ||
    !source ||
    source === "fallback";
  if (!usingSample && warnings.length === 0) return null;

  const sampleBits = [
    samples?.market ? dict.common.gold : null,
    samples?.macro ? "Macro" : null,
    samples?.news ? "News" : null,
  ].filter(Boolean);

  return (
    <div className="rounded-gb-md border border-gb-line bg-gb-accent-wash/40 px-3 py-2.5 text-xs leading-relaxed text-gb-muted">
      {usingSample
        ? sampleBits.length > 0
          ? `${dict.common.sampleNotice} (${sampleBits.join(" · ")})`
          : dict.common.sampleNotice
        : `${dict.common.liveVia} ${source}.`}
      {warnings.length > 0 ? (
        <span className="mt-1 block text-gb-faint">{warnings.slice(0, 2).join(" · ")}</span>
      ) : null}
    </div>
  );
}
