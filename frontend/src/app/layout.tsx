import type { Metadata } from "next";
import "@/styles/globals.css";
import { Sidebar } from "@/shared/components/layout/sidebar";

export const metadata: Metadata = {
  title: "Qonaq — Цифровые приглашения для казахстанских мероприятий",
  description: "Создайте цифровое приглашение, соберите ответы гостей, управляйте списками — всё в одном месте.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <div style={{ display: "flex", minHeight: "100vh" }}>
          <Sidebar />
          <main style={{ flex: 1, minWidth: 0, overflowX: "hidden" }}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
