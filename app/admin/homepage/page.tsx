"use client";

import React, { useState, useEffect } from "react";
import { Plus, X, GripVertical, Check } from "lucide-react";
import { MediaPickerButton } from "../_components/MediaPicker";

const fontMichroma = { fontFamily: "var(--font-michroma), sans-serif" };
const fontIvymode = { fontFamily: "var(--font-ivymode), serif" };

const TABS = ["hero", "brand-intro", "craftsmanship", "legacy", "applications", "dimensions", "finishes"] as const;
type Tab = (typeof TABS)[number];
const TAB_LABELS: Record<Tab, string> = {
  hero: "Hero",
  "brand-intro": "Brand Intro",
  craftsmanship: "Craftsmanship",
  legacy: "Legacy",
  applications: "Applications",
  dimensions: "Dimensions",
  finishes: "Finishes",
};

export default function HomepagePage() {
  const [activeTab, setActiveTab] = useState<Tab>("hero");

  return (
    <div className="space-y-8" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
      {/* Header */}
      <div>
        <p className="text-[10px] tracking-[0.3em] uppercase text-[#1a1a1a]/35 mb-1" style={fontMichroma}>
          Site Content
        </p>
        <h2 className="text-3xl font-light text-[#1a1a1a]" style={fontIvymode}>
          Homepage
        </h2>
        <p className="mt-2 text-sm text-[#8b8b8b]">
          Edit each homepage section's text, images, and links.
        </p>
      </div>

      <div className="h-px bg-[#1a1a1a]/8" />

      {/* Tabs */}
      <div className="flex gap-1">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-[9px] tracking-[0.2em] uppercase border transition-colors ${
              activeTab === tab
                ? "bg-[#007190] text-white border-[#007190]"
                : "bg-white text-[#1a1a1a]/40 border-[#1a1a1a]/15 hover:text-[#1a1a1a] hover:border-[#1a1a1a]/30"
            }`}
            style={fontMichroma}
          >
            {TAB_LABELS[tab]}
          </button>
        ))}
      </div>

      {activeTab === "hero" && <HeroTab />}
      {activeTab === "brand-intro" && <BrandIntroTab />}
      {activeTab === "craftsmanship" && <CraftsmanshipTab />}
      {activeTab === "legacy" && <LegacyTab />}
      {activeTab === "applications" && <ApplicationsTab />}
      {activeTab === "dimensions" && <DimensionsTab />}
      {activeTab === "finishes" && <FinishesTab />}
    </div>
  );
}

// ============================================================================
// Hero tab
// ============================================================================

interface HeroSlide {
  id: string;
  image: string;
  label: string;
  textColor: string;
  order: number;
}

interface HeroSettings {
  heroTitle: string | null;
  heroSubtitle: string | null;
  heroButtonText: string | null;
  heroButtonLink: string | null;
}

function HeroTab() {
  const [settings, setSettings] = useState<HeroSettings>({
    heroTitle: "",
    heroSubtitle: "",
    heroButtonText: "",
    heroButtonLink: "",
  });
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingSettings, setSavingSettings] = useState(false);
  const [savedSettings, setSavedSettings] = useState(false);
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

  useEffect(() => {
    fetchAll();
  }, []);

  async function fetchAll() {
    try {
      setLoading(true);
      const [settingsRes, slidesRes] = await Promise.all([
        fetch("/api/settings").then((r) => r.json()),
        fetch("/api/hero-slides").then((r) => r.json()),
      ]);
      if (settingsRes?.data) {
        setSettings({
          heroTitle: settingsRes.data.heroTitle || "",
          heroSubtitle: settingsRes.data.heroSubtitle || "",
          heroButtonText: settingsRes.data.heroButtonText || "",
          heroButtonLink: settingsRes.data.heroButtonLink || "",
        });
      }
      if (slidesRes?.data) setSlides(slidesRes.data);
    } catch (err: any) {
      setError(err.message || "Failed to load.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveSettings() {
    setSavingSettings(true);
    setError(null);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save.");
      setSavedSettings(true);
      setTimeout(() => setSavedSettings(false), 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSavingSettings(false);
    }
  }

  async function handleAddSlide() {
    setError(null);
    try {
      const res = await fetch("/api/hero-slides", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: "", label: "NEW SLIDE", textColor: "white" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add slide.");
      setSlides((prev) => [...prev, data.data]);
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function updateSlide(id: string, patch: Partial<HeroSlide>) {
    setSlides((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
    try {
      await fetch(`/api/hero-slides/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
    } catch {
      setError("Failed to save slide changes.");
    }
  }

  async function handleDeleteSlide(id: string) {
    if (!confirm("Delete this slide? This cannot be undone.")) return;
    setError(null);
    try {
      const res = await fetch(`/api/hero-slides/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete.");
      setSlides((prev) => prev.filter((s) => s.id !== id));
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function moveSlide(from: number, to: number) {
    if (from === to) return;
    const reordered = [...slides];
    const [moved] = reordered.splice(from, 1);
    reordered.splice(to, 0, moved);
    setSlides(reordered);

    setError(null);
    try {
      await Promise.all(
        reordered.map((slide, i) =>
          slide.order === i
            ? Promise.resolve()
            : fetch(`/api/hero-slides/${slide.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ order: i }),
              })
        )
      );
      setSlides((prev) => prev.map((s, i) => ({ ...s, order: i })));
    } catch {
      setError("Failed to save the new slide order.");
      fetchAll();
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((n) => (
          <div key={n} className="h-24 bg-white border border-[#1a1a1a]/8 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
      )}

      {/* Text + button */}
      <div className="bg-white border border-[#1a1a1a]/8 p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-[#1a1a1a]/8 pb-3">
          <p className="text-[9px] tracking-[0.3em] uppercase text-[#1a1a1a]/35" style={fontMichroma}>
            Hero Text
          </p>
          {savedSettings && (
            <span className="flex items-center gap-1 text-[10px] text-green-600" style={fontMichroma}>
              <Check size={11} /> Saved
            </span>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40" style={fontMichroma}>
            Headline
          </label>
          <input
            type="text"
            value={settings.heroTitle || ""}
            onChange={(e) => setSettings((p) => ({ ...p, heroTitle: e.target.value }))}
            placeholder="EXPLORE THE COLLECTION"
            className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40" style={fontMichroma}>
            Subtitle
          </label>
          <textarea
            value={settings.heroSubtitle || ""}
            onChange={(e) => setSettings((p) => ({ ...p, heroSubtitle: e.target.value }))}
            rows={3}
            className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40" style={fontMichroma}>
              Button Text
            </label>
            <input
              type="text"
              value={settings.heroButtonText || ""}
              onChange={(e) => setSettings((p) => ({ ...p, heroButtonText: e.target.value }))}
              placeholder="VIEW ALL PRODUCTS"
              className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40" style={fontMichroma}>
              Button Link
            </label>
            <input
              type="text"
              value={settings.heroButtonLink || ""}
              onChange={(e) => setSettings((p) => ({ ...p, heroButtonLink: e.target.value }))}
              placeholder="/explore-collection"
              className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none font-mono"
            />
          </div>
        </div>

        <button
          onClick={handleSaveSettings}
          disabled={savingSettings}
          className="border border-[#007190]/25 bg-white px-5 py-2 text-[10px] tracking-[0.15em] uppercase text-[#007190]/70 hover:bg-[#007190] hover:text-white hover:border-[#007190] disabled:opacity-40 transition-all"
          style={fontMichroma}
        >
          {savingSettings ? "Saving…" : "Save Hero Text"}
        </button>
      </div>

      {/* Slideshow */}
      <div className="bg-white border border-[#1a1a1a]/8 p-6 space-y-4">
        <div>
          <p className="text-[9px] tracking-[0.3em] uppercase text-[#1a1a1a]/35 border-b border-[#1a1a1a]/8 pb-3 mb-1" style={fontMichroma}>
            Background Slideshow
          </p>
          <p className="text-[10px] text-[#8b8b8b] pt-2">
            Drag the grip handle to reorder. Each slide's label is shown in the corner over its image.
          </p>
        </div>

        <div className="space-y-3">
          {slides.map((slide, idx) => (
            <div
              key={slide.id}
              onDragOver={(e) => {
                e.preventDefault();
                if (draggedIdx !== null) setDragOverIdx(idx);
              }}
              onDragLeave={() => setDragOverIdx((cur) => (cur === idx ? null : cur))}
              onDrop={(e) => {
                e.preventDefault();
                if (draggedIdx !== null) moveSlide(draggedIdx, idx);
                setDraggedIdx(null);
                setDragOverIdx(null);
              }}
              className={`flex gap-3 items-center bg-[#f8f5f0] border p-3 transition-colors ${
                draggedIdx === idx
                  ? "opacity-40 border-[#1a1a1a]/10"
                  : dragOverIdx === idx
                    ? "border-[#007190]"
                    : "border-[#1a1a1a]/10"
              }`}
            >
              <div
                draggable
                onDragStart={() => setDraggedIdx(idx)}
                onDragEnd={() => {
                  setDraggedIdx(null);
                  setDragOverIdx(null);
                }}
                className="flex-shrink-0 self-stretch flex items-center text-[#1a1a1a]/25 hover:text-[#1a1a1a]/60 cursor-grab active:cursor-grabbing transition-colors"
                title="Drag to reorder"
              >
                <GripVertical size={15} />
              </div>

              <div className="w-16 h-16 flex-shrink-0 border border-[#1a1a1a]/10 bg-white overflow-hidden">
                {slide.image ? (
                  <img src={slide.image} alt="" className="w-full h-full object-cover" />
                ) : null}
              </div>

              <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="sm:col-span-2">
                  <label className="block text-[8px] text-[#8b8b8b] uppercase">Image</label>
                  <div className="flex gap-1">
                    <input
                      type="text"
                      value={slide.image}
                      onChange={(e) => updateSlide(slide.id, { image: e.target.value })}
                      className="w-full border border-[#1a1a1a]/10 bg-white px-2 py-1 text-xs outline-none"
                    />
                    <MediaPickerButton
                      folder="products"
                      onSelect={(url) => updateSlide(slide.id, { image: url })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[8px] text-[#8b8b8b] uppercase">Label Color</label>
                  <div className="flex gap-1">
                    {(["white", "black"] as const).map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => updateSlide(slide.id, { textColor: c })}
                        className={`flex-1 px-2 py-1 text-[10px] uppercase border transition-colors ${
                          slide.textColor === c
                            ? "bg-[#1a1a1a] text-white border-[#1a1a1a]"
                            : "bg-white text-[#1a1a1a]/50 border-[#1a1a1a]/15"
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="sm:col-span-3">
                  <label className="block text-[8px] text-[#8b8b8b] uppercase">Label Text</label>
                  <input
                    type="text"
                    value={slide.label}
                    onChange={(e) => updateSlide(slide.id, { label: e.target.value })}
                    className="w-full border border-[#1a1a1a]/10 bg-white px-2 py-1 text-xs outline-none"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleDeleteSlide(slide.id)}
                className="text-red-500 hover:text-red-700 transition-colors p-1 self-start"
              >
                <X size={15} />
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={handleAddSlide}
          className="flex items-center gap-2 border border-[#007190] px-4 py-2.5 text-[10px] tracking-[0.15em] uppercase text-[#007190] hover:bg-[#007190] hover:text-white transition-all"
          style={fontMichroma}
        >
          <Plus size={13} />
          Add Slide
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// Brand Intro tab
// ============================================================================

interface BrandSettings {
  brandTagImage: string | null;
  brandTagSubtext: string | null;
  brandImg: string | null;
  brandSubtitle: string | null;
  brandBtn: string | null;
  brandBtnLink: string | null;
}

function BrandIntroTab() {
  const [settings, setSettings] = useState<BrandSettings>({
    brandTagImage: "",
    brandTagSubtext: "",
    brandImg: "",
    brandSubtitle: "",
    brandBtn: "",
    brandBtnLink: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data?.data) {
          setSettings({
            brandTagImage: data.data.brandTagImage || "",
            brandTagSubtext: data.data.brandTagSubtext || "",
            brandImg: data.data.brandImg || "",
            brandSubtitle: data.data.brandSubtitle || "",
            brandBtn: data.data.brandBtn || "",
            brandBtnLink: data.data.brandBtnLink || "",
          });
        }
      })
      .catch((err) => setError(err.message || "Failed to load."))
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save.");
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((n) => (
          <div key={n} className="h-24 bg-white border border-[#1a1a1a]/8 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
      )}

      <div className="bg-white border border-[#1a1a1a]/8 p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-[#1a1a1a]/8 pb-3">
          <p className="text-[9px] tracking-[0.3em] uppercase text-[#1a1a1a]/35" style={fontMichroma}>
            Brand Intro
          </p>
          {saved && (
            <span className="flex items-center gap-1 text-[10px] text-green-600" style={fontMichroma}>
              <Check size={11} /> Saved
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40" style={fontMichroma}>
              Tag Image
            </label>
            <p className="text-[10px] text-[#8b8b8b]">The "Il Gres Imperiale d'Italia" graphic at the top.</p>
            {settings.brandTagImage && (
              <img src={settings.brandTagImage} alt="" className="h-10 object-contain bg-[#007190] px-2 py-1" />
            )}
            <div className="flex gap-1">
              <input
                type="text"
                value={settings.brandTagImage || ""}
                onChange={(e) => setSettings((p) => ({ ...p, brandTagImage: e.target.value }))}
                className="w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-3 py-2 text-xs text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none"
              />
              <MediaPickerButton folder="products" onSelect={(url) => setSettings((p) => ({ ...p, brandTagImage: url }))} />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40" style={fontMichroma}>
              Logo Image
            </label>
            <p className="text-[10px] text-[#8b8b8b]">The NOBILITA logo in the middle.</p>
            {settings.brandImg && (
              <img src={settings.brandImg} alt="" className="h-10 object-contain bg-[#007190] px-2 py-1" />
            )}
            <div className="flex gap-1">
              <input
                type="text"
                value={settings.brandImg || ""}
                onChange={(e) => setSettings((p) => ({ ...p, brandImg: e.target.value }))}
                className="w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-3 py-2 text-xs text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none"
              />
              <MediaPickerButton folder="products" onSelect={(url) => setSettings((p) => ({ ...p, brandImg: url }))} />
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40" style={fontMichroma}>
            Tag Subtext
          </label>
          <input
            type="text"
            value={settings.brandTagSubtext || ""}
            onChange={(e) => setSettings((p) => ({ ...p, brandTagSubtext: e.target.value }))}
            placeholder="The Imperial Stone of Italy"
            className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40" style={fontMichroma}>
            Description
          </label>
          <textarea
            value={settings.brandSubtitle || ""}
            onChange={(e) => setSettings((p) => ({ ...p, brandSubtitle: e.target.value }))}
            rows={4}
            className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40" style={fontMichroma}>
              Button Text
            </label>
            <input
              type="text"
              value={settings.brandBtn || ""}
              onChange={(e) => setSettings((p) => ({ ...p, brandBtn: e.target.value }))}
              placeholder="OUR STORY"
              className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40" style={fontMichroma}>
              Button Link
            </label>
            <input
              type="text"
              value={settings.brandBtnLink || ""}
              onChange={(e) => setSettings((p) => ({ ...p, brandBtnLink: e.target.value }))}
              placeholder="/our-story"
              className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none font-mono"
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="border border-[#007190]/25 bg-white px-5 py-2 text-[10px] tracking-[0.15em] uppercase text-[#007190]/70 hover:bg-[#007190] hover:text-white hover:border-[#007190] disabled:opacity-40 transition-all"
          style={fontMichroma}
        >
          {saving ? "Saving…" : "Save Brand Intro"}
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// Craftsmanship tab
// ============================================================================

interface CraftSettings {
  craftHeading: string | null;
  craftParagraph: string | null;
  craftBgImage: string | null;
  craftBgImageMobile: string | null;
  craftBadgeText: string | null;
  craftBadgeLink: string | null;
  craftCasaLabel: string | null;
}

function CraftsmanshipTab() {
  const [settings, setSettings] = useState<CraftSettings>({
    craftHeading: "",
    craftParagraph: "",
    craftBgImage: "",
    craftBgImageMobile: "",
    craftBadgeText: "",
    craftBadgeLink: "",
    craftCasaLabel: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data?.data) {
          setSettings({
            craftHeading: data.data.craftHeading || "",
            craftParagraph: data.data.craftParagraph || "",
            craftBgImage: data.data.craftBgImage || "",
            craftBgImageMobile: data.data.craftBgImageMobile || "",
            craftBadgeText: data.data.craftBadgeText || "",
            craftBadgeLink: data.data.craftBadgeLink || "",
            craftCasaLabel: data.data.craftCasaLabel || "",
          });
        }
      })
      .catch((err) => setError(err.message || "Failed to load."))
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save.");
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((n) => (
          <div key={n} className="h-24 bg-white border border-[#1a1a1a]/8 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
      )}

      <div className="bg-white border border-[#1a1a1a]/8 p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-[#1a1a1a]/8 pb-3">
          <p className="text-[9px] tracking-[0.3em] uppercase text-[#1a1a1a]/35" style={fontMichroma}>
            Craftsmanship
          </p>
          {saved && (
            <span className="flex items-center gap-1 text-[10px] text-green-600" style={fontMichroma}>
              <Check size={11} /> Saved
            </span>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40" style={fontMichroma}>
            Heading
          </label>
          <input
            type="text"
            value={settings.craftHeading || ""}
            onChange={(e) => setSettings((p) => ({ ...p, craftHeading: e.target.value }))}
            placeholder="ITALIAN CRAFTSMANSHIP"
            className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40" style={fontMichroma}>
            Paragraph
          </label>
          <textarea
            value={settings.craftParagraph || ""}
            onChange={(e) => setSettings((p) => ({ ...p, craftParagraph: e.target.value }))}
            rows={3}
            className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40" style={fontMichroma}>
              Background Image (Desktop)
            </label>
            {settings.craftBgImage && (
              <img src={settings.craftBgImage} alt="" className="h-16 w-full object-cover border border-[#1a1a1a]/10" />
            )}
            <div className="flex gap-1">
              <input
                type="text"
                value={settings.craftBgImage || ""}
                onChange={(e) => setSettings((p) => ({ ...p, craftBgImage: e.target.value }))}
                className="w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-3 py-2 text-xs text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none"
              />
              <MediaPickerButton folder="products" onSelect={(url) => setSettings((p) => ({ ...p, craftBgImage: url }))} />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40" style={fontMichroma}>
              Background Image (Mobile)
            </label>
            {settings.craftBgImageMobile && (
              <img src={settings.craftBgImageMobile} alt="" className="h-16 w-full object-cover border border-[#1a1a1a]/10" />
            )}
            <div className="flex gap-1">
              <input
                type="text"
                value={settings.craftBgImageMobile || ""}
                onChange={(e) => setSettings((p) => ({ ...p, craftBgImageMobile: e.target.value }))}
                className="w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-3 py-2 text-xs text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none"
              />
              <MediaPickerButton folder="products" onSelect={(url) => setSettings((p) => ({ ...p, craftBgImageMobile: url }))} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40" style={fontMichroma}>
              Badge Text
            </label>
            <input
              type="text"
              value={settings.craftBadgeText || ""}
              onChange={(e) => setSettings((p) => ({ ...p, craftBadgeText: e.target.value }))}
              placeholder="MADE IN ITALY"
              className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40" style={fontMichroma}>
              Badge Link
            </label>
            <input
              type="text"
              value={settings.craftBadgeLink || ""}
              onChange={(e) => setSettings((p) => ({ ...p, craftBadgeLink: e.target.value }))}
              placeholder="/made-in-italy"
              className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none font-mono"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40" style={fontMichroma}>
            "Casa Nobile" Label
          </label>
          <p className="text-[10px] text-[#8b8b8b]">Small label in the bottom corner of the section.</p>
          <input
            type="text"
            value={settings.craftCasaLabel || ""}
            onChange={(e) => setSettings((p) => ({ ...p, craftCasaLabel: e.target.value }))}
            placeholder="CASA NOBILE"
            className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="border border-[#007190]/25 bg-white px-5 py-2 text-[10px] tracking-[0.15em] uppercase text-[#007190]/70 hover:bg-[#007190] hover:text-white hover:border-[#007190] disabled:opacity-40 transition-all"
          style={fontMichroma}
        >
          {saving ? "Saving…" : "Save Craftsmanship"}
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// Legacy tab
// ============================================================================

interface LegacySettings {
  legacyLeftImage: string | null;
  legacyLeftLabel: string | null;
  legacySketchImage: string | null;
  legacyLogoImage: string | null;
  legacyTaglineImage: string | null;
  legacyRightImage: string | null;
  legacyRightLabel: string | null;
}

function ImageField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40" style={fontMichroma}>
        {label}
      </label>
      {value && <img src={value} alt="" className="h-16 w-full object-cover border border-[#1a1a1a]/10" />}
      <div className="flex gap-1">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-3 py-2 text-xs text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none"
        />
        <MediaPickerButton folder="products" onSelect={onChange} />
      </div>
    </div>
  );
}

function LegacyTab() {
  const [settings, setSettings] = useState<LegacySettings>({
    legacyLeftImage: "",
    legacyLeftLabel: "",
    legacySketchImage: "",
    legacyLogoImage: "",
    legacyTaglineImage: "",
    legacyRightImage: "",
    legacyRightLabel: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data?.data) {
          setSettings({
            legacyLeftImage: data.data.legacyLeftImage || "",
            legacyLeftLabel: data.data.legacyLeftLabel || "",
            legacySketchImage: data.data.legacySketchImage || "",
            legacyLogoImage: data.data.legacyLogoImage || "",
            legacyTaglineImage: data.data.legacyTaglineImage || "",
            legacyRightImage: data.data.legacyRightImage || "",
            legacyRightLabel: data.data.legacyRightLabel || "",
          });
        }
      })
      .catch((err) => setError(err.message || "Failed to load."))
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save.");
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((n) => (
          <div key={n} className="h-24 bg-white border border-[#1a1a1a]/8 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
      )}

      <div className="bg-white border border-[#1a1a1a]/8 p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-[#1a1a1a]/8 pb-3">
          <p className="text-[9px] tracking-[0.3em] uppercase text-[#1a1a1a]/35" style={fontMichroma}>
            Legacy (Triptych)
          </p>
          {saved && (
            <span className="flex items-center gap-1 text-[10px] text-green-600" style={fontMichroma}>
              <Check size={11} /> Saved
            </span>
          )}
        </div>
        <p className="text-[10px] text-[#8b8b8b] -mt-2">
          The three-panel section below Craftsmanship — a photo on each side of a center logo stack.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <ImageField
            label="Left Panel Photo"
            value={settings.legacyLeftImage || ""}
            onChange={(url) => setSettings((p) => ({ ...p, legacyLeftImage: url }))}
          />
          <div className="space-y-1.5">
            <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40" style={fontMichroma}>
              Left Panel Caption
            </label>
            <input
              type="text"
              value={settings.legacyLeftLabel || ""}
              onChange={(e) => setSettings((p) => ({ ...p, legacyLeftLabel: e.target.value }))}
              placeholder="TREVI FOUNTAIN"
              className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <ImageField
            label="Right Panel Photo"
            value={settings.legacyRightImage || ""}
            onChange={(url) => setSettings((p) => ({ ...p, legacyRightImage: url }))}
          />
          <div className="space-y-1.5">
            <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40" style={fontMichroma}>
              Right Panel Caption
            </label>
            <input
              type="text"
              value={settings.legacyRightLabel || ""}
              onChange={(e) => setSettings((p) => ({ ...p, legacyRightLabel: e.target.value }))}
              placeholder="PALAZZO DELLA CIVILTÀ ITALIANA"
              className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <ImageField
            label="Center Sketch"
            value={settings.legacySketchImage || ""}
            onChange={(url) => setSettings((p) => ({ ...p, legacySketchImage: url }))}
          />
          <ImageField
            label="Center Logo"
            value={settings.legacyLogoImage || ""}
            onChange={(url) => setSettings((p) => ({ ...p, legacyLogoImage: url }))}
          />
          <ImageField
            label="Center Tagline Graphic"
            value={settings.legacyTaglineImage || ""}
            onChange={(url) => setSettings((p) => ({ ...p, legacyTaglineImage: url }))}
          />
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="border border-[#007190]/25 bg-white px-5 py-2 text-[10px] tracking-[0.15em] uppercase text-[#007190]/70 hover:bg-[#007190] hover:text-white hover:border-[#007190] disabled:opacity-40 transition-all"
          style={fontMichroma}
        >
          {saving ? "Saving…" : "Save Legacy"}
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// Applications tab
// ============================================================================

interface AppTileData {
  id: string;
  name: string;
  image: string;
  productName: string;
  row: number;
  darkLabel: boolean;
}

function ApplicationsTab() {
  const [heading, setHeading] = useState("");
  const [tiles, setTiles] = useState<AppTileData[]>([]);
  const [productNames, setProductNames] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingHeading, setSavingHeading] = useState(false);
  const [savedHeading, setSavedHeading] = useState(false);
  const [savingTileId, setSavingTileId] = useState<string | null>(null);

  useEffect(() => {
    fetchAll();
  }, []);

  async function fetchAll() {
    try {
      setLoading(true);
      const [settingsRes, tilesRes, productsRes] = await Promise.all([
        fetch("/api/settings").then((r) => r.json()),
        fetch("/api/application-tiles").then((r) => r.json()),
        fetch("/api/products").then((r) => r.json()),
      ]);
      if (settingsRes?.data) setHeading(settingsRes.data.applicationsHeading || "");
      if (tilesRes?.data) setTiles(tilesRes.data);
      if (productsRes?.data) {
        setProductNames(productsRes.data.map((p: { name: string }) => p.name).sort());
      }
    } catch (err: any) {
      setError(err.message || "Failed to load.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveHeading() {
    setSavingHeading(true);
    setError(null);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationsHeading: heading }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save.");
      setSavedHeading(true);
      setTimeout(() => setSavedHeading(false), 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSavingHeading(false);
    }
  }

  async function updateTile(id: string, patch: Partial<AppTileData>) {
    setTiles((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
    setSavingTileId(id);
    try {
      const res = await fetch(`/api/application-tiles/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (!res.ok) throw new Error("Failed to save tile.");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSavingTileId(null);
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((n) => (
          <div key={n} className="h-24 bg-white border border-[#1a1a1a]/8 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
      )}

      {/* Heading */}
      <div className="bg-white border border-[#1a1a1a]/8 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#1a1a1a]/8 pb-3">
          <p className="text-[9px] tracking-[0.3em] uppercase text-[#1a1a1a]/35" style={fontMichroma}>
            Applications
          </p>
          {savedHeading && (
            <span className="flex items-center gap-1 text-[10px] text-green-600" style={fontMichroma}>
              <Check size={11} /> Saved
            </span>
          )}
        </div>
        <div className="space-y-1.5">
          <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40" style={fontMichroma}>
            Heading
          </label>
          <input
            type="text"
            value={heading}
            onChange={(e) => setHeading(e.target.value)}
            placeholder="APPLICATIONS"
            className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none"
          />
        </div>
        <button
          onClick={handleSaveHeading}
          disabled={savingHeading}
          className="border border-[#007190]/25 bg-white px-5 py-2 text-[10px] tracking-[0.15em] uppercase text-[#007190]/70 hover:bg-[#007190] hover:text-white hover:border-[#007190] disabled:opacity-40 transition-all"
          style={fontMichroma}
        >
          {savingHeading ? "Saving…" : "Save Heading"}
        </button>
      </div>

      {/* Tiles */}
      <div className="bg-white border border-[#1a1a1a]/8 p-6 space-y-4">
        <div>
          <p className="text-[9px] tracking-[0.3em] uppercase text-[#1a1a1a]/35 border-b border-[#1a1a1a]/8 pb-3 mb-1" style={fontMichroma}>
            The Six Tiles
          </p>
          <p className="text-[10px] text-[#8b8b8b] pt-2">
            Each tile's name, image, and target product can be changed — the grid stays fixed at two rows of three.
            Changes save automatically as you edit.
          </p>
        </div>

        <div className="space-y-3">
          {tiles.map((tile) => (
            <div key={tile.id} className="flex gap-3 items-center bg-[#f8f5f0] border border-[#1a1a1a]/10 p-3">
              <div className="w-16 h-16 flex-shrink-0 border border-[#1a1a1a]/10 bg-white overflow-hidden">
                {tile.image && <img src={tile.image} alt="" className="w-full h-full object-cover" />}
              </div>

              <div className="flex-1 grid grid-cols-1 sm:grid-cols-4 gap-2">
                <div>
                  <label className="block text-[8px] text-[#8b8b8b] uppercase">Label</label>
                  <input
                    type="text"
                    value={tile.name}
                    onChange={(e) => updateTile(tile.id, { name: e.target.value })}
                    className="w-full border border-[#1a1a1a]/10 bg-white px-2 py-1 text-xs outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[8px] text-[#8b8b8b] uppercase">Image</label>
                  <div className="flex gap-1">
                    <input
                      type="text"
                      value={tile.image}
                      onChange={(e) => updateTile(tile.id, { image: e.target.value })}
                      className="w-full border border-[#1a1a1a]/10 bg-white px-2 py-1 text-xs outline-none"
                    />
                    <MediaPickerButton folder="products" onSelect={(url) => updateTile(tile.id, { image: url })} />
                  </div>
                </div>
                <div>
                  <label className="block text-[8px] text-[#8b8b8b] uppercase">Opens Product</label>
                  <select
                    value={tile.productName}
                    onChange={(e) => updateTile(tile.id, { productName: e.target.value })}
                    className="w-full border border-[#1a1a1a]/10 bg-white px-2 py-1 text-xs outline-none"
                  >
                    {/* Keep the current value selectable even if it's since been renamed/removed */}
                    {!productNames.includes(tile.productName) && (
                      <option value={tile.productName}>{tile.productName}</option>
                    )}
                    {productNames.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-4">
                  <label className="block text-[8px] text-[#8b8b8b] uppercase">Label Color</label>
                  <div className="flex gap-1 w-32">
                    {([false, true] as const).map((dark) => (
                      <button
                        key={String(dark)}
                        type="button"
                        onClick={() => updateTile(tile.id, { darkLabel: dark })}
                        className={`flex-1 px-2 py-1 text-[10px] uppercase border transition-colors ${
                          tile.darkLabel === dark
                            ? "bg-[#1a1a1a] text-white border-[#1a1a1a]"
                            : "bg-white text-[#1a1a1a]/50 border-[#1a1a1a]/15"
                        }`}
                      >
                        {dark ? "Dark" : "White"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {savingTileId === tile.id && (
                <span className="text-[9px] text-[#8b8b8b] flex-shrink-0" style={fontMichroma}>Saving…</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Dimensions tab
// ============================================================================

interface DimensionsSettings {
  dimHeading: string | null;
  dimCol1Header: string | null;
  dimCol1Item1: string | null;
  dimCol1Item2: string | null;
  dimCol2Header: string | null;
  dimCol2Item1: string | null;
  dimCol2Item2: string | null;
  dimCol3Header: string | null;
  dimCol3Item1: string | null;
  dimCol3Item2: string | null;
  dimImage: string | null;
  dimBtnText: string | null;
  dimBtnLink: string | null;
}

function DimensionsTab() {
  const [settings, setSettings] = useState<DimensionsSettings>({
    dimHeading: "",
    dimCol1Header: "",
    dimCol1Item1: "",
    dimCol1Item2: "",
    dimCol2Header: "",
    dimCol2Item1: "",
    dimCol2Item2: "",
    dimCol3Header: "",
    dimCol3Item1: "",
    dimCol3Item2: "",
    dimImage: "",
    dimBtnText: "",
    dimBtnLink: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data?.data) {
          setSettings({
            dimHeading: data.data.dimHeading || "",
            dimCol1Header: data.data.dimCol1Header || "",
            dimCol1Item1: data.data.dimCol1Item1 || "",
            dimCol1Item2: data.data.dimCol1Item2 || "",
            dimCol2Header: data.data.dimCol2Header || "",
            dimCol2Item1: data.data.dimCol2Item1 || "",
            dimCol2Item2: data.data.dimCol2Item2 || "",
            dimCol3Header: data.data.dimCol3Header || "",
            dimCol3Item1: data.data.dimCol3Item1 || "",
            dimCol3Item2: data.data.dimCol3Item2 || "",
            dimImage: data.data.dimImage || "",
            dimBtnText: data.data.dimBtnText || "",
            dimBtnLink: data.data.dimBtnLink || "",
          });
        }
      })
      .catch((err) => setError(err.message || "Failed to load."))
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save.");
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((n) => (
          <div key={n} className="h-24 bg-white border border-[#1a1a1a]/8 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
      )}

      <div className="bg-white border border-[#1a1a1a]/8 p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-[#1a1a1a]/8 pb-3">
          <p className="text-[9px] tracking-[0.3em] uppercase text-[#1a1a1a]/35" style={fontMichroma}>
            Dimensions
          </p>
          {saved && (
            <span className="flex items-center gap-1 text-[10px] text-green-600" style={fontMichroma}>
              <Check size={11} /> Saved
            </span>
          )}
        </div>
        <p className="text-[10px] text-[#8b8b8b] -mt-2">
          The "Format &amp; Dimensions" spec grid — a fixed 3-column layout (Thickness / Dimensions / Format), each with two lines, plus a feature image and button.
        </p>

        <div className="space-y-1.5">
          <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40" style={fontMichroma}>
            Heading
          </label>
          <input
            type="text"
            value={settings.dimHeading || ""}
            onChange={(e) => setSettings((p) => ({ ...p, dimHeading: e.target.value }))}
            placeholder="FORMAT & DIMENSIONS"
            className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="space-y-1.5">
            <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40" style={fontMichroma}>
              Column 1 Header
            </label>
            <input
              type="text"
              value={settings.dimCol1Header || ""}
              onChange={(e) => setSettings((p) => ({ ...p, dimCol1Header: e.target.value }))}
              placeholder="THICKNESS"
              className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none"
            />
            <input
              type="text"
              value={settings.dimCol1Item1 || ""}
              onChange={(e) => setSettings((p) => ({ ...p, dimCol1Item1: e.target.value }))}
              placeholder="6.5 MM"
              className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none"
            />
            <input
              type="text"
              value={settings.dimCol1Item2 || ""}
              onChange={(e) => setSettings((p) => ({ ...p, dimCol1Item2: e.target.value }))}
              placeholder="12 MM"
              className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40" style={fontMichroma}>
              Column 2 Header
            </label>
            <input
              type="text"
              value={settings.dimCol2Header || ""}
              onChange={(e) => setSettings((p) => ({ ...p, dimCol2Header: e.target.value }))}
              placeholder="DIMENSIONS"
              className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none"
            />
            <input
              type="text"
              value={settings.dimCol2Item1 || ""}
              onChange={(e) => setSettings((p) => ({ ...p, dimCol2Item1: e.target.value }))}
              placeholder="1600 X 3200 MM"
              className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none"
            />
            <input
              type="text"
              value={settings.dimCol2Item2 || ""}
              onChange={(e) => setSettings((p) => ({ ...p, dimCol2Item2: e.target.value }))}
              placeholder="1620 X 3240 MM"
              className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40" style={fontMichroma}>
              Column 3 Header
            </label>
            <input
              type="text"
              value={settings.dimCol3Header || ""}
              onChange={(e) => setSettings((p) => ({ ...p, dimCol3Header: e.target.value }))}
              placeholder="FORMAT"
              className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none"
            />
            <input
              type="text"
              value={settings.dimCol3Item1 || ""}
              onChange={(e) => setSettings((p) => ({ ...p, dimCol3Item1: e.target.value }))}
              placeholder="RECTIFIED"
              className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none"
            />
            <input
              type="text"
              value={settings.dimCol3Item2 || ""}
              onChange={(e) => setSettings((p) => ({ ...p, dimCol3Item2: e.target.value }))}
              placeholder="GROSS"
              className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <ImageField
            label="Feature Image"
            value={settings.dimImage || ""}
            onChange={(url) => setSettings((p) => ({ ...p, dimImage: url }))}
          />
          <div className="space-y-5">
            <div className="space-y-1.5">
              <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40" style={fontMichroma}>
                Button Text
              </label>
              <input
                type="text"
                value={settings.dimBtnText || ""}
                onChange={(e) => setSettings((p) => ({ ...p, dimBtnText: e.target.value }))}
                placeholder="TECHNICAL DATA"
                className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40" style={fontMichroma}>
                Button Link
              </label>
              <input
                type="text"
                value={settings.dimBtnLink || ""}
                onChange={(e) => setSettings((p) => ({ ...p, dimBtnLink: e.target.value }))}
                placeholder="/technical-data"
                className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none font-mono"
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="border border-[#007190]/25 bg-white px-5 py-2 text-[10px] tracking-[0.15em] uppercase text-[#007190]/70 hover:bg-[#007190] hover:text-white hover:border-[#007190] disabled:opacity-40 transition-all"
          style={fontMichroma}
        >
          {saving ? "Saving…" : "Save Dimensions"}
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// Finishes tab
// ============================================================================

interface FinishesSettings {
  finishesHeading: string | null;
  finish1Name: string | null;
  finish1Image: string | null;
  finish1Desc: string | null;
  finish2Name: string | null;
  finish2Image: string | null;
  finish2Desc: string | null;
  finish3Name: string | null;
  finish3Image: string | null;
  finish3Desc: string | null;
  finish4Name: string | null;
  finish4Image: string | null;
  finish4Desc: string | null;
  finish5Name: string | null;
  finish5Image: string | null;
  finish5Desc: string | null;
}

const FINISH_ROW_KEYS = [1, 2, 3, 4, 5] as const;

function FinishesTab() {
  const [settings, setSettings] = useState<FinishesSettings>({
    finishesHeading: "",
    finish1Name: "",
    finish1Image: "",
    finish1Desc: "",
    finish2Name: "",
    finish2Image: "",
    finish2Desc: "",
    finish3Name: "",
    finish3Image: "",
    finish3Desc: "",
    finish4Name: "",
    finish4Image: "",
    finish4Desc: "",
    finish5Name: "",
    finish5Image: "",
    finish5Desc: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data?.data) {
          setSettings({
            finishesHeading: data.data.finishesHeading || "",
            finish1Name: data.data.finish1Name || "",
            finish1Image: data.data.finish1Image || "",
            finish1Desc: data.data.finish1Desc || "",
            finish2Name: data.data.finish2Name || "",
            finish2Image: data.data.finish2Image || "",
            finish2Desc: data.data.finish2Desc || "",
            finish3Name: data.data.finish3Name || "",
            finish3Image: data.data.finish3Image || "",
            finish3Desc: data.data.finish3Desc || "",
            finish4Name: data.data.finish4Name || "",
            finish4Image: data.data.finish4Image || "",
            finish4Desc: data.data.finish4Desc || "",
            finish5Name: data.data.finish5Name || "",
            finish5Image: data.data.finish5Image || "",
            finish5Desc: data.data.finish5Desc || "",
          });
        }
      })
      .catch((err) => setError(err.message || "Failed to load."))
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save.");
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((n) => (
          <div key={n} className="h-24 bg-white border border-[#1a1a1a]/8 animate-pulse" />
        ))}
      </div>
    );
  }

  const rowDefaults: Record<(typeof FINISH_ROW_KEYS)[number], { name: string; desc: string }> = {
    1: { name: "POLISHED", desc: "A glossy, reflective finish that brings out the full richness of the design for a luxurious look." },
    2: { name: "MATTE", desc: "A non-reflective and refined finish, with added slip resistance." },
    3: { name: "HONED", desc: "A smooth, satin-like finish that balances subtle sheen with modern elegance." },
    4: { name: "STRUCTURED MATTE", desc: "Leather-inspired texture with subtle richness and enhanced grip." },
    5: { name: "3D / 5D MATTE", desc: "A multi-dimensional finish that brings depth, texture, and realism to stone surfaces." },
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
      )}

      <div className="bg-white border border-[#1a1a1a]/8 p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-[#1a1a1a]/8 pb-3">
          <p className="text-[9px] tracking-[0.3em] uppercase text-[#1a1a1a]/35" style={fontMichroma}>
            Finishes
          </p>
          {saved && (
            <span className="flex items-center gap-1 text-[10px] text-green-600" style={fontMichroma}>
              <Check size={11} /> Saved
            </span>
          )}
        </div>
        <p className="text-[10px] text-[#8b8b8b] -mt-2">
          The five-tile finishes accordion. Fixed order and click-to-filter behavior — only each tile's name, image, and description are editable.
        </p>

        <div className="space-y-1.5">
          <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40" style={fontMichroma}>
            Heading
          </label>
          <input
            type="text"
            value={settings.finishesHeading || ""}
            onChange={(e) => setSettings((p) => ({ ...p, finishesHeading: e.target.value }))}
            placeholder="FINISHES"
            className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none"
          />
        </div>

        {FINISH_ROW_KEYS.map((n) => {
          const nameKey = `finish${n}Name` as keyof FinishesSettings;
          const imageKey = `finish${n}Image` as keyof FinishesSettings;
          const descKey = `finish${n}Desc` as keyof FinishesSettings;
          return (
            <div key={n} className="border-t border-[#1a1a1a]/8 pt-5 space-y-4">
              <p className="text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/30" style={fontMichroma}>
                Tile {n}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40" style={fontMichroma}>
                    Name
                  </label>
                  <input
                    type="text"
                    value={settings[nameKey] || ""}
                    onChange={(e) => setSettings((p) => ({ ...p, [nameKey]: e.target.value }))}
                    placeholder={rowDefaults[n].name}
                    className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none"
                  />
                </div>
                <ImageField
                  label="Image"
                  value={settings[imageKey] || ""}
                  onChange={(url) => setSettings((p) => ({ ...p, [imageKey]: url }))}
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40" style={fontMichroma}>
                  Description
                </label>
                <textarea
                  value={settings[descKey] || ""}
                  onChange={(e) => setSettings((p) => ({ ...p, [descKey]: e.target.value }))}
                  placeholder={rowDefaults[n].desc}
                  rows={2}
                  className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none resize-none"
                />
              </div>
            </div>
          );
        })}

        <button
          onClick={handleSave}
          disabled={saving}
          className="border border-[#007190]/25 bg-white px-5 py-2 text-[10px] tracking-[0.15em] uppercase text-[#007190]/70 hover:bg-[#007190] hover:text-white hover:border-[#007190] disabled:opacity-40 transition-all"
          style={fontMichroma}
        >
          {saving ? "Saving…" : "Save Finishes"}
        </button>
      </div>
    </div>
  );
}
