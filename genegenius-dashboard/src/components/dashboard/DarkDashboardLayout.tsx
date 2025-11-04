"use client";

import { ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Search,
  Home,
  Activity,
  FileText,
  Database,
  Star,
  Code,
  Beaker,
  Bell,
  User,
} from "lucide-react";

interface DarkDashboardLayoutProps {
  children: ReactNode;
}

interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  path: string;
}

export function DarkDashboardLayout({ children }: DarkDashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();

  const navItems: NavItem[] = [
    { icon: Home, label: "Dashboard", path: "/" },
    { icon: Activity, label: "Analytics", path: "/analytics" },
    { icon: FileText, label: "Reports", path: "/reports" },
    { icon: Database, label: "Database", path: "/database" },
    { icon: Star, label: "Favorites", path: "/favorites" },
    { icon: Code, label: "API", path: "/api-docs" },
    { icon: Beaker, label: "Lab", path: "/lab" },
    { icon: Bell, label: "Notifications", path: "/notifications" },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <div className="flex h-screen bg-[#0f1419]">
      {/* Sidebar */}
      <aside className="w-16 bg-[#1a1f28] border-r border-gray-800 flex flex-col items-center py-4 gap-2">
        {/* Logo */}
        <div className="mb-4">
          <button
            onClick={() => handleNavigation("/")}
            className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-blue-500/50"
            aria-label="Home"
            title="GeneGenius Dashboard"
          >
            <span className="text-white font-bold text-sm">GG</span>
          </button>
        </div>

        {/* Search */}
        <button
          className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
          aria-label="Search"
          title="Search"
        >
          <Search className="h-5 w-5" />
        </button>

        <div className="w-8 h-px bg-gray-800 my-2" />

        {/* Navigation Items */}
        {navItems.map((item, index) => {
          const isActive = pathname === item.path;
          return (
            <button
              key={index}
              onClick={() => handleNavigation(item.path)}
              className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-200 group relative ${
                isActive
                  ? "text-white bg-gray-800 shadow-lg"
                  : "text-gray-400 hover:text-white hover:bg-gray-800/70 hover:scale-105 active:scale-95"
              }`}
              aria-label={item.label}
              title={item.label}
            >
              <item.icon className="h-5 w-5" />
              {isActive && (
                <span className="absolute left-0 w-1 h-6 bg-blue-500 rounded-r-full" />
              )}
            </button>
          );
        })}
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
