"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  Home,
  FileText,
  Package,
  Newspaper,
  Image as ImageIcon,
  LogOut,
  Menu,
  X,
  ChevronRight,
  MessageSquare,
  Download,
  Mail,
  Palette,
  Type,
} from "lucide-react";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

const menuItems = [
  { name: "Overview", path: "/admin", icon: LayoutDashboard, exact: true },
  { name: "Homepage", path: "/admin/homepage", icon: Home, exact: false },
  { name: "Products", path: "/admin/products", icon: Package, exact: false },
  { name: "Blogs", path: "/admin/blogs", icon: Newspaper, exact: false },
  { name: "Queries", path: "/admin/queries", icon: MessageSquare, exact: false },
  { name: "Catalog Requests", path: "/admin/catalog-requests", icon: Download, exact: false },
  { name: "Datasheet Requests", path: "/admin/datasheet-requests", icon: FileText, exact: false },
  { name: "Newsletter", path: "/admin/newsletter", icon: Mail, exact: false },
  { name: "Media Library", path: "/admin/media", icon: ImageIcon, exact: false },
  { name: "Master Data", path: "/admin/master-data", icon: Palette, exact: false },
  { name: "Page Titles", path: "/admin/page-titles", icon: Type, exact: false },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) {
      setLoading(false);
      return;
    }

    async function checkSession() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          router.push(`/admin/login?from=${pathname}`);
        }
      } catch {
        router.push(`/admin/login?from=${pathname}`);
      } finally {
        setLoading(false);
      }
    }

    checkSession();
  }, [pathname, isLoginPage, router]);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        router.push("/admin/login");
        router.refresh();
      }
    } catch (err) {
      console.error("Logout error", err);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#007190]">
        <div className="flex flex-col items-center gap-6">
          <div className="w-8 h-8 border border-white/20 border-t-white/80 rounded-full animate-spin" />
          <p className="font-michroma text-[10px] tracking-[0.3em] uppercase text-white/40">
            Verifying Session
          </p>
        </div>
      </div>
    );
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-[#f8f5f0]" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-60 flex-col bg-[#007190] transition-transform duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo area — enlarged and centered */}
        <div className="relative flex h-24 items-center justify-center px-6 border-b border-white/[0.06]">
          <Link href="/admin">
            <Image
              src="/images/NOBILITA_white.png"
              alt="Nobilita"
              width={170}
              height={46}
              className="object-contain"
            />
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="absolute right-4 text-white hover:text-white/70 transition-colors lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 pt-6 space-y-0.5 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = item.exact
              ? pathname === item.path
              : pathname === item.path || pathname.startsWith(item.path + "/");
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 text-white transition-all duration-150 group ${
                  isActive ? "bg-white/[0.07]" : "hover:bg-white/[0.04]"
                }`}
              >
                <Icon size={15} className="text-white" />
                <span
                  className="text-[11px] tracking-[0.15em] uppercase text-white"
                  style={{ fontFamily: "var(--font-michroma), sans-serif" }}
                >
                  {item.name}
                </span>
                {isActive && (
                  <ChevronRight size={12} className="ml-auto text-white" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom user area */}
        <div className="border-t border-white/[0.06] p-4 space-y-3">
          <div className="px-2">
            <p className="text-[10px] text-white truncate">{user?.email || "—"}</p>
            <p
              className="text-[9px] tracking-[0.2em] uppercase text-white mt-0.5"
              style={{ fontFamily: "var(--font-michroma), sans-serif" }}
            >
              {user?.role || "ADMIN"}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2.5 px-2 py-2 text-white hover:text-red-400 transition-colors text-[11px]"
          >
            <LogOut size={14} />
            <span
              className="tracking-[0.15em] uppercase"
              style={{ fontFamily: "var(--font-michroma), sans-serif" }}
            >
              Sign Out
            </span>
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile sidebar toggle (no topbar on desktop) */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="flex items-center px-6 pt-6 text-[#1a1a1a]/40 hover:text-[#1a1a1a] transition-colors lg:hidden"
        >
          <Menu size={20} />
        </button>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 pt-4 lg:p-10 lg:pt-6">
          <div className="mx-auto max-w-6xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
