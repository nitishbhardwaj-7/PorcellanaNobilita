"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, X, ChevronDown, GripVertical } from "lucide-react";
import { MediaPickerField, MediaPickerButton } from "../_components/MediaPicker";
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

interface ProductFormProps {
  productId?: string; // undefined = new product
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
  showMediaPicker = false,
  mediaFolder = "products",
}: {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder: string;
  showMediaPicker?: boolean;
  mediaFolder?: string;
}) {
  const [input, setInput] = useState("");
  // Drag-to-reorder for the chips, mirroring the Carousel Slides editor's
  // pattern below — most relevant here since this is how multi-image fields
  // like Face Images get reordered (there's no separate numbered list UI).
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);
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

  function moveTag(from: number, to: number) {
    if (from === to) return;
    const next = [...values];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    onChange(next);
  }

  return (
    <div className="space-y-1.5">
      <label className="block text-[9px] tracking-[0.3em] uppercase text-[#1a1a1a]/50" style={fontMichroma}>
        {label}
      </label>
      <div className="flex gap-1.5 items-stretch">
        <div className="flex-1 min-h-[44px] flex flex-wrap gap-1.5 items-center border border-[#1a1a1a]/15 bg-white px-3 py-2 focus-within:border-[#1a1a1a]/40 transition-colors">
          {values.map((v, idx) => (
            <span
              key={v}
              draggable
              onDragStart={() => setDraggedIdx(idx)}
              onDragOver={(e) => {
                e.preventDefault();
                if (draggedIdx !== null) setDragOverIdx(idx);
              }}
              onDragLeave={() => setDragOverIdx((cur) => (cur === idx ? null : cur))}
              onDrop={(e) => {
                e.preventDefault();
                if (draggedIdx !== null) moveTag(draggedIdx, idx);
                setDraggedIdx(null);
                setDragOverIdx(null);
              }}
              onDragEnd={() => {
                setDraggedIdx(null);
                setDragOverIdx(null);
              }}
              className={`flex items-center gap-1.5 bg-[#f8f5f0] border pl-1 pr-2 py-0.5 text-[10px] text-[#1a1a1a]/70 cursor-grab active:cursor-grabbing transition-colors ${
                draggedIdx === idx ? "opacity-40 border-[#1a1a1a]/10" : dragOverIdx === idx ? "border-[#007190]" : "border-[#1a1a1a]/10"
              }`}
              title={showMediaPicker ? "Drag to reorder" : undefined}
            >
              {showMediaPicker && (
                <img src={v} alt="" className="w-5 h-5 object-cover border border-[#1a1a1a]/10 flex-shrink-0" />
              )}
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
        {showMediaPicker && (
          <MediaPickerButton
            folder={mediaFolder}
            multiSelect
            onSelect={(url) => {
              if (!values.includes(url)) {
                onChange([...values, url]);
              }
            }}
            onSelectMultiple={(urls) => {
              const newOnes = urls.filter((u) => !values.includes(u));
              if (newOnes.length > 0) onChange([...values, ...newOnes]);
            }}
          />
        )}
      </div>
      <p className="text-[10px] text-[#8b8b8b]">
        Press Enter or comma to add{showMediaPicker && ", or pick/upload several from the media library at once"}
        {showMediaPicker && values.length > 1 && " — drag a thumbnail to reorder"}
      </p>
    </div>
  );
}

export default function ProductForm({ productId }: ProductFormProps) {
  const router = useRouter();
  const isNew = !productId;

  const [form, setForm] = useState({
    name: "",
    nameColor: "default",
    nameFont: "default",
    nameSize: "default",
    slug: "",
    description: "",
    showDescription: false,
    descriptionColor: "default",
    descriptionFont: "default",
    descriptionSize: "default",
    color: "White",
    finish: "",
    finishCategories: [] as string[],
    thicknessMm: [] as string[],
    dimensions: [] as string[],
    format: "",
    applications: [] as string[],
    coverImage: "",
    gallery: [] as string[],
    leftBg: "",
    faces: [] as string[],
    finishes: [] as string[],
    slides: [] as { type: "image" | "video"; src: string; poster?: string; alt?: string }[],
    availableFaces: [] as string[],
    bookmatchImg: "",
    isHorizontalFace: false,
    isDark: false,
    order: 0,
    status: "DRAFT" as "DRAFT" | "PUBLISHED",
  });

  // Slug is auto-derived from the name and has no dedicated UI field — products are only
  // ever shown as a popup, never routed to by slug. For an existing product we still keep
  // its original slug stable when the name is edited, rather than silently changing it.
  const [keepExistingSlug, setKeepExistingSlug] = useState(false);
  const [saving, setSaving] = useState(false);
  const [draggedSlideIdx, setDraggedSlideIdx] = useState<number | null>(null);
  const [dragOverSlideIdx, setDragOverSlideIdx] = useState<number | null>(null);

  function moveSlide(from: number, to: number) {
    if (from === to) return;
    setForm((p) => {
      const next = [...p.slides];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return { ...p, slides: next };
    });
  }
  const [loadingProduct, setLoadingProduct] = useState(!isNew);
  const [error, setError] = useState<string | null>(null);

  // Color/Finish master data — editable from Admin > Explore The Collection > Colors/Finishes instead of hardcoded.
  const [colorOptions, setColorOptions] = useState<string[]>([]);
  const [finishOptions, setFinishOptions] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/colors")
      .then((res) => res.json())
      .then((data) => data?.data && setColorOptions(data.data.map((c: { name: string }) => c.name)))
      .catch(() => {});
    fetch("/api/finishes")
      .then((res) => res.json())
      .then((data) => data?.data && setFinishOptions(data.data.map((f: { name: string }) => f.name)))
      .catch(() => {});
  }, []);

  const fontMichroma = { fontFamily: "var(--font-michroma), sans-serif" };
  const fontIvymode = { fontFamily: "var(--font-ivymode), serif" };

  useEffect(() => {
    if (!isNew && productId) {
      fetch(`/api/products/${productId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            const p = data.data;
            setForm({
              name: p.name,
              nameColor: p.nameColor || "default",
              nameFont: p.nameFont || "default",
              nameSize: p.nameSize || "default",
              slug: p.slug,
              description: p.description || "",
              showDescription: !!p.showDescription,
              descriptionColor: p.descriptionColor || "default",
              descriptionFont: p.descriptionFont || "default",
              descriptionSize: p.descriptionSize || "default",
              color: p.color || "White",
              finish: p.finish || "",
              // Fall back to the legacy single `finish` value for products saved
              // before multi-finish support existed, so it shows up pre-selected.
              finishCategories: (p.finishCategories && p.finishCategories.length > 0)
                ? p.finishCategories
                : (p.finish ? [p.finish] : []),
              thicknessMm: p.thicknessMm || [],
              dimensions: p.dimensions || [],
              format: p.format || "",
              applications: p.applications || [],
              coverImage: p.coverImage || "",
              gallery: p.gallery || [],
              leftBg: p.leftBg || "",
              faces: p.faces || [],
              finishes: p.finishes || [],
              slides: Array.isArray(p.slides) ? p.slides : [],
              availableFaces: p.availableFaces || [],
              bookmatchImg: p.bookmatchImg || "",
              isHorizontalFace: p.isHorizontalFace || false,
              isDark: p.isDark || false,
              order: p.order ?? 0,
              status: p.status,
            });
            setKeepExistingSlug(true);
          }
        })
        .catch(() => setError("Failed to load product."))
        .finally(() => setLoadingProduct(false));
    }
  }, [productId, isNew]);

  function handleNameChange(value: string) {
    setForm((prev) => ({
      ...prev,
      name: value,
      slug: keepExistingSlug ? prev.slug : slugify(value),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      const url = isNew ? "/api/products" : `/api/products/${productId}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save product.");

      router.push("/admin/products");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loadingProduct) {
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
            href="/admin/products"
            className="flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase text-[#1a1a1a]/40 hover:text-[#1a1a1a] transition-colors mb-3"
            style={fontMichroma}
          >
            <ArrowLeft size={12} />
            Back to Explore The Collection
          </Link>
          <h2 className="text-3xl font-light text-[#1a1a1a]" style={fontIvymode}>
            {isNew ? "New Product" : form.name || "Edit Product"}
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
            form="product-form"
            disabled={saving}
            className="flex items-center gap-2 bg-[#007190] px-5 py-2.5 text-[10px] tracking-[0.2em] uppercase text-white hover:bg-[#005d76] disabled:opacity-40 transition-colors"
            style={fontMichroma}
          >
            <Save size={13} />
            {saving ? "Saving..." : "Save Product"}
          </button>
        </div>
      </div>

      <div className="h-px bg-[#1a1a1a]/8" />

      {error && (
        <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
      )}

      <form id="product-form" onSubmit={handleSubmit}>
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
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-3 text-sm text-[#1a1a1a] placeholder-[#1a1a1a]/25 focus:border-[#1a1a1a]/40 focus:outline-none"
                  placeholder="e.g. Statuario Ultimo"
                />
                <p className="text-[9px] text-[#8b8b8b]">
                  Color/Font/Size below apply only to the large title shown when a visitor opens this product's popup —
                  not the name shown on the Explore Collection grid tile, which stays consistent across every product.
                </p>
                <StyleRow
                  color={form.nameColor}
                  onColorChange={(v) => setForm((p) => ({ ...p, nameColor: v }))}
                  font={form.nameFont}
                  onFontChange={(v) => setForm((p) => ({ ...p, nameFont: v }))}
                  size={form.nameSize}
                  onSizeChange={(v) => setForm((p) => ({ ...p, nameSize: v }))}
                  sizeOptions={HEADING_SIZE_OPTIONS}
                  colorDefaultLabel={form.isDark ? "White" : "Black"}
                  fontDefaultLabel="Ivymode"
                />
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-[9px] tracking-[0.3em] uppercase text-[#1a1a1a]/50 cursor-pointer select-none" style={fontMichroma}>
                  <input
                    type="checkbox"
                    checked={form.showDescription}
                    onChange={(e) => setForm((p) => ({ ...p, showDescription: e.target.checked }))}
                    className="accent-[#007190]"
                  />
                  Show Product Description
                </label>
                <p className="text-[9px] text-[#8b8b8b]">
                  Hidden by default. When ticked, an editorial paragraph appears below the slab face images in this product's popup.
                </p>
                {form.showDescription && (
                  <>
                    <textarea
                      rows={4}
                      value={form.description}
                      onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                      className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-3 text-sm text-[#1a1a1a] placeholder-[#1a1a1a]/25 focus:border-[#1a1a1a]/40 focus:outline-none"
                      placeholder="Editorial paragraph shown below the slab face images…"
                    />
                    <p className="text-[9px] text-[#8b8b8b]">
                      Leave a blank line between paragraphs to split them. If left empty, the site's signature editorial paragraph is shown instead.
                    </p>
                    <StyleRow
                      color={form.descriptionColor}
                      onColorChange={(v) => setForm((p) => ({ ...p, descriptionColor: v }))}
                      font={form.descriptionFont}
                      onFontChange={(v) => setForm((p) => ({ ...p, descriptionFont: v }))}
                      size={form.descriptionSize}
                      onSizeChange={(v) => setForm((p) => ({ ...p, descriptionSize: v }))}
                      sizeOptions={PARAGRAPH_SIZE_OPTIONS}
                      colorDefaultLabel="Grey"
                      fontDefaultLabel="Ivymode"
                    />
                  </>
                )}
              </div>

            </div>

            {/* Specifications */}
            <div className="bg-white border border-[#1a1a1a]/8 p-6 space-y-5">
              <p className="text-[9px] tracking-[0.3em] uppercase text-[#1a1a1a]/35 border-b border-[#1a1a1a]/8 pb-3" style={fontMichroma}>
                Specifications
              </p>

              <div className="space-y-1.5">
                <label className="block text-[9px] tracking-[0.3em] uppercase text-[#1a1a1a]/50" style={fontMichroma}>
                  Color Category
                </label>
                <select
                  value={form.color}
                  onChange={(e) => setForm((p) => ({ ...p, color: e.target.value }))}
                  className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-3 text-sm text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none"
                >
                  {/* Include the product's current value even if it's since been removed
                      from Master Data, so editing an old product never silently changes it. */}
                  {(form.color && !colorOptions.includes(form.color) ? [form.color, ...colorOptions] : colorOptions).map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[9px] tracking-[0.3em] uppercase text-[#1a1a1a]/50" style={fontMichroma}>
                  Finish
                </label>
                <div className="flex flex-wrap gap-2">
                  {[...finishOptions, ...form.finishCategories.filter((f) => !finishOptions.includes(f))].map((f) => {
                    const isSelected = form.finishCategories.includes(f);
                    return (
                      <button
                        key={f}
                        type="button"
                        onClick={() =>
                          setForm((p) => ({
                            ...p,
                            finishCategories: isSelected
                              ? p.finishCategories.filter((x) => x !== f)
                              : [...p.finishCategories, f],
                          }))
                        }
                        className={`px-3.5 py-2 text-xs border transition-colors ${
                          isSelected
                            ? "bg-[#1a1a1a] text-white border-[#1a1a1a]"
                            : "bg-[#f8f5f0] text-[#1a1a1a]/60 border-[#1a1a1a]/15 hover:border-[#1a1a1a]/35"
                        }`}
                      >
                        {f}
                      </button>
                    );
                  })}
                </div>
                <p className="text-[10px] text-[#8b8b8b]">
                  Select every finish this slab is available in — it'll show up under each one as a filter on the website.
                </p>
              </div>

              <TagInput
                label="Dimensions"
                values={form.dimensions}
                onChange={(v) => setForm((p) => ({ ...p, dimensions: v }))}
                placeholder='e.g. 1600x3200, 1620x3240…'
              />
            </div>

            {/* Exhibition / Modal Details */}
            <div className="bg-white border border-[#1a1a1a]/8 p-6 space-y-5">
              <p className="text-[9px] tracking-[0.3em] uppercase text-[#1a1a1a]/35 border-b border-[#1a1a1a]/8 pb-3" style={fontMichroma}>
                Detail Modal Customization (Exhibition View)
              </p>

              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="block text-[9px] tracking-[0.3em] uppercase text-[#1a1a1a]/50" style={fontMichroma}>
                    Left Panel Image (Slab Application)
                  </label>
                  {form.leftBg && (
                    <div className="relative aspect-video w-full overflow-hidden border border-[#1a1a1a]/8 bg-[#f8f5f0] mb-2 flex items-center justify-center">
                      <img
                        src={form.leftBg}
                        alt="Left Panel Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setForm((p) => ({ ...p, leftBg: "" }))}
                        className="absolute top-2 right-2 bg-white/90 border border-[#1a1a1a]/10 w-6 h-6 flex items-center justify-center text-[#1a1a1a]/50 hover:text-red-500 transition-colors"
                        title="Remove image"
                      >
                        <X size={11} />
                      </button>
                    </div>
                  )}
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      value={form.leftBg}
                      onChange={(e) => setForm((p) => ({ ...p, leftBg: e.target.value }))}
                      className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-3 text-sm text-[#1a1a1a] placeholder-[#1a1a1a]/25 focus:border-[#1a1a1a]/40 focus:outline-none"
                      placeholder="e.g. /images/Our story/Verde profondo application.jpg"
                    />
                    <MediaPickerButton folder="products" onSelect={(url) => setForm((p) => ({ ...p, leftBg: url }))} />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[9px] tracking-[0.3em] uppercase text-[#1a1a1a]/50" style={fontMichroma}>
                    Bookmatch Image
                    <br />
                    (Optional)
                  </label>
                  {form.bookmatchImg && (
                    <div className="relative aspect-video w-full overflow-hidden border border-[#1a1a1a]/8 bg-[#f8f5f0] mb-2 flex items-center justify-center">
                      <img
                        src={form.bookmatchImg}
                        alt="Bookmatch Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setForm((p) => ({ ...p, bookmatchImg: "" }))}
                        className="absolute top-2 right-2 bg-white/90 border border-[#1a1a1a]/10 w-6 h-6 flex items-center justify-center text-[#1a1a1a]/50 hover:text-red-500 transition-colors"
                        title="Remove image"
                      >
                        <X size={11} />
                      </button>
                    </div>
                  )}
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      value={form.bookmatchImg}
                      onChange={(e) => setForm((p) => ({ ...p, bookmatchImg: e.target.value }))}
                      className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-3 text-sm text-[#1a1a1a] placeholder-[#1a1a1a]/25 focus:border-[#1a1a1a]/40 focus:outline-none"
                      placeholder="e.g. /images/Calacatta Oyster/Bookmatch.jpg"
                    />
                    <MediaPickerButton folder="products" onSelect={(url) => setForm((p) => ({ ...p, bookmatchImg: url }))} />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="isHorizontalFace"
                    checked={form.isHorizontalFace}
                    onChange={(e) => setForm((p) => ({ ...p, isHorizontalFace: e.target.checked }))}
                    className="w-4 h-4 border-[#1a1a1a]/15 text-[#1a1a1a] focus:ring-0 focus:outline-none"
                  />
                  <label htmlFor="isHorizontalFace" className="text-xs text-[#1a1a1a]/70 select-none">
                    My Face photos are already upright (portrait), not landscape
                  </label>
                </div>
                <p className="text-[10px] text-[#8b8b8b] pl-7">
                  Leave unchecked (default) if your Face photos are wide/landscape — the site automatically
                  rotates them to fill the tall Face panel, like Calacatta Oyster. Check this box only if
                  your Face photos are already tall/portrait-oriented — checking it displays them as-is
                  without rotating. Using the wrong setting for your photos' orientation is what makes the
                  Face preview look distorted or sideways.
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="isDark"
                  checked={form.isDark}
                  onChange={(e) => setForm((p) => ({ ...p, isDark: e.target.checked }))}
                  className="w-4 h-4 border-[#1a1a1a]/15 text-[#1a1a1a] focus:ring-0 focus:outline-none"
                />
                <label htmlFor="isDark" className="text-xs text-[#1a1a1a]/70 select-none">
                  White text for darker background materials
                </label>
              </div>

              <TagInput
                label="Faces Info List"
                values={form.faces}
                onChange={(v) => setForm((p) => ({ ...p, faces: v }))}
                placeholder="e.g. 6.5MM – 1 FACE, 12MM – BOOKMATCH OF 1"
              />

              <TagInput
                label="Finishes Info List"
                values={form.finishes}
                onChange={(v) => setForm((p) => ({ ...p, finishes: v }))}
                placeholder="e.g. 6.5MM – POLISHED, 12MM – MATTE"
              />

              <TagInput
                label="Slab Face Image URLs (availableFaces)"
                values={form.availableFaces}
                onChange={(v) => setForm((p) => ({ ...p, availableFaces: v }))}
                placeholder="Paste face image path and press Enter"
                showMediaPicker={true}
                mediaFolder="products"
              />
              
              {/* Slides Editor */}
              <div className="space-y-3">
                <label className="block text-[9px] tracking-[0.3em] uppercase text-[#1a1a1a]/50" style={fontMichroma}>
                  Carousel Slides (Image/Video Gallery)
                </label>
                
                {form.slides.map((slide, idx) => (
                  <div
                    key={idx}
                    onDragOver={(e) => {
                      e.preventDefault();
                      if (draggedSlideIdx !== null) setDragOverSlideIdx(idx);
                    }}
                    onDragLeave={() => setDragOverSlideIdx((cur) => (cur === idx ? null : cur))}
                    onDrop={(e) => {
                      e.preventDefault();
                      if (draggedSlideIdx !== null) moveSlide(draggedSlideIdx, idx);
                      setDraggedSlideIdx(null);
                      setDragOverSlideIdx(null);
                    }}
                    className={`flex gap-2.5 items-center bg-[#f8f5f0] border p-3 relative transition-colors ${
                      draggedSlideIdx === idx
                        ? "opacity-40 border-[#1a1a1a]/10"
                        : dragOverSlideIdx === idx
                          ? "border-[#007190]"
                          : "border-[#1a1a1a]/10"
                    }`}
                  >
                    <div
                      draggable
                      onDragStart={() => setDraggedSlideIdx(idx)}
                      onDragEnd={() => {
                        setDraggedSlideIdx(null);
                        setDragOverSlideIdx(null);
                      }}
                      className="flex-shrink-0 self-stretch flex items-center text-[#1a1a1a]/25 hover:text-[#1a1a1a]/60 cursor-grab active:cursor-grabbing transition-colors"
                      title="Drag to reorder"
                    >
                      <GripVertical size={15} />
                    </div>
                    <div className="w-14 h-14 flex-shrink-0 border border-[#1a1a1a]/10 bg-white overflow-hidden">
                      {slide.src ? (
                        slide.type === "video" ? (
                          <video src={slide.src} muted playsInline preload="metadata" className="w-full h-full object-cover" />
                        ) : (
                          <img src={slide.src} alt="" className="w-full h-full object-cover" />
                        )
                      ) : null}
                    </div>
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-4 gap-2">
                      <div>
                        <label className="block text-[8px] text-[#8b8b8b] uppercase">Type</label>
                        <select
                          value={slide.type}
                          onChange={(e) => {
                            const newSlides = [...form.slides];
                            newSlides[idx].type = e.target.value as "image" | "video";
                            setForm((p) => ({ ...p, slides: newSlides }));
                          }}
                          className="w-full border border-[#1a1a1a]/10 bg-white px-2 py-1 text-xs outline-none"
                        >
                          <option value="image">Image</option>
                          <option value="video">Video</option>
                        </select>
                      </div>
                      <div className="sm:col-span-3">
                        <label className="block text-[8px] text-[#8b8b8b] uppercase">Source URL</label>
                        <div className="flex gap-1">
                          <input
                            type="text"
                            value={slide.src}
                            onChange={(e) => {
                              const newSlides = [...form.slides];
                              newSlides[idx].src = e.target.value;
                              setForm((p) => ({ ...p, slides: newSlides }));
                            }}
                            className="w-full border border-[#1a1a1a]/10 bg-white px-2 py-1 text-xs outline-none animate-none"
                          />
                          <MediaPickerButton
                            folder="products"
                            accept={slide.type === "video" ? "video/*" : "image/*"}
                            onSelect={(url) => {
                              const newSlides = [...form.slides];
                              newSlides[idx].src = url;
                              setForm((p) => ({ ...p, slides: newSlides }));
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, slides: p.slides.filter((_, i) => i !== idx) }))}
                      className="text-red-500 hover:text-red-700 transition-colors p-1"
                    >
                      <X size={15} />
                    </button>
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, slides: [...p.slides, { type: "image", src: "" }] }))}
                  className="px-3 py-1.5 border border-[#007190] text-[9px] tracking-[0.15em] uppercase hover:bg-[#007190] hover:text-white transition-all"
                  style={fontMichroma}
                >
                  + Add Slide
                </button>
              </div>
            </div>
          </div>

          {/* Right column — images & order */}
          <div className="space-y-5">
            {/* Cover image */}
            <div className="bg-white border border-[#1a1a1a]/8 p-5">
              <MediaPickerField
                label="Cover Image"
                value={form.coverImage}
                onChange={(url) => setForm((p) => ({ ...p, coverImage: url }))}
                folder="products"
                placeholder="/uploads/products/…"
              />
            </div>

            {/* Order */}
            <div className="bg-white border border-[#1a1a1a]/8 p-5 space-y-3">
              <p className="text-[9px] tracking-[0.3em] uppercase text-[#1a1a1a]/35 border-b border-[#1a1a1a]/8 pb-3" style={fontMichroma}>
                Display Order
              </p>
              <input
                type="number"
                min={0}
                value={form.order}
                onChange={(e) => setForm((p) => ({ ...p, order: parseInt(e.target.value) || 0 }))}
                className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-3 py-2.5 text-sm text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none"
              />
              <p className="text-[10px] text-[#8b8b8b]">Lower number = shown first on the page</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
