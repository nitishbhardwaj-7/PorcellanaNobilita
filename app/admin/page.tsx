"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FileText, Package, Newspaper, Image as ImageIcon, ArrowUpRight, Plus, Inbox } from "lucide-react";

interface Stats {
  productsCount: number;
  blogsCount: number;
  mediaCount: number;
  publishedProducts: number;
  publishedBlogs: number;
  submissionsCount: number;
  unreadSubmissions: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    productsCount: 0,
    blogsCount: 0,
    mediaCount: 0,
    publishedProducts: 0,
    publishedBlogs: 0,
    submissionsCount: 0,
    unreadSubmissions: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [productsRes, blogsRes, mediaRes, submissionsRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/blogs"),
          fetch("/api/media"),
          fetch("/api/submissions"),
        ]);

        const productsData = productsRes.ok ? await productsRes.json() : { data: [] };
        const blogsData = blogsRes.ok ? await blogsRes.json() : { data: [] };
        const mediaData = mediaRes.ok ? await mediaRes.json() : { data: [] };
        const submissionsData = submissionsRes.ok ? await submissionsRes.json() : { data: [] };

        const products = productsData.data || [];
        const blogs = blogsData.data || [];
        const media = mediaData.data || [];
        const submissions = submissionsData.data || [];

        setStats({
          productsCount: products.length,
          blogsCount: blogs.length,
          mediaCount: media.length,
          publishedProducts: products.filter((p: any) => p.status === "PUBLISHED").length,
          publishedBlogs: blogs.filter((b: any) => b.status === "PUBLISHED").length,
          submissionsCount: submissions.length,
          unreadSubmissions: submissions.filter((s: any) => !s.isRead).length,
        });
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const fontMichroma = { fontFamily: "var(--font-michroma), sans-serif" };
  const fontIvymode = { fontFamily: "var(--font-ivymode), serif" };

  const cards = [
    {
      label: "Products",
      count: stats.productsCount,
      detail: `${stats.publishedProducts} published · ${stats.productsCount - stats.publishedProducts} draft`,
      href: "/admin/products",
      icon: Package,
      cta: "Manage Products",
    },
    {
      label: "Blogs",
      count: stats.blogsCount,
      detail: `${stats.publishedBlogs} published · ${stats.blogsCount - stats.publishedBlogs} draft`,
      href: "/admin/blogs",
      icon: Newspaper,
      cta: "Manage Blogs",
    },
    {
      label: "Form Submissions",
      count: stats.submissionsCount,
      detail: `${stats.unreadSubmissions} unread · queries, catalog, datasheet & newsletter`,
      href: "/admin/queries",
      icon: Inbox,
      cta: "View Queries",
    },
    {
      label: "Media Assets",
      count: stats.mediaCount,
      detail: "Uploaded images & files",
      href: "/admin/media",
      icon: ImageIcon,
      cta: "Open Library",
    },
  ];

  const quickActions = [
    { label: "New Product", href: "/admin/products/new" },
    { label: "New Blog", href: "/admin/blogs/new" },
    { label: "Upload Media", href: "/admin/media" },
  ];

  if (loading) {
    return (
      <div className="space-y-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-36 bg-white border border-[#1a1a1a]/8 animate-pulse" />
          ))}
        </div>
        <div className="h-48 bg-white border border-[#1a1a1a]/8 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-10" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
      {/* Welcome header */}
      <div>
        <p className="text-[10px] tracking-[0.3em] uppercase text-[#1a1a1a]/35 mb-2" style={fontMichroma}>
          Nobilita Content Studio
        </p>
        <h2 className="text-3xl font-light text-[#1a1a1a] leading-tight" style={fontIvymode}>
          Welcome Back
        </h2>
        <p className="mt-2 text-sm text-[#8b8b8b]">
          Manage your pages, product catalogue, and media library from here.
        </p>
      </div>

      {/* Divider */}
      <div className="h-px bg-[#1a1a1a]/8" />

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="bg-white border border-[#1a1a1a]/8 p-6 flex flex-col justify-between group hover:border-[#1a1a1a]/20 transition-colors"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-[9px] tracking-[0.3em] uppercase text-[#1a1a1a]/40 mb-3" style={fontMichroma}>
                    {card.label}
                  </p>
                  <p className="text-4xl font-light text-[#1a1a1a]" style={fontIvymode}>
                    {card.count}
                  </p>
                </div>
                <div className="w-9 h-9 border border-[#1a1a1a]/10 flex items-center justify-center text-[#1a1a1a]/30">
                  <Icon size={15} />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-[11px] text-[#8b8b8b]">{card.detail}</p>
                <Link
                  href={card.href}
                  className="flex items-center gap-1 text-[9px] tracking-[0.2em] uppercase text-[#1a1a1a]/40 hover:text-[#1a1a1a] transition-colors"
                  style={fontMichroma}
                >
                  {card.cta}
                  <ArrowUpRight size={11} />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick actions */}
      <div>
        <p className="text-[9px] tracking-[0.3em] uppercase text-[#1a1a1a]/35 mb-4" style={fontMichroma}>
          Quick Actions
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="flex items-center justify-between border border-[#1a1a1a]/10 bg-white hover:bg-[#1a1a1a] hover:border-[#1a1a1a] px-4 py-3.5 group transition-all duration-200"
            >
              <span
                className="text-[10px] tracking-[0.15em] uppercase text-[#1a1a1a]/60 group-hover:text-white transition-colors"
                style={fontMichroma}
              >
                {action.label}
              </span>
              <Plus size={13} className="text-[#1a1a1a]/30 group-hover:text-white transition-colors" />
            </Link>
          ))}
        </div>
      </div>

      {/* Info banner */}
      <div className="border-l-2 border-[#1a1a1a]/20 pl-5 py-1">
        <p className="text-xs text-[#8b8b8b] leading-relaxed">
          <span className="text-[#1a1a1a]/60 font-medium">Pro tip:</span> Publish a product or blog post from its editor to push content live instantly. Draft items are only visible in the admin preview.
        </p>
      </div>
    </div>
  );
}
