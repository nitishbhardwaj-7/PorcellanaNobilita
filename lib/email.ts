import nodemailer from "nodemailer";

/**
 * Notification email for form submissions (queries, catalog/datasheet downloads, newsletter signups).
 *
 * Configuration is read entirely from environment variables so nothing is hardcoded here:
 *   EMAIL_HOST  - SMTP host (defaults to Gmail's smtp.gmail.com if EMAIL_USER looks like a gmail address)
 *   EMAIL_PORT  - SMTP port (defaults to 465)
 *   EMAIL_USER  - SMTP auth username / "from" address
 *   EMAIL_PASS  - SMTP auth password (for Gmail this must be an App Password, not the account password)
 *   EMAIL_TO    - where notifications are sent (comma-separated for multiple recipients)
 *
 * If EMAIL_USER / EMAIL_PASS aren't set, sending is silently skipped (submissions still save to the
 * database either way) — this lets the CMS work today and email be switched on later just by adding
 * these env vars, no code changes needed.
 */

const BRAND_BLUE = "#007190";

let cachedTransporter: ReturnType<typeof nodemailer.createTransport> | null = null;

function getTransporter() {
  const { EMAIL_USER, EMAIL_PASS } = process.env;
  if (!EMAIL_USER || !EMAIL_PASS) return null;

  if (!cachedTransporter) {
    const host = process.env.EMAIL_HOST || "smtp.gmail.com";
    const port = Number(process.env.EMAIL_PORT) || 465;

    cachedTransporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user: EMAIL_USER, pass: EMAIL_PASS },
    });
  }

  return cachedTransporter;
}

interface SubmissionEmailData {
  type: "QUERY" | "CATALOG" | "NEWSLETTER" | "DATASHEET";
  name: string;
  email: string;
  phone?: string | null;
  message?: string | null;
  product?: string | null;
  language?: string | null;
  createdAt?: Date | null;
}

// Short label used in the subject line, for quick inbox scanning.
const SUBJECT_LABELS: Record<SubmissionEmailData["type"], string> = {
  QUERY: "New Enquiry",
  CATALOG: "New Catalogue Request",
  NEWSLETTER: "New Newsletter Subscriber",
  DATASHEET: "New Datasheet Request",
};

// Title shown in the email's coloured banner. A plain enquiry reads "Contact Request"
// (matching the reference GLAZE template); a product enquiry names the product directly;
// downloads read as a completed action rather than a generic "request".
function getBannerTitle(data: SubmissionEmailData): string {
  if (data.type === "QUERY") {
    return data.product ? `Product Inquiry for: ${data.product}` : "Contact Request";
  }
  if (data.type === "CATALOG") return "Catalogue Downloaded";
  if (data.type === "DATASHEET") return "Datasheet Downloaded";
  return "Newsletter Subscription";
}

/**
 * Sends a notification email for a new form submission. Never throws — a failed/unconfigured
 * send is logged and swallowed so it can never break the submission API for site visitors.
 */
