"use client";

import React, { useState, useEffect } from "react";
import { Check } from "lucide-react";
import { MediaPickerButton } from "../_components/MediaPicker";
import { StyleRow } from "../_components/StyleControls";
import { HEADING_SIZE_OPTIONS, PARAGRAPH_SIZE_OPTIONS } from "@/lib/textStyle";

const fontMichroma = { fontFamily: "var(--font-michroma), sans-serif" };
const fontIvymode = { fontFamily: "var(--font-ivymode), serif" };

const STYLE_SUFFIXES = ["Color", "Font", "Size"] as const;
const STYLED_FIELDS = [
  "miHeading",
  "miSec1Label",
  "miSec2Para1",
  "miSec2Para2",
  "miSec2ImageLabel",
  "miSec3Line1",
  "miSec3Line2",
  "miSec3RightImageLabel",
  "miSec3BottomPara",
  "miSec4Label",
] as const;
const HEADING_FIELDS = new Set(["miHeading"]);
// What each field's Color actually renders as when left at "Default" — the
// page's own hardcoded fallback color — shown in the dropdown as e.g.
// "White (Default)" instead of a bare "Default". The four image/video
// overlay captions default to white text; the rest default to grey.
const COLOR_DEFAULTS: Record<(typeof STYLED_FIELDS)[number], string> = {
  miHeading: "Grey",
  miSec1Label: "White",
  miSec2Para1: "Grey",
  miSec2Para2: "Grey",
  miSec2ImageLabel: "White",
  miSec3Line1: "Grey",
  miSec3Line2: "Grey",
  miSec3RightImageLabel: "White",
  miSec3BottomPara: "Grey",
  miSec4Label: "White",
};

interface MiSettings {
  miHeading: string;
  miHeadingColor: string;
  miHeadingFont: string;
  miHeadingSize: string;
  miSec1Video: string;
  miSec1Label: string;
  miSec1LabelColor: string;
  miSec1LabelFont: string;
  miSec1LabelSize: string;
  miSec2Para1: string;
  miSec2Para1Color: string;
  miSec2Para1Font: string;
  miSec2Para1Size: string;
  miSec2Para2: string;
  miSec2Para2Color: string;
  miSec2Para2Font: string;
  miSec2Para2Size: string;
  miSec2Image: string;
  miSec2ImageLabel: string;
  miSec2ImageLabelColor: string;
  miSec2ImageLabelFont: string;
  miSec2ImageLabelSize: string;
  miSec3Line1: string;
  miSec3Line1Color: string;
  miSec3Line1Font: string;
  miSec3Line1Size: string;
  miSec3Line2: string;
  miSec3Line2Color: string;
  miSec3Line2Font: string;
  miSec3Line2Size: string;
  miSec3LeftImage: string;
  miSec3RightImage: string;
  miSec3RightImageLabel: string;
  miSec3RightImageLabelColor: string;
  miSec3RightImageLabelFont: string;
  miSec3RightImageLabelSize: string;
  miSec3BottomPara: string;
  miSec3BottomParaColor: string;
  miSec3BottomParaFont: string;
  miSec3BottomParaSize: string;
  miSec4BgImage: string;
  miSec4BgImageMobile: string;
  miSec4TagImage: string;
  miSec4Label: string;
  miSec4LabelColor: string;
  miSec4LabelFont: string;
  miSec4LabelSize: string;
}

