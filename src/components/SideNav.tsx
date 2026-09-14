"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { brand } from "@/lib/design-tokens";
import { useI18n } from "@/lib/i18n/client";
import { navItems } from "@/lib/nav";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SideNav() {
  const pathname = usePathname();
  const { dict } = useI18n();

  return (
    <aside className="sticky top-0 hidden h-dvh w-56 shrink-0 flex-col border-r border-gb-line bg-gb-elevated px-3 py-6 lg:flex">
      <Link href="/" className="gb-display px-3 text-2xl tracking-tight text-gb-ink">
        {brand.name}
      </Link>
      <p className="mt-1.5 px-3 text-[0.7rem] font-medium text-gb-accent">
        {dict.brand.privateDesk}
      </p>

      <nav aria-label="Main" className="mt-10 flex flex-1 flex-col gap-0.5">
        {navItems.map((item) => {
          const active = isActive(pathname, item.href);
          const label = dict.nav[item.id];
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`relative rounded-gb-md px-3 py-2.5 text-sm font-medium transition-colors duration-[var(--gb-duration-fast)] ${
                active
                  ? "bg-gb-accent-wash text-gb-ink"
                  : "text-gb-muted hover:bg-gb-bg hover:text-gb-ink"
              }`}
            >
              {active ? (
                <span
                  aria-hidden
                  className="absolute inset-y-2 start-0 w-0.5 rounded-full bg-gb-accent"
                />
              ) : null}
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
