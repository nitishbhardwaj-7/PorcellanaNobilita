"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Eye, EyeOff, ExternalLink } from "lucide-react";

interface NewsletterPost {
  id: string;
  title: string;
  slug: string;
  status: "DRAFT" | "PUBLISHED";
  cardImage: string | null;
  htmlFile: string | null;
  order: number;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export default function NewsletterPostsAdminPage() {
  const [posts, setPosts] = useState<NewsletterPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fontMichroma = { fontFamily: "var(--font-michroma), sans-serif" };
  const fontIvymode = { fontFamily: "var(--font-ivymode), serif" };

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      setLoading(true);
      const res = await fetch("/api/newsletters");
      if (!res.ok) throw new Error("Failed to load newsletters.");
      const data = await res.json();
      setPosts(data.data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function toggleStatus(post: NewsletterPost) {
    const newStatus = post.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    try {
      const res = await fetch(`/api/newsletters/${post.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status.");
      setPosts((prev) =>
        prev.map((p) => (p.id === post.id ? { ...p, status: newStatus } : p))
      );
    } catch (err: any) {
      alert(err.message);
    }
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/newsletters/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete newsletter.");
      setPosts((prev) => prev.filter((p) => p.id !== id));
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
            Newsletter Posts
          </h2>
          <p className="mt-2 text-sm text-[#8b8b8b]">
            Uploaded HTML editions shown at /newsletter — each opens exactly as uploaded. Distinct from the "Newsletter" subscriber list.
          </p>
        </div>
        <Link
          href="/admin/newsletter-posts/new"
          className="flex items-center gap-2 bg-[#007190] px-5 py-2.5 text-[10px] tracking-[0.2em] uppercase text-white hover:bg-[#005d76] transition-colors"
          style={fontMichroma}
        >
          <Plus size={13} />
          Add Newsletter
        </Link>
      </div>

      <div className="h-px bg-[#1a1a1a]/8" />

      {error && (
        <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
      )}

      {posts.length === 0 ? (
        <div className="bg-white border border-[#1a1a1a]/8 p-16 text-center">
          <p className="text-sm text-[#8b8b8b] mb-4">
            No newsletters yet — add one and upload its HTML file to get started.
          </p>
          <Link
            href="/admin/newsletter-posts/new"
            className="inline-flex items-center gap-2 bg-[#007190] px-6 py-3 text-[10px] tracking-[0.2em] uppercase text-white hover:bg-[#005d76] transition-colors"
            style={fontMichroma}
          >
            <Plus size={13} />
            Add First Newsletter
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-[#1a1a1a]/8">
          {/* Table header */}
          <div
            className="grid grid-cols-[48px_1fr_120px_100px_100px] gap-4 px-5 py-3 border-b border-[#1a1a1a]/8 text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40"
            style={fontMichroma}
          >
            <span></span>
            <span>Title</span>
            <span>Date</span>
            <span>Status</span>
            <span className="text-right">Actions</span>
          </div>

          {/* Rows */}
          {posts.map((post, idx) => (
            <div
              key={post.id}
              className={`grid grid-cols-[48px_1fr_120px_100px_100px] gap-4 px-5 py-4 items-center hover:bg-[#f8f5f0]/60 transition-colors ${
                idx < posts.length - 1 ? "border-b border-[#1a1a1a]/6" : ""
              }`}
            >
              {/* Thumbnail */}
              <div className="w-10 h-10 bg-[#f8f5f0] border border-[#1a1a1a]/10 overflow-hidden flex-shrink-0">
                {post.cardImage ? (
                  <img src={post.cardImage} alt={post.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#1a1a1a]/20">
                    <span className="text-[8px]" style={fontMichroma}>IMG</span>
                  </div>
                )}
              </div>

              {/* Title + slug */}
              <div>
                <p className="text-sm font-medium text-[#1a1a1a]">{post.title}</p>
                <p className="text-[10px] text-[#8b8b8b] mt-0.5 font-mono">{post.slug}</p>
              </div>

              {/* Date */}
              <p className="text-[11px] text-[#8b8b8b]">{formatDate(post.publishedAt)}</p>

              {/* Status badge */}
              <div>
                <span
                  className={`inline-block px-2 py-0.5 text-[9px] tracking-[0.2em] uppercase border ${
                    post.status === "PUBLISHED"
                      ? "border-[#1a7a96]/30 text-[#1a7a96] bg-[#1a7a96]/5"
                      : "border-[#1a1a1a]/15 text-[#8b8b8b]"
                  }`}
                  style={fontMichroma}
                >
                  {post.status === "PUBLISHED" ? "Live" : "Draft"}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-1">
                {post.status === "PUBLISHED" && post.htmlFile && (
                  <a
                    href={`/newsletter/${post.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="View live"
                    className="w-7 h-7 flex items-center justify-center border border-[#1a1a1a]/10 text-[#1a1a1a]/40 hover:text-[#007190] hover:border-[#007190]/30 transition-colors"
                  >
                    <ExternalLink size={13} />
                  </a>
                )}
                <button
                  onClick={() => toggleStatus(post)}
                  title={post.status === "PUBLISHED" ? "Unpublish" : "Publish"}
                  className="w-7 h-7 flex items-center justify-center border border-[#1a1a1a]/10 text-[#1a1a1a]/40 hover:text-[#1a7a96] hover:border-[#1a7a96]/30 transition-colors"
                >
                  {post.status === "PUBLISHED" ? <EyeOff size={13} /> : <Eye size={13} />}
                </button>
                <Link
                  href={`/admin/newsletter-posts/${post.id}`}
                  className="w-7 h-7 flex items-center justify-center border border-[#1a1a1a]/10 text-[#1a1a1a]/40 hover:text-[#1a1a1a] hover:border-[#1a1a1a]/30 transition-colors"
                  title="Edit"
                >
                  <Pencil size={13} />
                </Link>
                <button
                  onClick={() => handleDelete(post.id, post.title)}
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

      <p className="text-[10px] text-[#8b8b8b]">{posts.length} newsletter{posts.length !== 1 ? "s" : ""} total</p>
    </div>
  );
}
