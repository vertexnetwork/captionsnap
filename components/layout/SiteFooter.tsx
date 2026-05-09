import Link from "next/link";
import { LAST_VERIFIED_GLOBAL } from "@/lib/platform-specs";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} CaptionSnap. Specs last verified {LAST_VERIFIED_GLOBAL}.</p>
        <nav className="flex flex-wrap gap-4">
          <Link href="/about" className="hover:text-foreground">About</Link>
          <Link href="/embed" className="hover:text-foreground">Embed</Link>
          <Link href="/contact" className="hover:text-foreground">Contact</Link>
          <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
          <Link href="/terms" className="hover:text-foreground">Terms</Link>
        </nav>
      </div>
    </footer>
  );
}
