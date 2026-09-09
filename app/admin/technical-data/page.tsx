"use client";

import React, { useState, useEffect, useRef } from "react";
import { Check, Plus, X, GripVertical, Upload, FileText, ExternalLink } from "lucide-react";
import { MediaPickerButton } from "../_components/MediaPicker";
import { StyleRow } from "../_components/StyleControls";
import { HEADING_SIZE_OPTIONS, PARAGRAPH_SIZE_OPTIONS } from "@/lib/textStyle";

interface Certification {
  id: string;
  order: number;
  title: string;
  subtitle: string | null;
  description: string | null;
  descriptionColor: string | null;
  descriptionFont: string | null;
  descriptionSize: string | null;
  logoImage: string | null;
  showDownload: boolean;
  certFile: string | null;
}

const fontMichroma = { fontFamily: "var(--font-michroma), sans-serif" };
const fontIvymode = { fontFamily: "var(--font-ivymode), serif" };

const STYLE_SUFFIXES = ["Color", "Font", "Size"] as const;
const STYLED_FIELDS = [
  "tdHeading",
  "tdHeroDesc",
  "tdCharHeading",
  "tdUgHeading",
  "tdUgDesc1",
  "tdUgDesc2",
  "tdDimHeading",
  "tdDimDesc1",
  "tdDimDesc2",
  "tdDimDesc3",
  "tdThickHeading",
  "tdThickDesc1",
  "tdThickDesc2",
  "tdSpecsHeading",
  "tdCertHeading",
] as const;
const HEADING_FIELDS = new Set([
  "tdHeading",
  "tdCharHeading",
  "tdUgHeading",
  "tdDimHeading",
  "tdThickHeading",
  "tdSpecsHeading",
  "tdCertHeading",
]);
// What each field's Color actually renders as when left at "Default" — the
// page's own hardcoded fallback color — shown in the dropdown as e.g.
// "White (Default)" instead of a bare "Default".
const COLOR_DEFAULTS: Record<(typeof STYLED_FIELDS)[number], string> = {
  tdHeading: "Black",
  tdHeroDesc: "Black",
  tdCharHeading: "White",
  tdUgHeading: "White",
  tdUgDesc1: "White",
  tdUgDesc2: "White",
  tdDimHeading: "White",
  tdDimDesc1: "White",
  tdDimDesc2: "White",
  tdDimDesc3: "White",
  tdThickHeading: "White",
  tdThickDesc1: "White",
  tdThickDesc2: "White",
  tdSpecsHeading: "Teal",
  tdCertHeading: "Teal",
};

