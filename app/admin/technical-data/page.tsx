"use client";

import React, { useState, useEffect } from "react";
import { Check } from "lucide-react";
import { MediaPickerButton } from "../_components/MediaPicker";

const fontMichroma = { fontFamily: "var(--font-michroma), sans-serif" };
const fontIvymode = { fontFamily: "var(--font-ivymode), serif" };

interface TdSettings {
  tdHeading: string;
  tdHeroDesc: string;
  tdCharHeading: string;
  [key: `tdChar${number}Title`]: string;
  [key: `tdChar${number}Desc`]: string;
  [key: `tdChar${number}Icon`]: string;
  tdUgHeading: string;
  tdUgDesc1: string;
  tdUgDesc2: string;
  tdDimHeading: string;
  tdDimDesc1: string;
  tdDimDesc2: string;
  tdDimDesc3: string;
  tdThickHeading: string;
  tdThickDesc1: string;
  tdThickDesc2: string;
  tdSpecsHeading: string;
}

const CHAR_ROWS = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

const CHAR_DEFAULTS: Record<(typeof CHAR_ROWS)[number], { title: string; desc: string; icon: string }> = {
  1: { title: "WATER PROOF", desc: "Highly resistant to water damage, due to an ultra-low absorption rate.", icon: "/images/technical data/SVGs/SVGs/icons-01.svg" },
  2: { title: "UV RESISTANT", desc: "Composed of 100% natural materials, ensuring colors remain vibrant even with prolonged exposure to sunlight and extreme weather.", icon: "/images/technical data/SVGs/SVGs/icons-06.svg" },
  3: { title: "SCRATCH RESISTANT", desc: "Engineered with a tough surface strength to withstand scratches and abrasions.", icon: "/images/technical data/SVGs/SVGs/icons-03.svg" },
  4: { title: "ECO FRIENDLY", desc: "Contains no substances harmful to the environment.", icon: "/images/technical data/SVGs/SVGs/icons-04.svg" },
  5: { title: "HEAT & FROST RESISTANT", desc: "NOBILITA does not burn, emit smoke, or release toxic substances when exposed to fire.", icon: "/images/technical data/SVGs/SVGs/icons-05.svg" },
  6: { title: "RECYCLABLE", desc: "Each slab incorporates between 52% - 98% recycled content and is fully reusable and recyclable.", icon: "/images/technical data/SVGs/SVGs/icons-07.svg" },
  7: { title: "EASY TO MAINTAIN", desc: "Compatible with all types of cleaning agents, including bleach and ammonia.", icon: "/images/technical data/SVGs/SVGs/icons-08.svg" },
  8: { title: "HIGH FLEXURAL STRENGTH", desc: "Designed to withstand heavy loads and pressure without bending or cracking.", icon: "/images/technical data/SVGs/SVGs/icons-09.svg" },
  9: { title: "HYGIENIC & FOOD SAFE", desc: "Non-toxic and free from harmful emissions, 100% food safe, NSF Certified.", icon: "/images/technical data/SVGs/SVGs/icons-10.svg" },
};

function emptySettings(): TdSettings {
  const base: any = {
    tdHeading: "", tdHeroDesc: "", tdCharHeading: "",
    tdUgHeading: "", tdUgDesc1: "", tdUgDesc2: "",
    tdDimHeading: "", tdDimDesc1: "", tdDimDesc2: "", tdDimDesc3: "",
    tdThickHeading: "", tdThickDesc1: "", tdThickDesc2: "",
    tdSpecsHeading: "",
  };
  CHAR_ROWS.forEach((n) => {
    base[`tdChar${n}Title`] = "";
    base[`tdChar${n}Desc`] = "";
    base[`tdChar${n}Icon`] = "";
  });
  return base as TdSettings;
}

