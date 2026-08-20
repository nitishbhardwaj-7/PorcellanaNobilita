"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, X, ChevronDown, ChevronUp, GripVertical, Plus } from "lucide-react";
import { MediaPickerField, MediaPickerButton } from "../_components/MediaPicker";

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
        className="flex w-full items-center justify-between border border-[#1a1a1a]/15 bg-white px-4 py-3 text-xs text-[#1a1a1a] hover:border-[#1a1a1a]/40 transition-colors focus:outline-none"
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

type ContentBlock = {
  type: "paragraph" | "heading" | "point" | "image";
  text?: string;
  title?: string;
  src?: string;
  alt?: string;
};

const BLOCK_TYPES: { value: ContentBlock["type"]; label: string }[] = [
  { value: "paragraph", label: "Paragraph" },
  { value: "heading", label: "Heading" },
  { value: "point", label: "Point (Bold Label)" },
  { value: "image", label: "Image" },
];

function ContentBlockEditor({
  blocks,
  onChange,
}: {
  blocks: ContentBlock[];
  onChange: (blocks: ContentBlock[]) => void;
}) {
  const fontMichroma = { fontFamily: "var(--font-michroma), sans-serif" };

  function updateBlock(idx: number, patch: Partial<ContentBlock>) {
    const next = [...blocks];
    next[idx] = { ...next[idx], ...patch };
    onChange(next);
  }

  function removeBlock(idx: number) {
    onChange(blocks.filter((_, i) => i !== idx));
  }

  function moveBlock(idx: number, dir: -1 | 1) {
    const target = idx + dir;
    if (target < 0 || target >= blocks.length) return;
    const next = [...blocks];
    [next[idx], next[target]] = [next[target], next[idx]];
    onChange(next);
  }

  function addBlock(type: ContentBlock["type"]) {
    onChange([...blocks, { type, text: "" }]);
  }

  return (
    <div className="space-y-3">
      {blocks.map((block, idx) => (
        <div key={idx} className="bg-[#f8f5f0] border border-[#1a1a1a]/10 p-4 space-y-3 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GripVertical size={13} className="text-[#1a1a1a]/25" />
              <span className="text-[9px] tracking-[0.2em] uppercase text-[#1a1a1a]/40" style={fontMichroma}>
                Block {idx + 1}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => moveBlock(idx, -1)}
                disabled={idx === 0}
                className="w-6 h-6 flex items-center justify-center text-[#1a1a1a]/40 hover:text-[#1a1a1a] disabled:opacity-20 transition-colors"
                title="Move up"
              >
                <ChevronUp size={13} />
              </button>
              <button
                type="button"
                onClick={() => moveBlock(idx, 1)}
                disabled={idx === blocks.length - 1}
                className="w-6 h-6 flex items-center justify-center text-[#1a1a1a]/40 hover:text-[#1a1a1a] disabled:opacity-20 transition-colors"
                title="Move down"
              >
                <ChevronDown size={13} />
              </button>
              <button
                type="button"
                onClick={() => removeBlock(idx)}
                className="w-6 h-6 flex items-center justify-center text-[#1a1a1a]/40 hover:text-red-500 transition-colors"
                title="Remove block"
              >
                <X size={13} />
              </button>
            </div>
          </div>

          <select
            value={block.type}
            onChange={(e) => updateBlock(idx, { type: e.target.value as ContentBlock["type"] })}
            className="block w-full sm:w-48 border border-[#1a1a1a]/15 bg-white px-3 py-2 text-xs text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none"
          >
            {BLOCK_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>

          {block.type === "paragraph" && (
            <textarea
              value={block.text || ""}
              onChange={(e) => updateBlock(idx, { text: e.target.value })}
              rows={3}
              placeholder="Paragraph text…"
              className="block w-full border border-[#1a1a1a]/15 bg-white px-3 py-2.5 text-sm text-[#1a1a1a] placeholder-[#1a1a1a]/25 focus:border-[#1a1a1a]/40 focus:outline-none resize-none leading-relaxed"
            />
          )}

          {block.type === "heading" && (
            <div className="space-y-1.5">
              <textarea
                value={block.text || ""}
                onChange={(e) => updateBlock(idx, { text: e.target.value })}
                rows={2}
                placeholder="Heading text… (use a new line to split into two colored lines)"
                className="block w-full border border-[#1a1a1a]/15 bg-white px-3 py-2.5 text-sm text-[#1a1a1a] placeholder-[#1a1a1a]/25 focus:border-[#1a1a1a]/40 focus:outline-none resize-none leading-relaxed"
              />
              <p className="text-[10px] text-[#8b8b8b]">First line renders in teal, following lines in black.</p>
            </div>
          )}

          {block.type === "point" && (
            <div className="space-y-2">
              <input
                type="text"
                value={block.title || ""}
                onChange={(e) => updateBlock(idx, { title: e.target.value })}
                placeholder="Point label, e.g. Zero Porosity"
                className="block w-full border border-[#1a1a1a]/15 bg-white px-3 py-2.5 text-sm text-[#1a1a1a] placeholder-[#1a1a1a]/25 focus:border-[#1a1a1a]/40 focus:outline-none"
              />
              <textarea
                value={block.text || ""}
                onChange={(e) => updateBlock(idx, { text: e.target.value })}
                rows={2}
                placeholder="Point description…"
                className="block w-full border border-[#1a1a1a]/15 bg-white px-3 py-2.5 text-sm text-[#1a1a1a] placeholder-[#1a1a1a]/25 focus:border-[#1a1a1a]/40 focus:outline-none resize-none leading-relaxed"
              />
            </div>
          )}

          {block.type === "image" && (
            <div className="space-y-2">
              {block.src && (
                <div className="w-full max-w-xs aspect-video overflow-hidden border border-[#1a1a1a]/10">
                  <img src={block.src} alt={block.alt || ""} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={block.src || ""}
                  onChange={(e) => updateBlock(idx, { src: e.target.value })}
                  placeholder="Image URL, e.g. /uploads/blogs/…"
                  className="block w-full border border-[#1a1a1a]/15 bg-white px-3 py-2.5 text-xs font-mono text-[#1a1a1a] placeholder-[#1a1a1a]/25 focus:border-[#1a1a1a]/40 focus:outline-none"
                />
                <MediaPickerButton folder="blogs" onSelect={(url) => updateBlock(idx, { src: url })} />
              </div>
              <input
                type="text"
                value={block.alt || ""}
                onChange={(e) => updateBlock(idx, { alt: e.target.value })}
                placeholder="Alt text (for SEO & accessibility)"
                className="block w-full border border-[#1a1a1a]/15 bg-white px-3 py-2.5 text-sm text-[#1a1a1a] placeholder-[#1a1a1a]/25 focus:border-[#1a1a1a]/40 focus:outline-none"
              />
            </div>
          )}
        </div>
      ))}

      <div className="flex flex-wrap gap-2 pt-1">
        {BLOCK_TYPES.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => addBlock(t.value)}
            className="flex items-center gap-1.5 px-3 py-2 border border-[#007190] text-[9px] tracking-[0.15em] uppercase hover:bg-[#007190] hover:text-white transition-all"
            style={fontMichroma}
          >
            <Plus size={11} />
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}

interface BlogFormProps {
  blogId?: string; // undefined = new blog
}

export default function BlogForm({ blogId }: BlogFormProps) {
  const router = useRouter();
  const isNew = !blogId;

  const [form, setForm] = useState({
    title: "",
    titleColor: "black" as "black" | "teal",
    titleFont: "ivymode" as "ivymode" | "michroma",
    slug: "",
    excerpt: "",
    author: "NOBILITA Editorial Team",
    authorImage: "",
    heroImage: "",
    heroImageAlt: "",
    tag: "",
    tags: [] as string[],
    content: [] as ContentBlock[],
    readTime: "",
    seoTitle: "",
    seoDescription: "",
    order: 0,
    status: "DRAFT" as "DRAFT" | "PUBLISHED",
    publishedAt: new Date().toISOString().slice(0, 10),
  });

  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadingBlog, setLoadingBlog] = useState(!isNew);
  const [error, setError] = useState<string | null>(null);

  const fontMichroma = { fontFamily: "var(--font-michroma), sans-serif" };
  const fontIvymode = { fontFamily: "var(--font-ivymode), serif" };

  useEffect(() => {
    if (!isNew && blogId) {
      fetch(`/api/blogs/${blogId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            const b = data.data;
            setForm({
              title: b.title,
              titleColor: b.titleColor === "teal" ? "teal" : "black",
              titleFont: b.titleFont === "michroma" ? "michroma" : "ivymode",
              slug: b.slug,
              excerpt: b.excerpt || "",
              author: b.author || "NOBILITA Editorial Team",
              authorImage: b.authorImage || "",
              heroImage: b.heroImage || "",
              heroImageAlt: b.heroImageAlt || "",
              tag: b.tag || "",
              tags: b.tags || [],
              content: Array.isArray(b.content) ? b.content : [],
              readTime: b.readTime || "",
              seoTitle: b.seoTitle || "",
              seoDescription: b.seoDescription || "",
              order: b.order ?? 0,
              status: b.status,
              publishedAt: b.publishedAt ? new Date(b.publishedAt).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
            });
            setSlugManuallyEdited(true);
          }
        })
        .catch(() => setError("Failed to load blog."))
        .finally(() => setLoadingBlog(false));
    }
  }, [blogId, isNew]);

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
      const url = isNew ? "/api/blogs" : `/api/blogs/${blogId}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save blog.");

      router.push("/admin/blogs");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loadingBlog) {
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
            href="/admin/blogs"
            className="flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase text-[#1a1a1a]/40 hover:text-[#1a1a1a] transition-colors mb-3"
            style={fontMichroma}
          >
            <ArrowLeft size={12} />
            Back to Blogs
          </Link>
          <h2 className="text-3xl font-light text-[#1a1a1a]" style={fontIvymode}>
            {isNew ? "New Blog Post" : form.title || "Edit Blog Post"}
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
            form="blog-form"
            disabled={saving}
            className="flex items-center gap-2 bg-[#007190] px-5 py-2.5 text-[10px] tracking-[0.2em] uppercase text-white hover:bg-[#005d76] disabled:opacity-40 transition-colors"
            style={fontMichroma}
          >
            <Save size={13} />
            {saving ? "Saving..." : "Save Blog"}
          </button>
        </div>
      </div>

      <div className="h-px bg-[#1a1a1a]/8" />

      {error && (
        <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
      )}

      <form id="blog-form" onSubmit={handleSubmit}>
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
                <textarea
                  required
                  rows={2}
                  value={form.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-3 text-sm text-[#1a1a1a] placeholder-[#1a1a1a]/25 focus:border-[#1a1a1a]/40 focus:outline-none resize-none"
                  placeholder="e.g. The Next Generation of Porcelain"
                />
                <p className="text-[10px] text-[#8b8b8b]">Press Enter for a manual line break on the blogs listing tile.</p>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="block text-[9px] tracking-[0.3em] uppercase text-[#1a1a1a]/50" style={fontMichroma}>
                    Title Color
                  </label>
                  <CustomSelect
                    value={form.titleColor}
                    onChange={(val) => setForm((p) => ({ ...p, titleColor: val as "black" | "teal" }))}
                    options={[
                      { value: "black", label: "Black" },
                      { value: "teal", label: "Teal (#007190)" },
                    ]}
                    style={fontMichroma}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[9px] tracking-[0.3em] uppercase text-[#1a1a1a]/50" style={fontMichroma}>
                    Title Font
                  </label>
                  <CustomSelect
                    value={form.titleFont}
                    onChange={(val) => setForm((p) => ({ ...p, titleFont: val as "ivymode" | "michroma" }))}
                    options={[
                      { value: "ivymode", label: "Ivymode" },
                      { value: "michroma", label: "Michroma" },
                    ]}
                    style={fontMichroma}
                  />
                </div>
              </div>
              <p className="text-[10px] text-[#8b8b8b] -mt-3">Applies to the title as shown on the blog post's own page.</p>

              <div className="space-y-1.5">
                <label className="block text-[9px] tracking-[0.3em] uppercase text-[#1a1a1a]/50" style={fontMichroma}>
                  URL Slug *
                </label>
                <input
                  type="text"
                  required
                  value={form.slug}
                  onChange={(e) => {
                    setSlugManuallyEdited(true);
                    setForm((p) => ({ ...p, slug: e.target.value }));
                  }}
                  className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-3 text-sm text-[#1a1a1a] font-mono focus:border-[#1a1a1a]/40 focus:outline-none"
                  placeholder="the-next-generation-porcelain"
                />
                <p className="text-[10px] text-[#8b8b8b]">Will be used as: /blog/{form.slug || "…"}</p>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[9px] tracking-[0.3em] uppercase text-[#1a1a1a]/50" style={fontMichroma}>
                  Excerpt
                </label>
                <textarea
                  value={form.excerpt}
                  onChange={(e) => setForm((p) => ({ ...p, excerpt: e.target.value }))}
                  rows={3}
                  className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-3 text-sm text-[#1a1a1a] placeholder-[#1a1a1a]/25 focus:border-[#1a1a1a]/40 focus:outline-none resize-none leading-relaxed"
                  placeholder="A short summary…"
                />
                <p className="text-[10px] text-[#8b8b8b]">
                  Shown as the preview text in the "Recent Blogs" carousel on other posts, and used as the SEO meta description if that field below is left blank.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-5">
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
                <div className="space-y-1.5">
                  <label className="block text-[9px] tracking-[0.3em] uppercase text-[#1a1a1a]/50" style={fontMichroma}>
                    Read Time
                  </label>
                  <input
                    type="text"
                    value={form.readTime}
                    onChange={(e) => setForm((p) => ({ ...p, readTime: e.target.value }))}
                    placeholder="e.g. 4 min read"
                    className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-3 text-sm text-[#1a1a1a] placeholder-[#1a1a1a]/25 focus:border-[#1a1a1a]/40 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[9px] tracking-[0.3em] uppercase text-[#1a1a1a]/50" style={fontMichroma}>
                  Author Image URL
                </label>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={form.authorImage}
                    onChange={(e) => setForm((p) => ({ ...p, authorImage: e.target.value }))}
                    className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-3 text-xs font-mono text-[#1a1a1a] placeholder-[#1a1a1a]/25 focus:border-[#1a1a1a]/40 focus:outline-none"
                    placeholder="/uploads/…"
                  />
                  <MediaPickerButton folder="blogs" onSelect={(url) => setForm((p) => ({ ...p, authorImage: url }))} />
                </div>
              </div>
            </div>

            {/* Categorization */}
            <div className="bg-white border border-[#1a1a1a]/8 p-6 space-y-5">
              <p className="text-[9px] tracking-[0.3em] uppercase text-[#1a1a1a]/35 border-b border-[#1a1a1a]/8 pb-3" style={fontMichroma}>
                Categorization
              </p>

              <div className="space-y-1.5">
                <label className="block text-[9px] tracking-[0.3em] uppercase text-[#1a1a1a]/50" style={fontMichroma}>
                  Category Tag
                </label>
                <input
                  type="text"
                  value={form.tag}
                  onChange={(e) => setForm((p) => ({ ...p, tag: e.target.value }))}
                  placeholder="e.g. INNOVATION, LIFESTYLE"
                  className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-3 text-sm text-[#1a1a1a] placeholder-[#1a1a1a]/25 focus:border-[#1a1a1a]/40 focus:outline-none uppercase"
                />
              </div>

              <TagInput
                label="SEO Tags / Keywords"
                values={form.tags}
                onChange={(v) => setForm((p) => ({ ...p, tags: v }))}
                placeholder="e.g. Porcelain Slabs, Italian Porcelain…"
              />
            </div>

            {/* Content Blocks */}
            <div className="bg-white border border-[#1a1a1a]/8 p-6 space-y-4">
              <p className="text-[9px] tracking-[0.3em] uppercase text-[#1a1a1a]/35 border-b border-[#1a1a1a]/8 pb-3" style={fontMichroma}>
                Article Content
              </p>
              <ContentBlockEditor
                blocks={form.content}
                onChange={(blocks) => setForm((p) => ({ ...p, content: blocks }))}
              />
              {form.content.length === 0 && (
                <p className="text-[11px] text-[#8b8b8b]">No content blocks yet. Add paragraphs, headings, points, or images above.</p>
              )}
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
                  placeholder="Defaults to the blog title if left blank"
                  className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-3 text-sm text-[#1a1a1a] placeholder-[#1a1a1a]/25 focus:border-[#1a1a1a]/40 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[9px] tracking-[0.3em] uppercase text-[#1a1a1a]/50" style={fontMichroma}>
                  SEO Meta Description
                </label>
                <textarea
                  value={form.seoDescription}
                  onChange={(e) => setForm((p) => ({ ...p, seoDescription: e.target.value }))}
                  rows={3}
                  placeholder="Defaults to the excerpt if left blank"
                  className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-3 text-sm text-[#1a1a1a] placeholder-[#1a1a1a]/25 focus:border-[#1a1a1a]/40 focus:outline-none resize-none leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* Right column — hero image & publish settings */}
          <div className="space-y-5">
            {/* Hero image */}
            <div className="bg-white border border-[#1a1a1a]/8 p-5 space-y-4">
              <MediaPickerField
                label="Hero Image"
                value={form.heroImage}
                onChange={(url) => setForm((p) => ({ ...p, heroImage: url }))}
                folder="blogs"
                placeholder="/uploads/blogs/…"
                aspect="aspect-[16/10]"
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
                <p className="text-[10px] text-[#8b8b8b]">Lower = shown first on the blogs listing</p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
