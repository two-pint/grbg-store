function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-sm">
      <div className="aspect-square w-full animate-pulse bg-zinc-200" />
      <div className="p-4">
        <div className="h-4 w-3/4 animate-pulse rounded bg-zinc-200" />
        <div className="mt-2 h-3 w-1/3 animate-pulse rounded bg-zinc-200" />
      </div>
    </div>
  );
}

export default function ProductsLoading() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 h-8 w-48 animate-pulse rounded bg-zinc-200" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </section>
  );
}
