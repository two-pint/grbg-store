import type { Metadata } from "next";
import { getProducts } from "@/lib/shopify/products";
import ProductCard from "@/components/ProductCard";

// Re-fetch product data at most every 60 seconds
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Products",
  description: "Browse the full GRBG collection.",
};

export default async function ProductsPage() {
  const products = await getProducts(50);

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        All Products
      </h1>

      {products.length === 0 ? (
        <p className="text-foreground/60">No products available right now.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
