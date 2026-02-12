import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-foreground/10 bg-background">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-8 text-sm text-foreground/50 sm:flex-row sm:justify-between sm:px-6 lg:px-8">
        <p>&copy; {new Date().getFullYear()} GRBG. All rights reserved.</p>

        <nav className="flex gap-6">
          <Link
            href="/products"
            className="transition-colors hover:text-foreground"
          >
            Products
          </Link>
          <Link
            href="/cart"
            className="transition-colors hover:text-foreground"
          >
            Cart
          </Link>
        </nav>
      </div>
    </footer>
  );
}
