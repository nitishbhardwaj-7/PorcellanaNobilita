"use client";

import React, { useState, useEffect, useRef } from "react";
import { Upload, Search, X, Check } from "lucide-react";

interface MediaFile {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  folder: string;
}

const FOLDERS = ["products", "blogs", "general"];

/**
 * In-context media browser + uploader, rendered as a modal overlay.
 *
 * Exists specifically so picking/uploading an image never navigates away from
 * whatever form is open — the old pattern (a plain link to /admin/media) fully
 * unmounted ProductForm/BlogForm and threw away all unsaved field state.
 */
function MediaPickerModal({
  initialFolder,
  onSelect,
  onClose,
}: {
  initialFolder: string;
  onSelect: (url: string) => void;
  onClose: () => void;
}) {
  const [media, setMedia] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [folder, setFolder] = useState(FOLDERS.includes(initialFolder) ? initialFolder : "products");
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const fontMichroma = { fontFamily: "var(--font-michroma), sans-serif" };

  useEffect(() => {
    fetchMedia();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [folder]);

  async function fetchMedia() {
    try {
      setLoading(true);
      const params = new URLSearchParams({ folder: "/" + folder });
      if (search) params.set("search", search);
      const res = await fetch(`/api/media?${params}`);
      const data = await res.json();
      setMedia(data.data || []);
    } catch {
      setError("Failed to load media.");
    } finally {
      setLoading(false);
    }
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const res = await fetch("/api/media", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      // Newly uploaded file is what the user almost certainly wants — select
      // it immediately rather than making them find it in the grid.
      onSelect(data.data.fileUrl);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1a1a1a]/50 p-4" onClick={onClose}>
      <div
        className="flex h-[85vh] w-full max-w-4xl flex-col bg-white shadow-2xl"
        style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1a1a1a]/8 px-6 py-4">
          <p className="text-[10px] tracking-[0.3em] uppercase text-[#1a1a1a]/50" style={fontMichroma}>
            Select or Upload Media
          </p>
          <button onClick={onClose} className="text-[#1a1a1a]/40 hover:text-[#1a1a1a] transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col gap-3 border-b border-[#1a1a1a]/8 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-1">
            {FOLDERS.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFolder(f)}
                className={`px-3 py-1.5 text-[9px] tracking-[0.2em] uppercase border transition-colors ${
                  folder === f
                    ? "bg-[#007190] text-white border-[#007190]"
                    : "bg-white text-[#007190]/60 border-[#007190]/15 hover:text-[#007190] hover:border-[#007190]/30"
                }`}
                style={fontMichroma}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <form
              onSubmit={(e) => { e.preventDefault(); fetchMedia(); }}
              className="flex flex-1"
            >
              <div className="relative flex-1">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1a1a1a]/30" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search…"
                  className="w-full border border-[#1a1a1a]/15 bg-white pl-9 pr-3 py-1.5 text-sm text-[#1a1a1a] placeholder-[#1a1a1a]/30 focus:outline-none focus:border-[#1a1a1a]/40"
                />
              </div>
            </form>

            <label
              className={`flex items-center gap-1.5 whitespace-nowrap bg-[#007190] px-4 py-2 text-[9px] tracking-[0.15em] uppercase text-white hover:bg-[#005d76] transition-colors cursor-pointer ${
                uploading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              style={fontMichroma}
            >
              <Upload size={12} />
              {uploading ? "Uploading…" : "Upload New"}
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/*"
                disabled={uploading}
                onChange={handleUpload}
              />
            </label>
          </div>
        </div>

        {error && (
          <div className="mx-6 mt-4 border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</div>
        )}

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-4">
              {[1, 2, 3, 4, 5].map((n) => (
                <div key={n} className="aspect-square bg-[#f8f5f0] animate-pulse" />
              ))}
            </div>
          ) : media.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-sm text-[#8b8b8b]">No assets in "{folder}" yet — upload one above.</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-4">
              {media.map((file) => (
                <button
                  key={file.id}
                  type="button"
                  onClick={() => onSelect(file.fileUrl)}
                  className="group relative aspect-square overflow-hidden border border-[#1a1a1a]/8 bg-[#f8f5f0] hover:border-[#1a1a1a]/40 transition-colors"
                  title={file.fileName}
                >
                  {file.fileType.startsWith("image/") ? (
                    <img
                      src={file.fileUrl}
                      alt={file.fileName}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[9px] uppercase text-[#1a1a1a]/30" style={fontMichroma}>
                      Document
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-[#1a1a1a]/0 opacity-0 group-hover:bg-[#1a1a1a]/40 group-hover:opacity-100 transition-all">
                    <span className="flex items-center gap-1 bg-white px-2 py-1 text-[9px] tracking-[0.1em] uppercase text-[#1a1a1a]" style={fontMichroma}>
                      <Check size={11} /> Select
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Drop-in replacement for a plain image-URL text field: shows a preview,
 * lets you pick or upload via the modal above, but still allows typing/
 * pasting a URL directly for edge cases (external URLs, etc.).
 */
export function MediaPickerField({
  label,
  value,
  onChange,
  folder = "products",
  placeholder = "/uploads/…",
  aspect = "aspect-square",
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  placeholder?: string;
  aspect?: string;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const fontMichroma = { fontFamily: "var(--font-michroma), sans-serif" };

  return (
    <div className="space-y-4">
      <p className="text-[9px] tracking-[0.3em] uppercase text-[#1a1a1a]/35 border-b border-[#1a1a1a]/8 pb-3" style={fontMichroma}>
        {label}
      </p>

      {value && (
        <div className={`relative ${aspect} w-full overflow-hidden border border-[#1a1a1a]/8`}>
          <img src={value} alt="" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 bg-white/90 border border-[#1a1a1a]/10 w-6 h-6 flex items-center justify-center text-[#1a1a1a]/50 hover:text-red-500 transition-colors"
          >
            <X size={11} />
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={() => setModalOpen(true)}
        className="flex w-full items-center justify-center gap-2 border border-[#007190] px-4 py-2.5 text-[10px] tracking-[0.15em] uppercase text-[#007190] hover:bg-[#007190] hover:text-white transition-all"
        style={fontMichroma}
      >
        <Upload size={13} />
        {value ? "Change Image" : "Choose Image"}
      </button>

      <div className="space-y-1.5">
        <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40" style={fontMichroma}>
          or paste URL manually
        </label>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-3 py-2.5 text-[11px] font-mono text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none"
          placeholder={placeholder}
        />
      </div>

      {modalOpen && (
        <MediaPickerModal
          initialFolder={folder}
          onClose={() => setModalOpen(false)}
          onSelect={(url) => {
            onChange(url);
            setModalOpen(false);
          }}
        />
      )}
    </div>
  );
}

/**
 * Compact variant for inline use next to a plain text input (e.g. a single
 * row inside a slides/blocks editor), rather than the full labeled block
 * above. Renders just an icon button that opens the same picker modal.
 */
export function MediaPickerButton({
  onSelect,
  folder = "products",
  className = "w-12",
}: {
  onSelect: (url: string) => void;
  folder?: string;
  className?: string;
}) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className={`${className} flex-shrink-0 flex items-stretch`}>
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        className="flex items-center justify-center w-full border border-[#1a1a1a]/15 bg-white text-[#1a1a1a]/50 hover:text-[#1a1a1a] hover:border-[#1a1a1a]/40 transition-colors"
        title="Choose from Media Library"
      >
        <Upload size={12} />
      </button>
      {modalOpen && (
        <MediaPickerModal
          initialFolder={folder}
          onClose={() => setModalOpen(false)}
          onSelect={(url) => {
            onSelect(url);
            setModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
