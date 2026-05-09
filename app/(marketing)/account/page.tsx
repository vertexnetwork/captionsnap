import type { Metadata } from "next";
import { AccountDashboard } from "@/components/pro/AccountDashboard";

export const metadata: Metadata = {
  title: "Account",
  description: "Manage your CaptionSnap Pro subscription.",
  alternates: { canonical: "/account" },
  robots: { index: false, follow: false },
};

export default function AccountPage() {
  return (
    <article className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight">Account</h1>
      <AccountDashboard />
    </article>
  );
}
