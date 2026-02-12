"use client";

import ErrorState from "@/components/ErrorState";

export default function ProductsError({ reset }: { reset: () => void }) {
  return (
    <ErrorState
      message="We couldn't load the products. Please try again."
      reset={reset}
    />
  );
}
