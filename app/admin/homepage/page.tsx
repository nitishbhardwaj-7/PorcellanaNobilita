"use client";

import React, { useState, useEffect } from "react";
import { Plus, X, GripVertical, Check } from "lucide-react";
import { MediaPickerButton } from "../_components/MediaPicker";
import { StyleRow } from "../_components/StyleControls";
import { HEADING_SIZE_OPTIONS, PARAGRAPH_SIZE_OPTIONS } from "@/lib/textStyle";

const fontMichroma = { fontFamily: "var(--font-michroma), sans-serif" };
const fontIvymode = { fontFamily: "var(--font-ivymode), serif" };

const TABS = ["hero", "brand-intro", "craftsmanship", "legacy", "applications", "dimensions", "finishes", "technical-data", "locations", "privacy-policy", "sitemap"] as const;
type Tab = (typeof TABS)[number];
const TAB_LABELS: Record<Tab, string> = {
  hero: "Explore The Collection",
  "brand-intro": "Brand Intro",
  craftsmanship: "Craftsmanship",
  legacy: "Legacy",
  applications: "Applications",
  dimensions: "Dimensions",
  finishes: "Finishes",
  "technical-data": "Slideshow",
  locations: "Locations",
  "privacy-policy": "Privacy Policy",
  sitemap: "Sitemap",
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
      <div className="flex flex-wrap gap-1">
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
      {activeTab === "technical-data" && <TechnicalDataTab />}
      {activeTab === "locations" && <LocationsTab />}
      {activeTab === "privacy-policy" && <PrivacyPolicyTab />}
      {activeTab === "sitemap" && <SitemapTab />}
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
  heroTitleColor: string | null;
  heroTitleFont: string | null;
  heroTitleSize: string | null;
  heroSubtitle: string | null;
  heroSubtitleColor: string | null;
  heroSubtitleFont: string | null;
  heroSubtitleSize: string | null;
  heroButtonText: string | null;
  heroButtonLink: string | null;
}