const EMPTY: MiSettings = {
  miHeading: "",
  miHeadingColor: "default",
  miHeadingFont: "default",
  miHeadingSize: "default",
  miSec1Video: "",
  miSec1Label: "",
  miSec1LabelColor: "default",
  miSec1LabelFont: "default",
  miSec1LabelSize: "default",
  miSec2Para1: "",
  miSec2Para1Color: "default",
  miSec2Para1Font: "default",
  miSec2Para1Size: "default",
  miSec2Para2: "",
  miSec2Para2Color: "default",
  miSec2Para2Font: "default",
  miSec2Para2Size: "default",
  miSec2Image: "",
  miSec2ImageLabel: "",
  miSec2ImageLabelColor: "default",
  miSec2ImageLabelFont: "default",
  miSec2ImageLabelSize: "default",
  miSec3Line1: "",
  miSec3Line1Color: "default",
  miSec3Line1Font: "default",
  miSec3Line1Size: "default",
  miSec3Line2: "",
  miSec3Line2Color: "default",
  miSec3Line2Font: "default",
  miSec3Line2Size: "default",
  miSec3LeftImage: "",
  miSec3RightImage: "",
  miSec3RightImageLabel: "",
  miSec3RightImageLabelColor: "default",
  miSec3RightImageLabelFont: "default",
  miSec3RightImageLabelSize: "default",
  miSec3BottomPara: "",
  miSec3BottomParaColor: "default",
  miSec3BottomParaFont: "default",
  miSec3BottomParaSize: "default",
  miSec4BgImage: "",
  miSec4BgImageMobile: "",
  miSec4TagImage: "",
  miSec4Label: "",
  miSec4LabelColor: "default",
  miSec4LabelFont: "default",
  miSec4LabelSize: "default",
};

// A <StyleRow> for one of the STYLED_FIELDS, using its own Color/Font/Size
// keys and the heading or paragraph size scale depending on the field.
function FieldStyleRow({
  field,
  settings,
  set,
}: {
  field: (typeof STYLED_FIELDS)[number];
  settings: MiSettings;
  set: <K extends keyof MiSettings>(key: K, value: string) => void;
}) {
  const colorKey = `${field}Color` as keyof MiSettings;
  const fontKey = `${field}Font` as keyof MiSettings;
  const sizeKey = `${field}Size` as keyof MiSettings;
  return (
    <StyleRow
      color={settings[colorKey]}
      onColorChange={(v) => set(colorKey, v)}
      font={settings[fontKey]}
      onFontChange={(v) => set(fontKey, v)}
      size={settings[sizeKey]}
      onSizeChange={(v) => set(sizeKey, v)}
      sizeOptions={HEADING_FIELDS.has(field) ? HEADING_SIZE_OPTIONS : PARAGRAPH_SIZE_OPTIONS}
      colorDefaultLabel={COLOR_DEFAULTS[field]}
      fontDefaultLabel="Ivymode"
    />
  );
}

function styleFields(field: (typeof STYLED_FIELDS)[number]): (keyof MiSettings)[] {
  return STYLE_SUFFIXES.map((s) => `${field}${s}` as keyof MiSettings);
}