export async function sendSubmissionNotification(data: SubmissionEmailData): Promise<void> {
  const transporter = getTransporter();
  const to = process.env.EMAIL_TO;

  if (!transporter || !to) {
    console.warn(
      "[email] Skipping notification email — EMAIL_USER/EMAIL_PASS/EMAIL_TO not configured."
    );
    return;
  }

  const subjectLabel = SUBJECT_LABELS[data.type];
  const bannerTitle = getBannerTitle(data);
  // Product-specific enquiries get their own distinct subject line so each one is
  // immediately identifiable in an inbox, rather than a generic "New Enquiry" for everything.
  const subject = data.product
    ? `${subjectLabel}: ${data.product} — ${data.name}`
    : `${subjectLabel} — ${data.name}`;

  const when = (data.createdAt || new Date()).toLocaleString("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Dubai",
  }) + " (Gulf Standard Time)";

  const rows: { label: string; value: string; isLink?: "mailto" }[] = [
    { label: "Name", value: data.name },
    { label: "Email", value: data.email, isLink: "mailto" },
  ];
  if (data.phone) rows.push({ label: "Phone", value: data.phone });
  if (data.product) rows.push({ label: "Product", value: data.product });
  if (data.language) rows.push({ label: "Language", value: data.language });
  if (data.message) rows.push({ label: "Message", value: data.message });
  rows.push({ label: "Received", value: when });

  try {
    await transporter.sendMail({
      from: `"Porcellana Nobilita" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text: [
        `${bannerTitle}`,
        "",
        ...rows.map((r) => `${r.label}: ${r.value}`),
      ].join("\n"),
      html: renderEmailHtml(bannerTitle, rows),
    });
    console.log(`[email] Notification sent to ${to} (${subjectLabel} — ${data.name})`);
  } catch (err) {
    console.error("[email] Failed to send submission notification:", err);
  }
}

function renderEmailHtml(
  bannerTitle: string,
  rows: { label: string; value: string; isLink?: "mailto" }[]
): string {
  // Gmail (and most webmail clients) strip inline base64 images from received mail for
  // security reasons — the logo has to be a real hosted URL. This automatically starts
  // working the moment NEXT_PUBLIC_APP_URL points at a live, publicly-reachable domain;
  // no code change needed then. Until the site is deployed publicly, no image URL can
  // work here — that's a hard requirement of how email image loading works, not
  // something fixable in code.
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://nobilita.com";
  const logoUrl = `${appUrl}/images/email-logo.png`;

  const fieldRows = rows
    .map(
      (r, i) => `
        <tr>
          <td style="padding: 16px 32px; font-family: Arial, Helvetica, sans-serif; font-size: 14px; font-weight: bold; color: #1a1a1a; width: 150px; vertical-align: top; ${
            i < rows.length - 1 ? "border-bottom: 1px solid #eeeeee;" : ""
          }">
            ${escapeHtml(r.label)}
          </td>
          <td style="padding: 16px 32px 16px 0; font-family: Arial, Helvetica, sans-serif; font-size: 14px; color: #1a1a1a; ${
            i < rows.length - 1 ? "border-bottom: 1px solid #eeeeee;" : ""
          }">
            ${
              r.isLink === "mailto"
                ? `<a href="mailto:${escapeHtml(r.value)}" style="color: #1a73c7; text-decoration: underline;">${escapeHtml(r.value)}</a>`
                : escapeHtml(r.value).replace(/\n/g, "<br>")
            }
          </td>
        </tr>`
    )
    .join("");

  return `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background: #f4f4f4; padding: 32px 16px;">
  <tr>
    <td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background: #ffffff; border: 1px solid #dcdcdc; max-width: 600px; width: 100%;">
        <!-- Header: logo -->
        <tr>
          <td style="padding: 28px 32px; text-align: center; border-bottom: 1px solid #eeeeee;">
            <img src="${logoUrl}" width="340" height="125" alt="Porcellana Nobilita" style="display: inline-block; max-width: 220px; height: auto;" />
          </td>
        </tr>
        <!-- Title banner -->
        <tr>
          <td style="background-color: ${BRAND_BLUE}; padding: 14px 32px;">
            <span style="font-family: Arial, Helvetica, sans-serif; color: #ffffff; font-size: 18px; font-weight: bold; letter-spacing: 0.5px;">
              ${escapeHtml(bannerTitle)}
            </span>
          </td>
        </tr>
        <!-- Fields -->
        <tr>
          <td>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              ${fieldRows}
            </table>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background-color: ${BRAND_BLUE}; padding: 14px 32px; text-align: center;">
            <span style="font-family: Arial, Helvetica, sans-serif; color: #ffffff; font-size: 13px; font-weight: bold; letter-spacing: 2px;">
              PORCELLANA NOBILITA
            </span>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
  `;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
