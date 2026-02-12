"use client";

import { useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  updateCartLineAction,
  removeFromCartAction,
} from "@/lib/shopify/actions";
import type { CartLine, Money } from "@/lib/shopify/types";

function formatPrice(money: Money) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: money.currencyCode,
  }).format(parseFloat(money.amount));
}

export default function CartLineItem({ line }: { line: CartLine }) {
  const [isPending, startTransition] = useTransition();
  const { merchandise } = line;
  const image = merchandise.image;

  // Filter out "Default Title" from variant options
  const variantLabel = merchandise.selectedOptions
    .filter((o) => o.value !== "Default Title")
    .map((o) => o.value)
    .join(" / ");

  function handleQuantity(newQty: number) {
    startTransition(async () => {
      if (newQty <= 0) {
        await removeFromCartAction([line.id]);
      } else {
        await updateCartLineAction(line.id, newQty);
      }
    });
  }

  function handleRemove() {
    startTransition(async () => {
      await removeFromCartAction([line.id]);
    });
  }

  return (
    <div
      className={`flex gap-4 py-5 transition-opacity ${isPending ? "opacity-50" : ""}`}
    >
      {/* Image */}
      <Link
        href={`/product/${merchandise.product.handle}`}
        className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md bg-white"
      >
        {image ? (
          <Image
            src={image.url}
            alt={image.altText ?? merchandise.product.title}
            fill
            sizes="96px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-zinc-400">
            No image
          </div>
        )}
      </Link>

      {/* Details */}
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <Link
            href={`/product/${merchandise.product.handle}`}
            className="text-sm font-medium text-foreground hover:underline"
          >
            {merchandise.product.title}
          </Link>
          {variantLabel && (
            <p className="mt-0.5 text-xs text-foreground/50">{variantLabel}</p>
          )}
        </div>

        {/* Quantity controls + remove */}
        <div className="mt-2 flex items-center gap-3">
          <div className="flex items-center rounded-md border border-foreground/15 bg-white">
            <button
              type="button"
              onClick={() => handleQuantity(line.quantity - 1)}
              disabled={isPending}
              className="flex h-8 w-8 items-center justify-center text-sm text-foreground/60 transition-colors hover:text-foreground disabled:opacity-40"
              aria-label="Decrease quantity"
            >
              -
            </button>
            <span className="flex h-8 w-8 items-center justify-center text-sm font-medium text-foreground">
              {line.quantity}
            </span>
            <button
              type="button"
              onClick={() => handleQuantity(line.quantity + 1)}
              disabled={isPending}
              className="flex h-8 w-8 items-center justify-center text-sm text-foreground/60 transition-colors hover:text-foreground disabled:opacity-40"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          <button
            type="button"
            onClick={handleRemove}
            disabled={isPending}
            className="text-xs text-foreground/40 transition-colors hover:text-red-500 disabled:opacity-40"
          >
            Remove
          </button>
        </div>
      </div>

      {/* Prices */}
      <div className="flex shrink-0 flex-col items-end justify-between">
        <span className="text-sm font-medium text-foreground">
          {formatPrice(line.cost.totalAmount)}
        </span>
        {line.quantity > 1 && (
          <span className="text-xs text-foreground/40">
            {formatPrice(line.cost.amountPerQuantity)} each
          </span>
        )}
      </div>
    </div>
  );
}
