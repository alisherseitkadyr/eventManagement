"use client";

import React from "react";
import styles from "./phonePreview.module.css";

interface PhonePreviewProps {
  children: React.ReactNode;
  maxHeight?: number;
}

export function PhonePreview({ children, maxHeight = 620 }: PhonePreviewProps) {
  return (
    <div className={styles.phone}>
      <div className={styles.notch} />
      <div className={styles.screen} style={{ maxHeight }}>
        {children}
      </div>
    </div>
  );
}