"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Settings } from "lucide-react";

interface TopBarItem {
  href: string;
  label: string;
}

const TOP_BAR_ITEMS: ReadonlyArray<TopBarItem> = [
  { href: "/", label: "Dashboard" },
  { href: "/analemma", label: "Analemma" },
  { href: "/landmarks", label: "Landmarks" },
  { href: "/observatory", label: "Observatory" },
];

function isActivePath(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/" || pathname.startsWith("/city");
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function TopBar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between gap-4 px-4 py-3 md:px-6">
        <div className="flex items-center gap-2">
          <span className="text-lg leading-none text-primary" aria-hidden="true">
            ✦
          </span>
          <span className="font-headline text-xl font-bold uppercase tracking-widest text-primary">
            HELIOS CHRONO
          </span>
        </div>

        <nav className="hidden items-center gap-5 md:flex" aria-label="Primary">
          {TOP_BAR_ITEMS.map((item) => {
            const isActive = isActivePath(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`border-b-2 pb-1 text-sm font-semibold tracking-wide transition-colors ${
                  isActive
                    ? "border-primary text-primary"
                    : "border-transparent text-secondary hover:text-on-surface"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Notifications"
            className="flex h-11 w-11 items-center justify-center rounded-full text-secondary transition-colors hover:bg-surface-container hover:text-on-surface"
          >
            <Bell className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Settings"
            className="hidden h-11 w-11 items-center justify-center rounded-full text-secondary transition-colors hover:bg-surface-container hover:text-on-surface md:flex"
          >
            <Settings className="h-5 w-5" />
          </button>
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-container-high text-sm font-semibold text-on-surface">
            HC
          </div>
        </div>
      </div>
    </header>
  );
}