"use client";

import React, { useState, useEffect, useRef } from "react";
import { Upload, FileText, ExternalLink, Check } from "lucide-react";

interface Settings {
  catalogPdfUrl: string | null;
  catalogPdfName: string | null;
  datasheetPdfUrlEnglish: string | null;
  datasheetPdfNameEnglish: string | null;
  datasheetPdfUrlItalian: string | null;
  datasheetPdfNameItalian: string | null;
}

type Slot = "catalog" | "datasheetEnglish" | "datasheetItalian";

const SLOTS: {
  slot: Slot;
  label: string;
  description: string;
  urlKey: keyof Settings;
  nameKey: keyof Settings;
  defaultUrl: string;
  defaultName: string;
}[] = [
  {
    slot: "catalog",
    label: "Catalogue PDF",
    description: "Downloaded when a visitor submits the catalogue request form.",
    urlKey: "catalogPdfUrl",
    nameKey: "catalogPdfName",
    defaultUrl: "/Pdfs/CATALOGUE.pdf",
    defaultName: "CATALOGUE.pdf",
  },
  {
    slot: "datasheetEnglish",
    label: "Technical Data Sheet — English",
    description: "Downloaded when a visitor requests the English datasheet.",
    urlKey: "datasheetPdfUrlEnglish",
    nameKey: "datasheetPdfNameEnglish",
    defaultUrl: "/Pdfs/TECHNICAL%20DATA%20SHEET%20-%20ENGLISH.pdf",
    defaultName: "TECHNICAL DATA SHEET - ENGLISH.pdf",
  },
  {
    slot: "datasheetItalian",
    label: "Technical Data Sheet — Italian",
    description: "Downloaded when a visitor requests the Italian datasheet.",
    urlKey: "datasheetPdfUrlItalian",
    nameKey: "datasheetPdfNameItalian",
    defaultUrl: "/Pdfs/TECHNICAL%20DATA%20SHEET%20-%20ITALIAN.pdf",
    defaultName: "TECHNICAL DATA SHEET - ITALIAN.pdf",
  },
];

export default function DownloadsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadingSlot, setUploadingSlot] = useState<Slot | null>(null);
  const [justUpdatedSlot, setJustUpdatedSlot] = useState<Slot | null>(null);
  const fileInputRefs = useRef<Record<Slot, HTMLInputElement | null>>({
    catalog: null,
    datasheetEnglish: null,
    datasheetItalian: null,
  });

  const fontMichroma = { fontFamily: "var(--font-michroma), sans-serif" };
  const fontIvymode = { fontFamily: "var(--font-ivymode), serif" };

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    try {
      setLoading(true);
      const res = await fetch("/api/settings");
      if (!res.ok) throw new Error("Failed to load settings.");
      const data = await res.json();
      setSettings(data.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpload(slot: Slot, file: File) {
    setError(null);
    setUploadingSlot(slot);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("slot", slot);

      const res = await fetch("/api/settings/pdf", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed.");

      setSettings(data.data);
      setJustUpdatedSlot(slot);
      setTimeout(() => setJustUpdatedSlot(null), 2500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploadingSlot(null);
    }
  }

  return (
    <div className="space-y-8" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
      {/* Header */}
      <div>
        <p className="text-[10px] tracking-[0.3em] uppercase text-[#1a1a1a]/35 mb-1" style={fontMichroma}>
          Site Files
        </p>
        <h2 className="text-3xl font-light text-[#1a1a1a]" style={fontIvymode}>
          PDF
        </h2>
        <p className="mt-2 text-sm text-[#8b8b8b]">
          Replace the catalogue and technical data sheet files visitors download from the site.
        </p>
      </div>

      <div className="h-px bg-[#1a1a1a]/8" />

      {error && (
        <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
      )}

      {loading || !settings ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-28 bg-white border border-[#1a1a1a]/8 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {SLOTS.map((s) => {
            const currentUrl = (settings[s.urlKey] as string | null) || s.defaultUrl;
            const currentName = (settings[s.nameKey] as string | null) || s.defaultName;
            const isUploading = uploadingSlot === s.slot;
            const justUpdated = justUpdatedSlot === s.slot;

            return (
              <div
                key={s.slot}
                className="bg-white border border-[#1a1a1a]/8 p-6 flex flex-col sm:flex-row sm:items-center gap-5"
              >
                <div className="w-11 h-11 flex-shrink-0 border border-[#1a1a1a]/10 flex items-center justify-center text-[#1a1a1a]/30">
                  <FileText size={18} />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-[9px] tracking-[0.3em] uppercase text-[#1a1a1a]/40 mb-1.5" style={fontMichroma}>
                    {s.label}
                  </p>
                  <p className="text-xs text-[#8b8b8b] mb-2">{s.description}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <a
                      href={currentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-[11px] text-[#007190] hover:underline truncate max-w-xs"
                      title={currentName}
                    >
                      {currentName}
                      <ExternalLink size={11} className="flex-shrink-0" />
                    </a>
                    {justUpdated && (
                      <span className="flex items-center gap-1 text-[10px] text-green-600" style={fontMichroma}>
                        <Check size={11} /> Updated
                      </span>
                    )}
                  </div>
                </div>

                <label
                  className={`flex items-center justify-center gap-2 border border-[#007190]/25 bg-white px-5 py-2.5 text-[10px] tracking-[0.15em] uppercase text-[#007190]/70 hover:bg-[#007190] hover:text-white hover:border-[#007190] transition-all cursor-pointer flex-shrink-0 ${
                    isUploading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  style={fontMichroma}
                >
                  <Upload size={13} />
                  {isUploading ? "Uploading…" : "Replace PDF"}
                  <input
                    ref={(el) => { fileInputRefs.current[s.slot] = el; }}
                    type="file"
                    className="hidden"
                    accept="application/pdf,.pdf"
                    disabled={isUploading}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleUpload(s.slot, file);
                      e.target.value = "";
                    }}
                  />
                </label>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
