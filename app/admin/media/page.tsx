"use client";

import React, { useState, useEffect, useRef } from "react";
import { Upload, Trash2, Copy, Check, Search, X, Tag } from "lucide-react";

interface MediaFile {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  alt: string | null;
  tags: string[];
  folder: string;
  createdAt: string;
}

const FOLDERS = ["products", "blogs"];

export default function MediaLibrary() {
  const [media, setMedia] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentFolder, setCurrentFolder] = useState("products");
  const [searchQuery, setSearchQuery] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null);
  const [editAlt, setEditAlt] = useState("");
  const [editTags, setEditTags] = useState("");
  const [saving, setSaving] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const fontMichroma = { fontFamily: "var(--font-michroma), sans-serif" };
  const fontIvymode = { fontFamily: "var(--font-ivymode), serif" };

  useEffect(() => {
    fetchMedia();
  }, [currentFolder]);

  async function fetchMedia() {
    try {
      setLoading(true);
      const params = new URLSearchParams({ folder: "/" + currentFolder });
      if (searchQuery) params.set("search", searchQuery);
      const res = await fetch(`/api/media?${params}`);
      if (!res.ok) throw new Error("Failed to load media.");
      const data = await res.json();
      setMedia(data.data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    fetchMedia();
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setError(null);
    setUploading(true);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setUploadProgress(`Uploading ${i + 1} / ${files.length}: ${file.name}`);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", currentFolder);

      try {
        const res = await fetch("/api/media", { method: "POST", body: formData });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Upload failed");
        setMedia((prev) => [data.data, ...prev]);
      } catch (err: any) {
        setError(err.message);
      }
    }

    setUploading(false);
    setUploadProgress(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleDelete(file: MediaFile) {
    if (!confirm(`Delete "${file.fileName}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/media/${file.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete.");
      setMedia((prev) => prev.filter((m) => m.id !== file.id));
      if (selectedFile?.id === file.id) setSelectedFile(null);
    } catch (err: any) {
      alert(err.message);
    }
  }

  function handleCopy(file: MediaFile) {
    navigator.clipboard.writeText(file.fileUrl);
    setCopiedId(file.id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  function openDetail(file: MediaFile) {
    setSelectedFile(file);
    setEditAlt(file.alt || "");
    setEditTags(file.tags.join(", "));
  }

  async function saveDetail() {
    if (!selectedFile) return;
    setSaving(true);
    try {
      const tags = editTags.split(",").map((t) => t.trim()).filter(Boolean);
      const res = await fetch(`/api/media/${selectedFile.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ alt: editAlt, tags }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMedia((prev) => prev.map((m) => (m.id === selectedFile.id ? data.data : m)));
      setSelectedFile(data.data);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return (
    <div className="flex gap-6 h-full" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
      {/* Main panel */}
      <div className="flex-1 space-y-6">
        {/* Header */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-[#1a1a1a]/35 mb-1" style={fontMichroma}>
              Asset Management
            </p>
            <h2 className="text-3xl font-light text-[#1a1a1a]" style={fontIvymode}>
              Media Library
            </h2>
          </div>

          <label
            className={`flex items-center gap-2 bg-[#007190] px-5 py-2.5 text-[10px] tracking-[0.2em] uppercase text-white hover:bg-[#005d76] transition-colors cursor-pointer ${
              uploading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            style={fontMichroma}
          >
            <Upload size={13} />
            {uploading ? "Uploading..." : "Upload"}
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/*,application/pdf"
              multiple
              disabled={uploading}
              onChange={handleFileUpload}
            />
          </label>
        </div>

        <div className="h-px bg-[#1a1a1a]/8" />

        {uploadProgress && (
          <div className="border border-[#1a7a96]/20 bg-[#1a7a96]/5 px-4 py-2.5 text-[11px] text-[#1a7a96]" style={fontMichroma}>
            {uploadProgress}
          </div>
        )}

        {error && (
          <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
        )}

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Folder selector */}
          <div className="flex gap-1">
            {FOLDERS.map((folder) => (
              <button
                key={folder}
                onClick={() => setCurrentFolder(folder)}
                className={`px-3 py-1.5 text-[9px] tracking-[0.2em] uppercase border transition-colors ${
                  currentFolder === folder
                    ? "bg-[#007190] text-white border-[#007190]"
                    : "bg-white text-[#1a1a1a]/40 border-[#1a1a1a]/15 hover:text-[#1a1a1a] hover:border-[#1a1a1a]/30"
                }`}
                style={fontMichroma}
              >
                {folder}
              </button>
            ))}
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex flex-1 max-w-sm">
            <div className="relative flex-1">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1a1a1a]/30" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by filename…"
                className="w-full border border-[#1a1a1a]/15 bg-white pl-9 pr-3 py-1.5 text-sm text-[#1a1a1a] placeholder-[#1a1a1a]/30 focus:outline-none focus:border-[#1a1a1a]/40"
              />
            </div>
            <button
              type="submit"
              className="border border-l-0 border-[#007190] bg-[#007190] px-3 text-white hover:bg-[#005d76] transition-colors"
            >
              <Search size={13} />
            </button>
          </form>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="aspect-square bg-white border border-[#1a1a1a]/8 animate-pulse" />
            ))}
          </div>
        ) : media.length === 0 ? (
          <div className="bg-white border border-[#1a1a1a]/8 p-16 text-center">
            <p className="text-sm text-[#8b8b8b]">No assets in "{currentFolder}". Upload your first image.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {media.map((file) => (
              <div
                key={file.id}
                className={`group relative bg-white border overflow-hidden cursor-pointer transition-all ${
                  selectedFile?.id === file.id
                    ? "border-[#1a1a1a]/50 ring-1 ring-[#1a1a1a]/20"
                    : "border-[#1a1a1a]/8 hover:border-[#1a1a1a]/25"
                }`}
                onClick={() => openDetail(file)}
              >
                {/* Preview */}
                <div className="aspect-square bg-[#f8f5f0] relative overflow-hidden">
                  {file.fileType.startsWith("image/") ? (
                    <img
                      src={file.fileUrl}
                      alt={file.alt || file.fileName}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-[9px] tracking-widest uppercase text-[#1a1a1a]/30" style={fontMichroma}>
                        Document
                      </span>
                    </div>
                  )}

                  {/* Hover actions */}
                  <div className="absolute inset-0 bg-[#1a1a1a]/0 group-hover:bg-[#1a1a1a]/20 transition-colors" />
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleCopy(file); }}
                      className="w-7 h-7 bg-white/95 border border-[#1a1a1a]/10 flex items-center justify-center text-[#1a1a1a]/60 hover:text-[#1a1a1a] transition-colors"
                      title="Copy URL"
                    >
                      {copiedId === file.id ? <Check size={12} className="text-green-600" /> : <Copy size={12} />}
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(file); }}
                      className="w-7 h-7 bg-white/95 border border-[#1a1a1a]/10 flex items-center justify-center text-[#1a1a1a]/60 hover:text-red-500 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>

                  {/* Tags badge */}
                  {file.tags.length > 0 && (
                    <div className="absolute bottom-2 left-2">
                      <span className="flex items-center gap-1 bg-white/90 px-1.5 py-0.5 text-[9px] text-[#1a1a1a]/60 border border-[#1a1a1a]/10">
                        <Tag size={9} />
                        {file.tags.length}
                      </span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="px-3 py-2.5 border-t border-[#1a1a1a]/6">
                  <p className="truncate text-[11px] text-[#1a1a1a]/70" title={file.fileName}>
                    {file.fileName}
                  </p>
                  <p className="text-[10px] text-[#1a1a1a]/30 mt-0.5 font-mono">
                    {formatBytes(file.fileSize)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="text-[10px] text-[#8b8b8b]">{media.length} asset{media.length !== 1 ? "s" : ""}</p>
      </div>

      {/* Detail panel */}
      {selectedFile && (
        <div className="w-72 flex-shrink-0 border-l border-[#1a1a1a]/8 pl-6 space-y-5">
          <div className="flex items-center justify-between">
            <p className="text-[9px] tracking-[0.3em] uppercase text-[#1a1a1a]/35" style={fontMichroma}>
              Asset Details
            </p>
            <button
              onClick={() => setSelectedFile(null)}
              className="text-[#1a1a1a]/30 hover:text-[#1a1a1a] transition-colors"
            >
              <X size={15} />
            </button>
          </div>

          {/* Preview */}
          <div className="aspect-square w-full border border-[#1a1a1a]/8 overflow-hidden bg-[#f8f5f0]">
            {selectedFile.fileType.startsWith("image/") && (
              <img src={selectedFile.fileUrl} alt="" className="w-full h-full object-cover" />
            )}
          </div>

          {/* Meta */}
          <div className="space-y-1 text-[11px] text-[#8b8b8b]">
            <p className="break-all text-[#1a1a1a]/70 font-medium">{selectedFile.fileName}</p>
            <p>{formatBytes(selectedFile.fileSize)} · {selectedFile.fileType.split("/")[1]?.toUpperCase()}</p>
            <p>{new Date(selectedFile.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</p>
          </div>

          <div className="h-px bg-[#1a1a1a]/8" />

          {/* Copy URL */}
          <button
            onClick={() => handleCopy(selectedFile)}
            className="flex w-full items-center justify-center gap-2 border border-[#007190]/25 bg-white px-3 py-2.5 text-[10px] tracking-[0.15em] uppercase text-[#007190]/70 hover:bg-[#007190] hover:text-white hover:border-[#007190] transition-all"
            style={fontMichroma}
          >
            {copiedId === selectedFile.id ? (
              <><Check size={12} className="text-green-500" /> Copied!</>
            ) : (
              <><Copy size={12} /> Copy URL</>
            )}
          </button>

          {/* Alt text */}
          <div className="space-y-1.5">
            <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40" style={fontMichroma}>
              Alt Text
            </label>
            <input
              type="text"
              value={editAlt}
              onChange={(e) => setEditAlt(e.target.value)}
              className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-3 py-2 text-sm text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none"
              placeholder="Describe the image…"
            />
          </div>

          {/* Tags */}
          <div className="space-y-1.5">
            <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40" style={fontMichroma}>
              Tags
            </label>
            <input
              type="text"
              value={editTags}
              onChange={(e) => setEditTags(e.target.value)}
              className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-3 py-2 text-sm text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none"
              placeholder="hero, product, white…"
            />
            <p className="text-[10px] text-[#8b8b8b]">Comma-separated</p>
          </div>

          <button
            onClick={saveDetail}
            disabled={saving}
            className="w-full bg-[#007190] py-2.5 text-[10px] tracking-[0.2em] uppercase text-white hover:bg-[#005d76] disabled:opacity-40 transition-colors"
            style={fontMichroma}
          >
            {saving ? "Saving…" : "Save Details"}
          </button>

          <button
            onClick={() => handleDelete(selectedFile)}
            className="w-full border border-red-200 py-2.5 text-[10px] tracking-[0.2em] uppercase text-red-400 hover:bg-red-50 transition-colors"
            style={fontMichroma}
          >
            Delete Asset
          </button>
        </div>
      )}
    </div>
  );
}
