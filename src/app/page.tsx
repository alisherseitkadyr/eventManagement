import Link from "next/link";
import { eventsApi } from "@/features/events/api";
import { EventCard } from "@/features/events/components/dashboard-cards";

export const dynamic = "force-dynamic";

export default async function MyInvitationsPage() {
  const events = await eventsApi.listAll();

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left, rgba(201,169,110,0.08), transparent 30%), var(--cream)",
        padding: "2.5rem 2rem",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            marginBottom: "2.5rem",
          }}
        >
          <div>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 34,
                fontWeight: 300,
                color: "var(--charcoal)",
                marginBottom: 6,
              }}
            >
              My Invitations
            </h1>
            <p style={{ fontSize: 14, color: "var(--warm-gray)" }}>
              Click an invitation to manage it, or create a new one.
            </p>
          </div>
          <Link
            href="/events/new"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "0.55rem 1.1rem",
              borderRadius: 10,
              background: "var(--burgundy)",
              color: "var(--white)",
              fontSize: 13,
              fontWeight: 500,
              textDecoration: "none",
              transition: "opacity 150ms",
            }}
          >
            + New Invitation
          </Link>
        </div>

        {/* Invitation cards */}
        {events.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: 20,
            }}
          >
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          /* Empty state */
          <div
            style={{
              textAlign: "center",
              padding: "5rem 2rem",
              background: "var(--white)",
              borderRadius: 24,
              border: "1px dashed var(--sand)",
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 16 }}>📬</div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 24,
                fontWeight: 300,
                color: "var(--charcoal)",
                marginBottom: 8,
              }}
            >
              No invitations yet
            </div>
            <p style={{ fontSize: 14, color: "var(--warm-gray)", marginBottom: 24 }}>
              Create your first invitation or pick a template to get started.
            </p>
            <Link
              href="/templates"
              style={{
                display: "inline-block",
                padding: "0.65rem 1.5rem",
                borderRadius: 10,
                background: "var(--burgundy)",
                color: "var(--white)",
                fontSize: 14,
                fontWeight: 500,
                textDecoration: "none",
              }}
            >
              Browse Templates
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
