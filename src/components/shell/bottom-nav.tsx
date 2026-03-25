"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Eye, LayoutDashboard, MapPin, TrendingUp } from "lucide-react";

interface BottomNavItem {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
}

const BOTTOM_NAV_ITEMS: ReadonlyArray<BottomNavItem> = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/analemma", label: "Analemma", icon: TrendingUp },
  { href: "/landmarks", label: "Landmarks", icon: MapPin },
  { href: "/observatory", label: "Observatory", icon: Eye },
];

function isActivePath(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/" || pathname.startsWith("/city");
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-surface-container-lowest shadow-[0_-4px_24px_rgba(11,28,48,0.06)] md:hidden"
      aria-label="Mobile primary"
    >
      <div className="grid grid-cols-4">
        {BOTTOM_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = isActivePath(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-h-14 flex-col items-center justify-center gap-1 border-t-2 px-2 py-2 text-xs font-semibold tracking-wide transition-colors ${
                isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-secondary hover:text-on-surface"
              }`}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}