"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { colors } from "@/lib/design-tokens";
import { useI18n } from "@/lib/i18n/client";
import { getCopy } from "@/lib/i18n/copy";
import { numberLocale } from "@/lib/i18n/labels";
import { readApiData } from "@/lib/api-client";

type Bar = {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
};

type Levels = {
  support: number;
  watch: number;
  invalidation: number;
};

type MarketPayload = {
  price: number;
  changePct: number;
  bars: Bar[];
  levels: Levels & { atr?: number };
  source?: string;
  sample?: boolean;
};

export function GoldPriceChart({
  levels,
  spot,
}: {
  levels: Levels;
  spot: number;
}) {
  const { locale, dict } = useI18n();
  const ui = getCopy(locale).ui;
  const formatPrice = (value: number) =>
    new Intl.NumberFormat(numberLocale(locale), {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);

  const [bars, setBars] = useState<Bar[]>([]);
  const [livePrice, setLivePrice] = useState(spot);
  const [changePct, setChangePct] = useState<number | null>(null);
  const [atr, setAtr] = useState<number | undefined>();
  const [source, setSource] = useState<string>("…");
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"line" | "candles">("candles");

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/market");
      const json = await res.json();
      const data = readApiData<MarketPayload>(json);
      if (!res.ok || !data) {
        setError(ui.chartUnavailable);
        return;
      }
      setBars(data.bars ?? []);
      setLivePrice(data.price ?? spot);
      setChangePct(data.changePct ?? null);
      setAtr(data.levels?.atr);
      setSource(data.sample || data.source === "fallback" ? ui.sample : ui.live);
      setError(null);
    } catch {
      setError(ui.chartUnavailable);
    }
  }, [spot, ui.chartUnavailable, ui.live, ui.sample]);

  useEffect(() => {
    void load();
    const id = window.setInterval(() => void load(), 60_000);
    return () => window.clearInterval(id);
  }, [load]);

  const chart = useMemo(() => {
    const points = bars.length > 1 ? bars.slice(-24) : [];
    if (points.length < 2) return null;

    const highs = points.map((b) => b.high);
    const lows = points.map((b) => b.low);
    const pad = 10;
    const w = 640;
    const h = 240;
    const atrPad = atr ?? 0;
    const min =
      Math.min(...lows, levels.support, levels.invalidation, livePrice, livePrice - atrPad) *
      0.998;
    const max =
      Math.max(...highs, levels.watch, livePrice, livePrice + atrPad) * 1.002;
    const span = Math.max(max - min, 1);

    const xAt = (i: number) => pad + (i / (points.length - 1)) * (w - pad * 2);
    const yAt = (price: number) => pad + (1 - (price - min) / span) * (h - pad * 2);
    const candleW = Math.max(3, ((w - pad * 2) / points.length) * 0.55);

    const line = points
      .map((b, i) => `${i === 0 ? "M" : "L"} ${xAt(i).toFixed(1)} ${yAt(b.close).toFixed(1)}`)
      .join(" ");

    const area = `${line} L ${xAt(points.length - 1).toFixed(1)} ${(h - pad).toFixed(1)} L ${xAt(0).toFixed(1)} ${(h - pad).toFixed(1)} Z`;

    const levelLines = [
      { y: yAt(levels.watch), label: dict.today.ceiling, color: colors.accentSoft },
      { y: yAt(levels.support), label: dict.today.floor, color: colors.bull },
      { y: yAt(levels.invalidation), label: dict.today.stop, color: colors.bear },
    ];

    const candles = points.map((b, i) => {
      const up = b.close >= b.open;
      return {
        x: xAt(i),
        openY: yAt(b.open),
        closeY: yAt(b.close),
        highY: yAt(b.high),
        lowY: yAt(b.low),
        up,
      };
    });

    const up = points[points.length - 1]!.close >= points[0]!.close;
    const rangeMove = (
      ((points[points.length - 1]!.close - points[0]!.close) / points[0]!.close) *
      100
    ).toFixed(2);

    return {
      w,
      h,
      line,
      area,
      levelLines,
      xAt,
      yAt,
      up,
      candles,
      candleW,
      lastDate: points[points.length - 1]?.date,
      firstDate: points[0]?.date,
      rangeMove,
      atrBand:
        atr !== undefined
          ? { top: yAt(livePrice + atr), bottom: yAt(livePrice - atr) }
          : null,
    };
  }, [bars, levels, livePrice, atr, dict.today.ceiling, dict.today.floor, dict.today.stop]);

  return (
    <section className="gb-fade-up gb-surface overflow-hidden p-0">
      <div className="flex flex-wrap items-end justify-between gap-3 px-5 pt-5 sm:px-6">
        <div>
          <p className="gb-eyebrow">{ui.chartTitle}</p>
          <p className="mt-1 text-sm text-gb-muted">{ui.chartSubtitle}</p>
        </div>
        <div className="flex items-end gap-4">
          <div className="flex gap-1 rounded-full border border-gb-line p-0.5">
            <button
              type="button"
              onClick={() => setMode("candles")}
              className={`rounded-full px-2.5 py-1 text-[0.65rem] ${
                mode === "candles" ? "bg-gb-ink text-white" : "text-gb-muted"
              }`}
            >
              {ui.candles}
            </button>
            <button
              type="button"
              onClick={() => setMode("line")}
              className={`rounded-full px-2.5 py-1 text-[0.65rem] ${
                mode === "line" ? "bg-gb-ink text-white" : "text-gb-muted"
              }`}
            >
              {ui.line}
            </button>
          </div>
          <div className="text-right">
            <p className="text-lg font-medium tracking-tight text-gb-ink">{formatPrice(livePrice)}</p>
            <p className="text-[0.65rem] text-gb-faint">
              {source}
              {changePct !== null
                ? ` · ${changePct >= 0 ? "+" : ""}${changePct.toFixed(2)}%`
                : ""}
            </p>
          </div>
        </div>
      </div>

      {error ? (
        <p className="px-5 py-8 text-sm text-gb-muted sm:px-6">{error}</p>
      ) : !chart ? (
        <div className="mx-5 my-6 h-40 animate-pulse rounded-gb-md bg-gb-line/50 sm:mx-6" />
      ) : (
        <div className="relative mt-2 px-2 pb-2 sm:px-3">
          <svg
            viewBox={`0 0 ${chart.w} ${chart.h}`}
            className="h-auto w-full"
            role="img"
            aria-label={ui.chartAria}
          >
            <defs>
              <linearGradient id="gbChartFill" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor={chart.up ? colors.bull : colors.bear}
                  stopOpacity="0.16"
                />
                <stop offset="100%" stopColor={colors.elevated} stopOpacity="0" />
              </linearGradient>
            </defs>

            {chart.atrBand ? (
              <rect
                x="8"
                y={chart.atrBand.top}
                width={chart.w - 16}
                height={Math.max(2, chart.atrBand.bottom - chart.atrBand.top)}
                fill={colors.accent}
                opacity="0.06"
              />
            ) : null}

            {chart.levelLines.map((lvl) => (
              <g key={lvl.label}>
                <line
                  x1="8"
                  x2={chart.w - 8}
                  y1={lvl.y}
                  y2={lvl.y}
                  stroke={lvl.color}
                  strokeWidth="1"
                  strokeDasharray="4 4"
                  opacity="0.85"
                />
                <text
                  x={chart.w - 10}
                  y={lvl.y - 4}
                  textAnchor="end"
                  fill={lvl.color}
                  fontSize="10"
                  fontFamily="system-ui, sans-serif"
                >
                  {lvl.label}
                </text>
              </g>
            ))}

            {mode === "line" ? (
              <>
                <path d={chart.area} fill="url(#gbChartFill)" />
                <path
                  d={chart.line}
                  fill="none"
                  stroke={chart.up ? colors.bull : colors.bear}
                  strokeWidth="2.25"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              </>
            ) : (
              chart.candles.map((c, i) => (
                <g key={i}>
                  <line
                    x1={c.x}
                    x2={c.x}
                    y1={c.highY}
                    y2={c.lowY}
                    stroke={c.up ? colors.bull : colors.bear}
                    strokeWidth="1"
                  />
                  <rect
                    x={c.x - chart.candleW / 2}
                    y={Math.min(c.openY, c.closeY)}
                    width={chart.candleW}
                    height={Math.max(1.5, Math.abs(c.closeY - c.openY))}
                    fill={c.up ? colors.bull : colors.bear}
                    opacity="0.9"
                  />
                </g>
              ))
            )}

            <circle
              cx={chart.xAt(chart.candles.length - 1)}
              cy={chart.yAt(livePrice)}
              r="4"
              fill={colors.ink}
            />
          </svg>
          <div className="flex justify-between px-3 pb-4 text-[0.65rem] text-gb-faint">
            <span>{chart.firstDate?.slice(0, 10) ?? ""}</span>
            <span>
              {ui.windowNow} {chart.rangeMove.startsWith("-") ? "" : "+"}
              {chart.rangeMove}% · {chart.lastDate?.slice(0, 10) ?? ""}
            </span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-px border-t border-gb-line bg-gb-line sm:grid-cols-4">
        {(
          [
            { label: dict.today.floor, value: levels.support },
            { label: dict.today.ceiling, value: levels.watch },
            { label: dict.today.stop, value: levels.invalidation },
            ...(atr !== undefined ? [{ label: ui.swingAtr, value: atr }] : []),
          ] as const
        ).map((row) => (
          <div key={row.label} className="bg-gb-elevated px-3 py-3 text-center">
            <p className="text-[0.65rem] text-gb-faint">{row.label}</p>
            <p className="mt-1 text-xs font-medium tracking-tight text-gb-ink sm:text-sm">
              {formatPrice(row.value)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
