import Link from "next/link";
import { Zap } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="border-b border-border/60 bg-background/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="inline-flex items-center gap-2 font-semibold tracking-tight">
          <Zap className="h-5 w-5 text-accent" />
          <span className="text-foreground">CaptionSnap</span>
        </Link>
        <nav className="flex items-center gap-5 text-sm text-muted">
          <Link href="/embed" className="hover:text-foreground">Embed</Link>
          <Link href="/about" className="hover:text-foreground">About</Link>
          <a
            href="https://github.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground"
          >
            Source
          </a>
        </nav>
      </div>
    </header>
  );
}
