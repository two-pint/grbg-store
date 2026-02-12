"use client";

import ErrorState from "@/components/ErrorState";

export default function ProductDetailError({ reset }: { reset: () => void }) {
  return (
    <ErrorState
      message="We couldn't load this product. Please try again."
      reset={reset}
    />
  );
}
