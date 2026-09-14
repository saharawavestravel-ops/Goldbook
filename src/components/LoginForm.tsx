"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { useI18n } from "@/lib/i18n/client";
import type { DeskUser, UserId } from "@/lib/users";

const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "⌫"] as const;
const PIN_LENGTH = 4;

export function LoginForm({ users }: { users: DeskUser[] }) {
  const { dict } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selected, setSelected] = useState<UserId | null>(null);
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onKey(key: string) {
    if (!selected) {
      setError(dict.login.selectFirst);
      return;
    }
    setError(null);
    if (key === "⌫") {
      setPin((value) => value.slice(0, -1));
      return;
    }
    if (!key || pin.length >= PIN_LENGTH) return;
    setPin((value) => value + key);
  }

  function selectUser(id: UserId) {
    setSelected(id);
    setPin("");
    setError(null);
  }

  function submit() {
    if (!selected) {
      setError(dict.login.selectFirst);
      return;
    }
    if (pin.length !== PIN_LENGTH) {
      setError(dict.login.enterPin);
      return;
    }

    startTransition(async () => {
      try {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: selected, pin }),
        });
        const data = (await response.json()) as { error?: string; ok?: boolean };
        if (!response.ok) {
          setError(data.error ?? `Error ${response.status}`);
          setPin("");
          return;
        }
        const next = searchParams.get("next") || "/";
        router.replace(next);
        router.refresh();
      } catch {
        setError("Network error — try again");
        setPin("");
      }
    });
  }

  const selectedUser = users.find((user) => user.id === selected);

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-8">
      <div>
        <p className="gb-eyebrow mb-3 text-center">{dict.login.selectProfile}</p>
        <div className="grid grid-cols-2 gap-3">
          {users.map((user, index) => {
            const active = selected === user.id;
            return (
              <button
                key={user.id}
                type="button"
                onClick={() => selectUser(user.id)}
                style={{ animationDelay: `${index * 70}ms` }}
                className={`gb-surface gb-profile-card gb-lift flex flex-col items-center gap-3 p-5 text-center ${
                  active ? "is-active" : "hover:border-gb-line-strong"
                }`}
              >
                <span
                  className="flex h-16 w-16 items-center justify-center rounded-full text-lg font-semibold text-white"
                  style={{ background: user.accent }}
                >
                  {user.initials}
                </span>
                <span>
                  <span className="block text-base font-medium text-gb-ink">{user.name}</span>
                  <span className="mt-1 block text-xs text-gb-muted">{user.role}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {selected ? (
        <div key={selected} className="gb-lift flex flex-col gap-6">
          <div className="text-center">
            <p className="gb-eyebrow">
              {dict.login.pinFor} {selectedUser?.name}
            </p>
            <div className="mt-4 flex justify-center gap-3">
              {Array.from({ length: PIN_LENGTH }).map((_, index) => (
                <span
                  key={`${selected}-${index}-${index < pin.length}`}
                  className={`h-3 w-3 rounded-full ${
                    index < pin.length ? "gb-pin-dot-on bg-gb-accent" : "bg-gb-line-strong"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {keys.map((key, index) =>
              key === "" ? (
                <span key={`empty-${index}`} />
              ) : (
                <button
                  key={key}
                  type="button"
                  onClick={() => onKey(key)}
                  className="flex h-14 items-center justify-center rounded-gb-md bg-gb-elevated text-xl font-medium text-gb-ink shadow-gb-sm transition hover:bg-gb-accent-wash active:scale-[0.98] sm:h-16"
                >
                  {key}
                </button>
              ),
            )}
          </div>

          {error ? <p className="text-center text-sm text-gb-danger">{error}</p> : null}

          <button
            type="button"
            onClick={submit}
            disabled={pending || pin.length !== PIN_LENGTH}
            className="gb-btn gb-btn-primary w-full disabled:opacity-60"
          >
            {pending ? dict.common.loading : dict.login.signIn}
          </button>
        </div>
      ) : null}
    </div>
  );
}
