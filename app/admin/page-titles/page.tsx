"use client";

import React, { useState, useEffect } from "react";
import { Check } from "lucide-react";

interface PageMetaRow {
  pageKey: string;
  label: string;
  title: string | null;
  description: string | null;
}

export default function PageTitlesPage() {
  const [pages, setPages] = useState<PageMetaRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [savedKey, setSavedKey] = useState<string | null>(null);

  const fontMichroma = { fontFamily: "var(--font-michroma), sans-serif" };
  const fontIvymode = { fontFamily: "var(--font-ivymode), serif" };

  useEffect(() => {
    fetchPages();
  }, []);

  async function fetchPages() {
    try {
      setLoading(true);
      const res = await fetch("/api/page-meta");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load.");
      setPages(data.data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function updateField(pageKey: string, field: "title" | "description", value: string) {
    setPages((prev) => prev.map((p) => (p.pageKey === pageKey ? { ...p, [field]: value } : p)));
  }

  async function handleSave(page: PageMetaRow) {
    setSavingKey(page.pageKey);
    setError(null);
    try {
      const res = await fetch(`/api/page-meta/${page.pageKey}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: page.title, description: page.description }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save.");
      setSavedKey(page.pageKey);
      setTimeout(() => setSavedKey(null), 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSavingKey(null);
    }
  }

  return (
    <div className="space-y-8" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
      {/* Header */}
      <div>
        <p className="text-[10px] tracking-[0.3em] uppercase text-[#1a1a1a]/35 mb-1" style={fontMichroma}>
          Site Configuration
        </p>
        <h2 className="text-3xl font-light text-[#1a1a1a]" style={fontIvymode}>
          Page Titles
        </h2>
        <p className="mt-2 text-sm text-[#8b8b8b]">
          Set each page's browser-tab title and search-engine description. Leave a field blank to use the site's default.
        </p>
      </div>

      <div className="h-px bg-[#1a1a1a]/8" />

      {error && (
        <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
      )}

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-32 bg-white border border-[#1a1a1a]/8 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {pages.map((page) => (
            <div key={page.pageKey} className="bg-white border border-[#1a1a1a]/8 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-[9px] tracking-[0.3em] uppercase text-[#1a1a1a]/40" style={fontMichroma}>
                  {page.label}
                </p>
                {savedKey === page.pageKey && (
                  <span className="flex items-center gap-1 text-[10px] text-green-600" style={fontMichroma}>
                    <Check size={11} /> Saved
                  </span>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40" style={fontMichroma}>
                  Page Title
                </label>
                <input
                  type="text"
                  value={page.title || ""}
                  onChange={(e) => updateField(page.pageKey, "title", e.target.value)}
                  placeholder="e.g. Our Story"
                  className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40" style={fontMichroma}>
                  Meta Description
                </label>
                <textarea
                  value={page.description || ""}
                  onChange={(e) => updateField(page.pageKey, "description", e.target.value)}
                  rows={2}
                  placeholder="A one or two sentence summary shown in search results."
                  className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none resize-none"
                />
              </div>

              <button
                onClick={() => handleSave(page)}
                disabled={savingKey === page.pageKey}
                className="border border-[#007190]/25 bg-white px-5 py-2 text-[10px] tracking-[0.15em] uppercase text-[#007190]/70 hover:bg-[#007190] hover:text-white hover:border-[#007190] disabled:opacity-40 transition-all"
                style={fontMichroma}
              >
                {savingKey === page.pageKey ? "Saving…" : "Save"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
