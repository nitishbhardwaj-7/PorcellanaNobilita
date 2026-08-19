"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const from = searchParams.get("from") || "/admin";
          router.push(from);
        }
      } catch {
        // not authenticated — stay
      }
    }
    checkAuth();
  }, [router, searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Login failed");

      const from = searchParams.get("from") || "/admin";
      router.push(from);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-[#f8f5f0] px-4"
      style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
    >
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-12">
          <Image
            src="/images/NOBILITA Logo BLACK.png"
            alt="Nobilita"
            width={160}
            height={44}
            className="object-contain mb-6"
          />
          <div className="w-8 h-px bg-[#1a1a1a]/20" />
          <p
            className="mt-4 text-[10px] tracking-[0.3em] uppercase text-[#1a1a1a]/40"
            style={{ fontFamily: "var(--font-michroma), sans-serif" }}
          >
            Content Studio
          </p>
        </div>

        {/* Form card */}
        <div className="bg-white border border-[#1a1a1a]/8 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="border border-red-200 bg-red-50 px-4 py-3 text-[11px] text-red-600 tracking-wide">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-[9px] tracking-[0.3em] uppercase text-[#1a1a1a]/50"
                style={{ fontFamily: "var(--font-michroma), sans-serif" }}
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-3 text-sm text-[#1a1a1a] placeholder-[#1a1a1a]/30 focus:border-[#1a1a1a]/50 focus:outline-none transition-colors"
                placeholder="admin@nobilita.com"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="block text-[9px] tracking-[0.3em] uppercase text-[#1a1a1a]/50"
                style={{ fontFamily: "var(--font-michroma), sans-serif" }}
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full border border-[#1a1a1a]/15 bg-[#f8f5f0] px-4 py-3 text-sm text-[#1a1a1a] placeholder-[#1a1a1a]/30 focus:border-[#1a1a1a]/50 focus:outline-none transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#1a1a1a] px-4 py-3.5 text-[10px] tracking-[0.3em] uppercase text-white hover:bg-[#3d3d3d] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              style={{ fontFamily: "var(--font-michroma), sans-serif" }}
            >
              {isLoading ? "Authenticating..." : "Enter Studio"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-[10px] text-[#1a1a1a]/25 tracking-wider">
          PORCELLANA NOBILITA — IL GRES IMPERIALE D&apos;ITALIA
        </p>
      </div>
    </div>
  );
}

export default function AdminLogin() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
