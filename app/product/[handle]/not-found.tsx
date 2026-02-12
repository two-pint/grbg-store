import Link from "next/link";

export default function ProductNotFound() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col items-center px-4 py-24 text-center sm:px-6 lg:px-8">
      <h1 className="text-6xl font-bold text-foreground/10">404</h1>
      <h2 className="mt-4 text-lg font-semibold text-foreground">
        Product not found
      </h2>
      <p className="mt-1 text-sm text-foreground/50">
        The product you&apos;re looking for doesn&apos;t exist or has been
        removed.
      </p>
      <Link
        href="/products"
        className="mt-6 inline-flex h-10 items-center justify-center rounded-full bg-foreground px-6 text-sm font-semibold text-background transition-colors hover:bg-foreground/85"
      >
        Browse Products
      </Link>
    </div>
  );
}
