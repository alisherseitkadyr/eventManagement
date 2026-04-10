"use client";

import { Toggle } from "@/shared/components/ui";
import type { ConstructorBlock } from "@/features/constructor/store";

interface BlockListProps {
  blocks: ConstructorBlock[];
  onToggle: (id: ConstructorBlock["id"]) => void;
}

export function BlockList({ blocks, onToggle }: BlockListProps) {
  const enabledCount = blocks.filter((b) => b.enabled).length;

  return (
    <div
      style={{
        background: "var(--white)",
        borderRadius: 16,
        border: "1px solid var(--sand)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "1rem 1.25rem",
          borderBottom: "1px solid var(--sand)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 500 }}>
          Блоки страницы
        </h3>
        <span style={{ fontSize: 11, color: "var(--warm-gray)" }}>
          {enabledCount} из {blocks.length}
        </span>
      </div>

      {blocks.map((block, index) => (
        <div
          key={block.id}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            padding: "0.8rem 1.25rem",
            borderBottom: index < blocks.length - 1 ? "1px solid var(--sand-light)" : "none",
            opacity: block.enabled ? 1 : 0.55,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 18 }}>{block.icon}</span>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--charcoal)" }}>
                {block.label}
              </div>
              <div style={{ fontSize: 11, color: "var(--warm-gray)", marginTop: 2 }}>
                {block.enabled ? "Включен" : "Скрыт"}
              </div>
            </div>
          </div>
          <Toggle checked={block.enabled} onChange={() => onToggle(block.id)} />
        </div>
      ))}
    </div>
  );
}
