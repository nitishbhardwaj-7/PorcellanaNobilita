"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, ChevronDown, FileText, ExternalLink } from "lucide-react";
import { MediaPickerField } from "../_components/MediaPicker";

function CustomSelect({
  value,
  onChange,
  options,
  style,
  className = "",
}: {
  value: string;
  onChange: (val: string) => void;
  options: { value: string; label: string }[];
  style?: React.CSSProperties;
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const selectedOption = options.find((o) => o.value === value) || options[0];

  return (
    <div ref={containerRef} className={`relative ${className}`} style={style}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between border border-[#1a1a1a]/15 bg-white px-4 py-2.5 text-[10px] text-[#1a1a1a] hover:border-[#1a1a1a]/40 transition-colors focus:outline-none"
      >
        <span className="tracking-[0.1em] uppercase font-semibold text-left">{selectedOption?.label}</span>
        <ChevronDown size={14} className={`text-[#1a1a1a]/40 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 z-50 mt-1 border border-[#1a1a1a]/10 bg-white shadow-lg py-1 max-h-60 overflow-auto">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              className={`flex w-full px-4 py-2.5 text-left text-xs tracking-[0.1em] uppercase font-semibold transition-colors ${
                opt.value === value
                  ? "bg-[#1a1a1a] text-white"
                  : "text-[#1a1a1a]/70 hover:bg-[#1a1a1a]/5 hover:text-[#1a1a1a]"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// Upload/replace/preview the newsletter's standalone HTML file. Reuses the
// same media-library upload endpoint as images (it accepts any file type),
// just scoped to the "newsletters" folder and an .html file picker.
function HtmlFileField({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const fontMichroma = { fontFamily: "var(--font-michroma), sans-serif" };
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "newsletters");
      const res = await fetch("/api/media", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed.");
      onChange(data.data.fileUrl);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-[9px] tracking-[0.3em] uppercase text-[#1a1a1a]/35 border-b border-[#1a1a1a]/8 pb-3" style={fontMichroma}>
        HTML File
      </p>

      {value && (
        <div className="flex items-center gap-2 border border-[#1a1a1a]/10 bg-[#f8f5f0] px-3 py-2.5">
          <FileText size={14} className="text-[#1a1a1a]/40 flex-shrink-0" />
          <span className="flex-1 truncate text-[11px] font-mono text-[#1a1a1a]/70">{value}</span>
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#1a1a1a]/40 hover:text-[#007190] transition-colors flex-shrink-0"
            title="Preview the raw uploaded file"
          >
            <ExternalLink size={13} />
          </a>
        </div>
      )}

      {error && <p className="text-[11px] text-red-600">{error}</p>}

      <label
        className={`flex w-full items-center justify-center gap-2 border border-[#007190] px-4 py-2.5 text-[10px] tracking-[0.15em] uppercase text-[#007190] hover:bg-[#007190] hover:text-white transition-all cursor-pointer ${
          uploading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        style={fontMichroma}
      >
        {uploading ? "Uploading…" : value ? "Replace HTML File" : "Upload HTML File"}
        <input
          ref={fileInputRef}
          type="file"
          accept=".html,text/html"
          className="hidden"
          disabled={uploading}
          onChange={handleFile}
        />
      </label>

      <div className="space-y-1.5">
        <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40" style={fontMichroma}>
          or paste a file URL manually
        </label>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-3 py-2.5 text-[11px] font-mono text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none"
          placeholder="/uploads/newsletters/…"
        />
      </div>

      <p className="text-[10px] text-[#8b8b8b]">
        This file is served exactly as uploaded at /newsletter/[slug] — its own layout, styles, and background, with none of the site's Navbar or Footer.
      </p>
    </div>
  );
}

interface NewsletterFormProps {
  newsletterId?: string; // undefined = new
}

export default function NewsletterForm({ newsletterId }: NewsletterFormProps) {
  const router = useRouter();
  const isNew = !newsletterId;

  const [form, setForm] = useState({
    title: "",
    slug: "",
    cardImage: "",
    htmlFile: "",
    seoTitle: "",
    seoDescription: "",
    order: 0,
    status: "DRAFT" as "DRAFT" | "PUBLISHED",
    publishedAt: new Date().toISOString().slice(0, 10),
  });

  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadingNewsletter, setLoadingNewsletter] = useState(!isNew);
  const [error, setError] = useState<string | null>(null);

  const fontMichroma = { fontFamily: "var(--font-michroma), sans-serif" };
  const fontIvymode = { fontFamily: "var(--font-ivymode), serif" };

  useEffect(() => {
    if (!isNew && newsletterId) {
      fetch(`/api/newsletters/${newsletterId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            const n = data.data;
            setForm({
              title: n.title,
              slug: n.slug,
              cardImage: n.cardImage || "",
              htmlFile: n.htmlFile || "",
              seoTitle: n.seoTitle || "",
              seoDescription: n.seoDescription || "",
              order: n.order ?? 0,
              status: n.status,
              publishedAt: n.publishedAt ? new Date(n.publishedAt).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
            });
            setSlugManuallyEdited(true);
          }
        })
        .catch(() => setError("Failed to load newsletter."))
        .finally(() => setLoadingNewsletter(false));
    }
  }, [newsletterId, isNew]);

  function handleTitleChange(value: string) {
    setForm((prev) => ({
      ...prev,
      title: value,
      slug: slugManuallyEdited ? prev.slug : slugify(value),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.htmlFile) {
      setError("Upload an HTML file before saving — the newsletter has nothing to show without one.");
      return;
    }

    setSaving(true);
    try {
      const url = isNew ? "/api/newsletters" : `/api/newsletters/${newsletterId}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save newsletter.");

      router.push("/admin/newsletter-posts");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loadingNewsletter) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((n) => (
          <div key={n} className="h-14 bg-white border border-[#1a1a1a]/8 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link
            href="/admin/newsletter-posts"
            className="flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase text-[#1a1a1a]/40 hover:text-[#1a1a1a] transition-colors mb-3"
            style={fontMichroma}
          >
            <ArrowLeft size={12} />
            Back to Newsletter Posts
          </Link>
          <h2 className="text-3xl font-light text-[#1a1a1a]" style={fontIvymode}>
            {isNew ? "New Newsletter" : form.title || "Edit Newsletter"}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <CustomSelect
            value={form.status}
            onChange={(val) => setForm((p) => ({ ...p, status: val as "DRAFT" | "PUBLISHED" }))}
            options={[
              { value: "DRAFT", label: "Draft" },
              { value: "PUBLISHED", label: "Published" },
            ]}
            style={fontMichroma}
            className="min-w-[140px]"
          />
          <button
            type="submit"
            form="newsletter-form"
            disabled={saving}
            className="flex items-center gap-2 bg-[#007190] px-5 py-2.5 text-[10px] tracking-[0.2em] uppercase text-white hover:bg-[#005d76] disabled:opacity-40 transition-colors"
            style={fontMichroma}
          >
            <Save size={13} />
            {saving ? "Saving..." : "Save Newsletter"}
          </button>
        </div>
      </div>

      <div className="h-px bg-[#1a1a1a]/8" />

      {error && (
        <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
      )}

      <form id="newsletter-form" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column — main fields */}
          <div className="lg:col-span-2 space-y-6">
            {/* Identity */}
            <div className="bg-white border border-[#1a1a1a]/8 p-6 space-y-5">
              <p className="text-[9px] tracking-[0.3em] uppercase text-[#1a1a1a]/35 border-b border-[#1a1a1a]/8 pb-3" style={fontMichroma}>
                Identity
              </p>

              <div className="space-y-1.5">
                <label className="block text-[9px] tracking-[0.3em] uppercase text-[#1a1a1a]/50" style={fontMichroma}>
                  Title *
                </label>
                <input
                  required
                  type="text"
                  value={form.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-3 text-sm text-[#1a1a1a] placeholder-[#1a1a1a]/25 focus:border-[#1a1a1a]/40 focus:outline-none"
                  placeholder="e.g. MACCHIA VECCHIA MAX"
                />
                <p className="text-[10px] text-[#8b8b8b]">Shown on the /newsletter listing card and used as the browser tab title.</p>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[9px] tracking-[0.3em] uppercase text-[#1a1a1a]/50" style={fontMichroma}>
                  Slug
                </label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => {
                    setSlugManuallyEdited(true);
                    setForm((p) => ({ ...p, slug: slugify(e.target.value) }));
                  }}
                  className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-3 text-sm text-[#1a1a1a] font-mono focus:border-[#1a1a1a]/40 focus:outline-none"
                />
                <p className="text-[10px] text-[#8b8b8b]">URL: /newsletter/{form.slug || "…"}</p>
              </div>
            </div>

            {/* HTML File */}
            <div className="bg-white border border-[#1a1a1a]/8 p-6">
              <HtmlFileField value={form.htmlFile} onChange={(url) => setForm((p) => ({ ...p, htmlFile: url }))} />
            </div>

            {/* SEO */}
            <div className="bg-white border border-[#1a1a1a]/8 p-6 space-y-5">
              <p className="text-[9px] tracking-[0.3em] uppercase text-[#1a1a1a]/35 border-b border-[#1a1a1a]/8 pb-3" style={fontMichroma}>
                SEO
              </p>
              <div className="space-y-1.5">
                <label className="block text-[9px] tracking-[0.3em] uppercase text-[#1a1a1a]/50" style={fontMichroma}>
                  SEO Title
                </label>
                <input
                  type="text"
                  value={form.seoTitle}
                  onChange={(e) => setForm((p) => ({ ...p, seoTitle: e.target.value }))}
                  placeholder="Defaults to the newsletter title if left blank"
                  className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-3 text-sm text-[#1a1a1a] placeholder-[#1a1a1a]/25 focus:border-[#1a1a1a]/40 focus:outline-none"
                />
                <p className="text-[10px] text-[#8b8b8b]">Filled into the uploaded file's &lt;title&gt; tag, which is usually blank in an email export.</p>
              </div>
              <div className="space-y-1.5">
                <label className="block text-[9px] tracking-[0.3em] uppercase text-[#1a1a1a]/50" style={fontMichroma}>
                  SEO Description
                </label>
                <textarea
                  value={form.seoDescription}
                  onChange={(e) => setForm((p) => ({ ...p, seoDescription: e.target.value }))}
                  rows={3}
                  placeholder="Optional — added as a meta description tag if the file doesn't already have one"
                  className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-3 text-sm text-[#1a1a1a] placeholder-[#1a1a1a]/25 focus:border-[#1a1a1a]/40 focus:outline-none resize-none leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* Right column — card image & publish settings */}
          <div className="space-y-5">
            {/* Card image */}
            <div className="bg-white border border-[#1a1a1a]/8 p-5">
              <MediaPickerField
                label="Listing Card Image"
                value={form.cardImage}
                onChange={(url) => setForm((p) => ({ ...p, cardImage: url }))}
                folder="newsletters"
                placeholder="/uploads/newsletters/…"
                aspect="aspect-[16/10]"
              />
              <p className="text-[10px] text-[#8b8b8b] mt-3">Shown on the /newsletter grid — the uploaded HTML file has no separate thumbnail.</p>
            </div>

            {/* Publish settings */}
            <div className="bg-white border border-[#1a1a1a]/8 p-5 space-y-4">
              <p className="text-[9px] tracking-[0.3em] uppercase text-[#1a1a1a]/35 border-b border-[#1a1a1a]/8 pb-3" style={fontMichroma}>
                Publish Settings
              </p>
              <div className="space-y-1.5">
                <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40" style={fontMichroma}>
                  Published Date
                </label>
                <input
                  type="date"
                  value={form.publishedAt}
                  onChange={(e) => setForm((p) => ({ ...p, publishedAt: e.target.value }))}
                  className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-3 py-2.5 text-sm text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40" style={fontMichroma}>
                  Display Order
                </label>
                <input
                  type="number"
                  min={0}
                  value={form.order}
                  onChange={(e) => setForm((p) => ({ ...p, order: parseInt(e.target.value) || 0 }))}
                  className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-3 py-2.5 text-sm text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none"
                />
                <p className="text-[10px] text-[#8b8b8b]">Lower number = shown first on the grid</p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
