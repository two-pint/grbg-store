import type { Metadata } from "next";
import Link from "next/link";
import { getCart } from "@/lib/shopify/cart";
import { getCartId } from "@/lib/shopify/cart-cookie";
import CartLineItem from "@/components/CartLineItem";
import type { Money } from "@/lib/shopify/types";

export const metadata: Metadata = {
  title: "Cart",
};

function formatPrice(money: Money) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: money.currencyCode,
  }).format(parseFloat(money.amount));
}

export default async function CartPage() {
  const cartId = await getCartId();
  const cart = cartId ? await getCart(cartId) : null;
  const lines = cart?.lines.edges.map((e) => e.node) ?? [];

  // Empty state
  if (!cart || lines.length === 0) {
    return (
      <section className="mx-auto flex max-w-7xl flex-col items-center px-4 py-24 text-center sm:px-6 lg:px-8">
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          className="mb-4 stroke-foreground/30"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 01-8 0" />
        </svg>
        <h1 className="text-xl font-semibold text-foreground">
          Your cart is empty
        </h1>
        <p className="mt-2 text-sm text-foreground/50">
          Looks like you haven&apos;t added anything yet.
        </p>
        <Link
          href="/products"
          className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-foreground px-8 text-sm font-semibold text-background transition-colors hover:bg-foreground/85"
        >
          Browse Products
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        Your Cart
      </h1>

      {/* Line items */}
      <div className="divide-y divide-foreground/10">
        {lines.map((line) => (
          <CartLineItem key={line.id} line={line} />
        ))}
      </div>

      {/* Totals */}
      <div className="mt-8 border-t border-foreground/10 pt-6">
        <div className="flex justify-between text-sm text-foreground/60">
          <span>Subtotal</span>
          <span>{formatPrice(cart.cost.subtotalAmount)}</span>
        </div>
        {cart.cost.totalTaxAmount && (
          <div className="mt-1 flex justify-between text-sm text-foreground/60">
            <span>Tax</span>
            <span>{formatPrice(cart.cost.totalTaxAmount)}</span>
          </div>
        )}
        <div className="mt-3 flex justify-between text-base font-semibold text-foreground">
          <span>Total</span>
          <span>{formatPrice(cart.cost.totalAmount)}</span>
        </div>
      </div>

      {/* Checkout */}
      <a
        href={cart.checkoutUrl}
        className="mt-6 flex h-12 w-full items-center justify-center rounded-full bg-foreground text-sm font-semibold text-background transition-colors hover:bg-foreground/85"
      >
        Checkout
      </a>

      <Link
        href="/products"
        className="mt-3 block text-center text-sm text-foreground/50 transition-colors hover:text-foreground"
      >
        Continue shopping
      </Link>
    </section>
  );
}
