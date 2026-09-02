"use client";

import React, { useState, useEffect } from "react";
import { Check } from "lucide-react";
import { MediaPickerButton } from "../_components/MediaPicker";

const fontMichroma = { fontFamily: "var(--font-michroma), sans-serif" };
const fontIvymode = { fontFamily: "var(--font-ivymode), serif" };

interface StorySettings {
  storyHeroTitle: string;
  storyHeroPara1: string;
  storyHeroPara2: string;
  storySec2Heading: string;
  storySec2Line1: string;
  storySec2Line3: string;
  storySec2BgImage: string;
  storySec2Image: string;
  storySec2BtnText: string;
  storySec2ProductName: string;
  storySec3Para: string;
  storySec3BtnText: string;
  storySec3ProductName: string;
  storySec4Heading: string;
  storySec4Line1: string;
  storySec4Line2: string;
  storySec4BgImage: string;
  storySec4Image: string;
  storySec4BtnText: string;
  storySec4ProductName: string;
}

const EMPTY: StorySettings = {
  storyHeroTitle: "",
  storyHeroPara1: "",
  storyHeroPara2: "",
  storySec2Heading: "",
  storySec2Line1: "",
  storySec2Line3: "",
  storySec2BgImage: "",
  storySec2Image: "",
  storySec2BtnText: "",
  storySec2ProductName: "",
  storySec3Para: "",
  storySec3BtnText: "",
  storySec3ProductName: "",
  storySec4Heading: "",
  storySec4Line1: "",
  storySec4Line2: "",
  storySec4BgImage: "",
  storySec4Image: "",
  storySec4BtnText: "",
  storySec4ProductName: "",
};

