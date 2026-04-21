import { redirect } from "next/navigation";
import Link from "next/link";
import { getAdminClient } from "@/lib/supabase/admin";
import { LayoutDashboard, MapPin, Users } from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  // Double-check auth at layout level
  try {
    const admin = getAdminClient();
    // Test admin access by attempting a simple query
    await admin.from("cities").select("id", { count: "exact", head: true });
  } catch {
    redirect("/?error=unauthorized");
  }

  const navItems = [
    {
      href: "/admin",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      href: "/admin/cities",
      label: "Cities",
      icon: MapPin,
    },
    {
      href: "/admin/landmarks",
      label: "Landmarks",
      icon: Users,
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900">Admin</h1>
          <p className="text-sm text-gray-600">Dashboard</p>
        </div>

        <nav className="mt-6">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <IconComponent className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
