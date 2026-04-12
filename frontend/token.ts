// ═══════════════════════════════════════════════════════════
// Qonaq Design Tokens
// Aesthetic: Luxury editorial with Central Asian warmth
// Fonts: Cormorant Garamond (display) + Outfit (body)
// ═══════════════════════════════════════════════════════════

export const colors = {
  cream: "#FAF6F1",
  ivory: "#F5EDE4",
  sand: "#E8DDD0",
  sandLight: "#F0EAE1",
  warmGray: "#9C9186",
  burgundy: "#7A2E3A",
  burgundyDeep: "#5C1D29",
  burgundyLight: "rgba(122,46,58,0.08)",
  gold: "#C9A96E",
  goldLight: "#DCC69A",
  goldFaint: "rgba(201,169,110,0.10)",
  terra: "#B8674D",
  charcoal: "#2C2825",
  charcoalSoft: "#4A4541",
  white: "#FFFFFF",
  success: "#2D8A56",
  successBg: "#E8F5EE",
  warning: "#D4870E",
  warningBg: "#FEF5E7",
  danger: "#C0392B",
  dangerBg: "#FDE8E8",
  info: "#4F5FBF",
  infoBg: "#EEF2FF",
} as const;

export const fonts = {
  display: "'Cormorant Garamond', serif",
  body: "'Outfit', sans-serif",
} as const;

export const radii = {
  sm: 8,
  md: 10,
  lg: 12,
  xl: 16,
  xxl: 20,
  pill: 100,
} as const;

export const shadows = {
  sm: "0 1px 3px rgba(0,0,0,0.04)",
  md: "0 4px 12px rgba(0,0,0,0.06)",
  lg: "0 8px 30px rgba(0,0,0,0.08)",
  xl: "0 16px 48px rgba(0,0,0,0.1)",
  phone: "0 24px 80px rgba(0,0,0,0.2)",
} as const;

export const transitions = {
  fast: "150ms cubic-bezier(0.16,1,0.3,1)",
  normal: "300ms cubic-bezier(0.16,1,0.3,1)",
  slow: "500ms cubic-bezier(0.16,1,0.3,1)",
} as const;

export type Colors = typeof colors;
export type ColorKey = keyof Colors;