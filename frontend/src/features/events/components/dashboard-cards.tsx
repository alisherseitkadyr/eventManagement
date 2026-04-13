"use client";

import React from "react";
import Link from "next/link";
import type { EventProject } from "@/features/events/types";
import { eventTypeLabels, eventTypeEmojis } from "@/shared/lib/utils";
import { Icon } from "@/shared/components/ui/icon";

export function EventCard({ event }: { event: EventProject }) {
  const firstStage = event.stages?.[0];
  return (
    <Link
      href={`/events/${event.id}`}
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
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,0,0,0.08)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div
        style={{
          height: 140,
          background: `linear-gradient(135deg, ${event.accentColor ?? "var(--burgundy)"}, var(--burgundy-deep))`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <div style={{ fontSize: 48, opacity: 0.8 }}>
          {eventTypeEmojis[event.type] ?? "🎉"}
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 12,
            left: 16,
            fontSize: 11,
            fontWeight: 500,
            padding: "0.2rem 0.6rem",
            borderRadius: 100,
            background: "rgba(255,255,255,0.2)",
            backdropFilter: "blur(4px)",
            color: "var(--white)",
          }}
        >
          {event.published ? "Опубликован" : "Черновик"}
        </div>
      </div>

      <div style={{ padding: "1.25rem" }}>
        <div
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: "var(--charcoal)",
            marginBottom: 4,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {event.title?.ru || eventTypeLabels[event.type]?.ru}
        </div>
        <div style={{ fontSize: 13, color: "var(--warm-gray)" }}>
          {eventTypeLabels[event.type]?.ru}
          {firstStage ? ` · ${firstStage.date}` : ""}
        </div>
      </div>
    </Link>
  );
}

export function CreateScratchCard() {
  return (
    <Link
      href="/events/new"
      style={{
        display: "block",
        background: "var(--white)",
        borderRadius: 20,
        border: "2px dashed var(--sand)",
        overflow: "hidden",
        textDecoration: "none",
        color: "inherit",
        transition: "transform 0.2s, box-shadow 0.2s, border-color 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,0,0,0.08)";
        e.currentTarget.style.borderColor = "var(--gold)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.borderColor = "var(--sand)";
      }}
    >
      <div
        style={{
          height: 140,
          background: "var(--ivory)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            background: "var(--gold-faint)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon name="plus" size={24} color="var(--burgundy)" />
        </div>
        <span style={{ fontSize: 14, fontWeight: 500, color: "var(--charcoal)" }}>
          Создать с нуля
        </span>
      </div>
      <div style={{ padding: "1.25rem" }}>
        <div style={{ fontSize: 14, color: "var(--warm-gray)", lineHeight: 1.5 }}>
          Начните с чистого холста и создайте уникальное приглашение
        </div>
      </div>
    </Link>
  );
}

export function TemplateCard({
  title,
  description,
  emoji,
  href,
}: {
  title: string;
  description: string;
  emoji: string;
  href: string;
}) {
  return (
    <Link
      href={href}
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
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,0,0,0.08)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div
        style={{
          height: 140,
          background: "linear-gradient(135deg, var(--terra), var(--burgundy))",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ fontSize: 40 }}>{emoji}</div>
      </div>
      <div style={{ padding: "1.25rem" }}>
        <div
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: "var(--charcoal)",
            marginBottom: 4,
          }}
        >
          {title}
        </div>
        <div style={{ fontSize: 13, color: "var(--warm-gray)", lineHeight: 1.4 }}>
          {description}
        </div>
      </div>
    </Link>
  );
}

export function UploadDesignCard() {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => console.log("Upload design")}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          console.log("Upload design");
        }
      }}
      style={{
        display: "block",
        background: "var(--white)",
        borderRadius: 20,
        border: "1px solid var(--sand)",
        overflow: "hidden",
        cursor: "pointer",
        transition: "transform 0.2s, box-shadow 0.2s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 12px 30px rgba(0,0,0,0.08)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
      }}
    >
      <div
        style={{
          height: 140,
          background: "var(--ivory)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            background: "var(--gold-faint)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon name="download" size={24} color="var(--burgundy)" />
        </div>
        <span style={{ fontSize: 14, fontWeight: 500, color: "var(--charcoal)" }}>
          Загрузить дизайн
        </span>
      </div>
      <div style={{ padding: "1.25rem" }}>
        <div style={{ fontSize: 14, color: "var(--warm-gray)", lineHeight: 1.5 }}>
          Используйте собственный готовый дизайн
        </div>
      </div>
    </div>
  );
}
