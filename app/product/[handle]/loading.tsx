export default function ProductDetailLoading() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        {/* Image skeleton */}
        <div>
          <div className="aspect-square w-full animate-pulse rounded-lg bg-zinc-200" />
          <div className="mt-3 flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-16 w-16 shrink-0 animate-pulse rounded-md bg-zinc-200"
              />
            ))}
          </div>
        </div>

        {/* Details skeleton */}
        <div className="flex flex-col gap-4">
          <div className="h-8 w-3/4 animate-pulse rounded bg-zinc-200" />
          <div className="h-7 w-24 animate-pulse rounded bg-zinc-200" />
          <div className="mt-2 flex flex-wrap gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-10 w-16 animate-pulse rounded-md bg-zinc-200"
              />
            ))}
          </div>
          <div className="mt-4 h-12 w-full animate-pulse rounded-full bg-zinc-200" />
          <div className="mt-6 space-y-2">
            <div className="h-3 w-full animate-pulse rounded bg-zinc-200" />
            <div className="h-3 w-5/6 animate-pulse rounded bg-zinc-200" />
            <div className="h-3 w-2/3 animate-pulse rounded bg-zinc-200" />
          </div>
        </div>
      </div>
    </section>
  );
}
