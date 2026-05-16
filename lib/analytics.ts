import { track as vercelTrack } from "@vercel/analytics";

type EventMap = {
  simulator_run: { placementId: string };
  share_link_copied: { placementId: string; bytes: number };
  embed_snippet_copied: { placementId: string };
  pseo_view: { slug: string };
  platform_switched: { from: string; to: string };
  device_switched: { placementId: string; to: "mobile" | "desktop" };
  affiliate_clicked: { id: string; surface: "pseo" | "extension" | "home" | "footer" };
  extension_install_clicked: { surface: "home" | "about" | "pseo" };
  pricing_viewed: { plan?: "monthly" | "annual" };
  checkout_started: { plan: "monthly" | "annual" };
  checkout_completed: { plan: "monthly" | "annual" };
  pro_feature_blocked: { feature: "png_export" | "bulk_paste" };
  pro_feature_used: { feature: "png_export" | "bulk_paste" };
};

export function track<K extends keyof EventMap>(name: K, props: EventMap[K]) {
  if (typeof window === "undefined") return;
  try {
    vercelTrack(name, props as Record<string, string | number | boolean>);
  } catch {
    // analytics is fire-and-forget
  }
}
