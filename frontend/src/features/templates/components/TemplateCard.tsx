"use client";

import Link from "next/link";
import type { Template } from "../types";

const TYPE_EMOJI: Record<string, string> = {
  wedding:   "💍",
  birthday:  "🎂",
  corporate: "💼",
  party:     "🎉",
  universal: "✨",
};

export function TemplateCard({ template }: { template: Template }) {
  const emoji = TYPE_EMOJI[template.type] ?? "✨";

  return (
    <Link
      href={`/events/new?template=${template.templateStyle}`}
      style={{
        display: "block",
        background: "var(--white)",
        borderRadius: 20,
        border: "1px solid var(--sand)",
        overflow: "hidden",
        textDecoration: "none",
        color: "inherit",
        transition: "transform 0.2s, box-shadow 0.2s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)";
        (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 12px 30px rgba(0,0,0,0.08)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none";
      }}
    >
      <div
        style={{
          height: 140,
          background: `linear-gradient(135deg, ${template.accentColor}, color-mix(in srgb, ${template.accentColor} 60%, #000))`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <span style={{ fontSize: 40 }}>{emoji}</span>
        <span
          style={{
            position: "absolute",
            bottom: 10,
            right: 12,
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            padding: "0.2rem 0.55rem",
            borderRadius: 100,
            background: "rgba(255,255,255,0.2)",
            backdropFilter: "blur(4px)",
            color: "rgba(255,255,255,0.9)",
          }}
        >
          {template.templateStyle}
        </span>
      </div>
      <div style={{ padding: "1.25rem" }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: "var(--charcoal)", marginBottom: 4 }}>
          {template.name}
        </div>
        {template.description ? (
          <div style={{ fontSize: 13, color: "var(--warm-gray)", lineHeight: 1.4 }}>
            {template.description}
          </div>
        ) : (
          <div style={{ fontSize: 13, color: "var(--warm-gray)" }}>
            {template.languages.join(" · ").toUpperCase()}
          </div>
        )}
      </div>
    </Link>
  );
}
