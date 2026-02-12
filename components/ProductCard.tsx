import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/shopify/types";

function formatPrice(amount: string, currencyCode: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
  }).format(parseFloat(amount));
}

export default function ProductCard({ product }: { product: Product }) {
  const { minVariantPrice } = product.priceRange;
  const image = product.featuredImage;

  return (
    <Link
      href={`/product/${product.handle}`}
      className="group block overflow-hidden rounded-lg bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      {/* Image */}
      <div className="relative aspect-square w-full overflow-hidden bg-zinc-200">
        {image ? (
          <Image
            src={image.url}
            alt={image.altText ?? product.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-zinc-400">
            No image
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="truncate text-sm font-medium text-foreground">
          {product.title}
        </h3>
        <p className="mt-1 text-sm text-foreground/60">
          {formatPrice(minVariantPrice.amount, minVariantPrice.currencyCode)}
        </p>
      </div>
    </Link>
  );
}