function HeroTab() {
  const [settings, setSettings] = useState<HeroSettings>({
    heroTitle: "",
    heroTitleColor: "default",
    heroTitleFont: "default",
    heroTitleSize: "default",
    heroSubtitle: "",
    heroSubtitleColor: "default",
    heroSubtitleFont: "default",
    heroSubtitleSize: "default",
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
          heroTitleColor: settingsRes.data.heroTitleColor || "default",
          heroTitleFont: settingsRes.data.heroTitleFont || "default",
          heroTitleSize: settingsRes.data.heroTitleSize || "default",
          heroSubtitle: settingsRes.data.heroSubtitle || "",
          heroSubtitleColor: settingsRes.data.heroSubtitleColor || "default",
          heroSubtitleFont: settingsRes.data.heroSubtitleFont || "default",
          heroSubtitleSize: settingsRes.data.heroSubtitleSize || "default",
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
          <StyleRow
            color={settings.heroTitleColor || "default"}
            onColorChange={(v) => setSettings((p) => ({ ...p, heroTitleColor: v }))}
            font={settings.heroTitleFont || "default"}
            onFontChange={(v) => setSettings((p) => ({ ...p, heroTitleFont: v }))}
            size={settings.heroTitleSize || "default"}
            onSizeChange={(v) => setSettings((p) => ({ ...p, heroTitleSize: v }))}
            sizeOptions={HEADING_SIZE_OPTIONS}
            colorDefaultLabel="White"
            fontDefaultLabel="Ivymode"
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
            placeholder="At NOBILITA, we believe that true luxury is not about trends, it is timeless design, enduring quality, and a deep respect for architectural legacy. Our porcelain tiles are not just surfaces, they are foundations for homes, businesses, and landmarks that will stand for generations."
            className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none resize-none"
          />
          <StyleRow
            color={settings.heroSubtitleColor || "default"}
            onColorChange={(v) => setSettings((p) => ({ ...p, heroSubtitleColor: v }))}
            font={settings.heroSubtitleFont || "default"}
            onFontChange={(v) => setSettings((p) => ({ ...p, heroSubtitleFont: v }))}
            size={settings.heroSubtitleSize || "default"}
            onSizeChange={(v) => setSettings((p) => ({ ...p, heroSubtitleSize: v }))}
            sizeOptions={PARAGRAPH_SIZE_OPTIONS}
            colorDefaultLabel="White"
            fontDefaultLabel="Ivymode"
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
  brandSubtitleColor: string | null;
  brandSubtitleFont: string | null;
  brandSubtitleSize: string | null;
  brandBtn: string | null;
  brandBtnLink: string | null;
  socialWhatsapp: string | null;
  socialInstagram: string | null;
  socialFacebook: string | null;
  socialLinkedin: string | null;
}

function BrandIntroTab() {
  const [settings, setSettings] = useState<BrandSettings>({
    brandTagImage: "",
    brandTagSubtext: "",
    brandImg: "",
    brandSubtitle: "",
    brandSubtitleColor: "default",
    brandSubtitleFont: "default",
    brandSubtitleSize: "default",
    brandBtn: "",
    brandBtnLink: "",
    socialWhatsapp: "",
    socialInstagram: "",
    socialFacebook: "",
    socialLinkedin: "",
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
            brandSubtitleColor: data.data.brandSubtitleColor || "default",
            brandSubtitleFont: data.data.brandSubtitleFont || "default",
            brandSubtitleSize: data.data.brandSubtitleSize || "default",
            brandBtn: data.data.brandBtn || "",
            brandBtnLink: data.data.brandBtnLink || "",
            socialWhatsapp: data.data.socialWhatsapp || "",
            socialInstagram: data.data.socialInstagram || "",
            socialFacebook: data.data.socialFacebook || "",
            socialLinkedin: data.data.socialLinkedin || "",
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
            {settings.brandTagImage ? (
              <img src={settings.brandTagImage} alt="" className="w-full max-h-56 object-contain bg-[#007190] p-3" />
            ) : (
              <div className="relative">
                <img src="/images/Links/tag.png" alt="" className="w-full max-h-56 object-contain bg-[#007190] p-3" />
                <span className="absolute top-1.5 left-1.5 bg-[#1a1a1a]/70 text-white text-[8px] tracking-[0.15em] uppercase px-1.5 py-0.5">Currently Live (Default)</span>
              </div>
            )}
            <div className="flex gap-1">
              <input
                type="text"
                value={settings.brandTagImage || ""}
                onChange={(e) => setSettings((p) => ({ ...p, brandTagImage: e.target.value }))}
                placeholder="/images/Links/tag.png"
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
            {settings.brandImg ? (
              <img src={settings.brandImg} alt="" className="w-full max-h-56 object-contain bg-[#007190] p-3" />
            ) : (
              <div className="relative">
                <img src="/images/NOBILITA_white.png" alt="" className="w-full max-h-56 object-contain bg-[#007190] p-3" />
                <span className="absolute top-1.5 left-1.5 bg-[#1a1a1a]/70 text-white text-[8px] tracking-[0.15em] uppercase px-1.5 py-0.5">Currently Live (Default)</span>
              </div>
            )}
            <div className="flex gap-1">
              <input
                type="text"
                value={settings.brandImg || ""}
                onChange={(e) => setSettings((p) => ({ ...p, brandImg: e.target.value }))}
                placeholder="/images/NOBILITA_white.png"
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
            placeholder="Inspired by Italy's noble heritage and Baroque architecture, NOBILITA porcelain is crafted in Modena, Italy, home to Ferrari, Acetaia Giusti, and Brioni. A collection where timeless Italian elegance meets advanced porcelain technology."
            className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none resize-none"
          />
          <StyleRow
            color={settings.brandSubtitleColor || "default"}
            onColorChange={(v) => setSettings((p) => ({ ...p, brandSubtitleColor: v }))}
            font={settings.brandSubtitleFont || "default"}
            onFontChange={(v) => setSettings((p) => ({ ...p, brandSubtitleFont: v }))}
            size={settings.brandSubtitleSize || "default"}
            onSizeChange={(v) => setSettings((p) => ({ ...p, brandSubtitleSize: v }))}
            sizeOptions={PARAGRAPH_SIZE_OPTIONS}
            colorDefaultLabel="White"
            fontDefaultLabel="Ivymode"
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

        <div className="space-y-1.5 pt-2 border-t border-[#1a1a1a]/8">
          <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40" style={fontMichroma}>
            Social Links
          </label>
          <p className="text-[10px] text-[#8b8b8b]">
            The WhatsApp / Instagram / Facebook / LinkedIn icons in the vertical sidebar. Leave blank to keep the placeholder links.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="space-y-1">
              <label className="block text-[8px] text-[#8b8b8b] uppercase">WhatsApp</label>
              <input
                type="text"
                value={settings.socialWhatsapp || ""}
                onChange={(e) => setSettings((p) => ({ ...p, socialWhatsapp: e.target.value }))}
                placeholder="https://wa.me/971500000000"
                className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-[8px] text-[#8b8b8b] uppercase">Instagram</label>
              <input
                type="text"
                value={settings.socialInstagram || ""}
                onChange={(e) => setSettings((p) => ({ ...p, socialInstagram: e.target.value }))}
                placeholder="https://instagram.com/nobilita"
                className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-[8px] text-[#8b8b8b] uppercase">Facebook</label>
              <input
                type="text"
                value={settings.socialFacebook || ""}
                onChange={(e) => setSettings((p) => ({ ...p, socialFacebook: e.target.value }))}
                placeholder="https://facebook.com/nobilita"
                className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-[8px] text-[#8b8b8b] uppercase">LinkedIn</label>
              <input
                type="text"
                value={settings.socialLinkedin || ""}
                onChange={(e) => setSettings((p) => ({ ...p, socialLinkedin: e.target.value }))}
                placeholder="https://linkedin.com/company/nobilita"
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
  craftHeadingColor: string | null;
  craftHeadingFont: string | null;
  craftHeadingSize: string | null;
  craftParagraph: string | null;
  craftParagraphColor: string | null;
  craftParagraphFont: string | null;
  craftParagraphSize: string | null;
  craftBgImage: string | null;
  craftBgImageMobile: string | null;
  craftBadgeText: string | null;
  craftBadgeLink: string | null;
  craftCasaLabel: string | null;
}

function CraftsmanshipTab() {
  const [settings, setSettings] = useState<CraftSettings>({
    craftHeading: "",
    craftHeadingColor: "default",
    craftHeadingFont: "default",
    craftHeadingSize: "default",
    craftParagraph: "",
    craftParagraphColor: "default",
    craftParagraphFont: "default",
    craftParagraphSize: "default",
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
            craftHeadingColor: data.data.craftHeadingColor || "default",
            craftHeadingFont: data.data.craftHeadingFont || "default",
            craftHeadingSize: data.data.craftHeadingSize || "default",
            craftParagraph: data.data.craftParagraph || "",
            craftParagraphColor: data.data.craftParagraphColor || "default",
            craftParagraphFont: data.data.craftParagraphFont || "default",
            craftParagraphSize: data.data.craftParagraphSize || "default",
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
          <StyleRow
            color={settings.craftHeadingColor || "default"}
            onColorChange={(v) => setSettings((p) => ({ ...p, craftHeadingColor: v }))}
            font={settings.craftHeadingFont || "default"}
            onFontChange={(v) => setSettings((p) => ({ ...p, craftHeadingFont: v }))}
            size={settings.craftHeadingSize || "default"}
            onSizeChange={(v) => setSettings((p) => ({ ...p, craftHeadingSize: v }))}
            sizeOptions={HEADING_SIZE_OPTIONS}
            colorDefaultLabel="White"
            fontDefaultLabel="Ivymode"
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
            placeholder="In the heart of Modena, where centuries of Italian expertise meet innovation, NOBILITA creates porcelain surfaces that embody the art of timeless craftsmanship."
            className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none resize-none"
          />
          <StyleRow
            color={settings.craftParagraphColor || "default"}
            onColorChange={(v) => setSettings((p) => ({ ...p, craftParagraphColor: v }))}
            font={settings.craftParagraphFont || "default"}
            onFontChange={(v) => setSettings((p) => ({ ...p, craftParagraphFont: v }))}
            size={settings.craftParagraphSize || "default"}
            onSizeChange={(v) => setSettings((p) => ({ ...p, craftParagraphSize: v }))}
            sizeOptions={PARAGRAPH_SIZE_OPTIONS}
            colorDefaultLabel="White"
            fontDefaultLabel="Ivymode"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40" style={fontMichroma}>
              Background Image (Desktop)
            </label>
            {settings.craftBgImage ? (
              <img src={settings.craftBgImage} alt="" className="w-full max-h-72 object-contain border border-[#1a1a1a]/10 bg-[#f0ede6]" />
            ) : (
              <div className="relative">
                <img src="/images/Links/MEDICI VILLA copy (7).png" alt="" className="w-full max-h-72 object-contain border border-[#1a1a1a]/10 bg-[#f0ede6]" />
                <span className="absolute top-1.5 left-1.5 bg-[#1a1a1a]/70 text-white text-[8px] tracking-[0.15em] uppercase px-1.5 py-0.5">Currently Live (Default)</span>
              </div>
            )}
            <div className="flex gap-1">
              <input
                type="text"
                value={settings.craftBgImage || ""}
                onChange={(e) => setSettings((p) => ({ ...p, craftBgImage: e.target.value }))}
                placeholder="/images/Links/MEDICI VILLA copy (7).png"
                className="w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-3 py-2 text-xs text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none"
              />
              <MediaPickerButton folder="products" onSelect={(url) => setSettings((p) => ({ ...p, craftBgImage: url }))} />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40" style={fontMichroma}>
              Background Image (Mobile)
            </label>
            {settings.craftBgImageMobile ? (
              <img src={settings.craftBgImageMobile} alt="" className="w-full max-h-72 object-contain border border-[#1a1a1a]/10 bg-[#f0ede6]" />
            ) : (
              <div className="relative">
                <img src="/images/Links/medici-villa-mobile.png" alt="" className="w-full max-h-72 object-contain border border-[#1a1a1a]/10 bg-[#f0ede6]" />
                <span className="absolute top-1.5 left-1.5 bg-[#1a1a1a]/70 text-white text-[8px] tracking-[0.15em] uppercase px-1.5 py-0.5">Currently Live (Default)</span>
              </div>
            )}
            <div className="flex gap-1">
              <input
                type="text"
                value={settings.craftBgImageMobile || ""}
                onChange={(e) => setSettings((p) => ({ ...p, craftBgImageMobile: e.target.value }))}
                placeholder="/images/Links/medici-villa-mobile.png"
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

// `defaultSrc` is the hardcoded fallback the public page actually renders
// when this field is empty — shown as a dimmed "(Default)" preview so an
// admin can see what's currently live, not just an empty box.
function ImageField({
  label,
  value,
  onChange,
  defaultSrc,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  defaultSrc?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40" style={fontMichroma}>
        {label}
      </label>
      {value ? (
        <img src={value} alt="" className="w-full max-h-72 object-contain border border-[#1a1a1a]/10 bg-[#f0ede6]" />
      ) : defaultSrc ? (
        <div className="relative">
          <img src={defaultSrc} alt="" className="w-full max-h-72 object-contain border border-[#1a1a1a]/10 bg-[#f0ede6]" />
          <span className="absolute top-1.5 left-1.5 bg-[#1a1a1a]/70 text-white text-[8px] tracking-[0.15em] uppercase px-1.5 py-0.5">Currently Live (Default)</span>
        </div>
      ) : null}
      <div className="flex gap-1">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={defaultSrc}
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
            defaultSrc="/images/Links/Trevi-Fountain-Large.jpeg"
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
            defaultSrc="/images/rightlegacy.jpg"
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
            defaultSrc="/images/Links/DP8017299.png"
          />
          <ImageField
            label="Center Logo"
            value={settings.legacyLogoImage || ""}
            onChange={(url) => setSettings((p) => ({ ...p, legacyLogoImage: url }))}
            defaultSrc="/images/Links/NOBILITA Logo BLACK.png"
          />
          <ImageField
            label="Center Tagline Graphic"
            value={settings.legacyTaglineImage || ""}
            onChange={(url) => setSettings((p) => ({ ...p, legacyTaglineImage: url }))}
            defaultSrc="/images/Links/tag grey.png"
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
  const [headingColor, setHeadingColor] = useState("default");
  const [headingFont, setHeadingFont] = useState("default");
  const [headingSize, setHeadingSize] = useState("default");
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
      if (settingsRes?.data) {
        setHeading(settingsRes.data.applicationsHeading || "");
        setHeadingColor(settingsRes.data.applicationsHeadingColor || "default");
        setHeadingFont(settingsRes.data.applicationsHeadingFont || "default");
        setHeadingSize(settingsRes.data.applicationsHeadingSize || "default");
      }
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
        body: JSON.stringify({
          applicationsHeading: heading,
          applicationsHeadingColor: headingColor,
          applicationsHeadingFont: headingFont,
          applicationsHeadingSize: headingSize,
        }),
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
          <StyleRow
            color={headingColor}
            onColorChange={setHeadingColor}
            font={headingFont}
            onFontChange={setHeadingFont}
            size={headingSize}
            onSizeChange={setHeadingSize}
            sizeOptions={HEADING_SIZE_OPTIONS}
            colorDefaultLabel="Grey"
            fontDefaultLabel="Ivymode"
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
  dimHeadingColor: string | null;
  dimHeadingFont: string | null;
  dimHeadingSize: string | null;
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
    dimHeadingColor: "default",
    dimHeadingFont: "default",
    dimHeadingSize: "default",
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
            dimHeadingColor: data.data.dimHeadingColor || "default",
            dimHeadingFont: data.data.dimHeadingFont || "default",
            dimHeadingSize: data.data.dimHeadingSize || "default",
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
          <StyleRow
            color={settings.dimHeadingColor || "default"}
            onColorChange={(v) => setSettings((p) => ({ ...p, dimHeadingColor: v }))}
            font={settings.dimHeadingFont || "default"}
            onFontChange={(v) => setSettings((p) => ({ ...p, dimHeadingFont: v }))}
            size={settings.dimHeadingSize || "default"}
            onSizeChange={(v) => setSettings((p) => ({ ...p, dimHeadingSize: v }))}
            sizeOptions={HEADING_SIZE_OPTIONS}
            colorDefaultLabel="Grey"
            fontDefaultLabel="Ivymode"
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
            defaultSrc="/images/format & dimensions application copy new.jpg"
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

interface FinishesHeadingSettings {
  finishesHeading: string | null;
  finishesHeadingColor: string | null;
  finishesHeadingFont: string | null;
  finishesHeadingSize: string | null;
}

interface FinishTile {
  id: string;
  order: number;
  name: string;
  filterName: string;
  image: string;
  desc: string;
  descColor: string | null;
  descFont: string | null;
  descSize: string | null;
  textStyle: string; // "dark" | "light"
  lightWash: boolean;
}

function FinishesTab() {
  const [settings, setSettings] = useState<FinishesHeadingSettings>({
    finishesHeading: "",
    finishesHeadingColor: "default",
    finishesHeadingFont: "default",
    finishesHeadingSize: "default",
  });
  const [tiles, setTiles] = useState<FinishTile[]>([]);
  const [finishOptions, setFinishOptions] = useState<string[]>([]);
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
      const [settingsRes, tilesRes, finishesRes] = await Promise.all([
        fetch("/api/settings").then((r) => r.json()),
        fetch("/api/home-finishes").then((r) => r.json()),
        fetch("/api/finishes").then((r) => r.json()).catch(() => null),
      ]);
      if (settingsRes?.data) {
        setSettings({
          finishesHeading: settingsRes.data.finishesHeading || "",
          finishesHeadingColor: settingsRes.data.finishesHeadingColor || "default",
          finishesHeadingFont: settingsRes.data.finishesHeadingFont || "default",
          finishesHeadingSize: settingsRes.data.finishesHeadingSize || "default",
        });
      }
      if (tilesRes?.data) setTiles(tilesRes.data);
      if (finishesRes?.data) setFinishOptions(finishesRes.data.map((f: { name: string }) => f.name));
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

  async function handleAddTile() {
    setError(null);
    try {
      const res = await fetch("/api/home-finishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "NEW FINISH", filterName: "New Finish", image: "", desc: "", textStyle: "dark", lightWash: false }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add tile.");
      setTiles((prev) => [...prev, data.data]);
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function updateTile(id: string, patch: Partial<FinishTile>) {
    setTiles((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
    try {
      await fetch(`/api/home-finishes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
    } catch {
      setError("Failed to save tile changes.");
    }
  }

  async function handleDeleteTile(id: string) {
    if (!confirm("Delete this finish tile? This cannot be undone.")) return;
    setError(null);
    try {
      const res = await fetch(`/api/home-finishes/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete.");
      setTiles((prev) => prev.filter((t) => t.id !== id));
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function moveTile(from: number, to: number) {
    if (from === to) return;
    const reordered = [...tiles];
    const [moved] = reordered.splice(from, 1);
    reordered.splice(to, 0, moved);
    setTiles(reordered);

    setError(null);
    try {
      await Promise.all(
        reordered.map((tile, i) =>
          tile.order === i
            ? Promise.resolve()
            : fetch(`/api/home-finishes/${tile.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ order: i }),
              })
        )
      );
      setTiles((prev) => prev.map((t, i) => ({ ...t, order: i })));
    } catch {
      setError("Failed to save the new tile order.");
      fetchAll();
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

      {/* Heading */}
      <div className="bg-white border border-[#1a1a1a]/8 p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-[#1a1a1a]/8 pb-3">
          <p className="text-[9px] tracking-[0.3em] uppercase text-[#1a1a1a]/35" style={fontMichroma}>
            Finishes
          </p>
          {savedSettings && (
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
            value={settings.finishesHeading || ""}
            onChange={(e) => setSettings((p) => ({ ...p, finishesHeading: e.target.value }))}
            placeholder="FINISHES"
            className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none"
          />
          <StyleRow
            color={settings.finishesHeadingColor || "default"}
            onColorChange={(v) => setSettings((p) => ({ ...p, finishesHeadingColor: v }))}
            font={settings.finishesHeadingFont || "default"}
            onFontChange={(v) => setSettings((p) => ({ ...p, finishesHeadingFont: v }))}
            size={settings.finishesHeadingSize || "default"}
            onSizeChange={(v) => setSettings((p) => ({ ...p, finishesHeadingSize: v }))}
            sizeOptions={HEADING_SIZE_OPTIONS}
            colorDefaultLabel="Grey"
            fontDefaultLabel="Ivymode"
          />
        </div>

        <button
          onClick={handleSaveSettings}
          disabled={savingSettings}
          className="border border-[#007190]/25 bg-white px-5 py-2 text-[10px] tracking-[0.15em] uppercase text-[#007190]/70 hover:bg-[#007190] hover:text-white hover:border-[#007190] disabled:opacity-40 transition-all"
          style={fontMichroma}
        >
          {savingSettings ? "Saving…" : "Save Heading"}
        </button>
      </div>

      {/* Tiles */}
      <div className="bg-white border border-[#1a1a1a]/8 p-6 space-y-4">
        <div>
          <p className="text-[9px] tracking-[0.3em] uppercase text-[#1a1a1a]/35 border-b border-[#1a1a1a]/8 pb-3 mb-1" style={fontMichroma}>
            Tiles
          </p>
          <p className="text-[10px] text-[#8b8b8b] pt-2">
            Drag the grip handle to reorder. Each field saves automatically as you edit it.
            "Filter Value" is the Finish that a click on this tile filters Explore Collection to —
            match it to a name in Admin &gt; Explore The Collection &gt; Finishes so the click actually finds products.
          </p>
        </div>

        <div className="space-y-3">
          {tiles.map((tile, idx) => (
            <div
              key={tile.id}
              onDragOver={(e) => {
                e.preventDefault();
                if (draggedIdx !== null) setDragOverIdx(idx);
              }}
              onDragLeave={() => setDragOverIdx((cur) => (cur === idx ? null : cur))}
              onDrop={(e) => {
                e.preventDefault();
                if (draggedIdx !== null) moveTile(draggedIdx, idx);
                setDraggedIdx(null);
                setDragOverIdx(null);
              }}
              className={`flex gap-3 items-start bg-[#f8f5f0] border p-3 transition-colors ${
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
                {tile.image ? (
                  <img src={tile.image} alt="" className="w-full h-full object-cover" />
                ) : null}
              </div>

              <div className="flex-1 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[8px] text-[#8b8b8b] uppercase">Name</label>
                    <input
                      type="text"
                      value={tile.name}
                      onChange={(e) => updateTile(tile.id, { name: e.target.value })}
                      className="w-full border border-[#1a1a1a]/10 bg-white px-2 py-1 text-xs outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[8px] text-[#8b8b8b] uppercase">Filter Value</label>
                    <input
                      type="text"
                      list={`finish-options-${tile.id}`}
                      value={tile.filterName}
                      onChange={(e) => updateTile(tile.id, { filterName: e.target.value })}
                      className="w-full border border-[#1a1a1a]/10 bg-white px-2 py-1 text-xs outline-none"
                    />
                    <datalist id={`finish-options-${tile.id}`}>
                      {finishOptions.map((f) => (
                        <option key={f} value={f} />
                      ))}
                    </datalist>
                  </div>
                </div>

                <div>
                  <label className="block text-[8px] text-[#8b8b8b] uppercase">Image</label>
                  <div className="flex gap-1">
                    <input
                      type="text"
                      value={tile.image}
                      onChange={(e) => updateTile(tile.id, { image: e.target.value })}
                      className="w-full border border-[#1a1a1a]/10 bg-white px-2 py-1 text-xs outline-none"
                    />
                    <MediaPickerButton
                      folder="products"
                      onSelect={(url) => updateTile(tile.id, { image: url })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 items-end">
                  <div>
                    <label className="block text-[8px] text-[#8b8b8b] uppercase">Text Style</label>
                    <div className="flex gap-1">
                      {(["dark", "light"] as const).map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => updateTile(tile.id, { textStyle: s })}
                          className={`flex-1 px-2 py-1 text-[10px] uppercase border transition-colors ${
                            tile.textStyle === s
                              ? "bg-[#1a1a1a] text-white border-[#1a1a1a]"
                              : "bg-white text-[#1a1a1a]/50 border-[#1a1a1a]/15"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                  {tile.textStyle === "dark" && (
                    <label className="flex items-center gap-1.5 text-[10px] text-[#1a1a1a]/60 pb-1.5">
                      <input
                        type="checkbox"
                        checked={tile.lightWash}
                        onChange={(e) => updateTile(tile.id, { lightWash: e.target.checked })}
                      />
                      Light wash overlay (for busy/light images)
                    </label>
                  )}
                </div>

                <div>
                  <label className="block text-[8px] text-[#8b8b8b] uppercase">Description</label>
                  <textarea
                    value={tile.desc}
                    onChange={(e) => updateTile(tile.id, { desc: e.target.value })}
                    rows={2}
                    className="w-full border border-[#1a1a1a]/10 bg-white px-2 py-1 text-xs outline-none resize-none"
                  />
                  <div className="mt-1">
                    <StyleRow
                      color={tile.descColor || "default"}
                      onColorChange={(v) => updateTile(tile.id, { descColor: v })}
                      font={tile.descFont || "default"}
                      onFontChange={(v) => updateTile(tile.id, { descFont: v })}
                      size={tile.descSize || "default"}
                      onSizeChange={(v) => updateTile(tile.id, { descSize: v })}
                      sizeOptions={PARAGRAPH_SIZE_OPTIONS}
                      colorDefaultLabel={tile.textStyle === "light" ? "White" : "Grey"}
                      fontDefaultLabel="Michroma"
                    />
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleDeleteTile(tile.id)}
                className="text-red-500 hover:text-red-700 transition-colors p-1 self-start"
              >
                <X size={15} />
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={handleAddTile}
          className="flex items-center gap-2 border border-[#007190] px-4 py-2.5 text-[10px] tracking-[0.15em] uppercase text-[#007190] hover:bg-[#007190] hover:text-white transition-all"
          style={fontMichroma}
        >
          <Plus size={13} />
          Add Tile
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// Technical Data tab
// ============================================================================

interface TechDataSlide {
  id: string;
  image: string;
  label: string;
  textColor: string;
  order: number;
}

function TechnicalDataTab() {
  const [slides, setSlides] = useState<TechDataSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

  useEffect(() => {
    fetchSlides();
  }, []);

  async function fetchSlides() {
    try {
      setLoading(true);
      const res = await fetch("/api/tech-data-slides").then((r) => r.json());
      if (res?.data) setSlides(res.data);
    } catch (err: any) {
      setError(err.message || "Failed to load.");
    } finally {
      setLoading(false);
    }
  }

  async function handleAddSlide() {
    setError(null);
    try {
      const res = await fetch("/api/tech-data-slides", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: "", label: "NEW SLIDE", textColor: "black" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add slide.");
      setSlides((prev) => [...prev, data.data]);
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function updateSlide(id: string, patch: Partial<TechDataSlide>) {
    setSlides((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
    try {
      await fetch(`/api/tech-data-slides/${id}`, {
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
      const res = await fetch(`/api/tech-data-slides/${id}`, { method: "DELETE" });
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
            : fetch(`/api/tech-data-slides/${slide.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ order: i }),
              })
        )
      );
      setSlides((prev) => prev.map((s, i) => ({ ...s, order: i })));
    } catch {
      setError("Failed to save the new slide order.");
      fetchSlides();
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

      <div className="bg-white border border-[#1a1a1a]/8 p-6 space-y-4">
        <div>
          <p className="text-[9px] tracking-[0.3em] uppercase text-[#1a1a1a]/35 border-b border-[#1a1a1a]/8 pb-3 mb-1" style={fontMichroma}>
            Technical Data Slideshow
          </p>
          <p className="text-[10px] text-[#8b8b8b] pt-2">
            Drag the grip handle to reorder. Each slide's label is shown in the bottom-right corner over its image. The Catalogue and Newsletter buttons open the site's standard forms and are not editable here.
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
// Locations tab
// ============================================================================

interface Location {
  id: string;
  order: number;
  name: string;
  line1: string | null;
  line2: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  mapEmbedUrl: string | null;
  googleMapsUrl: string | null;
  lat: number | null;
  lng: number | null;
}

function LocationsTab() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

  useEffect(() => {
    fetchLocations();
  }, []);

  async function fetchLocations() {
    try {
      setLoading(true);
      const res = await fetch("/api/locations");
      const data = await res.json();
      if (data?.data) setLocations(data.data);
    } catch (err: any) {
      setError(err.message || "Failed to load.");
    } finally {
      setLoading(false);
    }
  }

  async function handleAddLocation() {
    setError(null);
    try {
      const res = await fetch("/api/locations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "NEW LOCATION" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add location.");
      setLocations((prev) => [...prev, data.data]);
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function updateLocation(id: string, patch: Partial<Location>) {
    setLocations((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));
    try {
      await fetch(`/api/locations/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
    } catch {
      setError("Failed to save location changes.");
    }
  }

  async function handleDeleteLocation(id: string) {
    if (!confirm("Delete this location? This cannot be undone.")) return;
    setError(null);
    try {
      const res = await fetch(`/api/locations/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete.");
      setLocations((prev) => prev.filter((l) => l.id !== id));
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function moveLocation(from: number, to: number) {
    if (from === to) return;
    const reordered = [...locations];
    const [moved] = reordered.splice(from, 1);
    reordered.splice(to, 0, moved);
    setLocations(reordered);

    setError(null);
    try {
      await Promise.all(
        reordered.map((loc, i) =>
          loc.order === i
            ? Promise.resolve()
            : fetch(`/api/locations/${loc.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ order: i }),
              })
        )
      );
      setLocations((prev) => prev.map((l, i) => ({ ...l, order: i })));
    } catch {
      setError("Failed to save the new location order.");
      fetchLocations();
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

      <div className="bg-white border border-[#1a1a1a]/8 p-6 space-y-4">
        <div>
          <p className="text-[9px] tracking-[0.3em] uppercase text-[#1a1a1a]/35 border-b border-[#1a1a1a]/8 pb-3 mb-1" style={fontMichroma}>
            Locations
          </p>
          <p className="text-[10px] text-[#8b8b8b] pt-2">
            Drag the grip handle to reorder — this is the left-to-right display order in the grid.
            Each field saves automatically as you edit it. Lat/Lng position the map pin and QR code link.
          </p>
        </div>

        <div className="space-y-3">
          {locations.map((loc, idx) => (
            <div
              key={loc.id}
              onDragOver={(e) => {
                e.preventDefault();
                if (draggedIdx !== null) setDragOverIdx(idx);
              }}
              onDragLeave={() => setDragOverIdx((cur) => (cur === idx ? null : cur))}
              onDrop={(e) => {
                e.preventDefault();
                if (draggedIdx !== null) moveLocation(draggedIdx, idx);
                setDraggedIdx(null);
                setDragOverIdx(null);
              }}
              className={`flex gap-3 items-start bg-[#f8f5f0] border p-3 transition-colors ${
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

              <div className="flex-1 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[8px] text-[#8b8b8b] uppercase">Name</label>
                    <input
                      type="text"
                      value={loc.name}
                      onChange={(e) => updateLocation(loc.id, { name: e.target.value })}
                      placeholder="e.g. Sharjah"
                      className="w-full border border-[#1a1a1a]/10 bg-white px-2 py-1 text-xs outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[8px] text-[#8b8b8b] uppercase">Phone</label>
                      <input
                        type="text"
                        value={loc.phone || ""}
                        onChange={(e) => updateLocation(loc.id, { phone: e.target.value })}
                        className="w-full border border-[#1a1a1a]/10 bg-white px-2 py-1 text-xs outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[8px] text-[#8b8b8b] uppercase">Email</label>
                      <input
                        type="text"
                        value={loc.email || ""}
                        onChange={(e) => updateLocation(loc.id, { email: e.target.value })}
                        className="w-full border border-[#1a1a1a]/10 bg-white px-2 py-1 text-xs outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[8px] text-[#8b8b8b] uppercase">Address</label>
                  <textarea
                    value={loc.address || ""}
                    onChange={(e) => updateLocation(loc.id, { address: e.target.value })}
                    rows={2}
                    className="w-full border border-[#1a1a1a]/10 bg-white px-2 py-1 text-xs outline-none resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[8px] text-[#8b8b8b] uppercase">Map Pin Label — Line 1</label>
                    <input
                      type="text"
                      value={loc.line1 || ""}
                      onChange={(e) => updateLocation(loc.id, { line1: e.target.value })}
                      placeholder="e.g. Glaze Granite & Marble,"
                      className="w-full border border-[#1a1a1a]/10 bg-white px-2 py-1 text-xs outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[8px] text-[#8b8b8b] uppercase">Map Pin Label — Line 2</label>
                    <input
                      type="text"
                      value={loc.line2 || ""}
                      onChange={(e) => updateLocation(loc.id, { line2: e.target.value })}
                      placeholder="e.g. EIC Sharjah, UAE"
                      className="w-full border border-[#1a1a1a]/10 bg-white px-2 py-1 text-xs outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[8px] text-[#8b8b8b] uppercase">Latitude</label>
                    <input
                      type="number"
                      step="any"
                      value={loc.lat ?? ""}
                      onChange={(e) => updateLocation(loc.id, { lat: e.target.value === "" ? null : Number(e.target.value) })}
                      className="w-full border border-[#1a1a1a]/10 bg-white px-2 py-1 text-xs outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[8px] text-[#8b8b8b] uppercase">Longitude</label>
                    <input
                      type="number"
                      step="any"
                      value={loc.lng ?? ""}
                      onChange={(e) => updateLocation(loc.id, { lng: e.target.value === "" ? null : Number(e.target.value) })}
                      className="w-full border border-[#1a1a1a]/10 bg-white px-2 py-1 text-xs outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[8px] text-[#8b8b8b] uppercase">Google Maps URL</label>
                  <p className="text-[8px] text-[#8b8b8b] mb-0.5">Used for the "Scan QR Code" link on the card.</p>
                  <input
                    type="text"
                    value={loc.googleMapsUrl || ""}
                    onChange={(e) => updateLocation(loc.id, { googleMapsUrl: e.target.value })}
                    className="w-full border border-[#1a1a1a]/10 bg-white px-2 py-1 text-xs outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[8px] text-[#8b8b8b] uppercase">Map Embed URL</label>
                  <p className="text-[8px] text-[#8b8b8b] mb-0.5">
                    From Google Maps: Share &gt; Embed a map &gt; copy the src="..." URL out of the iframe code.
                  </p>
                  <input
                    type="text"
                    value={loc.mapEmbedUrl || ""}
                    onChange={(e) => updateLocation(loc.id, { mapEmbedUrl: e.target.value })}
                    className="w-full border border-[#1a1a1a]/10 bg-white px-2 py-1 text-xs outline-none font-mono"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleDeleteLocation(loc.id)}
                className="text-red-500 hover:text-red-700 transition-colors p-1 self-start"
              >
                <X size={15} />
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={handleAddLocation}
          className="flex items-center gap-2 border border-[#007190] px-4 py-2.5 text-[10px] tracking-[0.15em] uppercase text-[#007190] hover:bg-[#007190] hover:text-white transition-all"
          style={fontMichroma}
        >
          <Plus size={13} />
          Add Location
        </button>
      </div>
    </div>
  );
}


// ============================================================================
// Privacy Policy tab
// ============================================================================

interface PrivacyPolicySettings {
  privacyHeroTitle: string;
  privacyHeroTitleColor: string;
  privacyHeroTitleFont: string;
  privacyHeroTitleSize: string;
  privacyBody: string;
}

function PrivacyPolicyTab() {
  const [settings, setSettings] = useState<PrivacyPolicySettings>({
    privacyHeroTitle: "",
    privacyHeroTitleColor: "default",
    privacyHeroTitleFont: "default",
    privacyHeroTitleSize: "default",
    privacyBody: "",
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
          const s = data.data;
          setSettings({
            privacyHeroTitle: s.privacyHeroTitle || "",
            privacyHeroTitleColor: s.privacyHeroTitleColor || "default",
            privacyHeroTitleFont: s.privacyHeroTitleFont || "default",
            privacyHeroTitleSize: s.privacyHeroTitleSize || "default",
            privacyBody: s.privacyBody || "",
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
        <div className="h-64 bg-white border border-[#1a1a1a]/8 animate-pulse" />
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
            Privacy Policy
          </p>
          {saved && (
            <span className="flex items-center gap-1 text-[10px] text-green-600" style={fontMichroma}>
              <Check size={11} /> Saved
            </span>
          )}
        </div>
        <p className="text-[10px] text-[#8b8b8b] -mt-2">The /privacy-policy page's hero banner and body content.</p>

        <div className="space-y-1.5">
          <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40" style={fontMichroma}>
            Title
          </label>
          <input
            type="text"
            value={settings.privacyHeroTitle}
            onChange={(e) => setSettings((p) => ({ ...p, privacyHeroTitle: e.target.value }))}
            placeholder="Privacy Policy"
            className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none"
          />
          <StyleRow
            color={settings.privacyHeroTitleColor}
            onColorChange={(v) => setSettings((p) => ({ ...p, privacyHeroTitleColor: v }))}
            font={settings.privacyHeroTitleFont}
            onFontChange={(v) => setSettings((p) => ({ ...p, privacyHeroTitleFont: v }))}
            size={settings.privacyHeroTitleSize}
            onSizeChange={(v) => setSettings((p) => ({ ...p, privacyHeroTitleSize: v }))}
            sizeOptions={HEADING_SIZE_OPTIONS}
            colorDefaultLabel="White"
            fontDefaultLabel="Ivymode"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40" style={fontMichroma}>
            Body Content
          </label>
          <p className="text-[10px] text-[#8b8b8b]">
            Basic HTML is supported: {"<h3>"} and {"<h4>"} for section headings, {"<p>"} for paragraphs, {"<ul><li>"} for bulleted lists. Leave blank to keep the original policy text.
          </p>
          <textarea
            value={settings.privacyBody}
            onChange={(e) => setSettings((p) => ({ ...p, privacyBody: e.target.value }))}
            rows={16}
            placeholder={`<p>At NOBILITA, we value your privacy...</p>\n\n<h3>What Personal Data Do We Collect?</h3>\n<p>...</p>`}
            className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-2.5 text-xs font-mono text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none resize-y"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="border border-[#007190]/25 bg-white px-5 py-2 text-[10px] tracking-[0.15em] uppercase text-[#007190]/70 hover:bg-[#007190] hover:text-white hover:border-[#007190] disabled:opacity-40 transition-all"
          style={fontMichroma}
        >
          {saving ? "Saving…" : "Save Privacy Policy"}
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// Sitemap tab
// ============================================================================

interface SitemapSettings {
  sitemapHeroTitle: string;
  sitemapHeroTitleColor: string;
  sitemapHeroTitleFont: string;
  sitemapHeroTitleSize: string;
}

function SitemapTab() {
  const [settings, setSettings] = useState<SitemapSettings>({
    sitemapHeroTitle: "",
    sitemapHeroTitleColor: "default",
    sitemapHeroTitleFont: "default",
    sitemapHeroTitleSize: "default",
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
          const s = data.data;
          setSettings({
            sitemapHeroTitle: s.sitemapHeroTitle || "",
            sitemapHeroTitleColor: s.sitemapHeroTitleColor || "default",
            sitemapHeroTitleFont: s.sitemapHeroTitleFont || "default",
            sitemapHeroTitleSize: s.sitemapHeroTitleSize || "default",
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
        <div className="h-40 bg-white border border-[#1a1a1a]/8 animate-pulse" />
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
            Sitemap
          </p>
          {saved && (
            <span className="flex items-center gap-1 text-[10px] text-green-600" style={fontMichroma}>
              <Check size={11} /> Saved
            </span>
          )}
        </div>
        <p className="text-[10px] text-[#8b8b8b] -mt-2">
          The /sitemap page's hero banner. Its Products list is generated automatically from your published
          products (Admin &gt; Explore The Collection) — add or remove a product there and it updates here too,
          nothing to edit in this tab.
        </p>

        <div className="space-y-1.5">
          <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40" style={fontMichroma}>
            Title
          </label>
          <input
            type="text"
            value={settings.sitemapHeroTitle}
            onChange={(e) => setSettings((p) => ({ ...p, sitemapHeroTitle: e.target.value }))}
            placeholder="Sitemap"
            className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none"
          />
          <StyleRow
            color={settings.sitemapHeroTitleColor}
            onColorChange={(v) => setSettings((p) => ({ ...p, sitemapHeroTitleColor: v }))}
            font={settings.sitemapHeroTitleFont}
            onFontChange={(v) => setSettings((p) => ({ ...p, sitemapHeroTitleFont: v }))}
            size={settings.sitemapHeroTitleSize}
            onSizeChange={(v) => setSettings((p) => ({ ...p, sitemapHeroTitleSize: v }))}
            sizeOptions={HEADING_SIZE_OPTIONS}
            colorDefaultLabel="White"
            fontDefaultLabel="Ivymode"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="border border-[#007190]/25 bg-white px-5 py-2 text-[10px] tracking-[0.15em] uppercase text-[#007190]/70 hover:bg-[#007190] hover:text-white hover:border-[#007190] disabled:opacity-40 transition-all"
          style={fontMichroma}
        >
          {saving ? "Saving…" : "Save Sitemap"}
        </button>
      </div>
    </div>
  );
}
