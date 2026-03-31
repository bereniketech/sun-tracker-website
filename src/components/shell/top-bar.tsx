"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { SearchBar } from "@/components/search-bar";

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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isSearchOpen) {
      return;
    }

    function handleClickOutside(event: MouseEvent): void {
      if (searchPanelRef.current && !searchPanelRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent): void {
      if (event.key === "Escape") {
        setIsSearchOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isSearchOpen]);

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
          <span className="font-headline text-xl font-bold uppercase tracking-widest bg-gradient-to-r from-primary to-primary-container bg-clip-text text-transparent">
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

        <div className="relative hidden md:block" ref={searchPanelRef}>
          <button
            type="button"
            aria-label="Search for a location"
            aria-expanded={isSearchOpen}
            onClick={() => setIsSearchOpen((prev) => !prev)}
            className="flex h-11 w-11 items-center justify-center rounded-full text-secondary transition-colors hover:bg-surface-container hover:text-on-surface"
          >
            <Search className="h-5 w-5" />
          </button>

          {isSearchOpen ? (
            <div className="absolute right-0 top-full mt-2 w-[min(56rem,calc(100vw-2rem))] z-50">
              <SearchBar />
            </div>
          ) : null}
        </div>

        <div className="flex items-center" />
      </div>
    </header>
  );
}