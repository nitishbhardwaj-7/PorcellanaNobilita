import { notFound } from "next/navigation";

// Services have been replaced by the Products catalogue.
// This route is kept as a tombstone to prevent 404 errors on old bookmarked URLs.
export default async function ServiceDetailPage() {
  notFound();
}
