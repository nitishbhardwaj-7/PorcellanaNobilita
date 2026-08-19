"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Cosmetic deterrent only — disables right-click, text selection/copy, and common
 * DevTools/view-source keyboard shortcuts on the public site. This does NOT prevent
 * anyone from actually reading the page's content (Network tab, `view-source:`,
 * disabling JS, curl, etc. all bypass it trivially) — it only discourages casual
 * right-click/select/keyboard access.
 *
 * Skipped entirely on /admin so editors can still use DevTools and select/copy text
 * while managing the CMS. Form inputs/textareas are also exempted everywhere else so
 * visitors can still select and copy what they've typed (see .no-select in globals.css).
 */
export default function DisableInspect() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  useEffect(() => {
    document.body.classList.toggle("no-select", !isAdmin);
    if (isAdmin) return;

    const isEditableTarget = (target: EventTarget | null) => {
      // target isn't always an Element (e.g. document itself when nothing is
      // focused) — closest() would throw on anything else.
      if (!(target instanceof Element)) return false;
      return !!target.closest('input, textarea, [contenteditable="true"]');
    };

    const blockContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    const blockCopy = (e: ClipboardEvent) => {
      if (isEditableTarget(e.target)) return;
      e.preventDefault();
    };

    const blockShortcuts = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();

      // F12 — most common DevTools shortcut
      if (e.key === "F12") {
        e.preventDefault();
        return;
      }

      // Ctrl/Cmd + Shift + I / J / C — DevTools (Inspect / Console / Element picker)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && ["i", "j", "c"].includes(key)) {
        e.preventDefault();
        return;
      }

      // Ctrl/Cmd + U — View Source
      if ((e.ctrlKey || e.metaKey) && key === "u") {
        e.preventDefault();
        return;
      }

      // Ctrl/Cmd + A / C — Select All / Copy (skipped inside form fields)
      if ((e.ctrlKey || e.metaKey) && ["a", "c"].includes(key) && !isEditableTarget(e.target)) {
        e.preventDefault();
        return;
      }
    };

    document.addEventListener("contextmenu", blockContextMenu);
    document.addEventListener("copy", blockCopy);
    document.addEventListener("keydown", blockShortcuts);

    return () => {
      document.body.classList.remove("no-select");
      document.removeEventListener("contextmenu", blockContextMenu);
      document.removeEventListener("copy", blockCopy);
      document.removeEventListener("keydown", blockShortcuts);
    };
  }, [isAdmin]);

  return null;
}
