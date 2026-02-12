function SkeletonLine() {
  return (
    <div className="flex gap-4 py-5">
      <div className="h-24 w-24 shrink-0 animate-pulse rounded-md bg-zinc-200" />
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <div className="h-4 w-40 animate-pulse rounded bg-zinc-200" />
          <div className="mt-1 h-3 w-20 animate-pulse rounded bg-zinc-200" />
        </div>
        <div className="h-8 w-24 animate-pulse rounded-md bg-zinc-200" />
      </div>
      <div className="h-4 w-16 shrink-0 animate-pulse rounded bg-zinc-200" />
    </div>
  );
}

export default function CartLoading() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 h-8 w-40 animate-pulse rounded bg-zinc-200" />
      <div className="divide-y divide-foreground/10">
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonLine key={i} />
        ))}
      </div>
      <div className="mt-8 border-t border-foreground/10 pt-6">
        <div className="flex justify-between">
          <div className="h-4 w-16 animate-pulse rounded bg-zinc-200" />
          <div className="h-4 w-20 animate-pulse rounded bg-zinc-200" />
        </div>
        <div className="mt-3 flex justify-between">
          <div className="h-5 w-12 animate-pulse rounded bg-zinc-200" />
          <div className="h-5 w-24 animate-pulse rounded bg-zinc-200" />
        </div>
      </div>
      <div className="mt-6 h-12 w-full animate-pulse rounded-full bg-zinc-200" />
    </section>
  );
}
