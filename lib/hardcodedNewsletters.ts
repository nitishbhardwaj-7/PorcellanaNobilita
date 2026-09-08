export interface NewsletterContentBlock {
  type: "paragraph" | "heading" | "point" | "image";
  text?: string;
  title?: string;
  src?: string;
  alt?: string;
}

export interface ProductSpec {
  productName: string;
  slabImage: string;
  dimensions: string[];
  faces: string[];
  finishes: string[];
  inspirationLine1?: string;
  inspirationLine2?: string;
}

export interface NewsletterPost {
  id: string;
  slug: string;
  title: string;
  bannerTagline: string;
  subtitle: string;
  heroImage: string;
  heroImageAlt?: string;
  date: string;
  author: string;
  productSpec: ProductSpec;
  content: NewsletterContentBlock[];
  seoTitle?: string;
  seoDescription?: string;
}

export const HARDCODED_NEWSLETTERS: NewsletterPost[] = [
  {
    id: "macchia-vecchia-max",
    slug: "macchia-vecchia-max",
    title: "MACCHIA VECCHIA MAX",
    bannerTagline: "Il Gres Imperiale d'Italia",
    subtitle: "A collection where timeless Italian elegance meets advanced porcelain technology.",
    heroImage: "/images/Nobilita Newsletter/Links/Macchia Vecchia Max App.jpg",
    heroImageAlt: "Macchia Vecchia Max luxury porcelain slab application",
    date: "2026-07-28",
    author: "NOBILITA Editorial Team",
    productSpec: {
      productName: "MACCHIA VECCHIA MAX",
      slabImage: "/images/Nobilita Newsletter/Links/Macchia Vechhia Max 1A.jpg",
      dimensions: [
        "6.5MM x 1600 x 3200 (R)",
        "12MM x 1620 x 3240 (G)"
      ],
      faces: [
        "6.5MM – BOOKMATCH OF 1",
        "12MM – BOOKMATCH OF 1"
      ],
      finishes: [
        "6.5MM – POLISHED & MATTE",
        "12MM – POLISHED & MATTE"
      ],
      inspirationLine1: "Inspired by Italy's noble heritage and baroque architecture,",
      inspirationLine2: "Porcellana NOBILITA is proudly made in Modena, Italy."
    },
    content: [
      {
        type: "paragraph",
        text: "Macchia Vecchia Max brings the iconic dramatic movement of gold and warm caramel veining over a luminous ivory porcelain body. Crafted with extraordinary detail, it stands as a testament to Italian design excellence and surface innovation."
      },
      {
        type: "heading",
        text: "Masterful Vein Matching & Performance"
      },
      {
        type: "paragraph",
        text: "Produced in Modena, Italy, Macchia Vecchia Max is engineered for grand architectural installations. Its ultra-durable, zero-porosity finish resists acids, heat, and daily wear while displaying breathtaking natural stone dynamics."
      },
      {
        type: "point",
        title: "Seamless Bookmatching",
        text: "Precision-engineered graphics enable flawless bookmatched wall features for double-height spaces and luxury bathrooms."
      },
      {
        type: "point",
        title: "Dual Thickness Versatility",
        text: "Offered in 6.5mm for wall cladding and 12mm for heavy-duty kitchen islands and vanity countertops."
      }
    ],
    seoTitle: "Macchia Vecchia Max | Italian Porcelain Newsletter | NOBILITA",
    seoDescription: "Explore Macchia Vecchia Max — A collection where timeless Italian elegance meets advanced porcelain technology."
  }
];

export function getNewsletterBySlug(slug: string): NewsletterPost {
  const found = HARDCODED_NEWSLETTERS.find((n) => n.slug === slug || n.id === slug);
  if (found) return found;

  // Generic fallback if slug is customized
  const formattedTitle = slug.replace(/-/g, " ").toUpperCase();
  return {
    id: slug,
    slug: slug,
    title: formattedTitle,
    bannerTagline: "Il Gres Imperiale d'Italia",
    subtitle: "A collection where timeless Italian elegance meets advanced porcelain technology.",
    heroImage: "/images/Nobilita Newsletter/Links/Macchia Vecchia Max App.jpg",
    heroImageAlt: `${formattedTitle} porcelain slab application`,
    date: "2026-07-28",
    author: "NOBILITA Editorial Team",
    productSpec: {
      productName: formattedTitle,
      slabImage: "/images/Nobilita Newsletter/Links/Macchia Vechhia Max 1A.jpg",
      dimensions: [
        "6.5MM x 1600 x 3200 (R)",
        "12MM x 1620 x 3240 (G)"
      ],
      faces: [
        "6.5MM – BOOKMATCH OF 1",
        "12MM – BOOKMATCH OF 1"
      ],
      finishes: [
        "6.5MM – POLISHED & MATTE",
        "12MM – POLISHED & MATTE"
      ],
      inspirationLine1: "Inspired by Italy's noble heritage and baroque architecture,",
      inspirationLine2: "Porcellana NOBILITA is proudly made in Modena, Italy."
    },
    content: [
      {
        type: "paragraph",
        text: `${formattedTitle} represents the pinnacle of Italian porcelain innovation, combining rich aesthetic artistry with unmatched structural performance.`
      }
    ],
    seoTitle: `${formattedTitle} | Italian Porcelain Newsletter | NOBILITA`,
    seoDescription: `Explore ${formattedTitle} — A collection where timeless Italian elegance meets advanced porcelain technology.`
  };
}
