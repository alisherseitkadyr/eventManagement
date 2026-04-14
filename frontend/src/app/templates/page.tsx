import { templatesApi } from "@/features/templates/api";
import { TemplateCard } from "@/features/templates/components/TemplateCard";
import { CreateScratchCard, UploadDesignCard } from "@/features/events/components/dashboard-cards";

export const dynamic = "force-dynamic";

export default async function TemplatesPage() {
  const templates = await templatesApi.listAll();

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
        <div style={{ marginBottom: "2.5rem" }}>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 34,
              fontWeight: 300,
              color: "var(--charcoal)",
              marginBottom: 6,
            }}
          >
            Templates
          </h1>
          <p style={{ fontSize: 14, color: "var(--warm-gray)" }}>
            Start from a ready-made design or build from scratch.
          </p>
        </div>

        {/* Start fresh */}
        <div style={{ marginBottom: "3rem" }}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 20,
              fontWeight: 400,
              color: "var(--charcoal)",
              marginBottom: "1.25rem",
            }}
          >
            Start fresh
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 20,
              maxWidth: 560,
            }}
          >
            <CreateScratchCard />
            <UploadDesignCard />
          </div>
        </div>

        {/* Template gallery — live from backend */}
        <div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 20,
              fontWeight: 400,
              color: "var(--charcoal)",
              marginBottom: "1.25rem",
            }}
          >
            Ready-made templates
            <span style={{ marginLeft: 10, fontSize: 13, fontWeight: 400, color: "var(--warm-gray)" }}>
              {templates.length}
            </span>
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: 20,
            }}
          >
            {templates.map((t) => (
              <TemplateCard key={t.id} template={t} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
