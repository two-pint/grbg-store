"use client";

export default function ErrorState({
  message = "Something went wrong loading this page.",
  reset,
}: {
  message?: string;
  reset?: () => void;
}) {
  return (
    <div className="mx-auto flex max-w-7xl flex-col items-center px-4 py-24 text-center sm:px-6 lg:px-8">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-500">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          className="stroke-current"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <h2 className="text-lg font-semibold text-foreground">
        Oops!
      </h2>
      <p className="mt-1 text-sm text-foreground/50">{message}</p>
      {reset && (
        <button
          type="button"
          onClick={reset}
          className="mt-6 inline-flex h-10 items-center justify-center rounded-full bg-foreground px-6 text-sm font-semibold text-background transition-colors hover:bg-foreground/85"
        >
          Try again
        </button>
      )}
    </div>
  );
}
