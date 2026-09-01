"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, Pencil, Check, X, ArrowUp, ArrowDown } from "lucide-react";

interface MasterItem {
  id: string;
  name: string;
  order: number;
}

const TABS = ["colors", "finishes"] as const;
type Tab = (typeof TABS)[number];

const TAB_CONFIG: Record<Tab, { label: string; endpoint: string; noun: string }> = {
  colors: { label: "Colors", endpoint: "/api/colors", noun: "color" },
  finishes: { label: "Finishes", endpoint: "/api/finishes", noun: "finish" },
};

export default function MasterDataPage() {
  const [activeTab, setActiveTab] = useState<Tab>("colors");
  const [items, setItems] = useState<MasterItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);

  const fontMichroma = { fontFamily: "var(--font-michroma), sans-serif" };
  const fontIvymode = { fontFamily: "var(--font-ivymode), serif" };
  const config = TAB_CONFIG[activeTab];

  useEffect(() => {
    fetchItems();
    setEditingId(null);
    setNewName("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  async function fetchItems() {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(config.endpoint);
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
      const res = await fetch(config.endpoint, {
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
      const res = await fetch(`${config.endpoint}/${id}`, {
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
      const res = await fetch(`${config.endpoint}/${item.id}`, { method: "DELETE" });
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
            : fetch(`${config.endpoint}/${item.id}`, {
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
    <div className="space-y-8" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
      {/* Header */}
      <div>
        <p className="text-[10px] tracking-[0.3em] uppercase text-[#1a1a1a]/35 mb-1" style={fontMichroma}>
          Site Configuration
        </p>
        <h2 className="text-3xl font-light text-[#1a1a1a]" style={fontIvymode}>
          Master Data
        </h2>
        <p className="mt-2 text-sm text-[#8b8b8b]">
          Manage the Color and Finish options offered in the product form and the public collection filters.
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
            {TAB_CONFIG[tab].label}
          </button>
        ))}
      </div>

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
            <div className="p-10 text-center text-sm text-[#8b8b8b]">No {config.noun}s yet — add one below.</div>
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
          placeholder={`Add a new ${config.noun}…`}
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
