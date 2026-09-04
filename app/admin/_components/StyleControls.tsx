"use client";

import React from "react";
import { COLOR_OPTIONS, FONT_OPTIONS } from "@/lib/textStyle";

// A field's Color / Font / Size — three plain <select> dropdowns in a row.
// Shared across every admin page that exposes per-field text styling
// (Homepage, Our Story, Made in Italy, Technical Data) so the control markup
// only exists once.
function MiniSelect({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (val: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      value={value || "default"}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border border-[#1a1a1a]/10 bg-white px-2 py-1.5 text-[11px] text-[#1a1a1a] outline-none focus:border-[#1a1a1a]/40"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

export function StyleRow({
  color,
  onColorChange,
  font,
  onFontChange,
  size,
  onSizeChange,
  sizeOptions,
}: {
  color: string;
  onColorChange: (v: string) => void;
  font: string;
  onFontChange: (v: string) => void;
  size: string;
  onSizeChange: (v: string) => void;
  sizeOptions: { value: string; label: string }[];
}) {
  return (
    <div className="grid grid-cols-3 gap-2">
      <div>
        <label className="block text-[8px] text-[#8b8b8b] uppercase">Color</label>
        <MiniSelect value={color} onChange={onColorChange} options={COLOR_OPTIONS} />
      </div>
      <div>
        <label className="block text-[8px] text-[#8b8b8b] uppercase">Font</label>
        <MiniSelect value={font} onChange={onFontChange} options={FONT_OPTIONS} />
      </div>
      <div>
        <label className="block text-[8px] text-[#8b8b8b] uppercase">Size</label>
        <MiniSelect value={size} onChange={onSizeChange} options={sizeOptions} />
      </div>
    </div>
  );
}