interface TdSettings {
  tdHeading: string;
  tdHeadingColor: string;
  tdHeadingFont: string;
  tdHeadingSize: string;
  tdHeroVideo: string;
  tdHeroDesc: string;
  tdHeroDescColor: string;
  tdHeroDescFont: string;
  tdHeroDescSize: string;
  tdCharHeading: string;
  tdCharHeadingColor: string;
  tdCharHeadingFont: string;
  tdCharHeadingSize: string;
  [key: `tdChar${number}Title`]: string;
  [key: `tdChar${number}Desc`]: string;
  [key: `tdChar${number}Icon`]: string;
  tdUgHeading: string;
  tdUgHeadingColor: string;
  tdUgHeadingFont: string;
  tdUgHeadingSize: string;
  tdUgDesc1: string;
  tdUgDesc1Color: string;
  tdUgDesc1Font: string;
  tdUgDesc1Size: string;
  tdUgDesc2: string;
  tdUgDesc2Color: string;
  tdUgDesc2Font: string;
  tdUgDesc2Size: string;
  tdOilHeading: string;
  tdOilStep1: string;
  tdOilStep2: string;
  tdOilStep3: string;
  tdOilStep4: string;
  tdCoffeeHeading: string;
  tdCoffeeStep1: string;
  tdCoffeeStep2: string;
  tdCoffeeStep3: string;
  tdCoffeeStep4: string;
  tdCoffeeStep5: string;
  tdWineHeading: string;
  tdWineStep1: string;
  tdWineStep2: string;
  tdWineStep3: string;
  tdWineStep4: string;
  tdWineSubnoteHeading: string;
  tdWineSubnoteStep1: string;
  tdWineSubnoteStep2: string;
  tdDimHeading: string;
  tdDimHeadingColor: string;
  tdDimHeadingFont: string;
  tdDimHeadingSize: string;
  tdDimDesc1: string;
  tdDimDesc1Color: string;
  tdDimDesc1Font: string;
  tdDimDesc1Size: string;
  tdDimDesc2: string;
  tdDimDesc2Color: string;
  tdDimDesc2Font: string;
  tdDimDesc2Size: string;
  tdDimDesc3: string;
  tdDimDesc3Color: string;
  tdDimDesc3Font: string;
  tdDimDesc3Size: string;
  tdThickHeading: string;
  tdThickHeadingColor: string;
  tdThickHeadingFont: string;
  tdThickHeadingSize: string;
  tdThickDesc1: string;
  tdThickDesc1Color: string;
  tdThickDesc1Font: string;
  tdThickDesc1Size: string;
  tdThickDesc2: string;
  tdThickDesc2Color: string;
  tdThickDesc2Font: string;
  tdThickDesc2Size: string;
  tdSpecsHeading: string;
  tdSpecsHeadingColor: string;
  tdSpecsHeadingFont: string;
  tdSpecsHeadingSize: string;
  tdCertHeading: string;
  tdCertHeadingColor: string;
  tdCertHeadingFont: string;
  tdCertHeadingSize: string;
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
    tdHeading: "", tdHeroVideo: "", tdHeroDesc: "", tdCharHeading: "",
    tdUgHeading: "", tdUgDesc1: "", tdUgDesc2: "",
    tdOilHeading: "", tdOilStep1: "", tdOilStep2: "", tdOilStep3: "", tdOilStep4: "",
    tdCoffeeHeading: "", tdCoffeeStep1: "", tdCoffeeStep2: "", tdCoffeeStep3: "", tdCoffeeStep4: "", tdCoffeeStep5: "",
    tdWineHeading: "", tdWineStep1: "", tdWineStep2: "", tdWineStep3: "", tdWineStep4: "",
    tdWineSubnoteHeading: "", tdWineSubnoteStep1: "", tdWineSubnoteStep2: "",
    tdDimHeading: "", tdDimDesc1: "", tdDimDesc2: "", tdDimDesc3: "",
    tdThickHeading: "", tdThickDesc1: "", tdThickDesc2: "",
    tdSpecsHeading: "",
    tdCertHeading: "",
  };
  CHAR_ROWS.forEach((n) => {
    base[`tdChar${n}Title`] = "";
    base[`tdChar${n}Desc`] = "";
    base[`tdChar${n}Icon`] = "";
  });
  STYLED_FIELDS.forEach((field) => {
    STYLE_SUFFIXES.forEach((suffix) => {
      base[`${field}${suffix}`] = "default";
    });
  });
  return base as TdSettings;
}

function FieldStyleRow({
  field,
  settings,
  set,
}: {
  field: (typeof STYLED_FIELDS)[number];
  settings: TdSettings;
  set: <K extends keyof TdSettings>(key: K, value: string) => void;
}) {
  const colorKey = `${field}Color` as keyof TdSettings;
  const fontKey = `${field}Font` as keyof TdSettings;
  const sizeKey = `${field}Size` as keyof TdSettings;
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

function styleFields(field: (typeof STYLED_FIELDS)[number]): (keyof TdSettings)[] {
  return STYLE_SUFFIXES.map((s) => `${field}${s}` as keyof TdSettings);
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
        <img src={value} alt="" className="h-28 w-28 object-contain border border-[#1a1a1a]/10 bg-[#007190] p-3" />
      ) : defaultSrc ? (
        <div className="relative h-28 w-28">
          <img src={defaultSrc} alt="" className="h-28 w-28 object-contain border border-[#1a1a1a]/10 bg-[#007190] p-3" />
          <span className="absolute top-0.5 left-0.5 bg-[#1a1a1a]/70 text-white text-[7px] tracking-[0.1em] uppercase px-1 py-0.5">Default</span>
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
        <MediaPickerButton folder="technical-data" accept="video/*" onSelect={onChange} />
      </div>
    </div>
  );
}