// `defaultSrc` is the hardcoded fallback the public page actually renders
// when this field is empty — shown as a dimmed "(Default)" preview so an
// admin can see what's currently live, not just an empty box.
function ImageField({ label, value, onChange, defaultSrc }: { label: string; value: string; onChange: (url: string) => void; defaultSrc?: string }) {
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

function VideoField({ label, value, onChange, defaultSrc }: { label: string; value: string; onChange: (url: string) => void; defaultSrc?: string }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40" style={fontMichroma}>
        {label}
      </label>
      {value ? (
        <video src={value} controls muted className="w-full max-h-72 object-contain border border-[#1a1a1a]/10 bg-[#f0ede6]" />
      ) : defaultSrc ? (
        <div className="relative">
          <video src={defaultSrc} controls muted className="w-full max-h-72 object-contain border border-[#1a1a1a]/10 bg-[#f0ede6]" />
          <span className="absolute top-1.5 left-1.5 bg-[#1a1a1a]/70 text-white text-[8px] tracking-[0.15em] uppercase px-1.5 py-0.5 pointer-events-none">Currently Live (Default)</span>
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
        <MediaPickerButton folder="made-in-italy" accept="video/*" onSelect={onChange} />
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
          const next: MiSettings = {
            ...EMPTY,
            miHeading: s.miHeading || "",
            miSec1Video: s.miSec1Video || "",
            miSec1Label: s.miSec1Label || "",
            miSec2Para1: s.miSec2Para1 || "",
            miSec2Para2: s.miSec2Para2 || "",
            miSec2Image: s.miSec2Image || "",
            miSec2ImageLabel: s.miSec2ImageLabel || "",
            miSec3Line1: s.miSec3Line1 || "",
            miSec3Line2: s.miSec3Line2 || "",
            miSec3LeftImage: s.miSec3LeftImage || "",
            miSec3RightImage: s.miSec3RightImage || "",
            miSec3RightImageLabel: s.miSec3RightImageLabel || "",
            miSec3BottomPara: s.miSec3BottomPara || "",
            miSec4BgImage: s.miSec4BgImage || "",
            miSec4BgImageMobile: s.miSec4BgImageMobile || "",
            miSec4TagImage: s.miSec4TagImage || "",
            miSec4Label: s.miSec4Label || "",
          };
          STYLED_FIELDS.forEach((field) => {
            STYLE_SUFFIXES.forEach((suffix) => {
              const key = `${field}${suffix}` as keyof MiSettings;
              (next as any)[key] = s[key] || "default";
            });
          });
          setSettings(next);
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
        <VideoField label="Background Video" value={settings.miSec1Video} onChange={(v) => set("miSec1Video", v)} defaultSrc="/images/made-in-italy/duomo 2.mp4" />

        <div className="space-y-1.5">
          <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40" style={fontMichroma}>Heading</label>
          <input
            type="text"
            value={settings.miHeading}
            onChange={(e) => set("miHeading", e.target.value)}
            placeholder="MADE IN ITALY"
            className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none"
          />
          <FieldStyleRow field="miHeading" settings={settings} set={set} />
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
          <FieldStyleRow field="miSec1Label" settings={settings} set={set} />
        </div>

        <SaveButton section="sec1" label="Save Section" fields={["miSec1Video", "miHeading", "miSec1Label", ...styleFields("miHeading"), ...styleFields("miSec1Label")]} />
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
            placeholder="In the heart of Italy, where rolling hills meet centuries of craftsmanship, lies Modena, a region shaped by the relentless pursuit of excellence. Home to Ferrari, Acetaia Giusti, and Brioni, Modena has long been a place where mastery is refined through patience, precision, and dedication to craft."
            className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none resize-none"
          />
          <FieldStyleRow field="miSec2Para1" settings={settings} set={set} />
        </div>
        <div className="space-y-1.5">
          <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40" style={fontMichroma}>Paragraph 2</label>
          <textarea
            value={settings.miSec2Para2}
            onChange={(e) => set("miSec2Para2", e.target.value)}
            rows={3}
            placeholder={'The same spirit defines its porcelain industry. Here, innovation and heritage exist side by side, transforming raw materials into surfaces of "exceptional quality and enduring beauty."'}
            className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none resize-none"
          />
          <p className="text-[9px] text-[#8b8b8b]">Wrap a phrase in "double quotes" to highlight it in brand teal, e.g. "exceptional quality and enduring beauty."</p>
          <FieldStyleRow field="miSec2Para2" settings={settings} set={set} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <ImageField label="Image" value={settings.miSec2Image} onChange={(v) => set("miSec2Image", v)} defaultSrc="/images/made-in-italy/Palazzo_della_civiltà_del_lavoro_(EUR,_Rome)_(5904657870).jpg" />
          <div className="space-y-1.5">
            <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40" style={fontMichroma}>Image Caption</label>
            <input
              type="text"
              value={settings.miSec2ImageLabel}
              onChange={(e) => set("miSec2ImageLabel", e.target.value)}
              placeholder="PALAZZO DELLA CIVILTÀ ITALIANA"
              className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none"
            />
            <FieldStyleRow field="miSec2ImageLabel" settings={settings} set={set} />
          </div>
        </div>

        <SaveButton section="sec2" label="Save Section" fields={["miSec2Para1", "miSec2Para2", "miSec2Image", "miSec2ImageLabel", ...styleFields("miSec2Para1"), ...styleFields("miSec2Para2"), ...styleFields("miSec2ImageLabel")]} />
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
            placeholder="Every NOBILITA slab is born from this tradition, crafted with Italian expertise, engineered for performance, and designed to stand the test of time."
            className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none resize-none"
          />
          <FieldStyleRow field="miSec3Line1" settings={settings} set={set} />
        </div>
        <div className="space-y-1.5">
          <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40" style={fontMichroma}>Top Text — Line 2</label>
          <textarea
            value={settings.miSec3Line2}
            onChange={(e) => set("miSec3Line2", e.target.value)}
            rows={2}
            placeholder={'More than a surface, it is a "legacy of craftsmanship made for generations to come."'}
            className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none resize-none"
          />
          <p className="text-[9px] text-[#8b8b8b]">Wrap a phrase in "double quotes" to highlight it in brand teal, e.g. "legacy of craftsmanship made for generations to come."</p>
          <FieldStyleRow field="miSec3Line2" settings={settings} set={set} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <ImageField label="Left Image (Factory)" value={settings.miSec3LeftImage} onChange={(v) => set("miSec3LeftImage", v)} defaultSrc="/images/made-in-italy/factory-image.jpeg" />
          <ImageField label="Right Image (Processing Unit)" value={settings.miSec3RightImage} onChange={(v) => set("miSec3RightImage", v)} defaultSrc="/images/made-in-italy/continua-impianto-hd-2.jpg" />
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
          <FieldStyleRow field="miSec3RightImageLabel" settings={settings} set={set} />
        </div>
        <div className="space-y-1.5">
          <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40" style={fontMichroma}>Bottom Paragraph</label>
          <textarea
            value={settings.miSec3BottomPara}
            onChange={(e) => set("miSec3BottomPara", e.target.value)}
            rows={3}
            placeholder="NOBILITA works at the forefront of large-format surface innovation, with state-of-the-art production systems capable of creating ultra-large slabs in exceptional formats and multiple thicknesses. These advancements have redefined what is possible in contemporary architecture, enabling seamless surfaces, reduced visual fragmentation, and a more monolithic architectural language."
            className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none resize-none"
          />
          <FieldStyleRow field="miSec3BottomPara" settings={settings} set={set} />
        </div>

        <SaveButton
          section="sec3"
          label="Save Section"
          fields={[
            "miSec3Line1", "miSec3Line2", "miSec3LeftImage", "miSec3RightImage", "miSec3RightImageLabel", "miSec3BottomPara",
            ...styleFields("miSec3Line1"), ...styleFields("miSec3Line2"), ...styleFields("miSec3RightImageLabel"), ...styleFields("miSec3BottomPara"),
          ]}
        />
      </div>

      {/* Section 4: Colosseum */}
      <div className="bg-white border border-[#1a1a1a]/8 p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-[#1a1a1a]/8 pb-3">
          <p className="text-[9px] tracking-[0.3em] uppercase text-[#1a1a1a]/35" style={fontMichroma}>Colosseum Reveal</p>
          <SavedBadge section="sec4" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <ImageField label="Background Image (Desktop)" value={settings.miSec4BgImage} onChange={(v) => set("miSec4BgImage", v)} defaultSrc="/images/made-in-italy/colosseo-2020-compressed.jpg" />
          <ImageField label="Background Image (Mobile)" value={settings.miSec4BgImageMobile} onChange={(v) => set("miSec4BgImageMobile", v)} defaultSrc="/images/made-in-italy/colosseo-mobile.jpg" />
        </div>
        <ImageField label="Tagline Graphic (Il Gres Imperiale d'Italia)" value={settings.miSec4TagImage} onChange={(v) => set("miSec4TagImage", v)} defaultSrc="/images/Links/tag grey.png" />
        <div className="space-y-1.5">
          <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40" style={fontMichroma}>Caption</label>
          <input
            type="text"
            value={settings.miSec4Label}
            onChange={(e) => set("miSec4Label", e.target.value)}
            placeholder="COLOSSEUM"
            className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none"
          />
          <FieldStyleRow field="miSec4Label" settings={settings} set={set} />
        </div>

        <SaveButton section="sec4" label="Save Section" fields={["miSec4BgImage", "miSec4BgImageMobile", "miSec4TagImage", "miSec4Label", ...styleFields("miSec4Label")]} />
      </div>
    </div>
  );
}
