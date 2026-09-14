"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useI18n } from "@/lib/i18n/client";
import { readApiData } from "@/lib/api-client";
import type { DeskUser } from "@/lib/users";
import type { StoredUserMeta } from "@/lib/users-store";

function formatWhen(iso: string | undefined, locale: string) {
  if (!iso) return "—";
  try {
    return new Intl.DateTimeFormat(locale === "ar" ? "ar" : locale === "fr" ? "fr" : "en", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

type HealthPayload = {
  productionReady: boolean;
  persist: { driver: "file" | "upstash"; durable: boolean };
  issues: { level: string; code: string; message: string }[];
  integrations: Record<string, boolean | string | undefined>;
};

export function YouProfile({
  user,
  meta,
  persist,
}: {
  user: DeskUser;
  meta?: StoredUserMeta;
  persist?: { driver: "file" | "upstash"; durable: boolean };
}) {
  const { locale, dict } = useI18n();
  const router = useRouter();
  const [currentPin, setCurrentPin] = useState("");
  const [nextPin, setNextPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [signingOut, setSigningOut] = useState(false);
  const [health, setHealth] = useState<HealthPayload | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch("/api/desk/health");
        const json = await res.json();
        const data = readApiData<HealthPayload>(json) ?? (json as HealthPayload);
        if (res.ok && data?.persist) setHealth(data);
      } catch {
        // ignore
      }
    })();
  }, []);

  function changePin() {
    setMessage(null);
    setError(null);
    if (nextPin !== confirmPin) {
      setError("PIN");
      return;
    }

    startTransition(async () => {
      const response = await fetch("/api/auth/change-pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPin, nextPin }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(data.error ?? "Error");
        return;
      }
      setCurrentPin("");
      setNextPin("");
      setConfirmPin("");
      setMessage("OK");
      router.refresh();
    });
  }

  async function signOut() {
    setSigningOut(true);
    setError(null);
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  const storage = health?.persist ?? persist;
  const issues = health?.issues ?? [];

  return (
    <div className="mx-auto grid w-full max-w-xl gap-8 lg:max-w-3xl lg:grid-cols-2 lg:items-start">
      <section className="gb-surface flex items-center gap-4 p-5 lg:col-span-2 lg:max-w-md">
        <span
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-lg font-semibold text-white"
          style={{ background: user.accent }}
        >
          {user.initials}
        </span>
        <div>
          <h2 className="text-xl font-medium text-gb-ink">{user.name}</h2>
          <p className="mt-1 text-sm text-gb-muted">{user.role}</p>
          {meta?.lastLoginAt ? (
            <p className="mt-2 text-xs text-gb-faint">{formatWhen(meta.lastLoginAt, locale)}</p>
          ) : null}
        </div>
      </section>

      <div className="lg:col-span-2">
        <LanguageSwitcher />
      </div>

      <section className="gb-surface p-5 sm:p-6">
        <h3 className="text-sm font-medium text-gb-ink">{dict.you.changePin}</h3>
        <div className="mt-5 flex flex-col gap-3">
          <label className="block">
            <span className="mb-1.5 block text-xs text-gb-muted">{dict.you.currentPin}</span>
            <input
              type="password"
              inputMode="numeric"
              autoComplete="current-password"
              value={currentPin}
              onChange={(event) => setCurrentPin(event.target.value.replace(/\D/g, "").slice(0, 4))}
              className="w-full rounded-gb-md border border-gb-line bg-gb-bg px-3 py-3 text-gb-ink outline-none focus:border-gb-ink"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs text-gb-muted">{dict.you.newPin}</span>
            <input
              type="password"
              inputMode="numeric"
              autoComplete="new-password"
              value={nextPin}
              onChange={(event) => setNextPin(event.target.value.replace(/\D/g, "").slice(0, 4))}
              className="w-full rounded-gb-md border border-gb-line bg-gb-bg px-3 py-3 text-gb-ink outline-none focus:border-gb-ink"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs text-gb-muted">{dict.you.confirmPin}</span>
            <input
              type="password"
              inputMode="numeric"
              autoComplete="new-password"
              value={confirmPin}
              onChange={(event) => setConfirmPin(event.target.value.replace(/\D/g, "").slice(0, 4))}
              className="w-full rounded-gb-md border border-gb-line bg-gb-bg px-3 py-3 text-gb-ink outline-none focus:border-gb-ink"
            />
          </label>
        </div>

        {error ? <p className="mt-3 text-sm text-gb-danger">{error}</p> : null}
        {message ? <p className="mt-3 text-sm text-gb-success">{message}</p> : null}

        <button
          type="button"
          onClick={changePin}
          disabled={pending}
          className="gb-btn gb-btn-secondary mt-5 w-full disabled:opacity-60"
        >
          {pending ? dict.common.loading : dict.you.changePin}
        </button>
      </section>

      <div className="flex flex-col gap-4">
        <section className="gb-surface p-5 text-sm">
          <h3 className="text-sm font-medium text-gb-ink">{dict.you.dataHealth}</h3>
          {storage ? (
            <p className="mt-3 text-gb-muted">
              {dict.you.storage}:{" "}
              <span className="text-gb-ink">
                {storage.durable ? dict.you.durable : dict.you.ephemeral}
              </span>
              <span className="text-gb-faint"> · {storage.driver}</span>
            </p>
          ) : null}
          {issues.length === 0 ? (
            <p className="mt-2 text-xs text-gb-success">{dict.you.feedsReady}</p>
          ) : (
            <div className="mt-3 space-y-2">
              <p className="text-xs text-gb-muted">{dict.you.feedsIssues}</p>
              {issues.slice(0, 4).map((issue) => (
                <p
                  key={issue.code}
                  className={`text-xs leading-relaxed ${
                    issue.level === "error" ? "text-gb-danger" : "text-gb-muted"
                  }`}
                >
                  {issue.message}
                </p>
              ))}
            </div>
          )}
        </section>

        <button
          type="button"
          onClick={signOut}
          disabled={signingOut}
          className="gb-btn gb-btn-ghost justify-start text-gb-danger disabled:opacity-60"
        >
          {signingOut ? dict.common.loading : dict.you.signOut}
        </button>
      </div>
    </div>
  );
}
