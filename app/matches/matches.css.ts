import { style } from "@vanilla-extract/css";
import { vars } from "../styles/theme.css";

export const headerRow = style({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
});

export const matchList = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.space.md,
});

export const matchCard = style({
  padding: `16px 20px`,
  backgroundColor: vars.color.bg,
  borderRadius: vars.radius.lg,
  border: `1px solid ${vars.color.border}`,
});

export const matchCardInner = style({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "8px",
  flexWrap: "wrap" as const,
});

export const matchTitle = style({
  fontWeight: "700",
  fontSize: vars.fontSize.lg,
});

export const blueTeam = style({ color: "#3b82f6" });
export const redTeam = style({ color: "#ef4444" });
export const sep = style({ color: vars.color.textMuted, margin: `0 ${vars.space.sm}` });

export const matchMeta = style({
  fontSize: vars.fontSize.sm,
  color: vars.color.textMuted,
  marginTop: "4px",
});

export const matchRight = style({
  display: "flex",
  alignItems: "center",
  gap: vars.space.sm,
  flexWrap: "wrap" as const,
});

export const vsLabel = style({
  fontSize: vars.fontSize.sm,
  color: vars.color.textMuted,
});

export const bigBadge = style({
  fontSize: vars.fontSize.sm,
  padding: `4px 12px`,
});

export const participantRow = style({
  marginTop: vars.space.md,
  display: "flex",
  gap: vars.space.sm,
  flexWrap: "wrap",
});

export const participantChip = style({
  fontSize: vars.fontSize.xs,
  padding: `2px 8px`,
  borderRadius: vars.radius.full,
});

export const blueChip = style({
  backgroundColor: "#2563eb18",
  color: "#60a5fa",
  border: "1px solid #2563eb33",
});

export const redChip = style({
  backgroundColor: "#ef444418",
  color: "#f87171",
  border: "1px solid #ef444433",
});

export const emptyState = style({
  textAlign: "center",
  padding: `${vars.space["2xl"]} 0`,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: vars.space.md,
});

export const emptyText = style({ color: vars.color.textMuted });
