import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductByHandle } from "@/lib/shopify/products";
import ProductImageGallery from "@/components/ProductImageGallery";
import ProductForm from "@/components/ProductForm";

export const revalidate = 60;

type Props = {
  params: Promise<{ handle: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProductByHandle(handle);

  if (!product) {
    return { title: "Product not found" };
  }

  return {
    title: product.title,
    description: product.description.slice(0, 160),
    openGraph: {
      title: product.title,
      description: product.description.slice(0, 160),
      images: product.featuredImage ? [product.featuredImage.url] : [],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { handle } = await params;
  const product = await getProductByHandle(handle);

  if (!product) {
    notFound();
  }

  const images = product.images.edges.map((e) => e.node);
  const variants = product.variants.edges.map((e) => e.node);

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        {/* Images */}
        <ProductImageGallery images={images} productTitle={product.title} />

        {/* Details */}
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {product.title}
          </h1>

          {/* Variant picker + Add to cart */}
          <ProductForm variants={variants} options={product.options} />

          {/* Description */}
          {product.descriptionHtml && (
            <div
              className="prose prose-zinc mt-4 max-w-none text-sm text-foreground/70"
              dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
            />
          )}
        </div>
      </div>
    </section>
  );
}
