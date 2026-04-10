"use client";

import React, { useState } from "react";
import { Card, Avatar, StatusBadge } from "@/shared/components/ui";
import { Icon } from "@/shared/components/ui/icon";
import type { Guest } from "@/features/guests/types";
import { guestSideLabels } from "@/shared/lib/utils";
import styles from "./GuestTable.module.css";

interface GuestTableProps {
  guests: Guest[];
  onCopyLink?: (guest: Guest) => void;
  onRemind?: (guest: Guest) => void;
}

export function GuestTable({ guests, onCopyLink, onRemind }: GuestTableProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (guest: Guest) => {
    setCopiedId(guest.id);
    onCopyLink?.(guest);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <Card noPadding>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr className={styles.headRow}>
              <th className={styles.th}>Имя / Семья</th>
              <th className={styles.th}>Чел.</th>
              <th className={styles.th}>Сторона</th>
              <th className={styles.th}>Статус</th>
              <th className={styles.th}>Телефон</th>
              <th className={`${styles.th} ${styles.thRight}`}>Действия</th>
            </tr>
          </thead>
          <tbody>
            {guests.map((g) => (
              <tr key={g.id} className={styles.row}>
                <td className={styles.td}>
                  <div className={styles.nameCell}>
                    <Avatar name={g.name} size={32} />
                    <div>
                      <span className={styles.guestName}>{g.name}</span>
                      {g.isVip && <span className={styles.vipBadge}>VIP</span>}
                      {g.isElder && <span className={styles.elderBadge}>Ақсақал</span>}
                    </div>
                  </div>
                </td>
                <td className={styles.td}>{g.count}</td>
                <td className={styles.td}>
                  <span style={{ fontSize: 12, color: "var(--warm-gray)" }}>
                    {guestSideLabels[g.side].ru}
                  </span>
                </td>
                <td className={styles.td}>
                  <StatusBadge status={g.status} />
                </td>
                <td className={`${styles.td} ${styles.phone}`}>{g.phone || "—"}</td>
                <td className={`${styles.td} ${styles.tdRight}`}>
                  <div className={styles.actions}>
                    <button
                      className={`${styles.actionBtn} ${copiedId === g.id ? styles.actionBtnSuccess : ""}`}
                      title="Копировать ссылку"
                      onClick={() => handleCopy(g)}
                    >
                      <Icon
                        name={copiedId === g.id ? "check" : "link"}
                        size={14}
                        color={copiedId === g.id ? "var(--success)" : "var(--gold)"}
                      />
                    </button>
                    {g.status === "pending" && (
                      <button
                        className={styles.actionBtn}
                        title="Напомнить"
                        onClick={() => onRemind?.(g)}
                      >
                        <Icon name="bell" size={14} color="var(--gold)" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
