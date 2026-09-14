"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useEffectEvent } from "react";
import { agents, type AgentId } from "@/lib/agents";
import { AgentAvatar } from "@/components/AgentAvatar";
import { getDeskRunSteps } from "@/lib/desk-run";
import { ErrorPanel } from "@/components/StatePanels";
import { useI18n } from "@/lib/i18n/client";
import { getCopy } from "@/lib/i18n/copy";
import { agentJobPlain } from "@/lib/plain-language";
import { readApiData, readApiError } from "@/lib/api-client";

type StepState = "pending" | "active" | "done";
type Phase = "running" | "ready" | "cancelled" | "error";

type RunBrief = {
  bias: string;
  confidence: number;
  summary: string;
  plainTitle?: string;
  plainExplain?: string;
};

type RunResponse = {
  ok: boolean;
  error?: string;
  brief?: RunBrief;
};

function parseRunResponse(json: unknown): RunResponse {
  const nested = readApiData<{ brief?: RunBrief }>(json);
  if (nested) {
    return { ok: true, brief: nested.brief };
  }
  if (json && typeof json === "object" && "ok" in json) {
    const body = json as { ok: boolean; brief?: RunBrief; error?: unknown };
    if (body.ok) return { ok: true, brief: body.brief };
    return { ok: false, error: readApiError(json) };
  }
  return { ok: false, error: readApiError(json) };
}

