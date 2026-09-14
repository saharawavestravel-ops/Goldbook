"use client";

import { useState } from "react";
import type { DailyBrief } from "@/lib/brief-shared";
import { briefShareText } from "@/lib/brief-shared";
import { useI18n } from "@/lib/i18n/client";
import { getCopy } from "@/lib/i18n/copy";

export function BriefActions({ brief }: { brief: DailyBrief }) {
  const { locale } = useI18n();
  const ui = getCopy(locale).ui;
  const [note, setMessage] = useState<string | null>(null);

  async function share() {
    const text = briefShareText(brief);
    try {
      if (navigator.share) {
        await navigator.share({ title: ui.shareTitle, text });
        setMessage(ui.share);
        return;
      }
      await navigator.clipboard.writeText(text);
      setMessage(ui.copied);
    } catch {
      try {
        await navigator.clipboard.writeText(text);
        setMessage(ui.copied);
      } catch {
        setMessage(ui.shareFail);
      }
    }
  }

  function saveNote() {
    const key = `goldbook-brief-note:${brief.dateLabel}`;
    window.localStorage.setItem(
      key,
      JSON.stringify({
        savedAt: new Date().toISOString(),
        bias: brief.bias,
        confidence: brief.confidence,
        summary: brief.summary,
      }),
    );
    setMessage(ui.saved);
  }

  return (
    <div className="flex flex-col gap-3">
      <button type="button" onClick={share} className="gb-btn gb-btn-primary w-full">
        {ui.share}
      </button>
      <button type="button" onClick={saveNote} className="gb-btn gb-btn-secondary w-full">
        {ui.save}
      </button>
      {note ? <p className="text-center text-sm text-gb-success">{note}</p> : null}
    </div>
  );
}
