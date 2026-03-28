"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, LogOut, Settings, UserRound } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
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
  const { user, signOut } = useAuth();

  if (pathname.startsWith("/login")) {
    return null;
  }

  async function handleSignOut(): Promise<void> {
    await signOut();
  }

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

        <div className="hidden w-64 md:block mx-4">
          <SearchBar />
        </div>

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
          {user ? (
            <button
              type="button"
              aria-label="Sign out"
              title="Sign out"
              onClick={() => void handleSignOut()}
              className="hidden h-11 items-center gap-2 rounded-full bg-surface-container-high px-4 text-sm font-semibold text-on-surface transition-colors hover:bg-surface-container md:flex"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Sign out
            </button>
          ) : (
            <Link
              href="/login"
              aria-label="Go to login"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-container-high text-on-surface transition-colors hover:bg-surface-container"
            >
              <UserRound className="h-5 w-5" aria-hidden="true" />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}