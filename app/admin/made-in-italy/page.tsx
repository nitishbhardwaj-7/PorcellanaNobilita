"use client";

import React, { useState, useEffect } from "react";
import { Check } from "lucide-react";
import { MediaPickerButton } from "../_components/MediaPicker";

const fontMichroma = { fontFamily: "var(--font-michroma), sans-serif" };
const fontIvymode = { fontFamily: "var(--font-ivymode), serif" };

interface MiSettings {
  miHeading: string;
  miSec1Label: string;
  miSec2Para1: string;
  miSec2Image: string;
  miSec2ImageLabel: string;
  miSec3Line1: string;
  miSec3LeftImage: string;
  miSec3RightImage: string;
  miSec3RightImageLabel: string;
  miSec3BottomPara: string;
  miSec4BgImage: string;
  miSec4BgImageMobile: string;
  miSec4Label: string;
}

const EMPTY: MiSettings = {
  miHeading: "",
  miSec1Label: "",
  miSec2Para1: "",
  miSec2Image: "",
  miSec2ImageLabel: "",
  miSec3Line1: "",
  miSec3LeftImage: "",
  miSec3RightImage: "",
  miSec3RightImageLabel: "",
  miSec3BottomPara: "",
  miSec4BgImage: "",
  miSec4BgImageMobile: "",
  miSec4Label: "",
};

