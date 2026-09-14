"use client";

import { useCallback, useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n/client";
import { getCopy } from "@/lib/i18n/copy";
import { numberLocale } from "@/lib/i18n/labels";
import { readApiData } from "@/lib/api-client";

type Sensors = {
  price: number;
  changePct: number;
  atr?: number;
  dxy?: number;
  dxyChangePct?: number;
  us10y?: number;
  source: string;
  asOf?: string;
  sample?: boolean;
};

type MarketPayload = {
  price: number;
  changePct: number;
  levels?: { atr?: number };
  helpers?: { dxy?: number; dxyChangePct?: number; us10y?: number };
  source?: string;
  sample?: boolean;
  asOf?: string;
  dataAsOf?: string;
};

export function LiveSensorsStrip({
  initial,
}: {
  initial?: {
    price?: number;
    changePct?: number;
    atr?: number;
    helpers?: { dxy?: number; dxyChangePct?: number; us10y?: number };
    marketSource?: string;
  };
}) {
  const { locale, dict } = useI18n();
  const ui = getCopy(locale).ui;
  const fmt = new Intl.NumberFormat(numberLocale(locale), {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const [sensors, setSensors] = useState<Sensors>({
    price: initial?.price ?? 0,
    changePct: initial?.changePct ?? 0,
    atr: initial?.atr,
    dxy: initial?.helpers?.dxy,
    dxyChangePct: initial?.helpers?.dxyChangePct,
    us10y: initial?.helpers?.us10y,
    source: initial?.marketSource === "fallback" ? ui.sample : ui.live,
  });
  const [tick, setTick] = useState(0);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/market");
      const json = await res.json();
      const data = readApiData<MarketPayload>(json);
      if (!res.ok || !data) return;
      const sample = Boolean(data.sample || data.source === "fallback");
      setSensors({
        price: data.price,
        changePct: data.changePct,
        atr: data.levels?.atr,
        dxy: data.helpers?.dxy,
        dxyChangePct: data.helpers?.dxyChangePct,
        us10y: data.helpers?.us10y,
        source: sample ? ui.sample : ui.live,
        asOf: data.dataAsOf ?? data.asOf,
        sample,
      });
      setTick((n) => n + 1);
    } catch {
      // keep last good read
    }
  }, [ui.live, ui.sample]);

  useEffect(() => {
    void refresh();
    const id = window.setInterval(() => void refresh(), 60_000);
    return () => window.clearInterval(id);
  }, [refresh]);

  const up = sensors.changePct >= 0;
  const dxyUp = (sensors.dxyChangePct ?? 0) >= 0;

  return (
    <section className="gb-lift gb-surface overflow-hidden p-0">
      <div className="flex items-center justify-between gap-3 border-b border-gb-line px-4 py-2.5 sm:px-5">
        <p className="gb-eyebrow !normal-case tracking-normal">{ui.sensorsTitle}</p>
        <button
          type="button"
          onClick={() => void refresh()}
          className="text-[0.7rem] text-gb-muted hover:text-gb-ink"
        >
          {dict.common.refresh}
          {tick > 0 ? ` · ${tick}` : ""}
        </button>
      </div>
      <div className="grid grid-cols-2 gap-px bg-gb-line sm:grid-cols-5">
        <Sensor
          label={dict.common.gold}
          value={fmt.format(sensors.price)}
          sub={`${up ? "+" : ""}${sensors.changePct.toFixed(2)}%`}
          tone={up ? "bull" : "bear"}
        />
        <Sensor
          label={ui.usDollar}
          value={sensors.dxy !== undefined ? sensors.dxy.toFixed(2) : "—"}
          sub={
            sensors.dxyChangePct !== undefined
              ? `${dxyUp ? "+" : ""}${sensors.dxyChangePct.toFixed(2)}%`
              : sensors.source
          }
          tone={
            sensors.dxyChangePct === undefined ? "flat" : dxyUp ? "bear" : "bull"
          }
          hint={ui.dollarHint}
        />
        <Sensor
          label={ui.us10y}
          value={sensors.us10y !== undefined ? `${sensors.us10y.toFixed(2)}%` : "—"}
          sub={ui.yieldsSub}
          tone="flat"
          hint={ui.yieldsHint}
        />
        <Sensor
          label={ui.typicalSwing}
          value={sensors.atr !== undefined ? fmt.format(sensors.atr) : "—"}
          sub="ATR"
          tone="flat"
        />
        <Sensor
          label={ui.feed}
          value={sensors.source}
          sub={
            sensors.asOf
              ? new Date(sensors.asOf).toLocaleTimeString(numberLocale(locale))
              : ui.deskSub
          }
          tone="flat"
          className="col-span-2 sm:col-span-1"
        />
      </div>
    </section>
  );
}

function Sensor({
  label,
  value,
  sub,
  tone,
  hint,
  className = "",
}: {
  label: string;
  value: string;
  sub: string;
  tone: "bull" | "bear" | "flat";
  hint?: string;
  className?: string;
}) {
  return (
    <div className={`bg-gb-elevated px-3 py-3 sm:px-4 ${className}`} title={hint}>
      <p className="text-[0.65rem] text-gb-faint">{label}</p>
      <p
        className={`mt-1 text-sm font-medium tracking-tight sm:text-base ${
          tone === "bull" ? "text-gb-bull" : tone === "bear" ? "text-gb-bear" : "text-gb-ink"
        }`}
      >
        {value}
      </p>
      <p className="mt-0.5 text-[0.7rem] text-gb-muted">{sub}</p>
    </div>
  );
}
