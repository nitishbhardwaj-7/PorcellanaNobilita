import NewsletterForm from "@/app/admin/newsletter-posts/NewsletterForm";

export default function EditNewsletterPage({ params }: { params: { id: string } }) {
  return <NewsletterForm newsletterId={params.id} />;
}
