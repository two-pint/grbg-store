"use client";

import { useState, useTransition } from "react";
import { addToCartAction } from "@/lib/shopify/actions";
import type {
  ProductVariant,
  ProductOption,
  Money,
} from "@/lib/shopify/types";

function formatPrice(money: Money) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: money.currencyCode,
  }).format(parseFloat(money.amount));
}

export default function ProductForm({
  variants,
  options,
}: {
  variants: ProductVariant[];
  options: ProductOption[];
}) {
  // Build initial selections from the first variant
  const initialSelections: Record<string, string> = {};
  if (variants.length > 0) {
    for (const opt of variants[0].selectedOptions) {
      initialSelections[opt.name] = opt.value;
    }
  }

  const [selections, setSelections] =
    useState<Record<string, string>>(initialSelections);
  const [isPending, startTransition] = useTransition();
  const [added, setAdded] = useState(false);

  // Find the variant that matches the current selections
  const selectedVariant = variants.find((v) =>
    v.selectedOptions.every((opt) => selections[opt.name] === opt.value),
  );

  // Filter to meaningful options (more than one value, and not "Default Title")
  const meaningfulOptions = options.filter(
    (opt) => opt.values.length > 1 || opt.values[0] !== "Default Title",
  );
  const hasOptions = meaningfulOptions.some((opt) => opt.values.length > 1);

  function handleOptionChange(optionName: string, value: string) {
    setSelections((prev) => ({ ...prev, [optionName]: value }));
    setAdded(false);
  }

  function handleAddToCart() {
    if (!selectedVariant || !selectedVariant.availableForSale) return;

    startTransition(async () => {
      await addToCartAction(selectedVariant.id, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 3000);
    });
  }

  const isUnavailable = selectedVariant && !selectedVariant.availableForSale;

  return (
    <div className="flex flex-col gap-6">
      {/* Price */}
      {selectedVariant && (
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-semibold text-foreground">
            {formatPrice(selectedVariant.price)}
          </span>
          {selectedVariant.compareAtPrice && (
            <span className="text-sm text-foreground/40 line-through">
              {formatPrice(selectedVariant.compareAtPrice)}
            </span>
          )}
        </div>
      )}

      {/* Variant options */}
      {hasOptions &&
        meaningfulOptions.map((option) => (
          <fieldset key={option.id} className="flex flex-col gap-2">
            <legend className="text-sm font-medium text-foreground">
              {option.name}
            </legend>
            <div className="flex flex-wrap gap-2">
              {option.values.map((value) => {
                const isSelected = selections[option.name] === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => handleOptionChange(option.name, value)}
                    className={`rounded-md border px-4 py-2 text-sm font-medium transition-colors ${
                      isSelected
                        ? "border-foreground bg-foreground text-background"
                        : "border-foreground/20 bg-white text-foreground hover:border-foreground/40"
                    }`}
                  >
                    {value}
                  </button>
                );
              })}
            </div>
          </fieldset>
        ))}

      {/* Add to cart */}
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={isPending || !selectedVariant || isUnavailable}
        className={`flex h-12 w-full items-center justify-center rounded-full text-sm font-semibold transition-colors ${
          added
            ? "bg-green-600 text-white"
            : isUnavailable
              ? "cursor-not-allowed bg-foreground/20 text-foreground/40"
              : "bg-foreground text-background hover:bg-foreground/85"
        } disabled:cursor-not-allowed disabled:opacity-60`}
      >
        {isPending
          ? "Adding..."
          : added
            ? "Added to cart!"
            : isUnavailable
              ? "Sold out"
              : "Add to Cart"}
      </button>
    </div>
  );
}
