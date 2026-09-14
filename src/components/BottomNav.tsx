"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/lib/i18n/client";
import { navItems } from "@/lib/nav";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function BottomNav() {
  const pathname = usePathname();
  const { dict } = useI18n();

  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-gb-line bg-gb-elevated/95 backdrop-blur-md"
    >
      <div className="gb-page flex h-[4.25rem] items-stretch justify-between px-0.5 sm:px-1">
        {navItems.map((item) => {
          const active = isActive(pathname, item.href);
          const label = dict.nav[item.id];
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex min-w-0 flex-1 flex-col items-center justify-center gap-1.5 px-1 text-[0.65rem] font-semibold tracking-wide transition-colors duration-[var(--gb-duration-fast)] ${
                active ? "text-gb-ink" : "text-gb-faint hover:text-gb-muted"
              }`}
            >
              <span
                className={`h-0.5 w-5 rounded-full transition-all ${
                  active ? "bg-gb-accent opacity-100" : "bg-transparent opacity-0"
                }`}
                aria-hidden
              />
              {label}
            </Link>
          );
        })}
      </div>
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
