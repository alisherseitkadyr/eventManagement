import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Qonaq — Цифровые приглашения для казахстанских мероприятий",
  description: "Создайте цифровое приглашение, соберите ответы гостей, управляйте списками — всё в одном месте.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}