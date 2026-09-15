// Classifies a submitted email address as "Personal" (a free consumer email
// provider like Gmail) or "Professional" (a company's own domain) — used on
// Admin > Queries to show how many enquiries come from each. Not
// scientifically precise (a company could still be using a Gmail address,
// and vice versa) — it's a best-effort classification based on the domain
// belonging to a known free/consumer email provider.
const FREE_EMAIL_DOMAINS = new Set([
  // Google
  "gmail.com", "googlemail.com",
  // Yahoo
  "yahoo.com", "yahoo.co.uk", "yahoo.co.in", "yahoo.co.jp", "yahoo.ca",
  "yahoo.com.au", "yahoo.fr", "yahoo.de", "ymail.com", "rocketmail.com",
  // Microsoft
  "outlook.com", "hotmail.com", "hotmail.co.uk", "hotmail.fr", "live.com",
  "msn.com", "passport.com",
  // Apple
  "icloud.com", "me.com", "mac.com",
  // Other well-known free providers
  "aol.com", "protonmail.com", "proton.me", "pm.me", "gmx.com", "gmx.net",
  "mail.com", "zoho.com", "yandex.com", "yandex.ru", "rediffmail.com",
  "tutanota.com", "fastmail.com", "inbox.com", "hushmail.com",
  // Common regional/China free providers
  "qq.com", "163.com", "126.com", "sina.com", "foxmail.com",
]);

export type EmailClassification = "Personal" | "Professional";

export function classifyEmail(email: string | null | undefined): EmailClassification {
  if (!email) return "Professional";
  const domain = email.split("@")[1]?.trim().toLowerCase();
  if (!domain) return "Professional";
  return FREE_EMAIL_DOMAINS.has(domain) ? "Personal" : "Professional";
}
