"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, ArrowUpRight, Eye, EyeOff } from "lucide-react";

interface Product {
  id: string;
  name: string;
  slug: string;
  finish: string | null;
  status: "DRAFT" | "PUBLISHED";
  coverImage: string | null;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fontMichroma = { fontFamily: "var(--font-michroma), sans-serif" };
  const fontIvymode = { fontFamily: "var(--font-ivymode), serif" };

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
    <div className="space-y-8" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[10px] tracking-[0.3em] uppercase text-[#1a1a1a]/35 mb-1" style={fontMichroma}>
            Slab Catalogue
          </p>
          <h2 className="text-3xl font-light text-[#1a1a1a]" style={fontIvymode}>
            Products
          </h2>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 bg-[#007190] px-5 py-2.5 text-[10px] tracking-[0.2em] uppercase text-white hover:bg-[#005d76] transition-colors"
          style={fontMichroma}
        >
          <Plus size={13} />
          Add Product
        </Link>
      </div>

      <div className="h-px bg-[#1a1a1a]/8" />

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
              <p className="text-[11px] text-[#8b8b8b]">{product.finish || "—"}</p>

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
