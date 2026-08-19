import SubmissionsList from "@/app/admin/_components/SubmissionsList";

export default function NewsletterSubscribersPage() {
  return <SubmissionsList type="NEWSLETTER" label="Newsletter" eyebrow="Subscribers" showMessage={false} />;
}
