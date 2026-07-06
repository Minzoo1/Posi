import { createGlobalTheme } from "@vanilla-extract/css";

export const vars = createGlobalTheme(":root", {
  color: {
    bg: "#0a0e1a",
    bgCard: "#0f1629",
    bgHover: "#1a2340",
    border: "#1e2d4a",
    primary: "#2563eb",
    primaryHover: "#1d4ed8",
    gold: "#f59e0b",
    win: "#22c55e",
    loss: "#ef4444",
    text: "#e2e8f0",
    textMuted: "#64748b",
    textSecondary: "#94a3b8",
  },
  space: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
    "2xl": "48px",
  },
  radius: {
    sm: "6px",
    md: "10px",
    lg: "16px",
    full: "9999px",
  },
  fontSize: {
    xs: "11px",
    sm: "13px",
    base: "15px",
    lg: "17px",
    xl: "20px",
    "2xl": "24px",
    "3xl": "30px",
  },
});