// One spill-care subsection (Oil / Coffee / Wine, or the wine subnote): a
// heading plus a fixed, numbered list of step textareas.
function SpillSubsection({
  title,
  headingField,
  headingPlaceholder,
  steps,
  settings,
  set,
}: {
  title: string;
  headingField: keyof TdSettings;
  headingPlaceholder: string;
  steps: { field: keyof TdSettings; placeholder: string }[];
  settings: TdSettings;
  set: <K extends keyof TdSettings>(key: K, value: string) => void;
}) {
  return (
    <div className="border-t border-[#1a1a1a]/8 pt-5 space-y-4">
      <p className="text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/30" style={fontMichroma}>{title}</p>
      <div className="space-y-1.5">
        <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40" style={fontMichroma}>Heading</label>
        <input
          type="text"
          value={settings[headingField]}
          onChange={(e) => set(headingField, e.target.value)}
          placeholder={headingPlaceholder}
          className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none"
        />
      </div>
      {steps.map((s, i) => (
        <div key={s.field} className="space-y-1.5">
          <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40" style={fontMichroma}>Step {i + 1}</label>
          <textarea
            value={settings[s.field]}
            onChange={(e) => set(s.field, e.target.value)}
            placeholder={s.placeholder}
            rows={2}
            className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none resize-none"
          />
        </div>
      ))}
    </div>
  );
}