function ImageField({ label, value, onChange }: { label: string; value: string; onChange: (url: string) => void }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40" style={fontMichroma}>
        {label}
      </label>
      {value && <img src={value} alt="" className="w-full max-h-72 object-contain border border-[#1a1a1a]/10 bg-[#f0ede6]" />}
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

export default function MadeInItalyAdminPage() {
  const [settings, setSettings] = useState<MiSettings>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingSection, setSavingSection] = useState<string | null>(null);
  const [savedSection, setSavedSection] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data?.data) {
          const s = data.data;
          setSettings({
            miHeading: s.miHeading || "",
            miSec1Label: s.miSec1Label || "",
            miSec2Para1: s.miSec2Para1 || "",
            miSec2Image: s.miSec2Image || "",
            miSec2ImageLabel: s.miSec2ImageLabel || "",
            miSec3Line1: s.miSec3Line1 || "",
            miSec3LeftImage: s.miSec3LeftImage || "",
            miSec3RightImage: s.miSec3RightImage || "",
            miSec3RightImageLabel: s.miSec3RightImageLabel || "",
            miSec3BottomPara: s.miSec3BottomPara || "",
            miSec4BgImage: s.miSec4BgImage || "",
            miSec4BgImageMobile: s.miSec4BgImageMobile || "",
            miSec4Label: s.miSec4Label || "",
          });
        }
      })
      .catch((err) => setError(err.message || "Failed to load."))
      .finally(() => setLoading(false));
  }, []);

  function set<K extends keyof MiSettings>(key: K, value: string) {
    setSettings((p) => ({ ...p, [key]: value }));
  }

  async function handleSave(section: string, fields: (keyof MiSettings)[]) {
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

  const SaveButton = ({ section, fields, label }: { section: string; fields: (keyof MiSettings)[]; label: string }) => (
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
          Made in Italy
        </h2>
        <p className="mt-2 text-sm text-[#8b8b8b]">
          Edit the Made in Italy page's text and images. Layout and animations stay fixed.
        </p>
      </div>

      <div className="h-px bg-[#1a1a1a]/8" />

      {error && (
        <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
      )}

      {/* Section 1: Duomo Hero */}
      <div className="bg-white border border-[#1a1a1a]/8 p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-[#1a1a1a]/8 pb-3">
          <p className="text-[9px] tracking-[0.3em] uppercase text-[#1a1a1a]/35" style={fontMichroma}>Duomo Video Hero</p>
          <SavedBadge section="sec1" />
        </div>
        <p className="text-[10px] text-[#8b8b8b] -mt-2">
          The background video is a fixed brand asset and isn't editable here.
        </p>

        <div className="space-y-1.5">
          <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40" style={fontMichroma}>Heading</label>
          <input
            type="text"
            value={settings.miHeading}
            onChange={(e) => set("miHeading", e.target.value)}
            placeholder="MADE IN ITALY"
            className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none"
          />
        </div>
        <div className="space-y-1.5">
          <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40" style={fontMichroma}>Video Caption</label>
          <input
            type="text"
            value={settings.miSec1Label}
            onChange={(e) => set("miSec1Label", e.target.value)}
            placeholder="DUOMO DI MILANO"
            className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none"
          />
        </div>

        <SaveButton section="sec1" label="Save Section" fields={["miHeading", "miSec1Label"]} />
      </div>

      {/* Section 2: Intro */}
      <div className="bg-white border border-[#1a1a1a]/8 p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-[#1a1a1a]/8 pb-3">
          <p className="text-[9px] tracking-[0.3em] uppercase text-[#1a1a1a]/35" style={fontMichroma}>Made In Italy Intro</p>
          <SavedBadge section="sec2" />
        </div>

        <div className="space-y-1.5">
          <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40" style={fontMichroma}>Paragraph 1</label>
          <textarea
            value={settings.miSec2Para1}
            onChange={(e) => set("miSec2Para1", e.target.value)}
            rows={3}
            className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none resize-none"
          />
        </div>
        <p className="text-[10px] text-[#8b8b8b]">
          A second paragraph ("...transforming raw materials into surfaces of exceptional quality...") has an inline highlighted phrase and isn't editable here.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <ImageField label="Image" value={settings.miSec2Image} onChange={(v) => set("miSec2Image", v)} />
          <div className="space-y-1.5">
            <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40" style={fontMichroma}>Image Caption</label>
            <input
              type="text"
              value={settings.miSec2ImageLabel}
              onChange={(e) => set("miSec2ImageLabel", e.target.value)}
              placeholder="PALAZZO DELLA CIVILTÀ ITALIANA"
              className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none"
            />
          </div>
        </div>

        <SaveButton section="sec2" label="Save Section" fields={["miSec2Para1", "miSec2Image", "miSec2ImageLabel"]} />
      </div>

      {/* Section 3: Large Format Slabs */}
      <div className="bg-white border border-[#1a1a1a]/8 p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-[#1a1a1a]/8 pb-3">
          <p className="text-[9px] tracking-[0.3em] uppercase text-[#1a1a1a]/35" style={fontMichroma}>Large Format Slabs</p>
          <SavedBadge section="sec3" />
        </div>

        <div className="space-y-1.5">
          <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40" style={fontMichroma}>Top Text — Line 1</label>
          <textarea
            value={settings.miSec3Line1}
            onChange={(e) => set("miSec3Line1", e.target.value)}
            rows={2}
            className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none resize-none"
          />
        </div>
        <p className="text-[10px] text-[#8b8b8b]">
          "Line 2" ("...a legacy of craftsmanship made for generations to come.") has an inline highlighted phrase and isn't editable here.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <ImageField label="Left Image (Factory)" value={settings.miSec3LeftImage} onChange={(v) => set("miSec3LeftImage", v)} />
          <ImageField label="Right Image (Processing Unit)" value={settings.miSec3RightImage} onChange={(v) => set("miSec3RightImage", v)} />
        </div>
        <div className="space-y-1.5">
          <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40" style={fontMichroma}>Right Image Caption</label>
          <input
            type="text"
            value={settings.miSec3RightImageLabel}
            onChange={(e) => set("miSec3RightImageLabel", e.target.value)}
            placeholder="LARGE FORMAT SLABS PROCESSING UNIT"
            className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none"
          />
        </div>
        <div className="space-y-1.5">
          <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40" style={fontMichroma}>Bottom Paragraph</label>
          <textarea
            value={settings.miSec3BottomPara}
            onChange={(e) => set("miSec3BottomPara", e.target.value)}
            rows={3}
            className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none resize-none"
          />
        </div>

        <SaveButton
          section="sec3"
          label="Save Section"
          fields={["miSec3Line1", "miSec3LeftImage", "miSec3RightImage", "miSec3RightImageLabel", "miSec3BottomPara"]}
        />
      </div>

      {/* Section 4: Colosseum */}
      <div className="bg-white border border-[#1a1a1a]/8 p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-[#1a1a1a]/8 pb-3">
          <p className="text-[9px] tracking-[0.3em] uppercase text-[#1a1a1a]/35" style={fontMichroma}>Colosseum Reveal</p>
          <SavedBadge section="sec4" />
        </div>
        <p className="text-[10px] text-[#8b8b8b] -mt-2">
          The "Il Gres Imperiale d'Italia" tagline graphic is a fixed brand asset and isn't editable here.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <ImageField label="Background Image (Desktop)" value={settings.miSec4BgImage} onChange={(v) => set("miSec4BgImage", v)} />
          <ImageField label="Background Image (Mobile)" value={settings.miSec4BgImageMobile} onChange={(v) => set("miSec4BgImageMobile", v)} />
        </div>
        <div className="space-y-1.5">
          <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40" style={fontMichroma}>Caption</label>
          <input
            type="text"
            value={settings.miSec4Label}
            onChange={(e) => set("miSec4Label", e.target.value)}
            placeholder="COLOSSEUM"
            className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none"
          />
        </div>

        <SaveButton section="sec4" label="Save Section" fields={["miSec4BgImage", "miSec4BgImageMobile", "miSec4Label"]} />
      </div>
    </div>
  );
}
