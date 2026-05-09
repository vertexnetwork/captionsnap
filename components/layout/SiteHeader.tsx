import Link from "next/link";

function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      width="22"
      height="22"
      aria-hidden="true"
      className={className}
    >
      {/* Clipped bracket suggesting a truncation cut */}
      <path
        d="M22 6 H10 a4 4 0 0 0 -4 4 v12 a4 4 0 0 0 4 4 h12"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="square"
      />
      {/* Truncation marks: the em-dash that becomes an ellipsis */}
      <circle cx="16" cy="16" r="1.4" fill="currentColor" />
      <circle cx="20" cy="16" r="1.4" fill="currentColor" />
      <circle cx="24" cy="16" r="1.4" fill="currentColor" />
    </svg>
  );
}

export function SiteHeader() {
  return (
    <header className="border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-1 py-2 font-semibold tracking-tight text-foreground"
          aria-label="CaptionSnap home"
        >
          <BrandMark className="text-accent" />
          <span>CaptionSnap</span>
        </Link>
        <nav className="flex items-center gap-1 text-sm text-muted">
          <Link
            href="/pricing"
            className="rounded-md px-3 py-2 hover:text-foreground"
          >
            Pricing
          </Link>
          <Link
            href="/embed"
            className="rounded-md px-3 py-2 hover:text-foreground"
          >
            Embed
          </Link>
          <Link
            href="/about"
            className="rounded-md px-3 py-2 hover:text-foreground"
          >
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}
