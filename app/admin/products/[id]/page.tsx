import ProductForm from "@/app/admin/products/ProductForm";

export default function EditProductPage({ params }: { params: { id: string } }) {
  return <ProductForm productId={params.id} />;
}
