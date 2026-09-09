"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Eye, EyeOff, Check } from "lucide-react";
import { MediaPickerButton } from "../_components/MediaPicker";
import { StyleRow } from "../_components/StyleControls";
import { HEADING_SIZE_OPTIONS } from "@/lib/textStyle";

interface Blog {
  id: string;
  title: string;
  slug: string;
  tag: string | null;
  status: "DRAFT" | "PUBLISHED";
  heroImage: string | null;
  order: number;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

interface HeroSettings {
  blogHeroImage: string;
  blogHeroTitle: string;
  blogHeroTitleColor: string;
  blogHeroTitleFont: string;
  blogHeroTitleSize: string;
}

const EMPTY_HERO: HeroSettings = {
  blogHeroImage: "",
  blogHeroTitle: "",
  blogHeroTitleColor: "default",
  blogHeroTitleFont: "default",
  blogHeroTitleSize: "default",
};

export default function BlogsAdminPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hero, setHero] = useState<HeroSettings>(EMPTY_HERO);
  const [savingHero, setSavingHero] = useState(false);
  const [heroSaved, setHeroSaved] = useState(false);

  const fontMichroma = { fontFamily: "var(--font-michroma), sans-serif" };
  const fontIvymode = { fontFamily: "var(--font-ivymode), serif" };

  useEffect(() => {
    fetchBlogs();
    fetchHero();
  }, []);

  async function fetchHero() {
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      if (data?.data) {
        const s = data.data;
        setHero({
          blogHeroImage: s.blogHeroImage || "",
          blogHeroTitle: s.blogHeroTitle || "",
          blogHeroTitleColor: s.blogHeroTitleColor || "default",
          blogHeroTitleFont: s.blogHeroTitleFont || "default",
          blogHeroTitleSize: s.blogHeroTitleSize || "default",
        });
      }
    } catch {
      // Non-fatal — the page header form just stays empty if this fails.
    }
  }

  function setHeroField<K extends keyof HeroSettings>(key: K, value: string) {
    setHero((p) => ({ ...p, [key]: value }));
  }

  async function saveHero() {
    setSavingHero(true);
    setError(null);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(hero),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save.");
      setHeroSaved(true);
      setTimeout(() => setHeroSaved(false), 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSavingHero(false);
    }
  }

  async function fetchBlogs() {
    try {
      setLoading(true);
      const res = await fetch("/api/blogs");
      if (!res.ok) throw new Error("Failed to load blogs.");
      const data = await res.json();
      setBlogs(data.data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function toggleStatus(blog: Blog) {
    const newStatus = blog.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    try {
      const res = await fetch(`/api/blogs/${blog.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status.");
      setBlogs((prev) =>
        prev.map((b) => (b.id === blog.id ? { ...b, status: newStatus } : b))
      );
    } catch (err: any) {
      alert(err.message);
    }
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/blogs/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete blog.");
      setBlogs((prev) => prev.filter((b) => b.id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  }

  function formatDate(dateStr: string) {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "—";
    return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="h-16 bg-white border border-[#1a1a1a]/8 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[10px] tracking-[0.3em] uppercase text-[#1a1a1a]/35 mb-1" style={fontMichroma}>
            Editorial
          </p>
          <h2 className="text-3xl font-light text-[#1a1a1a]" style={fontIvymode}>
            Blogs
          </h2>
        </div>
        <Link
          href="/admin/blogs/new"
          className="flex items-center gap-2 bg-[#007190] px-5 py-2.5 text-[10px] tracking-[0.2em] uppercase text-white hover:bg-[#005d76] transition-colors"
          style={fontMichroma}
        >
          <Plus size={13} />
          Add Blog
        </Link>
      </div>

      <div className="h-px bg-[#1a1a1a]/8" />

      {error && (
        <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
      )}

      {/* Page Header — the /blog listing page's top hero banner (background
          image + title). Separate from each blog post's own heroImage. */}
      <div className="bg-white border border-[#1a1a1a]/8 p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-[#1a1a1a]/8 pb-3">
          <p className="text-[9px] tracking-[0.3em] uppercase text-[#1a1a1a]/35" style={fontMichroma}>Page Header</p>
          {heroSaved && (
            <span className="flex items-center gap-1 text-[9px] tracking-[0.15em] uppercase text-[#007190]">
              <Check size={11} /> Saved
            </span>
          )}
        </div>
        <p className="text-[10px] text-[#8b8b8b] -mt-2">The banner shown at the top of the /blog listing page.</p>

        <div className="space-y-1.5">
          <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40" style={fontMichroma}>Title</label>
          <input
            type="text"
            value={hero.blogHeroTitle}
            onChange={(e) => setHeroField("blogHeroTitle", e.target.value)}
            placeholder="BLOG"
            className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none"
          />
          <StyleRow
            color={hero.blogHeroTitleColor}
            onColorChange={(v) => setHeroField("blogHeroTitleColor", v)}
            font={hero.blogHeroTitleFont}
            onFontChange={(v) => setHeroField("blogHeroTitleFont", v)}
            size={hero.blogHeroTitleSize}
            onSizeChange={(v) => setHeroField("blogHeroTitleSize", v)}
            sizeOptions={HEADING_SIZE_OPTIONS}
            colorDefaultLabel="White"
            fontDefaultLabel="Ivymode"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40" style={fontMichroma}>Background Image</label>
          {hero.blogHeroImage ? (
            <img src={hero.blogHeroImage} alt="" className="w-full max-h-72 object-contain border border-[#1a1a1a]/10 bg-[#f0ede6]" />
          ) : (
            <div className="relative">
              <img src="/images/blogs page images/ferro-industriale-blog-hero.webp" alt="" className="w-full max-h-72 object-contain border border-[#1a1a1a]/10 bg-[#f0ede6]" />
              <span className="absolute top-1.5 left-1.5 bg-[#1a1a1a]/70 text-white text-[8px] tracking-[0.15em] uppercase px-1.5 py-0.5">Currently Live (Default)</span>
            </div>
          )}
          <div className="flex gap-1">
            <input
              type="text"
              value={hero.blogHeroImage}
              onChange={(e) => setHeroField("blogHeroImage", e.target.value)}
              placeholder="/images/blogs page images/ferro-industriale-blog-hero.webp"
              className="w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-3 py-2 text-xs text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none"
            />
            <MediaPickerButton folder="blogs" onSelect={(url) => setHeroField("blogHeroImage", url)} />
          </div>
        </div>

        <button
          type="button"
          onClick={saveHero}
          disabled={savingHero}
          className="flex items-center gap-2 border border-[#007190] px-5 py-2.5 text-[10px] tracking-[0.2em] uppercase text-[#007190] hover:bg-[#007190] hover:text-white transition-all disabled:opacity-50"
          style={fontMichroma}
        >
          {savingHero ? "Saving…" : "Save Page Header"}
        </button>
      </div>

      {blogs.length === 0 ? (
        <div className="bg-white border border-[#1a1a1a]/8 p-16 text-center">
          <p className="text-sm text-[#8b8b8b] mb-4">No blog posts yet. Publish your first article.</p>
          <Link
            href="/admin/blogs/new"
            className="inline-flex items-center gap-2 bg-[#007190] px-6 py-3 text-[10px] tracking-[0.2em] uppercase text-white hover:bg-[#005d76] transition-colors"
            style={fontMichroma}
          >
            <Plus size={13} />
            Add First Blog
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-[#1a1a1a]/8">
          {/* Table header */}
          <div
            className="grid grid-cols-[48px_1fr_120px_120px_100px_100px] gap-4 px-5 py-3 border-b border-[#1a1a1a]/8 text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40"
            style={fontMichroma}
          >
            <span></span>
            <span>Title</span>
            <span>Tag</span>
            <span>Date</span>
            <span>Status</span>
            <span className="text-right">Actions</span>
          </div>

          {/* Rows */}
          {blogs.map((blog, idx) => (
            <div
              key={blog.id}
              className={`grid grid-cols-[48px_1fr_120px_120px_100px_100px] gap-4 px-5 py-4 items-center hover:bg-[#f8f5f0]/60 transition-colors ${
                idx < blogs.length - 1 ? "border-b border-[#1a1a1a]/6" : ""
              }`}
            >
              {/* Thumbnail */}
              <div className="w-10 h-10 bg-[#f8f5f0] border border-[#1a1a1a]/10 overflow-hidden flex-shrink-0">
                {blog.heroImage ? (
                  <img src={blog.heroImage} alt={blog.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#1a1a1a]/20">
                    <span className="text-[8px]" style={fontMichroma}>IMG</span>
                  </div>
                )}
              </div>

              {/* Title + slug */}
              <div>
                <p className="text-sm font-medium text-[#1a1a1a]">{blog.title}</p>
                <p className="text-[10px] text-[#8b8b8b] mt-0.5 font-mono">{blog.slug}</p>
              </div>

              {/* Tag */}
              <p className="text-[11px] text-[#8b8b8b] uppercase truncate">{blog.tag || "—"}</p>

              {/* Date */}
              <p className="text-[11px] text-[#8b8b8b]">{formatDate(blog.publishedAt)}</p>

              {/* Status badge */}
              <div>
                <span
                  className={`inline-block px-2 py-0.5 text-[9px] tracking-[0.2em] uppercase border ${
                    blog.status === "PUBLISHED"
                      ? "border-[#1a7a96]/30 text-[#1a7a96] bg-[#1a7a96]/5"
                      : "border-[#1a1a1a]/15 text-[#8b8b8b]"
                  }`}
                  style={fontMichroma}
                >
                  {blog.status === "PUBLISHED" ? "Live" : "Draft"}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-1">
                <button
                  onClick={() => toggleStatus(blog)}
                  title={blog.status === "PUBLISHED" ? "Unpublish" : "Publish"}
                  className="w-7 h-7 flex items-center justify-center border border-[#1a1a1a]/10 text-[#1a1a1a]/40 hover:text-[#1a7a96] hover:border-[#1a7a96]/30 transition-colors"
                >
                  {blog.status === "PUBLISHED" ? <EyeOff size={13} /> : <Eye size={13} />}
                </button>
                <Link
                  href={`/admin/blogs/${blog.id}`}
                  className="w-7 h-7 flex items-center justify-center border border-[#1a1a1a]/10 text-[#1a1a1a]/40 hover:text-[#1a1a1a] hover:border-[#1a1a1a]/30 transition-colors"
                  title="Edit"
                >
                  <Pencil size={13} />
                </Link>
                <button
                  onClick={() => handleDelete(blog.id, blog.title)}
                  title="Delete"
                  className="w-7 h-7 flex items-center justify-center border border-[#1a1a1a]/10 text-[#1a1a1a]/40 hover:text-red-500 hover:border-red-200 transition-colors"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-[10px] text-[#8b8b8b]">{blogs.length} blog{blogs.length !== 1 ? "s" : ""} total</p>
    </div>
  );
}
