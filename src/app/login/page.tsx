import { Suspense } from "react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { LoginForm } from "@/components/LoginForm";
import { brand } from "@/lib/design-tokens";
import { getI18n } from "@/lib/i18n/server";
import { localizeUser, userList } from "@/lib/users";

export default async function LoginPage() {
  const { locale, dict } = await getI18n();
  const localizedUsers = userList.map((user) => localizeUser(user, locale));

  return (
    <main className="relative flex min-h-full flex-1 flex-col justify-center overflow-hidden px-5 py-12 pt-[max(3rem,env(safe-area-inset-top))] pb-[max(3rem,env(safe-area-inset-bottom))] sm:px-8 lg:py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 70% 45% at 50% 0%, #dbeafe 0%, transparent 55%), radial-gradient(ellipse 40% 35% at 100% 100%, #eff6ff 0%, transparent 50%), #f4f6f9",
        }}
      />

      <div className="gb-lift mx-auto w-full max-w-md text-center">
        <p className="gb-eyebrow">{dict.login.eyebrow}</p>
        <h1 className="gb-display mt-3 text-5xl text-gb-ink sm:text-6xl">{brand.name}</h1>
        <p className="mt-3 text-base leading-relaxed text-gb-muted">{dict.login.blurb}</p>
      </div>

      <div className="gb-lift mx-auto mt-6 w-full max-w-md" style={{ animationDelay: "40ms" }}>
        <LanguageSwitcher compact />
      </div>

      <div className="gb-lift mt-8" style={{ animationDelay: "90ms" }}>
        <Suspense
          fallback={<div className="mx-auto h-80 max-w-md animate-pulse rounded-gb-lg bg-gb-line/50" />}
        >
          <LoginForm users={localizedUsers} />
        </Suspense>
      </div>

      <div className="mx-auto mt-10 max-w-sm text-center">
        <p className="text-xs leading-relaxed text-gb-faint">{dict.login.disclaimer}</p>
      </div>
    </main>
  );
}
