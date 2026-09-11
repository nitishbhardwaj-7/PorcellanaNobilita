"use client";

import React from "react";
import { COLOR_OPTIONS, FONT_OPTIONS } from "@/lib/textStyle";

// A field's Color / Font / Size — three plain <select> dropdowns in a row.
// Shared across every admin page that exposes per-field text styling
// (Homepage, Our Story, Made in Italy, Technical Data, Newsletter Posts) so
// the control markup only exists once.

// Maps a human default label (as passed to StyleRow) to the literal option
// value it duplicates, so that option can be dropped from the list below.
const DEFAULT_LABEL_TO_VALUE: Record<string, string> = {
  Black: "black",
  Teal: "teal",
  Grey: "grey",
  White: "white",
  Ivymode: "ivymode",
  Michroma: "michroma",
};

// Replaces the "Default" option's label with "<actual value> (Default)" so
// admins can see what "Default" resolves to for THIS field without having
// to check the live page — e.g. "Ivymode (Default)" instead of a bare
// "Default". When the matched option's own label carries a color code (e.g.
// COLOR_OPTIONS' "Grey (#545759)"), that code is pulled in too — "Grey
// (#545759) (Default)" — read straight from COLOR_OPTIONS so it can never
// drift out of sync if the code ever changes there. Also drops the plain
// option that would otherwise duplicate it (e.g. a separate "Ivymode"
// sitting right below "Ivymode (Default)") — the relabeled Default option
// already covers that choice. The duplicate is kept, unrelabeled, if it's
// the field's *current* stored value — e.g. a field explicitly saved as
// "ivymode" before this field had a default label keeps its own distinct
// "Ivymode" option so the dropdown still shows a real selection instead of
// silently falling back to none. Leaves every other option (and the whole
// list, when no label is given) untouched.
function withDefaultLabel(
  options: { value: string; label: string }[],
  actualLabel: string | undefined,
  currentValue: string
): { value: string; label: string }[] {
  if (!actualLabel) return options;
  const duplicateValue = DEFAULT_LABEL_TO_VALUE[actualLabel];
  const matchedOption = options.find((o) => o.value === duplicateValue);
  const codeMatch = matchedOption?.label.match(/\(#[0-9a-fA-F]{3,6}\)/);
  const defaultLabel = codeMatch ? `${actualLabel} ${codeMatch[0]}` : actualLabel;
  return options
    .filter((o) => o.value !== duplicateValue || o.value === currentValue)
    .map((o) => (o.value === "default" ? { ...o, label: `${defaultLabel} (Default)` } : o));
}

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
  colorDefaultLabel,
  fontDefaultLabel,
  sizeDefaultLabel,
}: {
  color: string;
  onColorChange: (v: string) => void;
  font: string;
  onFontChange: (v: string) => void;
  size: string;
  onSizeChange: (v: string) => void;
  sizeOptions: { value: string; label: string }[];
  /** What "Default" actually renders as for this field, e.g. "Black", "White", "Grey", "Teal" — shown as "<label> (Default)". Omit to show a bare "Default". */
  colorDefaultLabel?: string;
  /** What "Default" actually renders as for this field, e.g. "Ivymode", "Michroma". Omit to show a bare "Default". */
  fontDefaultLabel?: string;
  /** Overrides the size dropdown's built-in "Responsive (Default)" label when a field's default is a fixed value rather than responsive. */
  sizeDefaultLabel?: string;
}) {
  return (
    <div className="grid grid-cols-3 gap-2">
      <div>
        <label className="block text-[8px] text-[#8b8b8b] uppercase">Color</label>
        <MiniSelect value={color} onChange={onColorChange} options={withDefaultLabel(COLOR_OPTIONS, colorDefaultLabel, color)} />
      </div>
      <div>
        <label className="block text-[8px] text-[#8b8b8b] uppercase">Font</label>
        <MiniSelect value={font} onChange={onFontChange} options={withDefaultLabel(FONT_OPTIONS, fontDefaultLabel, font)} />
      </div>
      <div>
        <label className="block text-[8px] text-[#8b8b8b] uppercase">Size</label>
        <MiniSelect value={size} onChange={onSizeChange} options={withDefaultLabel(sizeOptions, sizeDefaultLabel, size)} />
      </div>
    </div>
  );
}
