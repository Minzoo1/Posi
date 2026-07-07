import { style, styleVariants } from "@vanilla-extract/css";
import { vars } from "../styles/theme.css";

export const grid = style({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
  gap: vars.space.md,
  marginTop: vars.space.lg,
});

export const trophyCard = style({
  backgroundColor: vars.color.bgCard,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.lg,
  padding: vars.space.lg,
  display: "flex",
  flexDirection: "column",
  gap: vars.space.sm,
  transition: "border-color 0.2s ease",
  ":hover": { borderColor: "#334155" },
});

export const cardHeader = style({
  display: "flex",
  alignItems: "center",
  gap: vars.space.sm,
  marginBottom: vars.space.xs,
});

export const trophyIcon = style({
  fontSize: "22px",
  lineHeight: "1",
});

export const cardTitle = style({
  fontSize: vars.fontSize.sm,
  color: vars.color.textMuted,
  fontWeight: "600",
  textTransform: "uppercase" as const,
  letterSpacing: "0.05em",
});

export const winner = style({
  fontSize: vars.fontSize.xl,
  fontWeight: "800",
  color: vars.color.text,
  lineHeight: "1.2",
});

export const winnerValue = style({
  fontSize: vars.fontSize["2xl"],
  fontWeight: "900",
  lineHeight: "1",
});

export const winnerSub = style({
  fontSize: vars.fontSize.sm,
  color: vars.color.textSecondary,
  marginTop: "2px",
});

export const divider = style({
  height: "1px",
  backgroundColor: vars.color.border,
  margin: `${vars.space.xs} 0`,
});

export const runnerUpList = style({
  display: "flex",
  flexDirection: "column" as const,
  gap: "6px",
});

export const runnerUpRow = style({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  fontSize: vars.fontSize.sm,
});

export const runnerUpName = style({
  color: vars.color.textSecondary,
});

export const runnerUpVal = style({
  color: vars.color.textMuted,
  fontWeight: "600",
});

export const accentColor = styleVariants({
  gold: { color: "#f59e0b" },
  win: { color: "#22c55e" },
  loss: { color: "#ef4444" },
  blue: { color: "#3b82f6" },
  purple: { color: "#a855f7" },
  orange: { color: "#f97316" },
  cyan: { color: "#06b6d4" },
  pink: { color: "#ec4899" },
});

export const rankBadge = style({
  fontSize: vars.fontSize.xs,
  color: vars.color.textMuted,
  minWidth: "18px",
});

export const emptyState = style({
  color: vars.color.textMuted,
  fontSize: vars.fontSize.sm,
  textAlign: "center" as const,
  padding: `${vars.space.md} 0`,
});
