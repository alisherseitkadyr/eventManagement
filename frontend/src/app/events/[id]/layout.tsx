import type { ReactNode } from "react";

interface EventLayoutProps {
  children: ReactNode;
  params: Promise<{ id: string }>;
}

// The root layout provides the single Sidebar (URL-aware).
// This layout just passes children through — no extra shell or sidebar.
export default async function EventLayout({ children }: EventLayoutProps) {
  return <>{children}</>;
}
