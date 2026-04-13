"use client";

import React from "react";
import { Card } from "@/shared/components/ui";
import { Input } from "@/shared/components/ui/input";
import { Icon } from "@/shared/components/ui/icon";
import type { RSVPStatus } from "@/shared/types/common";
import styles from "./GuestFilters.module.css";

interface GuestFiltersProps {
  activeStatus: RSVPStatus | "all";
  onStatusChange: (status: RSVPStatus | "all") => void;
  search: string;
  onSearchChange: (value: string) => void;
}

const STATUS_TABS: { key: RSVPStatus | "all"; label: string }[] = [
  { key: "all", label: "Все" },
  { key: "confirmed", label: "Подтвердили" },
  { key: "pending", label: "Не ответили" },
  { key: "maybe", label: "Под вопросом" },
  { key: "declined", label: "Отказали" },
];

export function GuestFilters({ activeStatus, onStatusChange, search, onSearchChange }: GuestFiltersProps) {
  return (
    <Card className={styles.bar}>
      <div className={styles.tabs}>
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.key}
            className={`${styles.tab} ${activeStatus === tab.key ? styles.tabActive : ""}`}
            onClick={() => onStatusChange(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className={styles.search}>
        <Input
          placeholder="Поиск..."
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
          icon={<Icon name="search" size={15} color="var(--warm-gray)" />}
        />
      </div>
    </Card>
  );
}
