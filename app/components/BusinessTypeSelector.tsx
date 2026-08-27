import { BUSINESS_TYPES, type BusinessType } from "../lib/agentCatalog";

// Re-ranks (never hides) the catalog by business type — with only 4
// general-purpose products, a hard filter risks an empty grid for a niche
// type like "Creator". See AgentsCatalogHub.tsx for how the selection is
// used to sort matching products first.
export default function BusinessTypeSelector({
  value,
  onChange,
}: {
  value: BusinessType | null;
  onChange: (value: BusinessType | null) => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <span style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)" }}>What&apos;s your business?</span>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {BUSINESS_TYPES.map((type) => {
          const active = value === type;
          return (
            <button
              key={type}
              onClick={() => onChange(active ? null : type)}
              style={{
                padding: "7px 14px",
                borderRadius: 999,
                fontSize: 12.5,
                fontWeight: 600,
                cursor: "pointer",
                border: active ? "1px solid var(--accent)" : "1px solid var(--border)",
                background: active ? "var(--accent-soft)" : "var(--surface)",
                color: active ? "var(--accent)" : "var(--muted)",
              }}
            >
              {type}
            </button>
          );
        })}
      </div>
    </div>
  );
}
