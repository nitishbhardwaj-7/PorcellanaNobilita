import React, { Suspense } from "react";
import HomeClient from "@/components/HomeClient";
import { getStaticPageMetadata } from "@/lib/staticPageMeta";

export const revalidate = 0; // Ensure fresh data on every request

export async function generateMetadata() {
  return getStaticPageMetadata(
    "home",
    "Porcellana Nobilita — IL GRES IMPERIALE D'ITALIA",
    "Luxury Italian porcelain slabs — Nobilita's imperial gres, crafted in Italy for architects, designers and discerning homeowners."
  );
}

export default async function Home() {
  return (
    <Suspense fallback={null}>
      <HomeClient cmsData={null} />
    </Suspense>
  );
}
