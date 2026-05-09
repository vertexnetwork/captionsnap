import { render } from "preact";
import { useMemo, useState } from "preact/hooks";
import {
  PLACEMENTS,
  type Placement,
  type Platform,
  type FieldId,
} from "@root/lib/platform-specs";
import { truncateField, counterState, graphemeLength } from "@root/lib/truncate";
import { buildShareUrl, type SimulatorState } from "@root/lib/share";
import { getFeaturedAffiliate } from "@root/data/affiliates";

const SITE_URL = "https://captionsnap.io";
const UTM_SUFFIX = "utm_source=chrome-extension&utm_medium=popup";

const PLATFORM_ORDER: Platform[] = [
  "meta",
  "tiktok",
  "linkedin",
  "x",
  "youtube",
  "pinterest",
  "reddit",
  "snapchat",
];

const PLATFORM_LABEL: Record<Platform, string> = {
  meta: "Meta",
  tiktok: "TikTok",
  linkedin: "LinkedIn",
  x: "X",
  youtube: "YouTube",
  pinterest: "Pinterest",
  reddit: "Reddit",
  snapchat: "Snapchat",
};

const DEFAULT_FIELDS: Partial<Record<FieldId, string>> = {
  primary:
    "Stop guessing where your ad copy gets clipped — preview truncation across every major ad platform in real time.",
  headline: "See exactly where your ad clips",
  description: "Free, no signup, URL is the database",
};

function Popup() {
  const [platform, setPlatform] = useState<Platform>("meta");
  const placementsForPlatform = useMemo(
    () => PLACEMENTS.filter((p) => p.platform === platform),
    [platform],
  );
  const [placementId, setPlacementId] = useState<string>(
    placementsForPlatform[0]?.id ?? PLACEMENTS[0]!.id,
  );

  const placement: Placement =
    PLACEMENTS.find((p) => p.id === placementId) ?? PLACEMENTS[0]!;

  const [fields, setFields] = useState<Partial<Record<FieldId, string>>>(DEFAULT_FIELDS);

  function selectPlatform(next: Platform) {
    if (next === platform) return;
    setPlatform(next);
    const first = PLACEMENTS.find((p) => p.platform === next);
    if (first) setPlacementId(first.id);
  }

  function updateField(id: FieldId, value: string) {
    setFields((prev) => ({ ...prev, [id]: value }));
  }

  const deepLink = useMemo(() => {
    const state: SimulatorState = {
      v: 1,
      placementId: placement.id,
      fields,
      display: { dark: true, deviceFrame: true },
    };
    const base = buildShareUrl(SITE_URL, state);
    return `${base}&${UTM_SUFFIX}`;
  }, [placement.id, fields]);

  const featured = getFeaturedAffiliate();

  return (
    <div class="popup">
      <header class="header">
        <h1 class="brand">
          Caption<span class="brand-accent">Snap</span>
        </h1>
        <p class="tagline">Where does your copy get cut?</p>
      </header>

      <nav class="platform-tabs" aria-label="Platform">
        {PLATFORM_ORDER.map((p) => (
          <button
            type="button"
            key={p}
            class={`platform-tab ${platform === p ? "is-active" : ""}`}
            onClick={() => selectPlatform(p)}
          >
            {PLATFORM_LABEL[p]}
          </button>
        ))}
      </nav>

      <label class="row">
        <span class="row-label">Placement</span>
        <select
          class="select"
          value={placement.id}
          onChange={(e) => setPlacementId((e.target as HTMLSelectElement).value)}
        >
          {placementsForPlatform.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
        </select>
      </label>

      <div class="fields">
        {placement.fields.map((f) => (
          <FieldEditor
            key={f.id}
            placement={placement}
            fieldId={f.id}
            value={fields[f.id] ?? ""}
            onChange={(v) => updateField(f.id, v)}
          />
        ))}
      </div>

      <a class="cta" href={deepLink} target="_blank" rel="noopener">
        Open full simulator with this copy →
      </a>

      <footer class="footer">
        {featured ? (
          <a
            class="affiliate"
            href={`${featured.url}${featured.url.includes("?") ? "&" : "?"}${UTM_SUFFIX}`}
            target="_blank"
            rel="sponsored noopener nofollow"
          >
            <span class="affiliate-tag">Recommended</span>
            <span class="affiliate-text">{featured.oneLiner}</span>
          </a>
        ) : (
          <a
            class="affiliate"
            href={`${SITE_URL}/about?${UTM_SUFFIX}`}
            target="_blank"
            rel="noopener"
          >
            <span class="affiliate-tag">About</span>
            <span class="affiliate-text">How CaptionSnap verifies these specs</span>
          </a>
        )}
      </footer>
    </div>
  );
}

function FieldEditor({
  placement,
  fieldId,
  value,
  onChange,
}: {
  placement: Placement;
  fieldId: FieldId;
  value: string;
  onChange: (v: string) => void;
}) {
  const field = placement.fields.find((f) => f.id === fieldId)!;
  const len = graphemeLength(value);
  const state = counterState(value, field);
  const truncated = truncateField(value, field, placement.platform);

  return (
    <div class="field">
      <div class="field-head">
        <label class="field-label" for={`fld-${fieldId}`}>
          {field.label}
        </label>
        <span class={`counter is-${state}`}>
          {len} / {field.truncateAt}
        </span>
      </div>
      <textarea
        id={`fld-${fieldId}`}
        class="textarea"
        rows={field.multiline ? 3 : 2}
        value={value}
        onInput={(e) => onChange((e.target as HTMLTextAreaElement).value)}
      />
      {truncated.isTruncated ? (
        <p class="truncated-preview">
          <span class="truncated-visible">
            {truncated.display.replace(truncated.ellipsis, "")}
          </span>
          <span class="truncated-cut">{truncated.ellipsis}</span>
        </p>
      ) : null}
    </div>
  );
}

const root = document.getElementById("root");
if (root) render(<Popup />, root);
