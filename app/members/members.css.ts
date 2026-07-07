import { style } from "@vanilla-extract/css";
import { vars } from "../styles/theme.css";

export const section = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.space.md,
});

export const sectionTitle = style({
  fontSize: vars.fontSize.lg,
  fontWeight: "700",
  marginBottom: vars.space.lg,
});

export const formStack = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.space.md,
});

export const label = style({
  fontSize: vars.fontSize.sm,
  color: vars.color.textSecondary,
  display: "block",
  marginBottom: vars.space.xs,
});

export const riotIdRow = style({
  display: "grid",
  gridTemplateColumns: "1fr 80px",
  gap: vars.space.sm,
});

export const errorMsg = style({
  fontSize: vars.fontSize.sm,
  color: vars.color.loss,
});

export const hint = style({
  fontSize: vars.fontSize.xs,
  color: vars.color.textMuted,
});

export const playerCard = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: `10px 14px`,
  backgroundColor: vars.color.bg,
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.color.border}`,
});

export const playerLeft = style({
  display: "flex",
  alignItems: "center",
  gap: vars.space.md,
});

export const playerName = style({
  fontWeight: "600",
  fontSize: vars.fontSize.base,
});

export const playerSub = style({
  fontSize: vars.fontSize.xs,
  color: vars.color.textMuted,
});

export const playerRight = style({
  display: "flex",
  alignItems: "center",
  gap: vars.space.lg,
});

export const eloText = style({
  fontWeight: "700",
  fontSize: vars.fontSize.base,
  textAlign: "right",
});

export const wrText = style({
  fontSize: vars.fontSize.xs,
  textAlign: "right",
});

export const emptyState = style({
  color: vars.color.textMuted,
  textAlign: "center",
  padding: `${vars.space["2xl"]} 0`,
});

export const centerLoader = style({
  display: "flex",
  justifyContent: "center",
  padding: vars.space["2xl"],
});

export const smallBtn = style({
  padding: `4px 10px`,
  fontSize: vars.fontSize.xs,
});

export const champRow = style({
  display: "flex",
  gap: "4px",
  marginTop: "4px",
  flexWrap: "wrap",
});

export const champBadge = style({
  fontSize: "10px",
  padding: `1px 6px`,
  borderRadius: vars.radius.full,
  backgroundColor: `${vars.color.primary}18`,
  color: vars.color.primary,
  fontWeight: "600",
  cursor: "default",
});
