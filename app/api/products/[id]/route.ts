import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET single product
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
    });
    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found." },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch product." },
      { status: 500 }
    );
  }
}

// PUT update product
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const {
      name,
      slug,
      description,
      color,
      finish,
      finishCategories,
      thicknessMm,
      dimensions,
      format,
      applications,
      coverImage,
      gallery,
      leftBg,
      faces,
      finishes,
      slides,
      availableFaces,
      bookmatchImg,
      isHorizontalFace,
      isDark,
      order,
      status,
    } = body;

    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        ...(name !== undefined && { name }),
        ...(slug !== undefined && { slug }),
        ...(description !== undefined && { description }),
        ...(color !== undefined && { color }),
        ...(finish !== undefined && { finish }),
        ...(finishCategories !== undefined && { finishCategories }),
        ...(thicknessMm !== undefined && { thicknessMm }),
        ...(dimensions !== undefined && { dimensions }),
        ...(format !== undefined && { format }),
        ...(applications !== undefined && { applications }),
        ...(coverImage !== undefined && { coverImage }),
        ...(gallery !== undefined && { gallery }),
        ...(leftBg !== undefined && { leftBg }),
        ...(faces !== undefined && { faces }),
        ...(finishes !== undefined && { finishes }),
        ...(slides !== undefined && { slides }),
        ...(availableFaces !== undefined && { availableFaces }),
        ...(bookmatchImg !== undefined && { bookmatchImg }),
        ...(isHorizontalFace !== undefined && { isHorizontalFace }),
        ...(isDark !== undefined && { isDark }),
        ...(order !== undefined && { order }),
        ...(status !== undefined && { status }),
      },
    });

    return NextResponse.json({ success: true, data: product });
  } catch (error: any) {
    console.error("PUT Product Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update product." },
      { status: 500 }
    );
  }
}

// DELETE product
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.product.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to delete product." },
      { status: 500 }
    );
  }
}
