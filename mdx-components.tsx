import type { MDXComponents } from "mdx/types";
import { SimulatorPreset } from "@/components/pseo/SimulatorPreset";
import { SpecTable } from "@/components/pseo/SpecTable";
import { FAQ } from "@/components/pseo/FAQ";
import { RelatedPages } from "@/components/pseo/RelatedPages";
import { LastVerifiedBadge } from "@/components/simulator/LastVerifiedBadge";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    SimulatorPreset,
    SpecTable,
    FAQ,
    RelatedPages,
    LastVerifiedBadge,
    ...components,
  };
}
