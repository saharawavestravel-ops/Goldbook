import Link from "next/link";
import { brand } from "@/lib/design-tokens";
import { BottomNav } from "@/components/BottomNav";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { SideNav } from "@/components/SideNav";
import { Disclaimer } from "@/components/StatePanels";
import { getSessionUser } from "@/lib/auth";
import { getI18n } from "@/lib/i18n/server";

export async function AppShell({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  const { dict } = await getI18n();

  return (
    <div className="flex min-h-full flex-1">
      <SideNav />

      <div className="flex min-h-full min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-gb-line bg-gb-elevated/90 pt-[env(safe-area-inset-top)] backdrop-blur-md">
          <div className="gb-page flex h-14 items-center justify-between gap-3 sm:h-16">
            <Link
              href="/"
              className="gb-display text-xl tracking-tight text-gb-ink lg:pointer-events-none lg:invisible"
            >
              {brand.name}
            </Link>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden sm:block">
                <LanguageSwitcher compact />
              </div>
              {user ? (
                <Link
                  href="/you"
                  className="flex items-center gap-2.5 rounded-gb-md border border-transparent px-1.5 py-1 text-xs font-medium text-gb-muted transition hover:border-gb-line hover:bg-gb-bg hover:text-gb-ink"
                >
                  <span
                    className="flex h-8 w-8 items-center justify-center rounded-full text-[0.65rem] font-semibold text-white ring-2 ring-gb-accent/20 sm:h-7 sm:w-7"
                    style={{ background: user.accent }}
                  >
                    {user.initials}
                  </span>
                  <span className="hidden sm:inline">{user.name}</span>
                </Link>
              ) : (
                <p className="text-xs font-medium text-gb-faint">{dict.brand.privateDesk}</p>
              )}
            </div>
          </div>
        </header>

        <div className="flex flex-1 flex-col pb-[calc(5.75rem+env(safe-area-inset-bottom))] lg:pb-10">
          {children}
          <div className="gb-page mt-auto pt-8 pb-2 lg:pb-0">
            <Disclaimer />
          </div>
        </div>

        <div className="lg:hidden">
          <BottomNav />
        </div>
      </div>
    </div>
  );
}
