import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const slabs = [
  {
    name: "Arabescato Vagli",
    img: "/images/Links/Arabescato Vagli Face 1_1 - Copy.jpg",
    color: "White",
    finish: "Polished",
    config: {
      leftBg: "/images/Links/Arabescato Vagli Face 1_1 - Copy.jpg",
      dimensions: ["6.5MM x 1600 x 3200 (RECTIFIED)", "12MM x 1620 x 3240 (GROSS)"],
      faces: ["6.5MM – BOOKMATCH OF 1", "12MM – BOOKMATCH OF 1"],
      finishes: ["6.5MM – POLISHED & HONED", "12MM – POLISHED & HONED"],
      slides: [
        { type: "video", src: "/images/Arbescato Vagli/arbescato vagli.mp4", poster: "/images/Links/Arabescato Vagli Face 1_1 - Copy.jpg", alt: "Arabescato Vagli Video" },
        { type: "image", src: "/images/Arbescato Vagli/Arbescato Vagli (2).jpg", alt: "Arabescato Vagli Slab 1" },
        { type: "image", src: "/images/Arbescato Vagli/Arabescato Vagli (2).jpg", alt: "Arabescato Vagli Slab 2" },
        { type: "image", src: "/images/Arbescato Vagli/Arabescato Vagli (4).jpg", alt: "Arabescato Vagli Slab 3" }
      ],
      bookmatchImg: "/images/Arbescato Vagli/Bookmatch.jpg",
      availableFaces: ["/images/Links/Arabescato Vagli Face 1_1 - Copy.jpg"],
      isHorizontalFace: true
    }
  },
  {
    name: "Calacatta Oyster",
    img: "/images/Links/Calacatta Oyster Face 1.jpg",
    color: "White",
    finish: "3D-5D Matte",
    config: {
      leftBg: "/images/Links/Calacatta Oyster Face 1.jpg",
      dimensions: ["6.5MM x 1600 x 3200 (RECTIFIED)", "12MM x 1620 x 3240 (GROSS)"],
      faces: ["6.5MM – 1  2  3", "12MM – BOOKMATCH OF 2"],
      finishes: ["6.5MM – POLISHED & HONED", "12MM – POLISHED & HONED"],
      slides: [
        { type: "video", src: "/images/Links/Calacatta Oyster Vid.mp4", poster: "/images/Links/Calacatta Oyster Face 1.jpg", alt: "Calacatta Oyster Video" },
        { type: "image", src: "/images/Calacatta Oyster/Calacatta Oyster1.jpg", alt: "Calacatta Oyster Slab 1" },
        { type: "image", src: "/images/Calacatta Oyster/Calacatta Oyster (2).jpg", alt: "Calacatta Oyster Slab 2" }
      ],
      bookmatchImg: "/images/Calacatta Oyster/Bookmatch.jpg",
      availableFaces: [
        "/images/Links/Calacatta Oyster Face 1.jpg",
        "/images/Links/Calacatta Oyster Face 2.jpg",
        "/images/Links/Calacatta Oyster Face 3.jpg"
      ],
      isHorizontalFace: false
    }
  },
  {
    name: "Arabescato Fjord",
    img: "/images/Links/Arbescato Fjord Face 1.jpg",
    color: "White",
    finish: "Matte",
    config: {
      leftBg: undefined,
      dimensions: ["6.5MM x 1600 x 3200 (RECTIFIED)", "12MM x 1620 x 3240 (GROSS)"],
      faces: ["6.5MM – 1 FACE", "12MM – 1 FACE"],
      finishes: ["6.5MM – MATTE", "12MM – MATTE"],
      slides: [
        { type: "image", src: "/images/Links/Arbescato Fjord Face 1.jpg", alt: "Arabescato Fjord Slab" }
      ],
      availableFaces: ["/images/Links/Arbescato Fjord Face 1.jpg"],
      isHorizontalFace: true
    }
  },
  {
    name: "Basaltina",
    img: "/images/Links/Basaltina matte.jpg",
    color: "Green",
    finish: "Honed",
    config: {
      leftBg: "/images/Links/Basaltina matte.jpg",
      dimensions: ["6.5MM x 1600 x 3200 (RECTIFIED)", "12MM x 1620 x 3240 (GROSS)"],
      faces: ["6.5MM – 1 FACE", "12MM – 1 FACE"],
      finishes: ["6.5MM – HONED", "12MM – HONED"],
      slides: [
        { type: "image", src: "/images/NewImages/Basaltina.jpg", alt: "Basaltina Application" },
        { type: "image", src: "/images/Links/Basaltina face 1.jpg", alt: "Basaltina Slab" }
      ],
      availableFaces: ["/images/Links/Basaltina face 1.jpg"],
      isHorizontalFace: true
    }
  },
  {
    name: "Calacatta Borghini",
    img: "/images/Links/Calacatta Borghini 1.jpg",
    color: "Beige",
    finish: "Polished",
    config: {
      leftBg: undefined,
      dimensions: ["6.5MM x 1600 x 3200 (RECTIFIED)", "12MM x 1620 x 3240 (GROSS)"],
      faces: ["6.5MM – 1 FACE", "12MM – BOOKMATCH OF 1"],
      finishes: ["6.5MM – POLISHED", "12MM – POLISHED"],
      slides: [
        { type: "video", src: "/images/Links/materials.mp4", poster: "/images/Links/Calacatta Borghini 1.jpg", alt: "Calacatta Borghini Video" },
        { type: "image", src: "/images/Links/Calacatta Borghini 1.jpg", alt: "Calacatta Borghini Slab" }
      ],
      availableFaces: ["/images/Links/Calacatta Borghini 1.jpg"],
      isHorizontalFace: false
    }
  },
  {
    name: "Calacatta Sponda",
    img: "/images/Links/Calacatta Sponda 1.jpg",
    color: "White",
    finish: "Polished",
    config: {
      leftBg: undefined,
      dimensions: ["6.5MM x 1600 x 3200 (RECTIFIED)", "12MM x 1620 x 3240 (GROSS)"],
      faces: ["6.5MM – 1 FACE", "12MM – 1 FACE"],
      finishes: ["6.5MM – POLISHED", "12MM – POLISHED"],
      slides: [
        { type: "video", src: "/images/Links/materials.mp4", poster: "/images/Links/Calacatta Sponda 1.jpg", alt: "Calacatta Sponda Video" },
        { type: "image", src: "/images/Links/Calacatta Sponda 1.jpg", alt: "Calacatta Sponda Slab" }
      ],
      availableFaces: ["/images/Links/Calacatta Sponda 1.jpg"],
      isHorizontalFace: false
    }
  },
  {
    name: "Calacatta Vagli Rosa",
    img: "/images/Links/Calacatta Vagli Rosa 1.jpg",
    color: "White",
    finish: "Polished",
    config: {
      leftBg: undefined,
      dimensions: ["6.5MM x 1600 x 3200 (RECTIFIED)", "12MM x 1620 x 3240 (GROSS)"],
      faces: ["6.5MM – 1 FACE", "12MM – 1 FACE"],
      finishes: ["6.5MM – POLISHED", "12MM – POLISHED"],
      slides: [
        { type: "video", src: "/images/Links/materials.mp4", poster: "/images/Links/Calacatta Vagli Rosa 1.jpg", alt: "Calacatta Vagli Rosa Video" },
        { type: "image", src: "/images/Links/Calacatta Vagli Rosa 1.jpg", alt: "Calacatta Vagli Rosa Slab" }
      ],
      availableFaces: ["/images/Links/Calacatta Vagli Rosa 1.jpg"],
      isHorizontalFace: false
    }
  },
  {
    name: "Crystallo Bianco",
    img: "/images/Links/crystallo bianco 1.jpg",
    color: "White",
    finish: "Honed",
    config: {
      leftBg: undefined,
      dimensions: ["6.5MM x 1600 x 3200 (RECTIFIED)", "12MM x 1620 x 3240 (GROSS)"],
      faces: ["6.5MM – 1 FACE", "12MM – 1 FACE"],
      finishes: ["6.5MM – HONED", "12MM – HONED"],
      slides: [
        { type: "video", src: "/images/Links/materials.mp4", poster: "/images/Links/crystallo bianco 1.jpg", alt: "Crystallo Bianco Video" },
        { type: "image", src: "/images/Links/crystallo bianco 1.jpg", alt: "Crystallo Bianco Slab" }
      ],
      availableFaces: ["/images/Links/crystallo bianco 1.jpg"],
      isHorizontalFace: false
    }
  },
  {
    name: "Fior Di Melo",
    img: "/images/Links/Fior Di Melo Face 1.jpg",
    color: "White",
    finish: "Matte",
    config: {
      leftBg: undefined,
      dimensions: ["6.5MM x 1600 x 3200 (RECTIFIED)", "12MM x 1620 x 3240 (GROSS)"],
      faces: ["6.5MM – 1 FACE", "12MM – 1 FACE"],
      finishes: ["6.5MM – MATTE", "12MM – MATTE"],
      slides: [
        { type: "video", src: "/images/Links/materials.mp4", poster: "/images/Links/Fior Di Melo Face 1.jpg", alt: "Fior Di Melo Video" },
        { type: "image", src: "/images/Links/Fior Di Melo Face 1.jpg", alt: "Fior Di Melo Slab" }
      ],
      availableFaces: ["/images/Links/Fior Di Melo Face 1.jpg"],
      isHorizontalFace: false
    }
  },
  {
    name: "Onice Bianco",
    img: "/images/Links/Onice Bianco 1.jpg",
    color: "White",
    finish: "Polished",
    config: {
      leftBg: undefined,
      dimensions: ["6.5MM x 1600 x 3200 (RECTIFIED)", "12MM x 1620 x 3240 (GROSS)"],
      faces: ["6.5MM – 1 FACE", "12MM – 1 FACE"],
      finishes: ["6.5MM – POLISHED", "12MM – POLISHED"],
      slides: [
        { type: "video", src: "/images/Links/materials.mp4", poster: "/images/Links/Onice Bianco 1.jpg", alt: "Onice Bianco Video" },
        { type: "image", src: "/images/Links/Onice Bianco 1.jpg", alt: "Onice Bianco Slab" }
      ],
      availableFaces: ["/images/Links/Onice Bianco 1.jpg"],
      isHorizontalFace: false
    }
  },
  {
    name: "Onice Black & White",
    img: "/images/Links/Onice Black & White Face 1_1.jpg",
    color: "Green",
    finish: "3D-5D Matte",
    config: {
      leftBg: undefined,
      dimensions: ["6.5MM x 1600 x 3200 (RECTIFIED)", "12MM x 1620 x 3240 (GROSS)"],
      faces: ["6.5MM – 1 FACE", "12MM – BOOKMATCH OF 1"],
      finishes: ["6.5MM – 3D-5D MATTE", "12MM – 3D-5D MATTE"],
      slides: [
        { type: "video", src: "/images/Links/materials.mp4", poster: "/images/Links/Onice Black & White Face 1_1.jpg", alt: "Onice Black & White Video" },
        { type: "image", src: "/images/Links/Onice Black & White Face 1_1.jpg", alt: "Onice Black & White Slab" }
      ],
      availableFaces: ["/images/Links/Onice Black & White Face 1_1.jpg"],
      isHorizontalFace: false
    }
  },
  {
    name: "Paonazzetto Inizio",
    img: "/images/Links/Paonazzetto Inizio 1.jpg",
    color: "White",
    finish: "Matte",
    config: {
      leftBg: undefined,
      dimensions: ["6.5MM x 1600 x 3200 (RECTIFIED)", "12MM x 1620 x 3240 (GROSS)"],
      faces: ["6.5MM – 1 FACE", "12MM – 1 FACE"],
      finishes: ["6.5MM – MATTE", "12MM – MATTE"],
      slides: [
        { type: "video", src: "/images/Links/materials.mp4", poster: "/images/Links/Paonazzetto Inizio 1.jpg", alt: "Paonazzetto Inizio Video" },
        { type: "image", src: "/images/Links/Paonazzetto Inizio 1.jpg", alt: "Paonazzetto Inizio Slab" }
      ],
      availableFaces: ["/images/Links/Paonazzetto Inizio 1.jpg"],
      isHorizontalFace: false
    }
  },
  {
    name: "Macchia Vecchia Max",
    img: "/images/Macchia Vecchia Max.jpeg",
    color: "White",
    finish: "Polished",
    config: {
      leftBg: "/images/Macchia Vecchia Max.jpeg",
      dimensions: ["6.5MM x 1600 x 3200 (RECTIFIED)", "12MM x 1620 x 3240 (GROSS)"],
      faces: ["6.5MM – 1 FACE", "12MM – 1 FACE"],
      finishes: ["6.5MM – POLISHED", "12MM – POLISHED"],
      slides: [
        { type: "image", src: "/images/Macchia Vecchia Max App.jpg", alt: "Macchia Vecchia Max Application" }
      ],
      availableFaces: ["/images/Macchia Vecchia Max.jpeg"],
      isHorizontalFace: false
    }
  },
  {
    name: "Statuario Ultimo",
    img: "/images/Links/Statuario Ultimo 1.jpg",
    color: "White",
    finish: "Honed",
    config: {
      leftBg: undefined,
      dimensions: ["6.5MM x 1600 x 3200 (RECTIFIED)", "12MM x 1620 x 3240 (GROSS)"],
      faces: ["6.5MM – 1 FACE", "12MM – 1 FACE"],
      finishes: ["6.5MM – HONED", "12MM – HONED"],
      slides: [
        { type: "video", src: "/images/Links/materials.mp4", poster: "/images/Links/Statuario Ultimo 1.jpg", alt: "Statuario Ultimo Video" },
        { type: "image", src: "/images/Links/Statuario Ultimo 1.jpg", alt: "Statuario Ultimo Slab" }
      ],
      availableFaces: ["/images/Links/Statuario Ultimo 1.jpg"],
      isHorizontalFace: false
    }
  },
  {
    name: "Travertino Romano Classico Cross Cut",
    img: "/images/Links/Travertino CC 1.jpg",
    color: "Beige",
    finish: "Structured Matte",
    config: {
      leftBg: undefined,
      dimensions: ["6.5MM x 1600 x 3200 (RECTIFIED)", "12MM x 1620 x 3240 (GROSS)"],
      faces: ["6.5MM – 1 FACE", "12MM – 1 FACE"],
      finishes: ["6.5MM – STRUCTURED MATTE", "12MM – STRUCTURED MATTE"],
      slides: [
        { type: "video", src: "/images/Links/materials.mp4", poster: "/images/Links/Travertino CC 1.jpg", alt: "Travertino Romano Classico Cross Cut Video" },
        { type: "image", src: "/images/Links/Travertino CC 1.jpg", alt: "Travertino Romano Classico Cross Cut Slab" }
      ],
      availableFaces: ["/images/Links/Travertino CC 1.jpg"],
      isHorizontalFace: false
    }
  },
  {
    name: "Travertino Romano Classico Vein Cut",
    img: "/images/Travertino vein cut.jpeg",
    color: "Beige",
    finish: "Structured Matte",
    config: {
      leftBg: "/images/Travertino vein cut.jpeg",
      dimensions: ["6.5MM x 1600 x 3200 (RECTIFIED)", "12MM x 1620 x 3240 (GROSS)"],
      faces: ["6.5MM – 1 FACE", "12MM – 1 FACE"],
      finishes: ["6.5MM – STRUCTURED MATTE", "12MM – STRUCTURED MATTE"],
      slides: [
        { type: "image", src: "/images/Travertino vein cut.jpeg", alt: "Travertino Romano Classico Vein Cut" }
      ],
      availableFaces: ["/images/Travertino vein cut.jpeg"],
      isHorizontalFace: false
    }
  },
  {
    name: "Venatino Betogli",
    img: "/images/Links/Venatino betogli 1.jpg",
    color: "White",
    finish: "Polished",
    config: {
      leftBg: undefined,
      dimensions: ["6.5MM x 1600 x 3200 (RECTIFIED)", "12MM x 1620 x 3240 (GROSS)"],
      faces: ["6.5MM – 1 FACE", "12MM – 1 FACE"],
      finishes: ["6.5MM – POLISHED", "12MM – POLISHED"],
      slides: [
        { type: "video", src: "/images/Links/materials.mp4", poster: "/images/Links/Venatino betogli 1.jpg", alt: "Venatino Betogli Video" },
        { type: "image", src: "/images/Links/Venatino betogli 1.jpg", alt: "Venatino Betogli Slab" }
      ],
      availableFaces: ["/images/Links/Venatino betogli 1.jpg"],
      isHorizontalFace: false
    }
  },
  {
    name: "White Camouflage",
    img: "/images/Links/White Camouflage Face 1.jpg",
    color: "Grey",
    finish: "Structured Matte",
    config: {
      leftBg: undefined,
      dimensions: ["6.5MM x 1600 x 3200 (RECTIFIED)", "12MM x 1620 x 3240 (GROSS)"],
      faces: ["6.5MM – 1 FACE", "12MM – 1 FACE"],
      finishes: ["6.5MM – STRUCTURED MATTE", "12MM – STRUCTURED MATTE"],
      slides: [
        { type: "video", src: "/images/Links/materials.mp4", poster: "/images/Links/White Camouflage Face 1.jpg", alt: "White Camouflage Video" },
        { type: "image", src: "/images/Links/White Camouflage Face 1.jpg", alt: "White Camouflage Slab" }
      ],
      availableFaces: ["/images/Links/White Camouflage Face 1.jpg"],
      isHorizontalFace: false
    }
  },
  {
    name: "Verde Profondo",
    img: "/images/Verde profondo/Verde profondo rotate.jpg",
    color: "Green",
    finish: "Polished",
    config: {
      leftBg: "/images/Verde profondo/Verde profondo rotate.jpg",
      dimensions: ["6.5MM x 1600 x 3200 (RECTIFIED)"],
      faces: ["6.5MM — 1 2 3"],
      finishes: ["6.5MM — POLISHED"],
      slides: [
        { type: "image", src: "/images/Verde profondo/Verde profondo application.jpg", alt: "Verde Profondo Application" },
        { type: "image", src: "/images/Verde profondo/BZ-060139-AMB-1-riv.jpg", alt: "Verde Profondo Interior 1" },
        { type: "image", src: "/images/Verde profondo/BZ-060139-AMB-2-riv.jpg", alt: "Verde Profondo Interior 2" },
        { type: "image", src: "/images/Verde profondo/BZ-060139-AMB-1-PAV.jpg", alt: "Verde Profondo Floor" }
      ],
      availableFaces: [
        "/images/Verde profondo/Verde profondo face 1.jpg",
        "/images/Verde profondo/Verde profondo face 2.jpg",
        "/images/Verde profondo/Verde profondo face 3.jpg"
      ],
      isHorizontalFace: false
    }
  },
  {
    name: "Ferro Industriale",
    img: "/images/Ferro Industriale/Ferro Industriale.jpg",
    color: "Grey",
    finish: "Matte",
    config: {
      leftBg: "/images/Ferro Industriale/Ferro Industriale.jpg",
      dimensions: ["6.5MM x 1600 x 3200 (RECTIFIED)", "12MM x 1620 x 3240 (GROSS)"],
      faces: ["6.5MM — 1", "12MM — 1"],
      finishes: ["6.5MM — MATTE", "12MM — MATTE"],
      slides: [
        { type: "image", src: "/images/Ferro Industriale/Ferro Industriale (2).jpg", alt: "Ferro Industriale Application 2" },
        { type: "image", src: "/images/Ferro Industriale/Ferro Industriale (1).jpg", alt: "Ferro Industriale Application 1" },
        { type: "image", src: "/images/Ferro Industriale/Ferro Industriale (3).jpg", alt: "Ferro Industriale Application 3" }
      ],
      availableFaces: ["/images/Ferro Industriale/Ferro Industriale.jpg"],
      isHorizontalFace: false
    }
  }
];

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

async function main() {
  console.log("Seeding products...");
  
  // Clear existing products
  await prisma.product.deleteMany({});
  
  for (let i = 0; i < slabs.length; i++) {
    const slab = slabs[i];
    const slug = slugify(slab.name);
    
    await prisma.product.create({
      data: {
        name: slab.name,
        slug: slug,
        color: slab.color,
        finish: slab.finish,
        coverImage: slab.img,
        leftBg: slab.config.leftBg || null,
        dimensions: slab.config.dimensions,
        faces: slab.config.faces,
        finishes: slab.config.finishes,
        slides: JSON.parse(JSON.stringify(slab.config.slides)),
        availableFaces: slab.config.availableFaces,
        bookmatchImg: slab.config.bookmatchImg || null,
        isHorizontalFace: slab.config.isHorizontalFace || false,
        status: "PUBLISHED",
        order: (i + 1) * 10
      }
    });
    
    console.log(`Created product: ${slab.name}`);
  }
  
  console.log("Seeding finished successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
