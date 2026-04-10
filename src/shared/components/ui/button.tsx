"use client";

import React from "react";
import styles from "./button.module.css";
import { cn } from "@/shared/lib/utils";

export type ButtonVariant = "primary" | "gold" | "ghost" | "danger" | "sm";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  icon?: React.ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
}

export function Button({
  variant = "primary",
  icon,
  loading,
  fullWidth,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        styles.btn,
        styles[variant],
        fullWidth && styles.fullWidth,
        loading && styles.loading,
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className={styles.spinner} />
      ) : (
        <>
          {icon && <span className={styles.icon}>{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
}