"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

export default function EditService() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [activeTab, setActiveTab] = useState<"content" | "faqs" | "seo">("content");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1. Content Tab
  const [serviceName, setServiceName] = useState("");
  const [slug, setSlug] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED">("DRAFT");
  
  // CTA Subfields
  const [ctaTitle, setCtaTitle] = useState("");
  const [ctaDesc, setCtaDesc] = useState("");
  const [ctaBtnText, setCtaBtnText] = useState("");
  const [ctaBtnLink, setCtaBtnLink] = useState("");

  // 2. FAQs Tab
  const [faqs, setFaqs] = useState<FAQItem[]>([]);

  // 3. SEO Tab
  const [seoTitle, setSeoTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [metaKeywords, setMetaKeywords] = useState("");
  const [canonicalUrl, setCanonicalUrl] = useState("");
  const [ogImage, setOgImage] = useState("");
  const [schemaMarkup, setSchemaMarkup] = useState("");

  useEffect(() => {
    async function fetchServiceDetails() {
      try {
        const res = await fetch(`/api/services/${id}`);
        if (!res.ok) throw new Error("Failed to load service data");
        const data = await res.json();
        const service = data.data;

        setServiceName(service.serviceName);
        setSlug(service.slug);
        setShortDescription(service.shortDescription);
        setLongDescription(service.longDescription);
        setFeaturedImage(service.featuredImage || "");
        setStatus(service.status as "DRAFT" | "PUBLISHED");
        
        const cta = service.ctaSection || {};
        setCtaTitle(cta.title || "");
        setCtaDesc(cta.description || "");
        setCtaBtnText(cta.linkText || "");
        setCtaBtnLink(cta.linkUrl || "");

        setFaqs(service.faqSection || []);

        setSeoTitle(service.seoTitle || "");
        setMetaDescription(service.metaDescription || "");
        setMetaKeywords(service.metaKeywords || "");
        setCanonicalUrl(service.canonicalUrl || "");
        setOgImage(service.ogImage || "");
        setSchemaMarkup(service.schemaMarkup ? JSON.stringify(service.schemaMarkup, null, 2) : "");
      } catch (err: any) {
        setError(err.message || "Failed to load service details");
      } finally {
        setIsLoading(false);
      }
    }

    if (id) fetchServiceDetails();
  }, [id]);

  const handleAddFaq = () => {
    setFaqs([...faqs, { question: "", answer: "" }]);
  };

  const handleUpdateFaq = (index: number, field: keyof FAQItem, value: string) => {
    const updated = [...faqs];
    updated[index][field] = value;
    setFaqs(updated);
  };

  const handleRemoveFaq = (index: number) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSaving(true);

    let parsedSchema = {};
    if (schemaMarkup.trim()) {
      try {
        parsedSchema = JSON.parse(schemaMarkup);
      } catch (err) {
        setError("Invalid JSON format in Schema Markup field.");
        setIsSaving(false);
        return;
      }
    }

    try {
      const res = await fetch(`/api/services/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceName,
          slug,
          shortDescription,
          longDescription,
          featuredImage: featuredImage || null,
          status,
          faqSection: faqs,
          ctaSection: {
            title: ctaTitle || null,
            description: ctaDesc || null,
            linkText: ctaBtnText || null,
            linkUrl: ctaBtnLink || null,
          },
          seoTitle: seoTitle || null,
          metaDescription: metaDescription || null,
          metaKeywords: metaKeywords || null,
          canonicalUrl: canonicalUrl || null,
          ogImage: ogImage || null,
          schemaMarkup: parsedSchema,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update service");
      }

      router.push("/admin/services");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center bg-slate-950 text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-500 border-t-transparent" />
          <p className="text-sm text-slate-400 font-medium">Fetching details...</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/services"
            className="rounded-lg border border-slate-800 p-2 text-slate-400 hover:bg-slate-900 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h2 className="text-xl font-bold text-white font-serif">Edit Service Page</h2>
            <p className="text-sm text-slate-400">Modify service parameters for: {serviceName}</p>
          </div>
        </div>
        <button
          type="submit"
          disabled={isSaving}
          className="flex items-center justify-center gap-2 rounded-xl bg-violet-600 hover:bg-violet-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors disabled:opacity-50 shadow-lg shadow-violet-900/25"
        >
          <Save size={16} />
          {isSaving ? "Saving..." : "Save Service"}
        </button>
      </div>

      {error && (
        <div className="rounded-xl bg-red-950/40 border border-red-800 p-4 text-sm text-red-400 font-medium">
          {error}
        </div>
      )}

      {/* Editor Tabs */}
      <div className="flex border-b border-slate-800">
        <button
          type="button"
          onClick={() => setActiveTab("content")}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "content" ? "border-violet-500 text-white" : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          1. Service Details
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("faqs")}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "faqs" ? "border-violet-500 text-white" : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          2. FAQs Component ({faqs.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("seo")}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "seo" ? "border-violet-500 text-white" : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          3. SEO & Metatags
        </button>
      </div>

      {/* Tab 1: Service Content */}
      {activeTab === "content" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6 rounded-2xl border border-slate-800 bg-slate-900/25 p-6">
            <h3 className="text-md font-serif font-bold text-white border-b border-slate-800 pb-3">Core Content</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Service Name</label>
                <input
                  type="text"
                  required
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  className="block w-full rounded-lg border border-slate-800 bg-slate-950/60 px-4 py-2.5 text-white placeholder-slate-600 focus:border-violet-500 focus:outline-none text-sm transition-all"
                  placeholder="e.g. Bespoke Porcelain Tile Laying"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">URL Slug</label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="block w-full rounded-lg border border-slate-800 bg-slate-950/60 px-4 py-2.5 text-white placeholder-slate-600 focus:border-violet-500 focus:outline-none text-sm transition-all font-mono"
                  placeholder="e.g. tile-laying"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Short Summary Description</label>
              <textarea
                required
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                rows={2}
                className="block w-full rounded-lg border border-slate-800 bg-slate-950/60 px-4 py-2.5 text-white placeholder-slate-600 focus:border-violet-500 focus:outline-none text-sm transition-all resize-none"
                placeholder="Give a brief summary to show on services listings..."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Long HTML / Markdown Description</label>
              <textarea
                required
                value={longDescription}
                onChange={(e) => setLongDescription(e.target.value)}
                rows={8}
                className="block w-full rounded-lg border border-slate-800 bg-slate-950/60 px-4 py-2.5 text-white placeholder-slate-650 focus:border-violet-500 focus:outline-none text-sm transition-all font-mono"
                placeholder="Write detailed service specifications and descriptions here..."
              />
            </div>

            <h3 className="text-md font-serif font-bold text-white border-b border-slate-800 pb-3 pt-4">Call To Action Banner Configuration</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">CTA Banner Title</label>
                <input
                  type="text"
                  value={ctaTitle}
                  onChange={(e) => setCtaTitle(e.target.value)}
                  className="block w-full rounded-lg border border-slate-800 bg-slate-950/60 px-4 py-2.5 text-white focus:border-violet-500 focus:outline-none text-sm transition-all"
                  placeholder="e.g. Looking to elevate your interiors?"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">CTA Banner Description</label>
                <textarea
                  value={ctaDesc}
                  onChange={(e) => setCtaDesc(e.target.value)}
                  rows={2}
                  className="block w-full rounded-lg border border-slate-800 bg-slate-950/60 px-4 py-2.5 text-white focus:border-violet-500 focus:outline-none text-sm transition-all resize-none"
                  placeholder="Invite visitors to inquire or schedule consultation..."
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">CTA Button Label</label>
                <input
                  type="text"
                  value={ctaBtnText}
                  onChange={(e) => setCtaBtnText(e.target.value)}
                  className="block w-full rounded-lg border border-slate-800 bg-slate-950/60 px-4 py-2.5 text-white focus:border-violet-500 focus:outline-none text-sm transition-all"
                  placeholder="e.g. Schedule Consultation"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">CTA Button Link</label>
                <input
                  type="text"
                  value={ctaBtnLink}
                  onChange={(e) => setCtaBtnLink(e.target.value)}
                  className="block w-full rounded-lg border border-slate-800 bg-slate-950/60 px-4 py-2.5 text-white focus:border-violet-500 focus:outline-none text-sm transition-all font-mono"
                  placeholder="e.g. /contact"
                />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/25 p-6 space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Publishing Status</h3>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStatus("DRAFT")}
                  className={`flex-1 rounded-xl px-4 py-2.5 text-xs font-semibold border transition-all ${
                    status === "DRAFT"
                      ? "bg-amber-500/10 text-amber-400 border-amber-500/40"
                      : "bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800"
                  }`}
                >
                  Draft
                </button>
                <button
                  type="button"
                  onClick={() => setStatus("PUBLISHED")}
                  className={`flex-1 rounded-xl px-4 py-2.5 text-xs font-semibold border transition-all ${
                    status === "PUBLISHED"
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/40"
                      : "bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800"
                  }`}
                >
                  Published
                </button>
              </div>

              <div className="pt-4">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Featured Card Image</label>
                <input
                  type="text"
                  value={featuredImage}
                  onChange={(e) => setFeaturedImage(e.target.value)}
                  className="block w-full rounded-lg border border-slate-800 bg-slate-950/60 px-4 py-2.5 text-white placeholder-slate-600 focus:border-violet-500 focus:outline-none text-sm transition-all"
                  placeholder="e.g. /uploads/services/laying.jpg"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: FAQs Accordion List */}
      {activeTab === "faqs" && (
        <div className="space-y-6 max-w-3xl rounded-2xl border border-slate-800 bg-slate-900/25 p-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-md font-serif font-bold text-white">Accordion Frequently Asked Questions</h3>
            <button
              type="button"
              onClick={handleAddFaq}
              className="flex items-center gap-1.5 rounded-lg bg-violet-600/10 hover:bg-violet-600 text-violet-400 hover:text-white px-3 py-1.5 text-xs font-semibold border border-violet-500/20 transition-all"
            >
              <Plus size={14} />
              Add FAQ Row
            </button>
          </div>

          {faqs.length === 0 ? (
            <div className="py-8 text-center text-slate-500 text-xs italic">
              No FAQs added for this service. Click "Add FAQ Row" to add collapsible accordions.
            </div>
          ) : (
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="relative rounded-xl border border-slate-800 bg-slate-950/40 p-4 space-y-3">
                  <button
                    type="button"
                    onClick={() => handleRemoveFaq(index)}
                    className="absolute top-4 right-4 rounded p-1 text-slate-500 hover:bg-red-950/20 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                  <div className="w-[calc(100%-24px)]">
                    <label className="text-[9px] uppercase font-bold text-slate-500">Question</label>
                    <input
                      type="text"
                      required
                      value={faq.question}
                      onChange={(e) => handleUpdateFaq(index, "question", e.target.value)}
                      className="mt-1 block w-full rounded border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white"
                      placeholder="e.g. What is the typical installation time?"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] uppercase font-bold text-slate-500">Answer</label>
                    <textarea
                      required
                      value={faq.answer}
                      onChange={(e) => handleUpdateFaq(index, "answer", e.target.value)}
                      rows={3}
                      className="mt-1 block w-full rounded border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white resize-none"
                      placeholder="Detail the answer response..."
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: SEO Engine Configurations */}
      {activeTab === "seo" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6 rounded-2xl border border-slate-800 bg-slate-900/25 p-6">
            <h3 className="text-md font-serif font-bold text-white border-b border-slate-800 pb-3">Search Engine Options</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Meta Title Tag</label>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  className="block w-full rounded-lg border border-slate-800 bg-slate-950/60 px-4 py-2.5 text-white placeholder-slate-650 focus:border-violet-500 focus:outline-none text-sm transition-all"
                  placeholder="Leave empty to fallback to Service Name"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Meta Description Tag</label>
                <textarea
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  rows={3}
                  className="block w-full rounded-lg border border-slate-800 bg-slate-950/60 px-4 py-2.5 text-white placeholder-slate-650 focus:border-violet-500 focus:outline-none text-sm transition-all resize-none"
                  placeholder="Provide keywords-optimized summaries for search snippets..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Meta Keywords (Comma separated)</label>
                <input
                  type="text"
                  value={metaKeywords}
                  onChange={(e) => setMetaKeywords(e.target.value)}
                  className="block w-full rounded-lg border border-slate-800 bg-slate-950/60 px-4 py-2.5 text-white placeholder-slate-650 focus:border-violet-500 focus:outline-none text-sm transition-all"
                  placeholder="porcelain laying, luxury tile craft, marble installers"
                />
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/25 p-6 space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Social Graph Sharing</h3>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">OG / Twitter Card Image URL</label>
                <input
                  type="text"
                  value={ogImage}
                  onChange={(e) => setOgImage(e.target.value)}
                  className="block w-full rounded-lg border border-slate-800 bg-slate-950/60 px-4 py-2 text-white placeholder-slate-650 focus:border-violet-500 focus:outline-none text-xs transition-all"
                  placeholder="/uploads/services/laying_og.jpg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Canonical Link Override</label>
                <input
                  type="text"
                  value={canonicalUrl}
                  onChange={(e) => setCanonicalUrl(e.target.value)}
                  className="block w-full rounded-lg border border-slate-800 bg-slate-950/60 px-4 py-2 text-white placeholder-slate-650 focus:border-violet-500 focus:outline-none text-xs transition-all font-mono"
                  placeholder="https://site.com/services/laying"
                />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/25 p-6 space-y-2">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Structured Schema JSON</h3>
              <textarea
                value={schemaMarkup}
                onChange={(e) => setSchemaMarkup(e.target.value)}
                rows={5}
                className="block w-full rounded-lg border border-slate-800 bg-slate-950/60 px-4 py-2 text-white placeholder-slate-650 focus:border-violet-500 focus:outline-none text-xs transition-all font-mono"
                placeholder='{ "@context": "https://schema.org", "@type": "Service", "name": "..." }'
              />
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
