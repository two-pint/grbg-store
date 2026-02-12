"use client";

import { useState } from "react";
import Image from "next/image";
import type { Image as ShopifyImage } from "@/lib/shopify/types";

export default function ProductImageGallery({
  images,
  productTitle,
}: {
  images: ShopifyImage[];
  productTitle: string;
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const current = images[selectedIndex];

  if (images.length === 0) {
    return (
      <div className="flex aspect-square w-full items-center justify-center rounded-lg bg-zinc-200 text-zinc-400">
        No image
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-white">
        <Image
          src={current.url}
          alt={current.altText ?? productTitle}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          priority
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((img, i) => (
            <button
              key={img.url}
              type="button"
              onClick={() => setSelectedIndex(i)}
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-md border-2 transition-colors ${
                i === selectedIndex
                  ? "border-indigo-500"
                  : "border-transparent hover:border-foreground/20"
              }`}
            >
              <Image
                src={img.url}
                alt={img.altText ?? `${productTitle} ${i + 1}`}
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
