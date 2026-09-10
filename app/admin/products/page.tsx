"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Check,
  X,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { MediaPickerButton } from "../_components/MediaPicker";
import { StyleRow } from "../_components/StyleControls";
import { HEADING_SIZE_OPTIONS } from "@/lib/textStyle";

const fontMichroma = { fontFamily: "var(--font-michroma), sans-serif" };
const fontIvymode = { fontFamily: "var(--font-ivymode), serif" };

const TABS = ["page-header", "products", "colors", "finishes"] as const;
type Tab = (typeof TABS)[number];
const TAB_LABELS: Record<Tab, string> = {
  "page-header": "Page Header",
  products: "Products",
  colors: "Colors",
  finishes: "Finishes",
};

export default function ExploreCollectionAdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>("products");

  return (
    <div className="space-y-8" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
      {/* Header */}
      <div>
        <p className="text-[10px] tracking-[0.3em] uppercase text-[#1a1a1a]/35 mb-1" style={fontMichroma}>
          Slab Catalogue
        </p>
        <h2 className="text-3xl font-light text-[#1a1a1a]" style={fontIvymode}>
          Explore The Collection
        </h2>
        <p className="mt-2 text-sm text-[#8b8b8b]">
          Manage the products, and the Color and Finish filter options, shown on the public Explore Collection page.
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

      {activeTab === "page-header" && <PageHeaderTab />}
      {activeTab === "products" && <ProductsTab />}
      {activeTab === "colors" && <MasterDataTab endpoint="/api/colors" noun="color" />}
      {activeTab === "finishes" && <MasterDataTab endpoint="/api/finishes" noun="finish" />}
    </div>
  );
}

// ============================================================================
// Page Header tab
// ============================================================================

interface PageHeaderSettings {
  exploreHeroTitle: string;
  exploreHeroTitleColor: string;
  exploreHeroTitleFont: string;
  exploreHeroTitleSize: string;
  exploreHeroLogo: string;
}

