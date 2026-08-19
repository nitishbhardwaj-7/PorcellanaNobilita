import React, { Suspense } from "react";
import HomeClient from "@/components/HomeClient";

export const revalidate = 0; // Ensure fresh data on every request

export default async function Home() {
  return (
    <Suspense fallback={null}>
      <HomeClient cmsData={null} />
    </Suspense>
  );
}