function ImageField({ label, value, onChange }: { label: string; value: string; onChange: (url: string) => void }) {
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

function ProductSelect({ label, value, productNames, onChange }: { label: string; value: string; productNames: string[]; onChange: (name: string) => void }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40" style={fontMichroma}>
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none"
      >
        {value && !productNames.includes(value) && <option value={value}>{value}</option>}
        {productNames.map((p) => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>
    </div>
  );
}

export default function OurStoryAdminPage() {
  const [settings, setSettings] = useState<StorySettings>(EMPTY);
  const [productNames, setProductNames] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingSection, setSavingSection] = useState<string | null>(null);
  const [savedSection, setSavedSection] = useState<string | null>(null);

  useEffect(() => {
    fetchAll();
  }, []);

  async function fetchAll() {
    try {
      setLoading(true);
      const [settingsRes, productsRes] = await Promise.all([
        fetch("/api/settings").then((r) => r.json()),
        fetch("/api/products").then((r) => r.json()),
      ]);
      if (settingsRes?.data) {
        const s = settingsRes.data;
        setSettings({
          storyHeroTitle: s.storyHeroTitle || "",
          storyHeroPara1: s.storyHeroPara1 || "",
          storyHeroPara2: s.storyHeroPara2 || "",
          storySec2Heading: s.storySec2Heading || "",
          storySec2Line1: s.storySec2Line1 || "",
          storySec2Line3: s.storySec2Line3 || "",
          storySec2BgImage: s.storySec2BgImage || "",
          storySec2Image: s.storySec2Image || "",
          storySec2BtnText: s.storySec2BtnText || "",
          storySec2ProductName: s.storySec2ProductName || "",
          storySec3Para: s.storySec3Para || "",
          storySec3BtnText: s.storySec3BtnText || "",
          storySec3ProductName: s.storySec3ProductName || "",
          storySec4Heading: s.storySec4Heading || "",
          storySec4Line1: s.storySec4Line1 || "",
          storySec4Line2: s.storySec4Line2 || "",
          storySec4BgImage: s.storySec4BgImage || "",
          storySec4Image: s.storySec4Image || "",
          storySec4BtnText: s.storySec4BtnText || "",
          storySec4ProductName: s.storySec4ProductName || "",
        });
      }
      if (productsRes?.data) {
        setProductNames(productsRes.data.map((p: { name: string }) => p.name).sort());
      }
    } catch (err: any) {
      setError(err.message || "Failed to load.");
    } finally {
      setLoading(false);
    }
  }

  function set<K extends keyof StorySettings>(key: K, value: string) {
    setSettings((p) => ({ ...p, [key]: value }));
  }

  async function handleSave(section: string, fields: (keyof StorySettings)[]) {
    setSavingSection(section);
    setError(null);
    try {
      const patch: Record<string, string> = {};
      fields.forEach((f) => { patch[f] = settings[f]; });
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save.");
      setSavedSection(section);
      setTimeout(() => setSavedSection(null), 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSavingSection(null);
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="h-24 bg-white border border-[#1a1a1a]/8 animate-pulse" />
        ))}
      </div>
    );
  }

  const SaveButton = ({ section, fields, label }: { section: string; fields: (keyof StorySettings)[]; label: string }) => (
    <button
      onClick={() => handleSave(section, fields)}
      disabled={savingSection === section}
      className="border border-[#007190]/25 bg-white px-5 py-2 text-[10px] tracking-[0.15em] uppercase text-[#007190]/70 hover:bg-[#007190] hover:text-white hover:border-[#007190] disabled:opacity-40 transition-all"
      style={fontMichroma}
    >
      {savingSection === section ? "Saving…" : label}
    </button>
  );

  const SavedBadge = ({ section }: { section: string }) =>
    savedSection === section ? (
      <span className="flex items-center gap-1 text-[10px] text-green-600" style={fontMichroma}>
        <Check size={11} /> Saved
      </span>
    ) : null;

  return (
    <div className="space-y-8" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
      {/* Header */}
      <div>
        <p className="text-[10px] tracking-[0.3em] uppercase text-[#1a1a1a]/35 mb-1" style={fontMichroma}>
          Site Content
        </p>
        <h2 className="text-3xl font-light text-[#1a1a1a]" style={fontIvymode}>
          Our Story
        </h2>
        <p className="mt-2 text-sm text-[#8b8b8b]">
          Edit the Our Story page's text, images, and "view product" links. Layout and animations stay fixed.
        </p>
      </div>

      <div className="h-px bg-[#1a1a1a]/8" />

      {error && (
        <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
      )}

      {/* Hero */}
      <div className="bg-white border border-[#1a1a1a]/8 p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-[#1a1a1a]/8 pb-3">
          <p className="text-[9px] tracking-[0.3em] uppercase text-[#1a1a1a]/35" style={fontMichroma}>Hero</p>
          <SavedBadge section="hero" />
        </div>

        <div className="space-y-1.5">
          <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40" style={fontMichroma}>Title</label>
          <input
            type="text"
            value={settings.storyHeroTitle}
            onChange={(e) => set("storyHeroTitle", e.target.value)}
            placeholder="OUR STORY"
            className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none"
          />
        </div>
        <div className="space-y-1.5">
          <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40" style={fontMichroma}>Paragraph 1</label>
          <textarea
            value={settings.storyHeroPara1}
            onChange={(e) => set("storyHeroPara1", e.target.value)}
            rows={2}
            className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none resize-none"
          />
        </div>
        <div className="space-y-1.5">
          <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40" style={fontMichroma}>Paragraph 2</label>
          <textarea
            value={settings.storyHeroPara2}
            onChange={(e) => set("storyHeroPara2", e.target.value)}
            rows={2}
            className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none resize-none"
          />
        </div>
        <p className="text-[10px] text-[#8b8b8b]">
          A third paragraph ("Among their defining features was the Piano Nobile…") has an inline highlighted phrase and isn't editable here.
        </p>

        <SaveButton section="hero" label="Save Hero" fields={["storyHeroTitle", "storyHeroPara1", "storyHeroPara2"]} />
      </div>

      {/* Section 2: Piano Nobile, Reimagined */}
      <div className="bg-white border border-[#1a1a1a]/8 p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-[#1a1a1a]/8 pb-3">
          <p className="text-[9px] tracking-[0.3em] uppercase text-[#1a1a1a]/35" style={fontMichroma}>Piano Nobile, Reimagined</p>
          <SavedBadge section="sec2" />
        </div>

        <div className="space-y-1.5">
          <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40" style={fontMichroma}>Heading</label>
          <input
            type="text"
            value={settings.storySec2Heading}
            onChange={(e) => set("storySec2Heading", e.target.value)}
            placeholder="PIANO NOBILE, REIMAGINED"
            className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none"
          />
        </div>
        <div className="space-y-1.5">
          <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40" style={fontMichroma}>Line 1</label>
          <textarea
            value={settings.storySec2Line1}
            onChange={(e) => set("storySec2Line1", e.target.value)}
            rows={2}
            className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none resize-none"
          />
        </div>
        <div className="space-y-1.5">
          <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40" style={fontMichroma}>Line 3</label>
          <textarea
            value={settings.storySec2Line3}
            onChange={(e) => set("storySec2Line3", e.target.value)}
            rows={2}
            className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none resize-none"
          />
        </div>
        <p className="text-[10px] text-[#8b8b8b]">
          "Line 2" ("…something extraordinary.") has an inline highlighted word and isn't editable here.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <ImageField label="Background Image" value={settings.storySec2BgImage} onChange={(v) => set("storySec2BgImage", v)} />
          <ImageField label="Product Photo" value={settings.storySec2Image} onChange={(v) => set("storySec2Image", v)} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40" style={fontMichroma}>Button Text</label>
            <input
              type="text"
              value={settings.storySec2BtnText}
              onChange={(e) => set("storySec2BtnText", e.target.value)}
              placeholder="VERDE PROFONDO"
              className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none"
            />
          </div>
          <ProductSelect label="Opens Product" value={settings.storySec2ProductName} productNames={productNames} onChange={(v) => set("storySec2ProductName", v)} />
        </div>

        <SaveButton
          section="sec2"
          label="Save Section"
          fields={["storySec2Heading", "storySec2Line1", "storySec2Line3", "storySec2BgImage", "storySec2Image", "storySec2BtnText", "storySec2ProductName"]}
        />
      </div>

      {/* Section 3: Bookmatch / Basaltina */}
      <div className="bg-white border border-[#1a1a1a]/8 p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-[#1a1a1a]/8 pb-3">
          <p className="text-[9px] tracking-[0.3em] uppercase text-[#1a1a1a]/35" style={fontMichroma}>Bookmatch Video Section</p>
          <SavedBadge section="sec3" />
        </div>
        <p className="text-[10px] text-[#8b8b8b] -mt-2">
          The background video and tagline graphic are fixed brand assets and aren't editable here.
        </p>

        <div className="space-y-1.5">
          <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40" style={fontMichroma}>Paragraph</label>
          <textarea
            value={settings.storySec3Para}
            onChange={(e) => set("storySec3Para", e.target.value)}
            rows={3}
            className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none resize-none"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40" style={fontMichroma}>Button Text</label>
            <input
              type="text"
              value={settings.storySec3BtnText}
              onChange={(e) => set("storySec3BtnText", e.target.value)}
              placeholder="BASALTINA"
              className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none"
            />
          </div>
          <ProductSelect label="Opens Product" value={settings.storySec3ProductName} productNames={productNames} onChange={(v) => set("storySec3ProductName", v)} />
        </div>

        <SaveButton section="sec3" label="Save Section" fields={["storySec3Para", "storySec3BtnText", "storySec3ProductName"]} />
      </div>

      {/* Section 4: Next Generation Porcelain */}
      <div className="bg-white border border-[#1a1a1a]/8 p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-[#1a1a1a]/8 pb-3">
          <p className="text-[9px] tracking-[0.3em] uppercase text-[#1a1a1a]/35" style={fontMichroma}>Next Generation Porcelain</p>
          <SavedBadge section="sec4" />
        </div>

        <div className="space-y-1.5">
          <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40" style={fontMichroma}>Heading</label>
          <input
            type="text"
            value={settings.storySec4Heading}
            onChange={(e) => set("storySec4Heading", e.target.value)}
            placeholder="NEXT GENERATION PORCELAIN"
            className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none"
          />
        </div>
        <div className="space-y-1.5">
          <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40" style={fontMichroma}>Line 1</label>
          <textarea
            value={settings.storySec4Line1}
            onChange={(e) => set("storySec4Line1", e.target.value)}
            rows={3}
            className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none resize-none"
          />
        </div>
        <div className="space-y-1.5">
          <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40" style={fontMichroma}>Line 2</label>
          <textarea
            value={settings.storySec4Line2}
            onChange={(e) => set("storySec4Line2", e.target.value)}
            rows={2}
            className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none resize-none"
          />
        </div>
        <p className="text-[10px] text-[#8b8b8b]">
          "Line 3" ("It is defined by beauty that endures.") has an inline highlighted phrase and isn't editable here.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <ImageField label="Background Image" value={settings.storySec4BgImage} onChange={(v) => set("storySec4BgImage", v)} />
          <ImageField label="Product Photo" value={settings.storySec4Image} onChange={(v) => set("storySec4Image", v)} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40" style={fontMichroma}>Button Text</label>
            <input
              type="text"
              value={settings.storySec4BtnText}
              onChange={(e) => set("storySec4BtnText", e.target.value)}
              placeholder="FERRO INDUSTRIALE"
              className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none"
            />
          </div>
          <ProductSelect label="Opens Product" value={settings.storySec4ProductName} productNames={productNames} onChange={(v) => set("storySec4ProductName", v)} />
        </div>

        <SaveButton
          section="sec4"
          label="Save Section"
          fields={["storySec4Heading", "storySec4Line1", "storySec4Line2", "storySec4BgImage", "storySec4Image", "storySec4BtnText", "storySec4ProductName"]}
        />
      </div>
    </div>
  );
}
