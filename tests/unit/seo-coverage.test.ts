import { describe, it, expect } from "vitest";
import { PSEO_INDEX, getPseoEntry, pseoSlugs } from "@/data/pseo-index";
import { PLACEMENTS, getPlacement } from "@/lib/platform-specs";
import { PSEO_MDX_SLUGS } from "@/content/pseo/load";

describe("pSEO ↔ MDX coverage", () => {
  it("every PSEO_INDEX entry has a matching MDX loader", () => {
    const indexSlugs = pseoSlugs();
    const mdxSet = new Set(PSEO_MDX_SLUGS);
    const missingMdx = indexSlugs.filter((s) => !mdxSet.has(s));
    expect(missingMdx, `PSEO entries without MDX: ${missingMdx.join(", ")}`).toEqual([]);
  });

  it("every MDX loader has a matching PSEO_INDEX entry", () => {
    const indexSet = new Set(pseoSlugs());
    const orphanMdx = PSEO_MDX_SLUGS.filter((s) => !indexSet.has(s));
    expect(orphanMdx, `MDX files without PSEO entry: ${orphanMdx.join(", ")}`).toEqual([]);
  });

  it("every PSEO entry references a known placement", () => {
    const broken = PSEO_INDEX.filter((e) => !getPlacement(e.placementId));
    expect(broken.map((e) => `${e.slug} -> ${e.placementId}`)).toEqual([]);
  });

  it("every related slug points at a known PSEO entry", () => {
    const broken: string[] = [];
    for (const e of PSEO_INDEX) {
      for (const r of e.related) {
        if (!getPseoEntry(r)) broken.push(`${e.slug} -> ${r}`);
      }
    }
    expect(broken).toEqual([]);
  });

  it("every placement is covered by at least one pSEO page", () => {
    const used = new Set(PSEO_INDEX.map((e) => e.placementId));
    const uncovered = PLACEMENTS.filter((p) => !used.has(p.id)).map((p) => p.id);
    expect(uncovered, `Placements without any pSEO page: ${uncovered.join(", ")}`).toEqual([]);
  });
});
