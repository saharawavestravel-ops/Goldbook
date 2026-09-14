"use client";

import { buildWhatToDoForGold, type WhatToDoPack } from "@/lib/gold-guide";
import { useI18n } from "@/lib/i18n/client";
import type { HomeIntel } from "@/lib/home-intel";
import type { DailyBriefPreview } from "@/lib/today-shared";

export function DailyGoldGuide({
  preview,
  intel,
}: {
  preview: DailyBriefPreview;
  intel?: HomeIntel | null;
}) {
  const { locale, dict } = useI18n();
  if (!preview.hasBrief) return null;
  const guide = buildWhatToDoForGold(preview, intel, locale);
  return <WhatToDoForGold guide={guide} labels={dict.guide} />;
}

function WhatToDoForGold({
  guide,
  labels,
}: {
  guide: WhatToDoPack;
  labels: {
    whatToDo: string;
    doThis: string;
    watchThis: string;
    standDownIf: string;
    newsMeaning: string;
    disclaimer: string;
  };
}) {
  return (
    <section className="gb-fade-up overflow-hidden rounded-gb-lg border border-gb-ink/10 bg-gb-ink text-white">
      <div className="p-5 sm:p-7">
        <p className="text-sm font-medium text-gb-accent-soft">{labels.whatToDo}</p>
        <h2 className="gb-display mt-3 text-3xl text-white sm:text-4xl">{guide.headline}</h2>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-white/80">{guide.oneLine}</p>

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <div>
            <p className="text-sm font-medium text-gb-accent-soft">{labels.doThis}</p>
            <ul className="mt-3 flex flex-col gap-2.5">
              {guide.forGold.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed text-white/90">
                  <span className="mt-0.5 text-gb-accent-soft">→</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-medium text-gb-accent-soft">{labels.watchThis}</p>
            <ul className="mt-3 flex flex-col gap-2">
              {guide.watch.map((item) => (
                <li
                  key={item}
                  className="rounded-gb-md border border-white/15 bg-white/5 px-3 py-2 text-sm leading-relaxed text-white/85"
                >
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-4 rounded-gb-md border border-red-300/30 bg-red-500/10 px-3 py-2.5 text-sm leading-relaxed text-red-100">
              <span className="font-medium">{labels.standDownIf} · </span>
              {guide.stopIf}
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 bg-white/5 px-5 py-5 sm:px-7">
        <p className="text-sm font-medium text-gb-accent-soft">{labels.newsMeaning}</p>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/85">{guide.newsMeaning}</p>
        <p className="mt-4 text-xs text-white/45">{labels.disclaimer}</p>
      </div>
    </section>
  );
}
