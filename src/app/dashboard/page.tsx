import Link from "next/link";
import { eventsApi } from "@/features/events/api";
import type { EventProject } from "@/features/events/types";
import { eventTypeLabels, eventTypeEmojis } from "@/shared/lib/utils";

export const dynamic = "force-dynamic";

function EventCard({ event }: { event: EventProject }) {
  const firstStage = event.stages?.[0];
  return (
    <Link
      href={`/events/${event.id}`}
      style={{
        display: "block",
        background: "var(--white)",
        borderRadius: 16,
        border: "1px solid var(--sand)",
        padding: "1.25rem 1.5rem",
        textDecoration: "none",
        color: "inherit",
        transition: "box-shadow 0.2s, transform 0.2s",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: event.accentColor ?? "var(--burgundy)",
          borderRadius: "16px 16px 0 0",
        }}
      />
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: "var(--ivory)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 22,
            flexShrink: 0,
          }}
        >
          {eventTypeEmojis[event.type] ?? "🎉"}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: "var(--charcoal)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {event.title?.ru || eventTypeLabels[event.type]?.ru}
          </div>
          <div style={{ fontSize: 12, color: "var(--warm-gray)", marginTop: 3 }}>
            {eventTypeLabels[event.type]?.ru}
            {firstStage ? ` · ${firstStage.date}` : ""}
          </div>
        </div>
        <div
          style={{
            fontSize: 11,
            fontWeight: 500,
            padding: "0.25rem 0.6rem",
            borderRadius: 100,
            background: event.published ? "var(--success-bg)" : "var(--ivory)",
            color: event.published ? "var(--success)" : "var(--warm-gray)",
            flexShrink: 0,
          }}
        >
          {event.published ? "Опубликован" : "Черновик"}
        </div>
      </div>
    </Link>
  );
}

export default async function DashboardPage() {
  const events = await eventsApi.listAll();

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left, rgba(201,169,110,0.12), transparent 30%), linear-gradient(180deg, var(--cream) 0%, #f8f0e8 100%)",
        padding: "3rem 1.25rem 4rem",
      }}
    >
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "2rem",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 28,
                fontWeight: 300,
                color: "var(--charcoal)",
              }}
            >
              Мои события
            </div>
            <div style={{ fontSize: 13, color: "var(--warm-gray)", marginTop: 4 }}>
              {events.length === 0
                ? "Создайте первое событие"
                : `${events.length} ${events.length === 1 ? "событие" : events.length < 5 ? "события" : "событий"}`}
            </div>
          </div>
          <Link
            href="/events/new"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "0.65rem 1.25rem",
              borderRadius: 12,
              background: "var(--burgundy)",
              color: "var(--white)",
              fontSize: 13,
              fontWeight: 600,
              textDecoration: "none",
              fontFamily: "var(--font-body)",
            }}
          >
            + Новое событие
          </Link>
        </div>

        {/* Events list */}
        {events.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "4rem 2rem",
              background: "var(--white)",
              borderRadius: 20,
              border: "1px solid var(--sand)",
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 22,
                fontWeight: 300,
                color: "var(--charcoal)",
                marginBottom: 8,
              }}
            >
              Пока нет событий
            </div>
            <div style={{ fontSize: 14, color: "var(--warm-gray)", marginBottom: 24 }}>
              Создайте первое цифровое приглашение
            </div>
            <Link
              href="/events/new"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "0.75rem 1.5rem",
                borderRadius: 12,
                background: "var(--burgundy)",
                color: "var(--white)",
                fontSize: 14,
                fontWeight: 600,
                textDecoration: "none",
                fontFamily: "var(--font-body)",
              }}
            >
              + Создать событие
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
