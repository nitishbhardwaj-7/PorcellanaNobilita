"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, X, ChevronDown } from "lucide-react";
import { MediaPickerField } from "../_components/MediaPicker";
import { StyleRow } from "../_components/StyleControls";
import { HEADING_SIZE_OPTIONS, PARAGRAPH_SIZE_OPTIONS } from "@/lib/textStyle";

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

function TagInput({
  label,
  values,
  onChange,
  placeholder,
}: {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder: string;
}) {
  const [input, setInput] = useState("");
  const fontMichroma = { fontFamily: "var(--font-michroma), sans-serif" };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === "Enter" || e.key === ",") && input.trim()) {
      e.preventDefault();
      if (!values.includes(input.trim())) {
        onChange([...values, input.trim()]);
      }
      setInput("");
    }
    if (e.key === "Backspace" && !input && values.length > 0) {
      onChange(values.slice(0, -1));
    }
  };

  return (
    <div className="space-y-1.5">
      <label className="block text-[9px] tracking-[0.3em] uppercase text-[#1a1a1a]/50" style={fontMichroma}>
        {label}
      </label>
      <div className="min-h-[44px] flex flex-wrap gap-1.5 items-center border border-[#1a1a1a]/15 bg-white px-3 py-2 focus-within:border-[#1a1a1a]/40 transition-colors">
        {values.map((v) => (
          <span
            key={v}
            className="flex items-center gap-1 bg-[#f8f5f0] border border-[#1a1a1a]/10 px-2 py-0.5 text-[10px] text-[#1a1a1a]/70"
          >
            {v}
            <button
              type="button"
              onClick={() => onChange(values.filter((x) => x !== v))}
              className="text-[#1a1a1a]/30 hover:text-[#1a1a1a] transition-colors"
            >
              <X size={10} />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={values.length === 0 ? placeholder : ""}
          className="flex-1 min-w-[120px] bg-transparent text-sm text-[#1a1a1a] placeholder-[#1a1a1a]/25 outline-none"
        />
      </div>
      <p className="text-[10px] text-[#8b8b8b]">Press Enter or comma to add</p>
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
    subtitle: "",
    subtitleColor: "default",
    subtitleFont: "default",
    subtitleSize: "default",
    author: "NOBILITA Editorial Team",
    cardImage: "",
    heroImage: "",
    heroImageAlt: "",
    specProductName: "",
    specProductNameColor: "default",
    specProductNameFont: "default",
    specProductNameSize: "default",
    specSlabImage: "",
    specDimensions: [] as string[],
    specFaces: [] as string[],
    specFinishes: [] as string[],
    specInspirationLine1: "",
    specInspirationLine2: "",
    specInspirationColor: "default",
    specInspirationFont: "default",
    specInspirationSize: "default",
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
              subtitle: n.subtitle || "",
              subtitleColor: n.subtitleColor || "default",
              subtitleFont: n.subtitleFont || "default",
              subtitleSize: n.subtitleSize || "default",
              author: n.author || "NOBILITA Editorial Team",
              cardImage: n.cardImage || "",
              heroImage: n.heroImage || "",
              heroImageAlt: n.heroImageAlt || "",
              specProductName: n.specProductName || "",
              specProductNameColor: n.specProductNameColor || "default",
              specProductNameFont: n.specProductNameFont || "default",
              specProductNameSize: n.specProductNameSize || "default",
              specSlabImage: n.specSlabImage || "",
              specDimensions: n.specDimensions || [],
              specFaces: n.specFaces || [],
              specFinishes: n.specFinishes || [],
              specInspirationLine1: n.specInspirationLine1 || "",
              specInspirationLine2: n.specInspirationLine2 || "",
              specInspirationColor: n.specInspirationColor || "default",
              specInspirationFont: n.specInspirationFont || "default",
              specInspirationSize: n.specInspirationSize || "default",
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
                  placeholder="e.g. PAONAZZETTO INIZIO"
                />
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

              <div className="space-y-1.5">
                <label className="block text-[9px] tracking-[0.3em] uppercase text-[#1a1a1a]/50" style={fontMichroma}>
                  Subtitle
                </label>
                <textarea
                  rows={2}
                  value={form.subtitle}
                  onChange={(e) => setForm((p) => ({ ...p, subtitle: e.target.value }))}
                  placeholder="A collection where timeless Italian elegance meets advanced porcelain technology."
                  className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-3 text-sm text-[#1a1a1a] placeholder-[#1a1a1a]/25 focus:border-[#1a1a1a]/40 focus:outline-none resize-none"
                />
                <StyleRow
                  color={form.subtitleColor}
                  onColorChange={(v) => setForm((p) => ({ ...p, subtitleColor: v }))}
                  font={form.subtitleFont}
                  onFontChange={(v) => setForm((p) => ({ ...p, subtitleFont: v }))}
                  size={form.subtitleSize}
                  onSizeChange={(v) => setForm((p) => ({ ...p, subtitleSize: v }))}
                  sizeOptions={PARAGRAPH_SIZE_OPTIONS}
                  colorDefaultLabel="Black"
                  fontDefaultLabel="Ivymode"
                />
                <p className="text-[10px] text-[#8b8b8b]">Shown in the white banner below the hero on the detail page.</p>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[9px] tracking-[0.3em] uppercase text-[#1a1a1a]/50" style={fontMichroma}>
                  Author
                </label>
                <input
                  type="text"
                  value={form.author}
                  onChange={(e) => setForm((p) => ({ ...p, author: e.target.value }))}
                  className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-3 text-sm text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none"
                />
              </div>
            </div>

            {/* Product Spec */}
            <div className="bg-white border border-[#1a1a1a]/8 p-6 space-y-5">
              <div>
                <p className="text-[9px] tracking-[0.3em] uppercase text-[#1a1a1a]/35 border-b border-[#1a1a1a]/8 pb-3" style={fontMichroma}>
                  Product Spotlight
                </p>
                <p className="text-[10px] text-[#8b8b8b] pt-2">
                  The featured-product section shown further down the detail page — slab image, title, and specs.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[9px] tracking-[0.3em] uppercase text-[#1a1a1a]/50" style={fontMichroma}>
                  Product Name
                </label>
                <input
                  type="text"
                  value={form.specProductName}
                  onChange={(e) => setForm((p) => ({ ...p, specProductName: e.target.value }))}
                  placeholder="e.g. PAONAZZETTO INIZIO"
                  className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-3 text-sm text-[#1a1a1a] placeholder-[#1a1a1a]/25 focus:border-[#1a1a1a]/40 focus:outline-none"
                />
                <StyleRow
                  color={form.specProductNameColor}
                  onColorChange={(v) => setForm((p) => ({ ...p, specProductNameColor: v }))}
                  font={form.specProductNameFont}
                  onFontChange={(v) => setForm((p) => ({ ...p, specProductNameFont: v }))}
                  size={form.specProductNameSize}
                  onSizeChange={(v) => setForm((p) => ({ ...p, specProductNameSize: v }))}
                  sizeOptions={HEADING_SIZE_OPTIONS}
                  colorDefaultLabel="Black"
                  fontDefaultLabel="Ivymode"
                />
              </div>

              <MediaPickerField
                label="Slab Image"
                value={form.specSlabImage}
                onChange={(url) => setForm((p) => ({ ...p, specSlabImage: url }))}
                folder="products"
                placeholder="/uploads/products/…"
                aspect="aspect-[3/4]"
              />

              <TagInput
                label="Dimensions"
                values={form.specDimensions}
                onChange={(values) => setForm((p) => ({ ...p, specDimensions: values }))}
                placeholder="e.g. 6.5MM x 1600 x 3200 (RECTIFIED)"
              />
              <TagInput
                label="Faces"
                values={form.specFaces}
                onChange={(values) => setForm((p) => ({ ...p, specFaces: values }))}
                placeholder="e.g. 6.5MM – BOOKMATCH OF 1"
              />
              <TagInput
                label="Finishes"
                values={form.specFinishes}
                onChange={(values) => setForm((p) => ({ ...p, specFinishes: values }))}
                placeholder="e.g. 6.5MM – POLISHED & MATTE"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="block text-[9px] tracking-[0.3em] uppercase text-[#1a1a1a]/50" style={fontMichroma}>
                    Inspiration Line 1
                  </label>
                  <input
                    type="text"
                    value={form.specInspirationLine1}
                    onChange={(e) => setForm((p) => ({ ...p, specInspirationLine1: e.target.value }))}
                    placeholder="Inspired by Italy's noble heritage and baroque architecture,"
                    className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-3 text-sm text-[#1a1a1a] placeholder-[#1a1a1a]/25 focus:border-[#1a1a1a]/40 focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[9px] tracking-[0.3em] uppercase text-[#1a1a1a]/50" style={fontMichroma}>
                    Inspiration Line 2
                  </label>
                  <input
                    type="text"
                    value={form.specInspirationLine2}
                    onChange={(e) => setForm((p) => ({ ...p, specInspirationLine2: e.target.value }))}
                    placeholder="Porcellana NOBILITA is proudly made in Modena, Italy."
                    className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-3 text-sm text-[#1a1a1a] placeholder-[#1a1a1a]/25 focus:border-[#1a1a1a]/40 focus:outline-none"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-[9px] tracking-[0.3em] uppercase text-[#1a1a1a]/50" style={fontMichroma}>
                  Inspiration Text Style
                </label>
                <StyleRow
                  color={form.specInspirationColor}
                  onColorChange={(v) => setForm((p) => ({ ...p, specInspirationColor: v }))}
                  font={form.specInspirationFont}
                  onFontChange={(v) => setForm((p) => ({ ...p, specInspirationFont: v }))}
                  size={form.specInspirationSize}
                  onSizeChange={(v) => setForm((p) => ({ ...p, specInspirationSize: v }))}
                  sizeOptions={PARAGRAPH_SIZE_OPTIONS}
                  colorDefaultLabel="Black"
                  fontDefaultLabel="Ivymode"
                />
                <p className="text-[10px] text-[#8b8b8b]">Applies to both inspiration lines together — they render as one paragraph.</p>
              </div>
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
              </div>
              <div className="space-y-1.5">
                <label className="block text-[9px] tracking-[0.3em] uppercase text-[#1a1a1a]/50" style={fontMichroma}>
                  SEO Description
                </label>
                <textarea
                  value={form.seoDescription}
                  onChange={(e) => setForm((p) => ({ ...p, seoDescription: e.target.value }))}
                  rows={3}
                  placeholder="Defaults to the subtitle if left blank"
                  className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-3 text-sm text-[#1a1a1a] placeholder-[#1a1a1a]/25 focus:border-[#1a1a1a]/40 focus:outline-none resize-none leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* Right column — images & publish settings */}
          <div className="space-y-5">
            {/* Card image */}
            <div className="bg-white border border-[#1a1a1a]/8 p-5 space-y-4">
              <MediaPickerField
                label="Listing Card Image"
                value={form.cardImage}
                onChange={(url) => setForm((p) => ({ ...p, cardImage: url }))}
                folder="blogs"
                placeholder="/uploads/blogs/…"
                aspect="aspect-[16/10]"
              />
              <p className="text-[10px] text-[#8b8b8b]">Shown on the /newsletter grid. Falls back to the hero image below if left blank.</p>
            </div>

            {/* Hero image */}
            <div className="bg-white border border-[#1a1a1a]/8 p-5 space-y-4">
              <MediaPickerField
                label="Detail Hero Image"
                value={form.heroImage}
                onChange={(url) => setForm((p) => ({ ...p, heroImage: url }))}
                folder="blogs"
                placeholder="/uploads/blogs/…"
                aspect="aspect-[16/9]"
              />
              <div className="space-y-1.5">
                <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40" style={fontMichroma}>
                  Hero Image Alt Text
                </label>
                <input
                  type="text"
                  value={form.heroImageAlt}
                  onChange={(e) => setForm((p) => ({ ...p, heroImageAlt: e.target.value }))}
                  className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-3 py-2.5 text-xs text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none"
                  placeholder="Describe the image for SEO"
                />
              </div>
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
