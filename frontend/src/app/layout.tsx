import type { Metadata } from "next";
import "@/styles/globals.css";
import { RootShell } from "@/shared/components/layout/root-shell";

export const metadata: Metadata = {
  title: "Qonaq",
  description: "Digital invitation studio for weddings, toi and family events.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <RootShell>{children}</RootShell>
      </body>
    </html>
  );
}