// Upload/replace/preview a certification's PDF file. Reuses the same
// generic media-upload endpoint as images, scoped to a "certifications"
// folder and a PDF-only file picker.
function CertFileField({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "certifications");
      const res = await fetch("/api/media", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed.");
      onChange(data.data.fileUrl);
    } catch {
      // Surfaced via the parent's shared error banner isn't wired here to
      // keep this a drop-in field; a failed upload just leaves the value
      // unchanged, which is visible enough in this compact row context.
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-1.5">
      <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40" style={fontMichroma}>
        Certificate PDF
      </label>
      {value && (
        <div className="flex items-center gap-2 border border-[#1a1a1a]/10 bg-white px-2 py-1.5">
          <FileText size={12} className="text-[#1a1a1a]/40 flex-shrink-0" />
          <span className="flex-1 truncate text-[10px] font-mono text-[#1a1a1a]/70">{value}</span>
          <a href={value} target="_blank" rel="noopener noreferrer" className="text-[#1a1a1a]/40 hover:text-[#007190] transition-colors flex-shrink-0">
            <ExternalLink size={12} />
          </a>
        </div>
      )}
      <label
        className={`flex items-center justify-center gap-1.5 w-full border border-[#1a1a1a]/15 bg-white px-2 py-1.5 text-[10px] text-[#1a1a1a]/60 hover:text-[#1a1a1a] hover:border-[#1a1a1a]/40 transition-colors cursor-pointer ${uploading ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <Upload size={11} />
        {uploading ? "Uploading…" : value ? "Replace PDF" : "Upload PDF"}
        <input ref={fileInputRef} type="file" accept="application/pdf,.pdf" className="hidden" disabled={uploading} onChange={handleFile} />
      </label>
      <p className="text-[9px] text-[#8b8b8b]">Optional — without one, "Download Certificate" opens the standard datasheet-request form instead.</p>
    </div>
  );
}

export default function TechnicalDataAdminPage() {
  const [settings, setSettings] = useState<TdSettings>(emptySettings());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingSection, setSavingSection] = useState<string | null>(null);
  const [savedSection, setSavedSection] = useState<string | null>(null);

  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [draggedCertIdx, setDraggedCertIdx] = useState<number | null>(null);
  const [dragOverCertIdx, setDragOverCertIdx] = useState<number | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/settings").then((r) => r.json()),
      fetch("/api/certifications").then((r) => r.json()),
    ])
      .then(([settingsRes, certsRes]) => {
        if (settingsRes?.data) {
          const s = settingsRes.data;
          const next = emptySettings();
          const styleKeys = new Set(
            STYLED_FIELDS.flatMap((field) => STYLE_SUFFIXES.map((suffix) => `${field}${suffix}`))
          );
          (Object.keys(next) as (keyof TdSettings)[]).forEach((k) => {
            (next as any)[k] = s[k] || (styleKeys.has(k) ? "default" : "");
          });
          setSettings(next);
        }
        if (certsRes?.data) setCertifications(certsRes.data);
      })
      .catch((err) => setError(err.message || "Failed to load."))
      .finally(() => setLoading(false));
  }, []);

  async function handleAddCertification() {
    setError(null);
    try {
      const res = await fetch("/api/certifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "NEW CERTIFICATION", subtitle: "", description: "" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add certification.");
      setCertifications((prev) => [...prev, data.data]);
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function updateCertification(id: string, patch: Partial<Certification>) {
    setCertifications((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
    try {
      await fetch(`/api/certifications/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
    } catch {
      setError("Failed to save certification changes.");
    }
  }

  async function handleDeleteCertification(id: string) {
    if (!confirm("Delete this certification? This cannot be undone.")) return;
    setError(null);
    try {
      const res = await fetch(`/api/certifications/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete.");
      setCertifications((prev) => prev.filter((c) => c.id !== id));
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function moveCertification(from: number, to: number) {
    if (from === to) return;
    const reordered = [...certifications];
    const [moved] = reordered.splice(from, 1);
    reordered.splice(to, 0, moved);
    setCertifications(reordered);

    setError(null);
    try {
      await Promise.all(
        reordered.map((cert, i) =>
          cert.order === i
            ? Promise.resolve()
            : fetch(`/api/certifications/${cert.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ order: i }),
              })
        )
      );
      setCertifications((prev) => prev.map((c, i) => ({ ...c, order: i })));
    } catch {
      setError("Failed to save the new certification order.");
    }
  }

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
    ...styleFields("tdCharHeading"),
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
          Edit the Technical Data page's text, images, and video. Layout and animations stay fixed. The inlined dimensions diagram and the labeled thickness image aren't editable here.
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
          <FieldStyleRow field="tdHeading" settings={settings} set={set} />
        </div>
        <div className="space-y-1.5">
          <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40" style={fontMichroma}>Description</label>
          <textarea
            value={settings.tdHeroDesc}
            onChange={(e) => set("tdHeroDesc", e.target.value)}
            rows={3}
            placeholder="Every NOBILITA surface is engineered for exceptional performance from specification to installation. Designed by architects and engineers, it combines technical precision with refined aesthetics, ensuring premium quality, consistency and reliability. NOBILITA offers outstanding durability, dimensional stability, stain resistance, and long-term performance."
            className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none resize-none"
          />
          <FieldStyleRow field="tdHeroDesc" settings={settings} set={set} />
        </div>
        <VideoField label="Background Video" value={settings.tdHeroVideo} onChange={(v) => set("tdHeroVideo", v)} defaultSrc="/images/technical data/engineered for perfomace.mp4" />
        <SaveButton section="hero" label="Save Hero" fields={["tdHeading", "tdHeroVideo", "tdHeroDesc", ...styleFields("tdHeading"), ...styleFields("tdHeroDesc")]} />
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
          <FieldStyleRow field="tdCharHeading" settings={settings} set={set} />
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
                <ImageField label="Icon" value={settings[iconKey]} onChange={(v) => set(iconKey, v)} defaultSrc={CHAR_DEFAULTS[n].icon} />
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
        <div className="space-y-1.5">
          <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40" style={fontMichroma}>Heading</label>
          <input
            type="text"
            value={settings.tdUgHeading}
            onChange={(e) => set("tdUgHeading", e.target.value)}
            placeholder="USER GUIDE"
            className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none"
          />
          <FieldStyleRow field="tdUgHeading" settings={settings} set={set} />
        </div>
        <div className="space-y-1.5">
          <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40" style={fontMichroma}>Paragraph 1</label>
          <textarea
            value={settings.tdUgDesc1}
            onChange={(e) => set("tdUgDesc1", e.target.value)}
            rows={2}
            placeholder="The lasting beauty and performance of a surface depend on proper care and maintenance. To help you preserve the exceptional qualities of NOBILITA porcelain surfaces, we have created a collection of maintenance guidelines."
            className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none resize-none"
          />
          <FieldStyleRow field="tdUgDesc1" settings={settings} set={set} />
        </div>
        <div className="space-y-1.5">
          <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40" style={fontMichroma}>Paragraph 2</label>
          <textarea
            value={settings.tdUgDesc2}
            onChange={(e) => set("tdUgDesc2", e.target.value)}
            rows={2}
            placeholder="Explore our easy-to-follow care instructions and cleaning recommendations. Whether for residential or commercial applications, these guidelines ensure your NOBILITA surfaces continue to perform and look their best for generations to come."
            className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none resize-none"
          />
          <FieldStyleRow field="tdUgDesc2" settings={settings} set={set} />
        </div>
        <SaveButton
          section="ug"
          label="Save Section"
          fields={["tdUgHeading", "tdUgDesc1", "tdUgDesc2", ...styleFields("tdUgHeading"), ...styleFields("tdUgDesc1"), ...styleFields("tdUgDesc2")]}
        />
      </div>

      {/* Spill Care */}
      <div className="bg-white border border-[#1a1a1a]/8 p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-[#1a1a1a]/8 pb-3">
          <p className="text-[9px] tracking-[0.3em] uppercase text-[#1a1a1a]/35" style={fontMichroma}>Spill Care</p>
          <SavedBadge section="spill" />
        </div>

        <SpillSubsection
          title="Oil Spills"
          headingField="tdOilHeading"
          headingPlaceholder="OIL SPILLS"
          settings={settings}
          set={set}
          steps={[
            { field: "tdOilStep1", placeholder: "Apply the cleaning product and leave for 5 minutes." },
            { field: "tdOilStep2", placeholder: "Rub with a scouring pad (use a magic sponge for Polished and Honed finishes)." },
            { field: "tdOilStep3", placeholder: "If the stain remains, reapply the product and leave for up to 5 more minutes (do not exceed five minutes on Polished finishes)." },
            { field: "tdOilStep4", placeholder: "Rub again using a scouring pad and wipe with a damp cloth and dry thoroughly." },
          ]}
        />

        <SpillSubsection
          title="Coffee Spills"
          headingField="tdCoffeeHeading"
          headingPlaceholder="COFFEE SPILLS"
          settings={settings}
          set={set}
          steps={[
            { field: "tdCoffeeStep1", placeholder: "Remove any excess liquid immediately." },
            { field: "tdCoffeeStep2", placeholder: "Apply a suitable cleaning product and leave for 3–5 minutes." },
            { field: "tdCoffeeStep3", placeholder: "Rub with a non-abrasive scouring pad (use a magic sponge for Polished and Honed finishes)." },
            { field: "tdCoffeeStep4", placeholder: "Wipe with a damp cloth to remove any residue." },
            { field: "tdCoffeeStep5", placeholder: "Dry thoroughly with a clean, soft cloth or paper towel." },
          ]}
        />

        <SpillSubsection
          title="Wine Spills"
          headingField="tdWineHeading"
          headingPlaceholder="WINE SPILLS"
          settings={settings}
          set={set}
          steps={[
            { field: "tdWineStep1", placeholder: "Rinse the affected area with warm water." },
            { field: "tdWineStep2", placeholder: "Apply a pH-neutral cleaner and allow it to act for a few minutes." },
            { field: "tdWineStep3", placeholder: "Gently clean the surface using a soft sponge or non-abrasive pad." },
            { field: "tdWineStep4", placeholder: "Wipe away any residue with a damp cloth and dry the surface completely." },
          ]}
        />

        <SpillSubsection
          title="Wine Spills — Subnote"
          headingField="tdWineSubnoteHeading"
          headingPlaceholder="For dried or stubborn stains:"
          settings={settings}
          set={set}
          steps={[
            { field: "tdWineSubnoteStep1", placeholder: "Reapply the cleaner and leave for up to 5 minutes." },
            { field: "tdWineSubnoteStep2", placeholder: "Gently rub the area and rinse thoroughly before drying." },
          ]}
        />

        <SaveButton
          section="spill"
          label="Save Section"
          fields={[
            "tdOilHeading", "tdOilStep1", "tdOilStep2", "tdOilStep3", "tdOilStep4",
            "tdCoffeeHeading", "tdCoffeeStep1", "tdCoffeeStep2", "tdCoffeeStep3", "tdCoffeeStep4", "tdCoffeeStep5",
            "tdWineHeading", "tdWineStep1", "tdWineStep2", "tdWineStep3", "tdWineStep4",
            "tdWineSubnoteHeading", "tdWineSubnoteStep1", "tdWineSubnoteStep2",
          ]}
        />
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
          <FieldStyleRow field="tdDimHeading" settings={settings} set={set} />
        </div>
        <div className="space-y-1.5">
          <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40" style={fontMichroma}>Paragraph 1</label>
          <textarea value={settings.tdDimDesc1} onChange={(e) => set("tdDimDesc1", e.target.value)} rows={2} placeholder="NOBILITA offers large-format porcelain slabs in rectified and non-rectified formats to suit different applications." className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none resize-none" />
          <FieldStyleRow field="tdDimDesc1" settings={settings} set={set} />
        </div>
        <div className="space-y-1.5">
          <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40" style={fontMichroma}>Paragraph 2</label>
          <textarea value={settings.tdDimDesc2} onChange={(e) => set("tdDimDesc2", e.target.value)} rows={2} placeholder="RECTIFIED SLABS are precisely trimmed for seamless installation, making them the preferred choice for tiling applications such as flooring, walls, and facades." className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none resize-none" />
          <FieldStyleRow field="tdDimDesc2" settings={settings} set={set} />
        </div>
        <div className="space-y-1.5">
          <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40" style={fontMichroma}>Paragraph 3</label>
          <textarea value={settings.tdDimDesc3} onChange={(e) => set("tdDimDesc3", e.target.value)} rows={2} placeholder="NON-RECTIFIED SLABS (Gross) are ideal when custom cutting is required, making them perfect for counter tops, mill work, and furniture." className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none resize-none" />
          <FieldStyleRow field="tdDimDesc3" settings={settings} set={set} />
        </div>
        <SaveButton
          section="dim"
          label="Save Section"
          fields={[
            "tdDimHeading", "tdDimDesc1", "tdDimDesc2", "tdDimDesc3",
            ...styleFields("tdDimHeading"), ...styleFields("tdDimDesc1"), ...styleFields("tdDimDesc2"), ...styleFields("tdDimDesc3"),
          ]}
        />
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
          <FieldStyleRow field="tdThickHeading" settings={settings} set={set} />
        </div>
        <div className="space-y-1.5">
          <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40" style={fontMichroma}>Paragraph 1</label>
          <textarea value={settings.tdThickDesc1} onChange={(e) => set("tdThickDesc1", e.target.value)} rows={2} placeholder="6.5 MM – Lightweight and versatile, 6.5 MM porcelain is ideal for wall cladding, furniture applications and other interior surfaces where reduced weight is preferred." className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none resize-none" />
          <FieldStyleRow field="tdThickDesc1" settings={settings} set={set} />
        </div>
        <div className="space-y-1.5">
          <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40" style={fontMichroma}>Paragraph 2</label>
          <textarea value={settings.tdThickDesc2} onChange={(e) => set("tdThickDesc2", e.target.value)} rows={2} placeholder="12 MM – A robust and durable option, 12 MM porcelain is well suited for flooring, countertops, kitchen worktops and other high-use applications." className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none resize-none" />
          <FieldStyleRow field="tdThickDesc2" settings={settings} set={set} />
        </div>
        <SaveButton
          section="thick"
          label="Save Section"
          fields={["tdThickHeading", "tdThickDesc1", "tdThickDesc2", ...styleFields("tdThickHeading"), ...styleFields("tdThickDesc1"), ...styleFields("tdThickDesc2")]}
        />
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
          <FieldStyleRow field="tdSpecsHeading" settings={settings} set={set} />
        </div>
        <SaveButton section="specs" label="Save Section" fields={["tdSpecsHeading", ...styleFields("tdSpecsHeading")]} />
      </div>

      {/* Certifications */}
      <div className="bg-white border border-[#1a1a1a]/8 p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-[#1a1a1a]/8 pb-3">
          <p className="text-[9px] tracking-[0.3em] uppercase text-[#1a1a1a]/35" style={fontMichroma}>Certifications</p>
          <SavedBadge section="cert-heading" />
        </div>

        <div className="space-y-1.5">
          <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40" style={fontMichroma}>Section Heading</label>
          <input
            type="text"
            value={settings.tdCertHeading}
            onChange={(e) => set("tdCertHeading", e.target.value)}
            placeholder="CERTIFICATIONS"
            className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none"
          />
          <FieldStyleRow field="tdCertHeading" settings={settings} set={set} />
        </div>
        <SaveButton section="cert-heading" label="Save Heading" fields={["tdCertHeading", ...styleFields("tdCertHeading")]} />

        <div className="border-t border-[#1a1a1a]/8 pt-5 space-y-4">
          <p className="text-[10px] text-[#8b8b8b]">
            Drag the grip handle to reorder. Each field saves automatically as you edit it.
          </p>

          {certifications.map((cert, idx) => (
            <div
              key={cert.id}
              onDragOver={(e) => {
                e.preventDefault();
                if (draggedCertIdx !== null) setDragOverCertIdx(idx);
              }}
              onDragLeave={() => setDragOverCertIdx((cur) => (cur === idx ? null : cur))}
              onDrop={(e) => {
                e.preventDefault();
                if (draggedCertIdx !== null) moveCertification(draggedCertIdx, idx);
                setDraggedCertIdx(null);
                setDragOverCertIdx(null);
              }}
              className={`flex gap-3 items-start bg-[#f8f5f0] border p-3 transition-colors ${
                draggedCertIdx === idx
                  ? "opacity-40 border-[#1a1a1a]/10"
                  : dragOverCertIdx === idx
                    ? "border-[#007190]"
                    : "border-[#1a1a1a]/10"
              }`}
            >
              <div
                draggable
                onDragStart={() => setDraggedCertIdx(idx)}
                onDragEnd={() => {
                  setDraggedCertIdx(null);
                  setDragOverCertIdx(null);
                }}
                className="flex-shrink-0 self-stretch flex items-center text-[#1a1a1a]/25 hover:text-[#1a1a1a]/60 cursor-grab active:cursor-grabbing transition-colors"
                title="Drag to reorder"
              >
                <GripVertical size={15} />
              </div>

              <div className="flex-1 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[8px] text-[#8b8b8b] uppercase">Title</label>
                    <input
                      type="text"
                      value={cert.title}
                      onChange={(e) => updateCertification(cert.id, { title: e.target.value })}
                      className="w-full border border-[#1a1a1a]/10 bg-white px-2 py-1 text-xs outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[8px] text-[#8b8b8b] uppercase">Subtitle</label>
                    <input
                      type="text"
                      value={cert.subtitle || ""}
                      onChange={(e) => updateCertification(cert.id, { subtitle: e.target.value })}
                      placeholder="e.g. CERTIFIED ITALIAN CERAMIC PRODUCTION"
                      className="w-full border border-[#1a1a1a]/10 bg-white px-2 py-1 text-xs outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[8px] text-[#8b8b8b] uppercase">Description</label>
                  <textarea
                    value={cert.description || ""}
                    onChange={(e) => updateCertification(cert.id, { description: e.target.value })}
                    rows={2}
                    className="w-full border border-[#1a1a1a]/10 bg-white px-2 py-1 text-xs outline-none resize-none"
                  />
                  <div className="mt-1">
                    <StyleRow
                      color={cert.descriptionColor || "default"}
                      onColorChange={(v) => updateCertification(cert.id, { descriptionColor: v })}
                      font={cert.descriptionFont || "default"}
                      onFontChange={(v) => updateCertification(cert.id, { descriptionFont: v })}
                      size={cert.descriptionSize || "default"}
                      onSizeChange={(v) => updateCertification(cert.id, { descriptionSize: v })}
                      sizeOptions={PARAGRAPH_SIZE_OPTIONS}
                      colorDefaultLabel="Grey"
                      fontDefaultLabel="Ivymode"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="block text-[8px] text-[#8b8b8b] uppercase">Logo</label>
                    {cert.logoImage && (
                      <img src={cert.logoImage} alt="" className="h-14 w-auto object-contain border border-[#1a1a1a]/10 bg-white p-1.5" />
                    )}
                    <div className="flex gap-1">
                      <input
                        type="text"
                        value={cert.logoImage || ""}
                        onChange={(e) => updateCertification(cert.id, { logoImage: e.target.value })}
                        className="w-full border border-[#1a1a1a]/10 bg-white px-2 py-1 text-xs outline-none"
                      />
                      <MediaPickerButton folder="certifications" onSelect={(url) => updateCertification(cert.id, { logoImage: url })} />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="flex items-center gap-2 text-[8px] text-[#8b8b8b] uppercase cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={cert.showDownload}
                        onChange={(e) => updateCertification(cert.id, { showDownload: e.target.checked })}
                        className="accent-[#007190]"
                      />
                      Show Download Certificate
                    </label>
                    {cert.showDownload ? (
                      <CertFileField
                        value={cert.certFile || ""}
                        onChange={(url) => updateCertification(cert.id, { certFile: url })}
                      />
                    ) : (
                      <p className="text-[9px] text-[#8b8b8b]">
                        Hidden on the public page — no "Download Certificate" button shows for this card. Tick the box above to upload a PDF and reveal it.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleDeleteCertification(cert.id)}
                className="text-red-500 hover:text-red-700 transition-colors p-1 self-start"
              >
                <X size={15} />
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={handleAddCertification}
          className="flex items-center gap-2 border border-[#007190] px-4 py-2.5 text-[10px] tracking-[0.15em] uppercase text-[#007190] hover:bg-[#007190] hover:text-white transition-all"
          style={fontMichroma}
        >
          <Plus size={13} />
          Add Certification
        </button>
      </div>
    </div>
  );
}