function PageHeaderTab() {
  const [settings, setSettings] = useState<PageHeaderSettings>({
    exploreHeroTitle: "",
    exploreHeroTitleColor: "default",
    exploreHeroTitleFont: "default",
    exploreHeroTitleSize: "default",
    exploreHeroLogo: "",
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
            exploreHeroTitle: s.exploreHeroTitle || "",
            exploreHeroTitleColor: s.exploreHeroTitleColor || "default",
            exploreHeroTitleFont: s.exploreHeroTitleFont || "default",
            exploreHeroTitleSize: s.exploreHeroTitleSize || "default",
            exploreHeroLogo: s.exploreHeroLogo || "",
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
            Page Header
          </p>
          {saved && (
            <span className="flex items-center gap-1 text-[10px] text-green-600" style={fontMichroma}>
              <Check size={11} /> Saved
            </span>
          )}
        </div>
        <p className="text-[10px] text-[#8b8b8b] -mt-2">The teal banner at the top of /explore-collection.</p>

        <div className="space-y-1.5">
          <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40" style={fontMichroma}>
            Title
          </label>
          <input
            type="text"
            value={settings.exploreHeroTitle}
            onChange={(e) => setSettings((p) => ({ ...p, exploreHeroTitle: e.target.value }))}
            placeholder="EXPLORE THE COLLECTION"
            className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-2.5 text-sm text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none"
          />
          <StyleRow
            color={settings.exploreHeroTitleColor}
            onColorChange={(v) => setSettings((p) => ({ ...p, exploreHeroTitleColor: v }))}
            font={settings.exploreHeroTitleFont}
            onFontChange={(v) => setSettings((p) => ({ ...p, exploreHeroTitleFont: v }))}
            size={settings.exploreHeroTitleSize}
            onSizeChange={(v) => setSettings((p) => ({ ...p, exploreHeroTitleSize: v }))}
            sizeOptions={HEADING_SIZE_OPTIONS}
            colorDefaultLabel="White"
            fontDefaultLabel="Ivymode"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40" style={fontMichroma}>
            Logo
          </label>
          {settings.exploreHeroLogo ? (
            <img src={settings.exploreHeroLogo} alt="" className="h-24 w-auto object-contain bg-[#007190] p-3" />
          ) : (
            <div className="relative inline-block">
              <img src="/images/NOBILITA_white.png" alt="" className="h-24 w-auto object-contain bg-[#007190] p-3" />
              <span className="absolute top-1 left-1 bg-[#1a1a1a]/70 text-white text-[8px] tracking-[0.15em] uppercase px-1.5 py-0.5">Currently Live (Default)</span>
            </div>
          )}
          <div className="flex gap-1">
            <input
              type="text"
              value={settings.exploreHeroLogo}
              onChange={(e) => setSettings((p) => ({ ...p, exploreHeroLogo: e.target.value }))}
              placeholder="/images/NOBILITA_white.png"
              className="w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-3 py-2 text-xs text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none"
            />
            <MediaPickerButton folder="products" onSelect={(url) => setSettings((p) => ({ ...p, exploreHeroLogo: url }))} />
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="border border-[#007190]/25 bg-white px-5 py-2 text-[10px] tracking-[0.15em] uppercase text-[#007190]/70 hover:bg-[#007190] hover:text-white hover:border-[#007190] disabled:opacity-40 transition-all"
          style={fontMichroma}
        >
          {saving ? "Saving…" : "Save Page Header"}
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// Products tab
// ============================================================================

interface Product {
  id: string;
  name: string;
  slug: string;
  finish: string | null;
  finishCategories: string[];
  status: "DRAFT" | "PUBLISHED";
  coverImage: string | null;
  order: number;
  createdAt: string;
  updatedAt: string;
}

function ProductsTab() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      setLoading(true);
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error("Failed to load products.");
      const data = await res.json();
      setProducts(data.data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function toggleStatus(product: Product) {
    const newStatus = product.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status.");
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, status: newStatus } : p))
      );
    } catch (err: any) {
      alert(err.message);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete product.");
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="h-16 bg-white border border-[#1a1a1a]/8 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 bg-[#007190] px-5 py-2.5 text-[10px] tracking-[0.2em] uppercase text-white hover:bg-[#005d76] transition-colors"
          style={fontMichroma}
        >
          <Plus size={13} />
          Add Product
        </Link>
      </div>

      {error && (
        <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
      )}

      {products.length === 0 ? (
        <div className="bg-white border border-[#1a1a1a]/8 p-16 text-center">
          <p className="text-sm text-[#8b8b8b] mb-4">No products yet. Add your first slab to the catalogue.</p>
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 bg-[#007190] px-6 py-3 text-[10px] tracking-[0.2em] uppercase text-white hover:bg-[#005d76] transition-colors"
            style={fontMichroma}
          >
            <Plus size={13} />
            Add First Product
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-[#1a1a1a]/8">
          {/* Table header */}
          <div
            className="grid grid-cols-[48px_1fr_160px_100px_100px] gap-4 px-5 py-3 border-b border-[#1a1a1a]/8 text-[9px] tracking-[0.25em] uppercase text-[#1a1a1a]/40"
            style={fontMichroma}
          >
            <span></span>
            <span>Product Name</span>
            <span>Finish</span>
            <span>Status</span>
            <span className="text-right">Actions</span>
          </div>

          {/* Rows */}
          {products.map((product, idx) => (
            <div
              key={product.id}
              className={`grid grid-cols-[48px_1fr_160px_100px_100px] gap-4 px-5 py-4 items-center hover:bg-[#f8f5f0]/60 transition-colors ${
                idx < products.length - 1 ? "border-b border-[#1a1a1a]/6" : ""
              }`}
            >
              {/* Thumbnail */}
              <div className="w-10 h-10 bg-[#f8f5f0] border border-[#1a1a1a]/10 overflow-hidden flex-shrink-0">
                {product.coverImage ? (
                  <img
                    src={product.coverImage}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#1a1a1a]/20">
                    <span className="text-[8px]" style={fontMichroma}>IMG</span>
                  </div>
                )}
              </div>

              {/* Name + slug */}
              <div>
                <p className="text-sm font-medium text-[#1a1a1a]">{product.name}</p>
                <p className="text-[10px] text-[#8b8b8b] mt-0.5 font-mono">{product.slug}</p>
              </div>

              {/* Finish */}
              <p className="text-[11px] text-[#8b8b8b]">
                {product.finishCategories && product.finishCategories.length > 0
                  ? product.finishCategories.join(", ")
                  : product.finish || "—"}
              </p>

              {/* Status badge */}
              <div>
                <span
                  className={`inline-block px-2 py-0.5 text-[9px] tracking-[0.2em] uppercase border ${
                    product.status === "PUBLISHED"
                      ? "border-[#1a7a96]/30 text-[#1a7a96] bg-[#1a7a96]/5"
                      : "border-[#1a1a1a]/15 text-[#8b8b8b]"
                  }`}
                  style={fontMichroma}
                >
                  {product.status === "PUBLISHED" ? "Live" : "Draft"}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-1">
                <button
                  onClick={() => toggleStatus(product)}
                  title={product.status === "PUBLISHED" ? "Unpublish" : "Publish"}
                  className="w-7 h-7 flex items-center justify-center border border-[#1a1a1a]/10 text-[#1a1a1a]/40 hover:text-[#1a7a96] hover:border-[#1a7a96]/30 transition-colors"
                >
                  {product.status === "PUBLISHED" ? <EyeOff size={13} /> : <Eye size={13} />}
                </button>
                <Link
                  href={`/admin/products/${product.id}`}
                  className="w-7 h-7 flex items-center justify-center border border-[#1a1a1a]/10 text-[#1a1a1a]/40 hover:text-[#1a1a1a] hover:border-[#1a1a1a]/30 transition-colors"
                  title="Edit"
                >
                  <Pencil size={13} />
                </Link>
                <button
                  onClick={() => handleDelete(product.id, product.name)}
                  title="Delete"
                  className="w-7 h-7 flex items-center justify-center border border-[#1a1a1a]/10 text-[#1a1a1a]/40 hover:text-red-500 hover:border-red-200 transition-colors"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-[10px] text-[#8b8b8b]">{products.length} product{products.length !== 1 ? "s" : ""} total</p>
    </div>
  );
}

// ============================================================================
// Colors / Finishes tab (Master Data — the filter option lists used by this
// same Explore Collection page and the product form's Color/Finish pickers)
// ============================================================================

interface MasterItem {
  id: string;
  name: string;
  order: number;
}

function MasterDataTab({ endpoint, noun }: { endpoint: string; noun: string }) {
  const [items, setItems] = useState<MasterItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    fetchItems();
    setEditingId(null);
    setNewName("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint]);

  async function fetchItems() {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(endpoint);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load.");
      setItems(data.data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    setAdding(true);
    setError(null);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add.");
      setItems((prev) => [...prev, data.data]);
      setNewName("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setAdding(false);
    }
  }

  async function handleRename(id: string) {
    if (!editingName.trim()) return;
    setSavingId(id);
    setError(null);
    try {
      const res = await fetch(`${endpoint}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editingName.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to rename.");
      setItems((prev) => prev.map((i) => (i.id === id ? data.data : i)));
      setEditingId(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSavingId(null);
    }
  }

  async function handleDelete(item: MasterItem) {
    if (!confirm(`Delete "${item.name}"? This cannot be undone.`)) return;
    setError(null);
    try {
      const res = await fetch(`${endpoint}/${item.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete.");
      setItems((prev) => prev.filter((i) => i.id !== item.id));
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function handleMove(index: number, direction: -1 | 1) {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const reordered = [...items];
    [reordered[index], reordered[targetIndex]] = [reordered[targetIndex], reordered[index]];
    setItems(reordered);

    // Persist both swapped items' new order values.
    setError(null);
    try {
      await Promise.all(
        reordered.map((item, i) =>
          item.order === i
            ? Promise.resolve()
            : fetch(`${endpoint}/${item.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ order: i }),
              })
        )
      );
      setItems((prev) => prev.map((item, i) => ({ ...item, order: i })));
    } catch {
      setError("Failed to save the new order.");
      fetchItems();
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
      )}

      {/* List */}
      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-12 bg-white border border-[#1a1a1a]/8 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-[#1a1a1a]/8">
          {items.length === 0 ? (
            <div className="p-10 text-center text-sm text-[#8b8b8b]">No {noun}s yet — add one below.</div>
          ) : (
            items.map((item, idx) => (
              <div
                key={item.id}
                className={`flex items-center gap-3 px-4 py-3 ${
                  idx < items.length - 1 ? "border-b border-[#1a1a1a]/6" : ""
                }`}
              >
                <div className="flex flex-col gap-0.5">
                  <button
                    type="button"
                    onClick={() => handleMove(idx, -1)}
                    disabled={idx === 0}
                    className="text-[#1a1a1a]/30 hover:text-[#1a1a1a] disabled:opacity-20 disabled:hover:text-[#1a1a1a]/30 transition-colors"
                  >
                    <ArrowUp size={12} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMove(idx, 1)}
                    disabled={idx === items.length - 1}
                    className="text-[#1a1a1a]/30 hover:text-[#1a1a1a] disabled:opacity-20 disabled:hover:text-[#1a1a1a]/30 transition-colors"
                  >
                    <ArrowDown size={12} />
                  </button>
                </div>

                {editingId === item.id ? (
                  <>
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleRename(item.id);
                        if (e.key === "Escape") setEditingId(null);
                      }}
                      className="flex-1 border border-[#1a1a1a]/15 bg-[#f8f5f0] px-3 py-1.5 text-sm text-[#1a1a1a] focus:border-[#1a1a1a]/40 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleRename(item.id)}
                      disabled={savingId === item.id}
                      className="text-green-600 hover:text-green-700 transition-colors"
                    >
                      <Check size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="text-[#1a1a1a]/40 hover:text-[#1a1a1a] transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </>
                ) : (
                  <>
                    <span className="flex-1 text-sm text-[#1a1a1a]">{item.name}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(item.id);
                        setEditingName(item.name);
                      }}
                      className="text-[#1a1a1a]/30 hover:text-[#1a1a1a] transition-colors"
                      title="Rename"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item)}
                      className="text-[#1a1a1a]/30 hover:text-red-500 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Add new */}
      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder={`Add a new ${noun}…`}
          className="flex-1 border border-[#1a1a1a]/15 bg-white px-4 py-3 text-sm text-[#1a1a1a] placeholder-[#1a1a1a]/30 focus:border-[#1a1a1a]/40 focus:outline-none"
        />
        <button
          type="submit"
          disabled={adding || !newName.trim()}
          className="flex items-center gap-2 bg-[#007190] px-5 py-3 text-[10px] tracking-[0.2em] uppercase text-white hover:bg-[#005d76] disabled:opacity-40 transition-colors"
          style={fontMichroma}
        >
          <Plus size={13} />
          Add
        </button>
      </form>
    </div>
  );
}
