import { track as vercelTrack } from "@vercel/analytics";

type EventMap = {
  simulator_run: { placementId: string };
  share_link_copied: { placementId: string; bytes: number };
  embed_snippet_copied: { placementId: string };
  pseo_view: { slug: string };
  platform_switched: { from: string; to: string };
};

export function track<K extends keyof EventMap>(name: K, props: EventMap[K]) {
  if (typeof window === "undefined") return;
  try {
    vercelTrack(name, props as Record<string, string | number | boolean>);
  } catch {
    // analytics is fire-and-forget
  }
}
