/**
 * Goldbook design tokens — black / white / blue.
 * Prefer CSS vars in UI; use this for charts, agents, and logic.
 */
export const colors = {
  bg: "#f4f6f9",
  elevated: "#ffffff",
  ink: "#0b0d10",
  inkSoft: "#1c2430",
  muted: "#5b6575",
  faint: "#94a0b3",
  line: "#e4e8ef",
  lineStrong: "#c9d1de",
  accent: "#2563eb",
  accentSoft: "#60a5fa",
  accentWash: "#eff5ff",
  success: "#0f766e",
  danger: "#c2410c",
  bull: "#0f766e",
  bear: "#c2410c",
  range: "#64748b",
} as const;

export const spacing = {
  1: "0.25rem",
  2: "0.5rem",
  3: "0.75rem",
  4: "1rem",
  5: "1.25rem",
  6: "1.5rem",
  8: "2rem",
  10: "2.5rem",
  12: "3rem",
  16: "4rem",
  20: "5rem",
  24: "6rem",
} as const;

export const motion = {
  ease: "cubic-bezier(0.22, 1, 0.36, 1)",
  easeOut: "cubic-bezier(0.16, 1, 0.3, 1)",
  fast: "150ms",
  base: "280ms",
  slow: "480ms",
} as const;

export const radii = {
  sm: "0.375rem",
  md: "0.625rem",
  lg: "0.875rem",
  xl: "1.25rem",
  full: "9999px",
} as const;

export const brand = {
  name: "Goldbook",
  tagline: "Private gold research desk for Salah & Rayane",
} as const;
