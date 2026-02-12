"use client";

import ErrorState from "@/components/ErrorState";

export default function CartError({ reset }: { reset: () => void }) {
  return (
    <ErrorState
      message="We couldn't load your cart. Please try again."
      reset={reset}
    />
  );
}
