"use client";

import React from "react";
import type { RSVPStatus, Language } from "@/shared/types/common";
import { rsvpStatusLabels, rsvpStatusConfig } from "@/shared/lib/utils";
export { Button } from "./button";

// ─── Card ───
interface CardProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
  accentColor?: string;
  hover?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export function Card({ children, className, noPadding, accentColor, hover, onClick, style }: CardProps) {
  return (
    <div
      className={className}
      onClick={onClick}
      style={{
        background: "var(--white)",
        borderRadius: 16,
        border: "1px solid var(--sand)",
        padding: noPadding ? 0 : "1.5rem",
        position: "relative",
        overflow: "hidden",
        transition: "box-shadow 0.3s, transform 0.3s",
        cursor: onClick ? "pointer" : undefined,
        ...(hover ? {} : {}),
        ...style,
      }}
    >
      {accentColor && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: accentColor,
            opacity: 0.5,
            borderRadius: "16px 16px 0 0",
          }}
        />
      )}
      {children}
    </div>
  );
}

// ─── Badge ───
interface BadgeProps {
  children: React.ReactNode;
  bg: string;
  color: string;
  icon?: React.ReactNode;
}

export function Badge({ children, bg, color, icon }: BadgeProps) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "0.25rem 0.7rem",
        borderRadius: 100,
        fontSize: 11,
        fontWeight: 500,
        background: bg,
        color,
        letterSpacing: "0.03em",
        whiteSpace: "nowrap",
      }}
    >
      {icon}
      {children}
    </span>
  );
}

// ─── Status Badge ───
interface StatusBadgeProps {
  status: RSVPStatus;
  lang?: Language;
}

export function StatusBadge({ status, lang = "ru" }: StatusBadgeProps) {
  const config = rsvpStatusConfig[status];
  const label = rsvpStatusLabels[status][lang];
  return (
    <Badge bg={config.bg} color={config.color}>
      {label}
    </Badge>
  );
}

// ─── Toggle ───
interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function Toggle({ checked, onChange }: ToggleProps) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      style={{
        width: 40,
        height: 22,
        borderRadius: 100,
        border: "none",
        cursor: "pointer",
        background: checked ? "var(--burgundy)" : "var(--sand)",
        position: "relative",
        transition: "background 250ms",
        padding: 0,
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: 16,
          height: 16,
          borderRadius: "50%",
          background: "var(--white)",
          position: "absolute",
          top: 3,
          left: checked ? 21 : 3,
          transition: "left 250ms cubic-bezier(0.16,1,0.3,1)",
          boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
        }}
      />
    </button>
  );
}

// ─── Avatar ───
interface AvatarProps {
  name: string;
  size?: number;
  gradient?: [string, string];
}

export function Avatar({ name, size = 34, gradient }: AvatarProps) {
  const [c1, c2] = gradient || ["var(--ivory)", "var(--sand)"];
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: `linear-gradient(135deg, ${c1}, ${c2})`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.35,
        fontWeight: 600,
        color: "var(--burgundy)",
        flexShrink: 0,
      }}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

// ─── SectionLabel ───
export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: 11,
        fontWeight: 500,
        letterSpacing: "0.15em",
        textTransform: "uppercase" as const,
        color: "var(--gold)",
      }}
    >
      {children}
    </div>
  );
}

// ─── SectionTitle ───
interface SectionTitleProps {
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

export function SectionTitle({ children, size = "md" }: SectionTitleProps) {
  const fontSize = size === "lg" ? 32 : size === "md" ? 28 : 20;
  return (
    <h2
      style={{
        fontFamily: "var(--font-display)",
        fontSize,
        fontWeight: 300,
        color: "var(--charcoal)",
        lineHeight: 1.2,
      }}
    >
      {children}
    </h2>
  );
}

// ─── Empty State ───
interface EmptyStateProps {
  icon: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div
      style={{
        textAlign: "center" as const,
        padding: "3rem 2rem",
        color: "var(--warm-gray)",
      }}
    >
      <div style={{ fontSize: 48, marginBottom: 12 }}>{icon}</div>
      <div style={{ fontSize: 16, fontWeight: 500, color: "var(--charcoal)", marginBottom: 6 }}>{title}</div>
      {description && <div style={{ fontSize: 13, marginBottom: 16 }}>{description}</div>}
      {action}
    </div>
  );
}