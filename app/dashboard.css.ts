import { style } from "@vanilla-extract/css";
import { vars } from "./styles/theme.css";

export const quickActions = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.space.sm,
  marginTop: vars.space.xs,
});

export const fullWidth = style({ width: "100%" });

export const sectionTitle = style({
  fontSize: vars.fontSize.lg,
  fontWeight: "700",
  marginBottom: vars.space.md,
});

export const rankNum = style({
  fontWeight: "700",
  width: "40px",
});

export const playerName = style({ fontWeight: "600" });

export const playerTag = style({
  fontSize: vars.fontSize.xs,
  color: vars.color.textMuted,
});

export const eloValue = style({ fontWeight: "700" });

export const matchCard = style({
  padding: `12px 16px`,
  backgroundColor: vars.color.bg,
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.color.border}`,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
});

export const matchTeams = style({
  fontWeight: "600",
  fontSize: vars.fontSize.base,
});

export const blueTeam = style({ color: "#3b82f6" });
export const redTeam = style({ color: "#ef4444" });

export const matchSep = style({ color: vars.color.textMuted, margin: `0 ${vars.space.sm}` });

export const matchMeta = style({
  fontSize: vars.fontSize.xs,
  color: vars.color.textMuted,
  marginTop: "2px",
});

export const viewMore = style({
  display: "block",
  textAlign: "center",
  marginTop: vars.space.md,
  color: vars.color.primary,
  fontSize: vars.fontSize.sm,
});

export const emptyState = style({
  color: vars.color.textMuted,
  textAlign: "center",
  padding: `${vars.space["2xl"]} 0`,
});

export const statSubValue = style({
  fontSize: vars.fontSize.sm,
  color: vars.color.textMuted,
});