function ImageField({ label, value, onChange }: { label: string; value: string; onChange: (url: string) => void }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40" style={fontMichroma}>
        {label}
      </label>
      {value && <img src={value} alt="" className="h-28 w-28 object-contain border border-[#1a1a1a]/10 bg-[#007190] p-3" />}
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

export default function TechnicalDataAdminPage() {
  const [settings, setSettings] = useState<TdSettings>(emptySettings());
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
          const next = emptySettings();
          (Object.keys(next) as (keyof TdSettings)[]).forEach((k) => {
            (next as any)[k] = s[k] || "";
          });
          setSettings(next);
        }
      })
      .catch((err) => setError(err.message || "Failed to load."))
      .finally(() => setLoading(false));
  }, []);

  function set(key: keyof TdSettings, value: string) {
    setSettings((p) => ({ ...p, [key]: value }));
  }

  async function handleSave(section: string, fields: (keyof TdSettings)[]) {
    setSavingSection(section);
    setError(null);
    try {
      const patch: Record<string, string> = {};
      fields.forEach((f) => { patch[f as string] = settings[f]; });
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

  const SaveButton = ({ section, fields, label }: { section: string; fields: (keyof TdSettings)[]; label: string }) => (
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

  const charFields: (keyof TdSettings)[] = [
    "tdCharHeading",
    ...CHAR_ROWS.flatMap((n) => [`tdChar${n}Title`, `tdChar${n}Desc`, `tdChar${n}Icon`] as (keyof TdSettings)[]),
  ];

  return (
    <div className="space-y-8" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
      {/* Header */}
      <div>
        <p className="text-[10px] tracking-[0.3em] uppercase text-[#1a1a1a]/35 mb-1" style={fontMichroma}>
          Site Content
        </p>
        <h2 className="text-3xl font-light text-[#1a1a1a]" style={fontIvymode}>
          Technical Data
        </h2>
        <p className="mt-2 text-sm text-[#8b8b8b]">
          Edit the Technical Data page's text and images. Layout and animations stay fixed. The Duomo-style hero video, spill-care how-to steps, the inlined dimensions diagram, and the labeled thickness image aren't editable here.
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
          <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40" style={fontMichroma}>Heading</label>
          <input
            type="text"
            value={settings.tdHeading}
            onChange={(e) => set("tdHeading", e.target.value)}
            placeholder="ENGINEERED FOR PERFORMANCE"
            className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none"
          />
        </div>
        <div className="space-y-1.5">
          <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40" style={fontMichroma}>Description</label>
          <textarea
            value={settings.tdHeroDesc}
            onChange={(e) => set("tdHeroDesc", e.target.value)}
            rows={3}
            className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none resize-none"
          />
        </div>
        <SaveButton section="hero" label="Save Hero" fields={["tdHeading", "tdHeroDesc"]} />
      </div>

      {/* Characteristics */}
      <div className="bg-white border border-[#1a1a1a]/8 p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-[#1a1a1a]/8 pb-3">
          <p className="text-[9px] tracking-[0.3em] uppercase text-[#1a1a1a]/35" style={fontMichroma}>Characteristics</p>
          <SavedBadge section="char" />
        </div>
        <p className="text-[10px] text-[#8b8b8b] -mt-2">Fixed set of 9 items — content only, no add/remove/reorder.</p>

        <div className="space-y-1.5">
          <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40" style={fontMichroma}>Section Heading</label>
          <input
            type="text"
            value={settings.tdCharHeading}
            onChange={(e) => set("tdCharHeading", e.target.value)}
            placeholder="CHARACTERISTICS"
            className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none"
          />
        </div>

        {CHAR_ROWS.map((n) => {
          const titleKey = `tdChar${n}Title` as keyof TdSettings;
          const descKey = `tdChar${n}Desc` as keyof TdSettings;
          const iconKey = `tdChar${n}Icon` as keyof TdSettings;
          return (
            <div key={n} className="border-t border-[#1a1a1a]/8 pt-5 space-y-4">
              <p className="text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/30" style={fontMichroma}>Item {n}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40" style={fontMichroma}>Title</label>
                  <input
                    type="text"
                    value={settings[titleKey]}
                    onChange={(e) => set(titleKey, e.target.value)}
                    placeholder={CHAR_DEFAULTS[n].title}
                    className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none"
                  />
                </div>
                <ImageField label="Icon" value={settings[iconKey]} onChange={(v) => set(iconKey, v)} />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40" style={fontMichroma}>Description</label>
                <textarea
                  value={settings[descKey]}
                  onChange={(e) => set(descKey, e.target.value)}
                  placeholder={CHAR_DEFAULTS[n].desc}
                  rows={2}
                  className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none resize-none"
                />
              </div>
            </div>
          );
        })}

        <SaveButton section="char" label="Save Characteristics" fields={charFields} />
      </div>

      {/* User Guide */}
      <div className="bg-white border border-[#1a1a1a]/8 p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-[#1a1a1a]/8 pb-3">
          <p className="text-[9px] tracking-[0.3em] uppercase text-[#1a1a1a]/35" style={fontMichroma}>User Guide</p>
          <SavedBadge section="ug" />
        </div>
        <p className="text-[10px] text-[#8b8b8b] -mt-2">The Oil/Coffee/Wine spill care-instructions below aren't editable here.</p>

        <div className="space-y-1.5">
          <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40" style={fontMichroma}>Heading</label>
          <input
            type="text"
            value={settings.tdUgHeading}
            onChange={(e) => set("tdUgHeading", e.target.value)}
            placeholder="USER GUIDE"
            className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none"
          />
        </div>
        <div className="space-y-1.5">
          <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40" style={fontMichroma}>Paragraph 1</label>
          <textarea
            value={settings.tdUgDesc1}
            onChange={(e) => set("tdUgDesc1", e.target.value)}
            rows={2}
            className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none resize-none"
          />
        </div>
        <div className="space-y-1.5">
          <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40" style={fontMichroma}>Paragraph 2</label>
          <textarea
            value={settings.tdUgDesc2}
            onChange={(e) => set("tdUgDesc2", e.target.value)}
            rows={2}
            className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none resize-none"
          />
        </div>
        <SaveButton section="ug" label="Save Section" fields={["tdUgHeading", "tdUgDesc1", "tdUgDesc2"]} />
      </div>

      {/* Dimensions */}
      <div className="bg-white border border-[#1a1a1a]/8 p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-[#1a1a1a]/8 pb-3">
          <p className="text-[9px] tracking-[0.3em] uppercase text-[#1a1a1a]/35" style={fontMichroma}>Format & Dimensions</p>
          <SavedBadge section="dim" />
        </div>
        <p className="text-[10px] text-[#8b8b8b] -mt-2">The dimensions diagram is a fixed technical asset and isn't editable here.</p>

        <div className="space-y-1.5">
          <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40" style={fontMichroma}>Heading</label>
          <input
            type="text"
            value={settings.tdDimHeading}
            onChange={(e) => set("tdDimHeading", e.target.value)}
            placeholder="FORMAT & DIMENSIONS"
            className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none"
          />
        </div>
        <div className="space-y-1.5">
          <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40" style={fontMichroma}>Paragraph 1</label>
          <textarea value={settings.tdDimDesc1} onChange={(e) => set("tdDimDesc1", e.target.value)} rows={2} className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none resize-none" />
        </div>
        <div className="space-y-1.5">
          <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40" style={fontMichroma}>Paragraph 2</label>
          <textarea value={settings.tdDimDesc2} onChange={(e) => set("tdDimDesc2", e.target.value)} rows={2} className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none resize-none" />
        </div>
        <div className="space-y-1.5">
          <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40" style={fontMichroma}>Paragraph 3</label>
          <textarea value={settings.tdDimDesc3} onChange={(e) => set("tdDimDesc3", e.target.value)} rows={2} className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none resize-none" />
        </div>
        <SaveButton section="dim" label="Save Section" fields={["tdDimHeading", "tdDimDesc1", "tdDimDesc2", "tdDimDesc3"]} />
      </div>

      {/* Thicknesses */}
      <div className="bg-white border border-[#1a1a1a]/8 p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-[#1a1a1a]/8 pb-3">
          <p className="text-[9px] tracking-[0.3em] uppercase text-[#1a1a1a]/35" style={fontMichroma}>Thicknesses</p>
          <SavedBadge section="thick" />
        </div>
        <p className="text-[10px] text-[#8b8b8b] -mt-2">The labeled thickness diagram image is fixed (its text overlays are positioned to its exact geometry) and isn't editable here.</p>

        <div className="space-y-1.5">
          <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40" style={fontMichroma}>Heading</label>
          <input
            type="text"
            value={settings.tdThickHeading}
            onChange={(e) => set("tdThickHeading", e.target.value)}
            placeholder="THICKNESSES"
            className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none"
          />
        </div>
        <div className="space-y-1.5">
          <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40" style={fontMichroma}>Paragraph 1</label>
          <textarea value={settings.tdThickDesc1} onChange={(e) => set("tdThickDesc1", e.target.value)} rows={2} className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none resize-none" />
        </div>
        <div className="space-y-1.5">
          <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40" style={fontMichroma}>Paragraph 2</label>
          <textarea value={settings.tdThickDesc2} onChange={(e) => set("tdThickDesc2", e.target.value)} rows={2} className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none resize-none" />
        </div>
        <SaveButton section="thick" label="Save Section" fields={["tdThickHeading", "tdThickDesc1", "tdThickDesc2"]} />
      </div>

      {/* Technical Specs */}
      <div className="bg-white border border-[#1a1a1a]/8 p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-[#1a1a1a]/8 pb-3">
          <p className="text-[9px] tracking-[0.3em] uppercase text-[#1a1a1a]/35" style={fontMichroma}>Technical Specifications</p>
          <SavedBadge section="specs" />
        </div>
        <p className="text-[10px] text-[#8b8b8b] -mt-2">The Download Italian/English buttons open the site's standard datasheet-request form and aren't editable here.</p>

        <div className="space-y-1.5">
          <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40" style={fontMichroma}>Heading</label>
          <input
            type="text"
            value={settings.tdSpecsHeading}
            onChange={(e) => set("tdSpecsHeading", e.target.value)}
            placeholder="TECHNICAL SPECIFICATIONS FOR PROFESSIONALS"
            className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none"
          />
        </div>
        <SaveButton section="specs" label="Save Section" fields={["tdSpecsHeading"]} />
      </div>
    </div>
  );
}
