import { style, styleVariants } from "@vanilla-extract/css";
import { vars } from "../../styles/theme.css";

export const profileCard = style({
  display: "flex",
  alignItems: "center",
  gap: vars.space.lg,
  padding: vars.space.lg,
  backgroundColor: vars.color.bgCard,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.lg,
  marginBottom: vars.space.lg,
});

export const avatar = style({
  width: "64px",
  height: "64px",
  borderRadius: "50%",
  backgroundColor: `${vars.color.primary}22`,
  border: `2px solid ${vars.color.primary}44`,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: vars.fontSize["2xl"],
  fontWeight: "800",
  color: vars.color.primary,
  flexShrink: 0,
});

export const profileInfo = style({ flex: 1 });

export const profileName = style({
  fontSize: vars.fontSize.xl,
  fontWeight: "800",
  marginBottom: "2px",
});

export const profileSub = style({
  fontSize: vars.fontSize.sm,
  color: vars.color.textMuted,
});

export const statGrid = style({
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: vars.space.md,
  marginBottom: vars.space.lg,
  "@media": {
    "screen and (max-width: 768px)": {
      gridTemplateColumns: "repeat(2, 1fr)",
    },
  },
});

export const statBox = style({
  backgroundColor: vars.color.bgCard,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.lg,
  padding: vars.space.lg,
  textAlign: "center",
});

export const statLabel = style({
  fontSize: vars.fontSize.xs,
  color: vars.color.textMuted,
  fontWeight: "600",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  marginBottom: vars.space.xs,
});

export const statValue = style({
  fontSize: vars.fontSize["2xl"],
  fontWeight: "800",
});

export const statSub = style({
  fontSize: vars.fontSize.xs,
  color: vars.color.textMuted,
  marginTop: "2px",
});

export const sectionTitle = style({
  fontSize: vars.fontSize.lg,
  fontWeight: "700",
  marginBottom: vars.space.md,
});

export const champList = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.space.sm,
});

export const champRow = style({
  display: "flex",
  alignItems: "center",
  gap: vars.space.md,
  padding: `10px 14px`,
  backgroundColor: vars.color.bg,
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.color.border}`,
});

export const champRank = style({
  width: "20px",
  fontSize: vars.fontSize.sm,
  fontWeight: "700",
  color: vars.color.textMuted,
  textAlign: "center",
  flexShrink: 0,
});

export const champName = style({
  flex: 1,
  fontWeight: "600",
  fontSize: vars.fontSize.base,
});

export const champMeta = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
  gap: "2px",
});

export const champLevel = style({
  fontSize: vars.fontSize.xs,
  fontWeight: "700",
  padding: `1px 7px`,
  borderRadius: vars.radius.full,
  backgroundColor: `${vars.color.gold}22`,
  color: vars.color.gold,
});

export const champPoints = style({
  fontSize: vars.fontSize.xs,
  color: vars.color.textMuted,
});

export const recentBadge = styleVariants({
  good: {
    display: "inline-flex",
    padding: `3px 10px`,
    borderRadius: vars.radius.full,
    fontSize: vars.fontSize.sm,
    fontWeight: "700",
    backgroundColor: `${"#22c55e"}18`,
    color: "#22c55e",
  },
  bad: {
    display: "inline-flex",
    padding: `3px 10px`,
    borderRadius: vars.radius.full,
    fontSize: vars.fontSize.sm,
    fontWeight: "700",
    backgroundColor: `${"#ef4444"}18`,
    color: "#ef4444",
  },
});

export const matchRow = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: `10px 14px`,
  backgroundColor: vars.color.bg,
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.color.border}`,
});

export const matchLeft = style({
  display: "flex",
  flexDirection: "column",
  gap: "2px",
});

export const matchTeams = style({ fontWeight: "600", fontSize: vars.fontSize.sm });
export const matchMeta = style({ fontSize: vars.fontSize.xs, color: vars.color.textMuted });

export const matchKda = style({
  fontSize: vars.fontSize.sm,
  color: vars.color.textSecondary,
  textAlign: "right",
});

export const emptyState = style({
  color: vars.color.textMuted,
  textAlign: "center",
  padding: `${vars.space["2xl"]} 0`,
});

export const backLink = style({
  display: "inline-flex",
  alignItems: "center",
  gap: vars.space.xs,
  color: vars.color.textMuted,
  fontSize: vars.fontSize.sm,
  marginBottom: vars.space.md,
  ":hover": { color: vars.color.text },
});
