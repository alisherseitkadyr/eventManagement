"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Icon } from "@/shared/components/ui/icon";
import { Sidebar } from "@/shared/components/layout/sidebar";
import styles from "./root-shell.module.css";

interface RootShellProps {
  children: ReactNode;
}

function getPageTitle(pathname: string): string {
  if (pathname === "/templates") {
    return "Templates";
  }

  if (pathname === "/events/new") {
    return "Create Invitation";
  }

  return "Qonaq";
}

export function RootShell({ children }: RootShellProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const showWorkspaceSidebar = pathname === "/templates" || pathname === "/events/new";

  if (!showWorkspaceSidebar) {
    return <>{children}</>;
  }

  return (
    <div className={styles.shell}>
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      {mobileOpen ? (
        <button
          type="button"
          className={styles.overlay}
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
        />
      ) : null}

      <div className={styles.mainArea}>
        <div className={styles.mobileBar}>
          <button
            type="button"
            className={styles.mobileMenuButton}
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
          >
            <Icon name="menu" size={20} color="currentColor" />
          </button>
          <div className={styles.mobilePageMeta}>
            <div className={styles.mobilePageTitle}>{getPageTitle(pathname)}</div>
            <div className={styles.mobilePageSubtitle}>Organizer workspace</div>
          </div>
        </div>

        <main className={styles.main}>{children}</main>
      </div>
    </div>
  );
}
