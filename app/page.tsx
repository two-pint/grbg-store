import Link from "next/link";
import { getProducts } from "@/lib/shopify/products";
import ProductCard from "@/components/ProductCard";

// Re-fetch product data at most every 60 seconds
export const revalidate = 60;

export default async function Home() {
  const products = await getProducts(6);

  return (
    <>
      {/* Hero */}
      <section className="flex flex-col items-center justify-center px-4 py-24 text-center sm:py-32">
        <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          Bold designs.{" "}
          <span className="text-accent">Zero&nbsp;compromise.</span>
        </h1>
        <p className="mt-4 max-w-lg text-lg text-foreground/60">
          Original artwork on premium print-on-demand goods — made to order,
          shipped to your&nbsp;door.
        </p>
        <Link
          href="/products"
          className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-foreground px-8 text-sm font-semibold text-background transition-colors hover:bg-foreground/85"
        >
          Shop Now
        </Link>
      </section>

      {/* Featured products */}
      {products.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
          <h2 className="mb-6 text-xl font-semibold tracking-tight text-foreground">
            Featured
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
