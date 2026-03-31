"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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

  if (pathname.startsWith("/login")) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/20 bg-white/70 backdrop-blur-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between gap-4 px-4 py-3 md:px-6">
        <div className="flex items-center gap-2.5 group">
          <span className="text-lg leading-none text-primary transition-transform duration-300 group-hover:rotate-90 group-hover:scale-110" aria-hidden="true">
            ✦
          </span>
          <div className="flex flex-col leading-none">
            <span className="font-headline text-base font-bold uppercase tracking-[0.22em] bg-gradient-to-r from-primary to-primary-container bg-clip-text text-transparent md:text-lg">
              SUN TRACKER
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-secondary">
              by Helios Chrono
            </span>
          </div>
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

        <div className="hidden md:block" aria-hidden="true" />

        <div className="flex items-center" />
      </div>
    </header>
  );
}