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
    id: "paonazzetto-inizio",
    slug: "paonazzetto-inizio",
    title: "PAONAZZETTO INIZIO",
    bannerTagline: "Il Gres Imperiale d'Italia",
    subtitle: "A collection where timeless Italian elegance meets advanced porcelain technology.",
    heroImage: "/images/newsletter page images/newsletter.png",
    heroImageAlt: "Paonazzetto Inizio luxury porcelain slab bathroom application",
    date: "2026-07-28",
    author: "NOBILITA Editorial Team",
    productSpec: {
      productName: "PAONAZZETTO INIZIO",
      slabImage: "/images/Links/Paonazzetto Inizio 1.jpg",
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
        text: "The Paonazzetto Inizio collection embodies the grandeur of classical Italian marble reconstituted through next-generation porcelain engineering. With distinct gold and violet veining moving gracefully across a translucent white body, each slab serves as an architectural centerpiece for high-end luxury interiors."
      },
      {
        type: "heading",
        text: "Artisanal Heritage Meets Sassuolo Precision"
      },
      {
        type: "paragraph",
        text: "Manufactured in Sassuolo, Italy, Paonazzetto Inizio is crafted using multi-layered mineral distribution techniques. The result is a surface with organic tactile depth, zero porosity (<0.05%), and complete resistance to thermal shock, UV exposure, and household staining."
      },
      {
        type: "point",
        title: "Monolithic Bookmatching",
        text: "Designed to allow mirror-matched and continuous vein-matched wall clad installations up to 320 x 160 cm per slab."
      },
      {
        type: "point",
        title: "Versatile Thickness",
        text: "Available in 6mm for lightweight wall cladding and 12mm for high-durability countertops and vanity surfaces."
      }
    ],
    seoTitle: "Paonazzetto Inizio | Italian Porcelain Newsletter | NOBILITA",
    seoDescription: "Explore Paonazzetto Inizio — A collection where timeless Italian elegance meets advanced porcelain technology."
  },
  {
    id: "striato-argento",
    slug: "striato-argento",
    title: "STRIATO ARGENTO",
    bannerTagline: "Il Gres Imperiale d'Italia",
    subtitle: "A collection where timeless Italian elegance meets advanced porcelain technology.",
    heroImage: "/images/newsletter page images/striato-argento-newsletter.webp",
    heroImageAlt: "Striato Argento porcelain application",
    date: "2026-07-28",
    author: "NOBILITA Editorial Team",
    productSpec: {
      productName: "STRIATO ARGENTO",
      slabImage: "/images/Links/Striato argento app 2.jpg",
      dimensions: [
        "6.5MM x 1600 x 3200 (R)",
        "12MM x 1620 x 3240 (G)"
      ],
      faces: [
        "6.5MM – 1 FACE",
        "12MM – 1 FACE"
      ],
      finishes: [
        "6.5MM – MATTE & POLISHED",
        "12MM – MATTE & POLISHED"
      ],
      inspirationLine1: "Inspired by Italy's noble heritage and baroque architecture,",
      inspirationLine2: "Porcellana NOBILITA is proudly made in Modena, Italy."
    },
    content: [
      {
        type: "paragraph",
        text: "Striato Argento captures the refined linear elegance of silver-veined Italian travertine. Designed for architectural applications requiring clean geometry and understated luxury, it brings balance and depth to grand residential and commercial spaces."
      },
      {
        type: "heading",
        text: "Linear Precision & Unmatched Resilience"
      },
      {
        type: "paragraph",
        text: "Engineered to withstand the demanding climates of the UAE and global luxury destinations, Striato Argento offers an impervious, stain-resistant surface that requires zero maintenance or periodic sealing."
      },
      {
        type: "point",
        title: "Architectural Flow",
        text: "Linear veining guides the eye across expansive flooring and double-height feature walls, creating a sense of infinite space."
      },
      {
        type: "point",
        title: "Full-Body Integrity",
        text: "Produced with high-purity raw minerals for longevity and structural performance."
      }
    ],
    seoTitle: "Striato Argento | Italian Porcelain Newsletter | NOBILITA",
    seoDescription: "Discover Striato Argento — A collection where timeless Italian elegance meets advanced porcelain technology."
  },
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