export function DeskRun() {
  const { locale, dict } = useI18n();
  const copy = getCopy(locale);
  const deskRunSteps = getDeskRunSteps(locale);
  const [phase, setPhase] = useState<Phase>("running");
  const [activeIndex, setActiveIndex] = useState(0);
  const [statusLine, setStatusLine] = useState(
    () => getDeskRunSteps(locale)[0]?.line ?? copy.runStarting,
  );
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [plainTitle, setPlainTitle] = useState<string | null>(null);
  const cancelledRef = useRef(false);
  const runStartedRef = useRef(false);
  const engineDoneRef = useRef(false);
  const engineResultRef = useRef<RunResponse | null>(null);

  const finishIfReady = useEffectEvent(() => {
    if (cancelledRef.current) return;
    if (!engineDoneRef.current) return;
    if (activeIndex < deskRunSteps.length - 1) return;

    const result = engineResultRef.current;
    if (result && !result.ok) {
      setPhase("error");
      setError(result.error ?? copy.runFailed);
      setStatusLine(dict.run.error);
      return;
    }

    setPhase("ready");
    setStatusLine(dict.run.done);
    if (result?.brief?.plainTitle) setPlainTitle(result.brief.plainTitle);
    if (result?.brief?.plainExplain) setSummary(result.brief.plainExplain);
    else if (result?.brief?.summary) setSummary(result.brief.summary);
  });

  const advance = useEffectEvent(() => {
    if (cancelledRef.current) return;

    if (activeIndex >= deskRunSteps.length - 1) {
      finishIfReady();
      return;
    }

    const next = activeIndex + 1;
    setActiveIndex(next);
    setStatusLine(deskRunSteps[next].line);
  });

  useEffect(() => {
    if (runStartedRef.current) return;
    runStartedRef.current = true;

    void (async () => {
      try {
        const response = await fetch("/api/desk/run", { method: "POST" });
        const json = await response.json();
        const data = parseRunResponse(json);
        if (!response.ok && data.ok) {
          engineResultRef.current = { ok: false, error: readApiError(json, copy.runFailed) };
        } else {
          engineResultRef.current = data;
        }
        if (cancelledRef.current) return;
        engineDoneRef.current = true;
        finishIfReady();
      } catch {
        if (cancelledRef.current) return;
        engineResultRef.current = { ok: false, error: copy.runNetwork };
        engineDoneRef.current = true;
        finishIfReady();
      }
    })();
  }, []);

  useEffect(() => {
    if (phase !== "running") return;

    const step = deskRunSteps[activeIndex];
    if (!step) return;

    const timer = window.setTimeout(() => {
      advance();
    }, step.delayMs);

    return () => window.clearTimeout(timer);
  }, [phase, activeIndex]);

  useEffect(() => {
    if (phase === "running" && activeIndex >= deskRunSteps.length - 1) {
      finishIfReady();
    }
  }, [phase, activeIndex]);

  function cancel() {
    cancelledRef.current = true;
    setPhase("cancelled");
    setStatusLine(dict.run.stopped);
  }

  function runAgain() {
    cancelledRef.current = false;
    runStartedRef.current = false;
    engineDoneRef.current = false;
    engineResultRef.current = null;
    setError(null);
    setSummary(null);
    setPlainTitle(null);
    setPhase("running");
    setActiveIndex(0);
    setStatusLine(deskRunSteps[0]?.line ?? copy.runStarting);

    runStartedRef.current = true;
    void (async () => {
      try {
        const response = await fetch("/api/desk/run", { method: "POST" });
        const json = await response.json();
        const data = parseRunResponse(json);
        if (cancelledRef.current) return;
        if (!response.ok && data.ok) {
          engineResultRef.current = { ok: false, error: readApiError(json, copy.runFailed) };
        } else {
          engineResultRef.current = data;
        }
        engineDoneRef.current = true;
        finishIfReady();
      } catch {
        if (cancelledRef.current) return;
        engineResultRef.current = { ok: false, error: copy.runNetwork };
        engineDoneRef.current = true;
        finishIfReady();
      }
    })();
  }

  function stepState(index: number): StepState {
    if (phase === "ready") return "done";
    if (phase === "error") {
      if (index < activeIndex) return "done";
      if (index === activeIndex) return "active";
      return "pending";
    }
    if (phase === "cancelled") {
      if (index < activeIndex) return "done";
      if (index === activeIndex) return "active";
      return "pending";
    }
    if (index < activeIndex) return "done";
    if (index === activeIndex) return "active";
    return "pending";
  }

  function agentById(id: AgentId) {
    return agents.find((agent) => agent.id === id)!;
  }

  const progress =
    phase === "ready"
      ? 100
      : Math.round(((activeIndex + (phase === "running" ? 0.35 : 0)) / deskRunSteps.length) * 100);

  const phaseLabel =
    phase === "ready"
      ? dict.run.done
      : phase === "cancelled"
        ? dict.run.stopped
        : phase === "error"
          ? dict.run.error
          : dict.run.live;

  return (
    <div className="flex flex-1 flex-col gap-8">
      <div className="gb-lift text-center">
        <p className="gb-eyebrow">{phaseLabel}</p>
        <p key={statusLine} className="gb-fade-in mt-3 text-lg text-gb-ink-soft">
          {statusLine}
        </p>
        {phase === "running" ? (
          <div className="mx-auto mt-5 max-w-sm">
            <div className="mb-2 flex justify-between text-[0.65rem] text-gb-faint">
              <span>{dict.run.progress}</span>
              <span>{Math.min(99, progress)}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-gb-line">
              <div
                className="h-full rounded-full bg-gb-accent transition-all duration-500"
                style={{ width: `${Math.min(99, progress)}%` }}
              />
            </div>
          </div>
        ) : null}
        {plainTitle && phase === "ready" ? (
          <p className="gb-fade-up mx-auto mt-3 max-w-md text-lg font-medium text-gb-ink">
            {plainTitle}
          </p>
        ) : null}
        {summary && phase === "ready" ? (
          <p className="gb-fade-up mx-auto mt-3 max-w-md text-sm leading-relaxed text-gb-muted">
            {summary}
          </p>
        ) : null}
        {error ? (
          <div className="mt-4 text-left">
            <ErrorPanel title={dict.run.error} description={error} />
          </div>
        ) : null}
      </div>

      <ol className="flex flex-col gap-3">
        {deskRunSteps.map((step, index) => {
          const agent = agentById(step.agentId);
          const state = stepState(index);
          return (
            <li
              key={step.agentId}
              className={`gb-surface flex items-center gap-4 p-4 transition-all duration-[var(--gb-duration)] ${
                state === "active" ? "translate-x-0.5 border-gb-ink shadow-gb-md" : ""
              } ${state === "done" ? "border-gb-line-strong" : ""} ${
                state === "pending" ? "opacity-40" : "opacity-100"
              }`}
            >
              <span className="relative">
                <AgentAvatar
                  agentId={agent.id}
                  name={agent.name}
                  initials={agent.initials}
                  accent={agent.accent}
                  size="md"
                  className={state === "active" ? "animate-[gb-pulse-soft_1.4s_ease-in-out_infinite]" : ""}
                />
                <span
                  className={`absolute -end-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-gb-elevated transition ${
                    state === "done"
                      ? "scale-110 bg-gb-success"
                      : state === "active"
                        ? "bg-gb-accent"
                        : "bg-gb-faint"
                  }`}
                />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gb-ink">
                  {agent.name}
                  <span className="ms-2 text-xs font-normal text-gb-faint">
                    {agentJobPlain(agent.id, locale).split("—")[0]?.trim() ?? agent.role}
                  </span>
                </p>
                <p className="mt-1 text-sm text-gb-muted">{step.line}</p>
              </div>
            </li>
          );
        })}
      </ol>

      {phase === "ready" ? (
        <div className="gb-fade-up mt-auto flex flex-col gap-3">
          <Link href="/" className="gb-btn gb-btn-primary w-full">
            {dict.run.seeResult}
          </Link>
          <Link href="/brief" className="gb-btn gb-btn-secondary w-full">
            {dict.run.openBrief}
          </Link>
        </div>
      ) : null}

      {phase === "running" ? (
        <button type="button" onClick={cancel} className="gb-btn gb-btn-ghost justify-center text-gb-danger">
          {dict.run.cancel}
        </button>
      ) : null}

      {phase === "cancelled" || phase === "error" ? (
        <div className="mt-auto flex flex-col gap-3">
          <button type="button" onClick={runAgain} className="gb-btn gb-btn-secondary w-full">
            {dict.run.runAgain}
          </button>
          <Link href="/" className="gb-btn gb-btn-ghost justify-center">
            {dict.agents.backToday}
          </Link>
        </div>
      ) : null}
    </div>
  );
}
