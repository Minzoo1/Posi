import { style, styleVariants, keyframes } from "@vanilla-extract/css";
import { vars } from "./theme.css";

export const btn = style({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: vars.space.sm,
  padding: `${vars.space.sm} ${vars.space.lg}`,
  borderRadius: vars.radius.md,
  fontSize: vars.fontSize.sm,
  fontWeight: "600",
  cursor: "pointer",
  border: "none",
  transition: "all 0.15s ease",
  outline: "none",
});

export const btnPrimary = style({
  backgroundColor: vars.color.primary,
  color: vars.color.text,
  ":hover": { backgroundColor: vars.color.primaryHover },
});

export const btnGhost = style({
  backgroundColor: "transparent",
  color: vars.color.textSecondary,
  border: `1px solid ${vars.color.border}`,
  ":hover": { backgroundColor: vars.color.bgHover, color: vars.color.text },
});

export const btnDanger = style({
  backgroundColor: `${vars.color.loss}22`,
  color: vars.color.loss,
  border: `1px solid ${vars.color.loss}44`,
  ":hover": { backgroundColor: `${vars.color.loss}33` },
});

export const input = style({
  width: "100%",
  padding: `${vars.space.sm} ${vars.space.md}`,
  backgroundColor: vars.color.bg,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.md,
  color: vars.color.text,
  fontSize: vars.fontSize.base,
  outline: "none",
  transition: "border-color 0.15s ease",
  "::placeholder": { color: vars.color.textMuted },
  ":focus": { borderColor: vars.color.primary },
});

export const select = style({
  width: "100%",
  padding: `${vars.space.sm} ${vars.space.md}`,
  backgroundColor: vars.color.bg,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.md,
  color: vars.color.text,
  fontSize: vars.fontSize.sm,
  outline: "none",
  cursor: "pointer",
  ":focus": { borderColor: vars.color.primary },
});

export const badge = style({
  display: "inline-flex",
  alignItems: "center",
  padding: `2px ${vars.space.sm}`,
  borderRadius: vars.radius.full,
  fontSize: vars.fontSize.xs,
  fontWeight: "700",
});

export const badgeVariant = styleVariants({
  win: { backgroundColor: `${vars.color.win}22`, color: vars.color.win },
  loss: { backgroundColor: `${vars.color.loss}22`, color: vars.color.loss },
});

export const statCard = style({
  backgroundColor: vars.color.bgCard,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.lg,
  padding: vars.space.lg,
  display: "flex",
  flexDirection: "column",
  gap: vars.space.xs,
});

export const statLabel = style({
  fontSize: vars.fontSize.xs,
  color: vars.color.textMuted,
  fontWeight: "600",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
});

export const statValue = style({
  fontSize: vars.fontSize["2xl"],
  fontWeight: "800",
  color: vars.color.text,
});

export const table = style({
  width: "100%",
  borderCollapse: "collapse",
});

export const th = style({
  padding: `${vars.space.sm} ${vars.space.md}`,
  textAlign: "left",
  fontSize: vars.fontSize.xs,
  color: vars.color.textMuted,
  fontWeight: "600",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  borderBottom: `1px solid ${vars.color.border}`,
});

export const td = style({
  padding: vars.space.md,
  fontSize: vars.fontSize.sm,
  borderBottom: `1px solid ${vars.color.border}22`,
  verticalAlign: "middle",
});

export const trHover = style({
  transition: "background-color 0.1s ease",
  ":hover": { backgroundColor: vars.color.bgHover },
});

const spin = keyframes({ to: { transform: "rotate(360deg)" } });

export const spinner = style({
  width: "32px",
  height: "32px",
  border: `3px solid ${vars.color.border}`,
  borderTopColor: vars.color.primary,
  borderRadius: "50%",
  animation: `${spin} 0.8s linear infinite`,
});

export const positionBadge = style({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: "36px",
  height: "28px",
  borderRadius: vars.radius.sm,
  fontSize: vars.fontSize.xs,
  fontWeight: "700",
  flexShrink: 0,
  backgroundColor: `${vars.color.primary}22`,
  color: vars.color.primary,
});

export const winText = style({ color: vars.color.win });
export const lossText = style({ color: vars.color.loss });
export const mutedText = style({ color: vars.color.textMuted });
export const secondaryText = style({ color: vars.color.textSecondary });
export const goldText = style({ color: vars.color.gold });

export const wrBadge = styleVariants({
  win: {
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    padding: `2px 10px`,
    borderRadius: vars.radius.full,
    backgroundColor: `${vars.color.win}18`,
    color: vars.color.win,
    fontWeight: "700",
    fontSize: vars.fontSize.sm,
  },
  loss: {
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    padding: `2px 10px`,
    borderRadius: vars.radius.full,
    backgroundColor: `${vars.color.loss}18`,
    color: vars.color.loss,
    fontWeight: "700",
    fontSize: vars.fontSize.sm,
  },
});

export const tierColors: Record<string, string> = {
  CHALLENGER: "#f0b429",
  GRANDMASTER: "#ef4444",
  MASTER: "#9333ea",
  DIAMOND: "#3b82f6",
  EMERALD: "#10b981",
  PLATINUM: "#06b6d4",
  GOLD: "#f59e0b",
  SILVER: "#94a3b8",
  BRONZE: "#b45309",
  IRON: "#78716c",
  UNRANKED: "#64748b",
};
