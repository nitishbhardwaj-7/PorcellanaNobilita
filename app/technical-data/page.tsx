import { getStaticPageMetadata } from "@/lib/staticPageMeta";
import TechnicalDataClient from "./TechnicalDataClient";

export async function generateMetadata() {
  return getStaticPageMetadata(
    "technical-data",
    "Technical Resources",
    "Technical specifications, thicknesses, and care guidance for Porcellana Nobilita's porcelain slabs."
  );
}

export default function TechnicalDataPage() {
  return <TechnicalDataClient />;
}
