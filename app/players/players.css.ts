import { style } from "@vanilla-extract/css";
import { vars } from "../styles/theme.css";

export const rankCell = style({
  fontWeight: "700",
  width: "40px",
});

export const playerName = style({ fontWeight: "600" });

export const playerSub = style({
  fontSize: vars.fontSize.xs,
  color: vars.color.textMuted,
});

export const lpText = style({
  color: vars.color.textMuted,
  fontSize: vars.fontSize.xs,
});

export const eloCell = style({
  fontWeight: "800",
  fontSize: vars.fontSize.lg,
});

export const emptyState = style({
  textAlign: "center",
  padding: `${vars.space["2xl"]} 0`,
  color: vars.color.textMuted,
});
