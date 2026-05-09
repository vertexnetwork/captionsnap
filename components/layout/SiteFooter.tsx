import Link from "next/link";
import { LAST_VERIFIED_GLOBAL } from "@/lib/platform-specs";

const COLUMNS: { heading: string; links: { label: string; href: string }[] }[] = [
  {
    heading: "Product",
    links: [
      { label: "Simulator", href: "/" },
      { label: "Bulk (Pro)", href: "/bulk" },
      { label: "Chrome extension", href: "/extension" },
      { label: "Embed", href: "/embed" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "Account",
    links: [
      { label: "Pricing", href: "/pricing" },
      { label: "Manage", href: "/account" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/60">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-1">
          <p className="text-sm font-semibold text-foreground">CaptionSnap</p>
          <p className="mt-2 text-xs text-muted">
            Specs last verified {LAST_VERIFIED_GLOBAL}.
          </p>
          <p className="mt-2 text-xs text-muted">
            © {new Date().getFullYear()} CaptionSnap.
          </p>
        </div>
        {COLUMNS.map((col) => (
          <nav key={col.heading} aria-label={col.heading} className="flex flex-col gap-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              {col.heading}
            </p>
            <ul className="mt-2 flex flex-col gap-1 text-sm text-muted">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="inline-block py-1.5 hover:text-foreground"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="mx-auto max-w-6xl border-t border-border/60 px-4 py-4">
        <Link
          href="/network"
          className="text-[11px] uppercase tracking-[0.18em] text-muted/70 hover:text-muted"
        >
          Part of the Vertex Network
        </Link>
      </div>
    </footer>
  );
}
