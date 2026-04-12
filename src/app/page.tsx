import Link from "next/link";
import { eventsApi } from "@/features/events/api";
import { EventCard, CreateScratchCard, TemplateCard, UploadDesignCard } from "@/features/events/components/dashboard-cards";

export const dynamic = "force-dynamic";

// ─── Main Dashboard Page ──────────────────────────────────────────────────
export default async function DashboardPage() {
  const events = await eventsApi.listAll();

  // Pre-made template designs
  const templates = [
    {
      title: "Свадебное приглашение",
      description: "Элегантный дизайн для вашего особенного дня",
      emoji: "💍",
      href: "/events/new?template=wedding",
    },
    {
      title: "День рождения",
      description: "Яркое и праздничное приглашение",
      emoji: "🎂",
      href: "/events/new?template=birthday",
    },
    {
      title: "Корпоративное мероприятие",
      description: "Профессиональный стиль для деловых встреч",
      emoji: "💼",
      href: "/events/new?template=corporate",
    },
    {
      title: "Вечеринка",
      description: "Веселое приглашение для встречи с друзьями",
      emoji: "🎉",
      href: "/events/new?template=party",
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left, rgba(201,169,110,0.08), transparent 30%), var(--cream)",
        padding: "2.5rem 2rem",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "2.5rem" }}>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 36,
              fontWeight: 300,
              color: "var(--charcoal)",
              marginBottom: 8,
            }}
          >
            Мои приглашения
          </h1>
          <p style={{ fontSize: 15, color: "var(--warm-gray)" }}>
            Создавайте красивые приглашения для ваших особенных событий
          </p>
        </div>

        {/* Quick actions row */}
        <div style={{ marginBottom: "3rem" }}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 22,
              fontWeight: 400,
              color: "var(--charcoal)",
              marginBottom: "1.25rem",
            }}
          >
            Быстрое создание
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 20,
            }}
          >
            <CreateScratchCard />

            {/* Upload custom design card */}
            <UploadDesignCard />
          </div>
        </div>

        {/* Templates section */}
        <div style={{ marginBottom: "3rem" }}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 22,
              fontWeight: 400,
              color: "var(--charcoal)",
              marginBottom: "1.25rem",
            }}
          >
            Готовые шаблоны
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: 20,
            }}
          >
            {templates.map((template) => (
              <TemplateCard key={template.title} {...template} />
            ))}
          </div>
        </div>

        {/* Your existing invitations */}
        {events.length > 0 && (
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                justifyContent: "space-between",
                marginBottom: "1.25rem",
              }}
            >
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 22,
                  fontWeight: 400,
                  color: "var(--charcoal)",
                }}
              >
                Ваши приглашения
              </h2>
              <Link
                href="/events/new"
                style={{
                  fontSize: 14,
                  color: "var(--burgundy)",
                  textDecoration: "none",
                  fontWeight: 500,
                }}
              >
                + Создать новое
              </Link>
            </div>
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
          </div>
        )}

        {/* Empty state (if no events) */}
        {events.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "4rem 2rem",
              background: "var(--white)",
              borderRadius: 24,
              border: "1px solid var(--sand)",
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
              У вас пока нет приглашений
            </div>
            <p style={{ fontSize: 14, color: "var(--warm-gray)", marginBottom: 24 }}>
              Создайте первое приглашение или выберите готовый шаблон выше
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
