"use client";

import React, { useState, useEffect } from "react";
import { Mail, MailOpen, Trash2, Phone } from "lucide-react";

interface Submission {
  id: string;
  type: "QUERY" | "CATALOG" | "NEWSLETTER" | "DATASHEET";
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  product: string | null;
  language: string | null;
  isRead: boolean;
  createdAt: string;
}

interface SubmissionsListProps {
  type: "QUERY" | "CATALOG" | "NEWSLETTER" | "DATASHEET";
  label: string; // e.g. "Query" — used in empty/count copy
  eyebrow: string; // e.g. "Enquiries"
  showMessage?: boolean; // whether to render the message column (newsletter usually has none)
  noun?: string; // e.g. "Downloads" instead of "Submissions", for catalog/datasheet
  showLanguage?: boolean; // whether to show the requested language under the contact name — off for catalog, which only has one file
}

export default function SubmissionsList({ type, label, eyebrow, showMessage = true, noun = "Submissions", showLanguage = true }: SubmissionsListProps) {
  const [items, setItems] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const fontMichroma = { fontFamily: "var(--font-michroma), sans-serif" };
  const fontIvymode = { fontFamily: "var(--font-ivymode), serif" };

  useEffect(() => {
    fetchItems();
  }, [type]);

  async function fetchItems() {
    try {
      setLoading(true);
      const res = await fetch(`/api/submissions?type=${type}`);
      if (!res.ok) throw new Error("Failed to load submissions.");
      const data = await res.json();
      setItems(data.data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function toggleRead(item: Submission) {
    try {
      const res = await fetch(`/api/submissions/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead: !item.isRead }),
      });
      if (!res.ok) throw new Error("Failed to update.");
      setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, isRead: !i.isRead } : i)));
    } catch (err: any) {
      alert(err.message);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete submission from "${name}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/submissions/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete.");
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  }

  function formatDate(dateStr: string) {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "—";
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const unreadCount = items.filter((i) => !i.isRead).length;

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
            {eyebrow}
          </p>
          <h2 className="text-3xl font-light text-[#1a1a1a]" style={fontIvymode}>
            {label} {noun}
          </h2>
        </div>
        {unreadCount > 0 && (
          <span
            className="px-3 py-1 text-[10px] tracking-[0.2em] uppercase border border-[#1a7a96]/30 text-[#1a7a96] bg-[#1a7a96]/5"
            style={fontMichroma}
          >
            {unreadCount} New
          </span>
        )}
      </div>

      <div className="h-px bg-[#1a1a1a]/8" />

      {error && (
        <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
      )}

      {items.length === 0 ? (
        <div className="bg-white border border-[#1a1a1a]/8 p-16 text-center">
          <p className="text-sm text-[#8b8b8b]">
            No {label.toLowerCase()} {noun.toLowerCase()} yet. They'll appear here as visitors submit the form on the site.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-[#1a1a1a]/8">
          {/* Table header */}
          <div
            className={`grid ${showMessage ? "grid-cols-[32px_1fr_1fr_140px_150px_90px]" : "grid-cols-[32px_1fr_1fr_150px_90px]"} gap-4 px-5 py-3 border-b border-[#1a1a1a]/8 text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40`}
            style={fontMichroma}
          >
            <span></span>
            <span>Contact</span>
            <span>Email / Phone</span>
            {showMessage && <span>Message</span>}
            <span>Submitted</span>
            <span className="text-right">Actions</span>
          </div>

          {/* Rows */}
          {items.map((item, idx) => (
            <div
              key={item.id}
              className={`grid ${showMessage ? "grid-cols-[32px_1fr_1fr_140px_150px_90px]" : "grid-cols-[32px_1fr_1fr_150px_90px]"} gap-4 px-5 py-4 items-start hover:bg-[#f8f5f0]/60 transition-colors ${
                idx < items.length - 1 ? "border-b border-[#1a1a1a]/6" : ""
              } ${!item.isRead ? "bg-[#1a7a96]/[0.03]" : ""}`}
            >
              {/* Unread dot */}
              <div className="pt-1">
                {!item.isRead && <span className="block w-2 h-2 rounded-full bg-[#1a7a96]" title="Unread" />}
              </div>

              {/* Name */}
              <div>
                <p className="text-sm font-medium text-[#1a1a1a]">{item.name}</p>
                {item.product && (
                  <span className="inline-block mt-1 px-2 py-0.5 text-[9px] tracking-[0.15em] uppercase border border-[#1a7a96]/30 text-[#1a7a96] bg-[#1a7a96]/5">
                    {item.product}
                  </span>
                )}
                {showLanguage && item.language && (
                  <p className="text-[10px] text-[#8b8b8b] mt-0.5 uppercase">{item.language}</p>
                )}
              </div>

              {/* Email / Phone */}
              <div className="space-y-0.5">
                <a href={`mailto:${item.email}`} className="block text-[12px] text-[#1a7a96] hover:underline truncate">
                  {item.email}
                </a>
                {item.phone && (
                  <a
                    href={`tel:${item.phone}`}
                    className="flex items-center gap-1 text-[11px] text-[#8b8b8b] hover:text-[#1a1a1a]"
                  >
                    <Phone size={10} />
                    {item.phone}
                  </a>
                )}
              </div>

              {/* Message */}
              {showMessage && (
                <div>
                  {item.message ? (
                    <p
                      className={`text-[11px] text-[#545759] leading-relaxed cursor-pointer ${
                        expanded === item.id ? "" : "line-clamp-2"
                      }`}
                      onClick={() => setExpanded(expanded === item.id ? null : item.id)}
                      title={expanded === item.id ? "Click to collapse" : "Click to expand"}
                    >
                      {item.message}
                    </p>
                  ) : (
                    <span className="text-[11px] text-[#8b8b8b]">—</span>
                  )}
                </div>
              )}

              {/* Date */}
              <p className="text-[11px] text-[#8b8b8b]">{formatDate(item.createdAt)}</p>

              {/* Actions */}
              <div className="flex items-center justify-end gap-1">
                <button
                  onClick={() => toggleRead(item)}
                  title={item.isRead ? "Mark as unread" : "Mark as read"}
                  className="w-7 h-7 flex items-center justify-center border border-[#1a1a1a]/10 text-[#1a1a1a]/40 hover:text-[#1a7a96] hover:border-[#1a7a96]/30 transition-colors"
                >
                  {item.isRead ? <MailOpen size={13} /> : <Mail size={13} />}
                </button>
                <button
                  onClick={() => handleDelete(item.id, item.name)}
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

      <p className="text-[10px] text-[#8b8b8b]">{items.length} submission{items.length !== 1 ? "s" : ""} total</p>
    </div>
  );
}
