import type { Metadata } from "next";
import "@/styles/globals.css";
import { eventsApi } from "@/features/events/api";
import { Sidebar } from "@/shared/components/layout/sidebar";

export const metadata: Metadata = {
  title: "Qonaq — Цифровые приглашения для казахстанских мероприятий",
  description: "Создайте цифровое приглашение, соберите ответы гостей, управляйте списками — всё в одном месте.",
};

function getInitials(name?: string) {
  if (!name) return "Q";
  const parts = name.split(" ").filter(Boolean);
  return parts.slice(0, 2).map((p) => p[0].toUpperCase()).join("");
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const events = await eventsApi.listAll();
  const first = events?.[0];

  return (
    <html lang="ru">
      <body>
        <div style={{ display: "flex", minHeight: "100vh" }}>
          <Sidebar
            eventId={first?.id ?? ""}
            eventName={first?.title?.ru ?? "Событие"}
            eventDate={first?.stages?.[0]?.date ?? ""}
            eventInitials={getInitials(first?.title?.ru)}
            allEvents={events}
          />

          <main style={{ flex: 1, padding: 24 }}>{children}</main>
        </div>
      </body>
    </html>
  );
}