import { style, styleVariants } from "@vanilla-extract/css";
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

export const leaderboardRow = style({
  position: "relative",
  transition: "background-color 0.1s ease",
  ":hover": { backgroundColor: "var(--color-bgHover, #1e293b)" },
});

export const champTooltip = style({
  position: "absolute",
  top: "calc(100% + 6px)",
  left: "0",
  zIndex: 10,
  display: "none",
  alignItems: "center",
  gap: "6px",
  backgroundColor: "#0f172a",
  border: "1px solid #1e293b",
  borderRadius: "8px",
  padding: "8px 12px",
  whiteSpace: "nowrap",
  boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
  selectors: {
    [`${leaderboardRow}:hover &`]: {
      display: "flex",
    },
  },
});

export const champIconWrap = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "3px",
});

export const champIcon = style({
  width: "36px",
  height: "36px",
  borderRadius: "50%",
  border: "2px solid #334155",
  objectFit: "cover",
});

export const champIconName = style({
  fontSize: "9px",
  color: "#94a3b8",
  textAlign: "center",
  maxWidth: "40px",
  overflow: "hidden",
  textOverflow: "ellipsis",
});

export const streakGrid = style({
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: vars.space.md,
  marginBottom: vars.space.lg,
});

export const streakCard = styleVariants({
  win: {
    position: "relative",
    overflow: "hidden",
    borderRadius: vars.radius.lg,
    padding: vars.space.lg,
    background: "linear-gradient(135deg, #052e16 0%, #0f1629 60%)",
    border: "1px solid #22c55e55",
    boxShadow: "0 0 24px #22c55e18, inset 0 1px 0 #22c55e22",
  },
  loss: {
    position: "relative",
    overflow: "hidden",
    borderRadius: vars.radius.lg,
    padding: vars.space.lg,
    background: "linear-gradient(135deg, #2d0a0a 0%, #0f1629 60%)",
    border: "1px solid #ef444455",
    boxShadow: "0 0 24px #ef444418, inset 0 1px 0 #ef444422",
  },
});

export const streakTitle = styleVariants({
  win: {
    fontSize: vars.fontSize.lg,
    fontWeight: "800",
    color: "#22c55e",
    marginBottom: vars.space.md,
    letterSpacing: "-0.3px",
    display: "flex",
    alignItems: "center",
    gap: vars.space.sm,
  },
  loss: {
    fontSize: vars.fontSize.lg,
    fontWeight: "800",
    color: "#ef4444",
    marginBottom: vars.space.md,
    letterSpacing: "-0.3px",
    display: "flex",
    alignItems: "center",
    gap: vars.space.sm,
  },
});

export const streakRow = styleVariants({
  win: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: `9px 12px`,
    borderRadius: vars.radius.md,
    marginBottom: "6px",
    backgroundColor: "#22c55e0d",
    border: "1px solid #22c55e22",
  },
  loss: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: `9px 12px`,
    borderRadius: vars.radius.md,
    marginBottom: "6px",
    backgroundColor: "#ef44440d",
    border: "1px solid #ef444422",
  },
});

export const streakName = style({
  fontWeight: "700",
  fontSize: vars.fontSize.base,
  color: vars.color.text,
});

export const streakBadge = styleVariants({
  win: {
    fontSize: vars.fontSize.sm,
    fontWeight: "800",
    padding: `3px 12px`,
    borderRadius: vars.radius.full,
    backgroundColor: "#22c55e22",
    color: "#22c55e",
    border: "1px solid #22c55e44",
    letterSpacing: "0.3px",
  },
  loss: {
    fontSize: vars.fontSize.sm,
    fontWeight: "800",
    padding: `3px 12px`,
    borderRadius: vars.radius.full,
    backgroundColor: "#ef444422",
    color: "#ef4444",
    border: "1px solid #ef444444",
    letterSpacing: "0.3px",
  },
});

export const streakEmpty = style({
  fontSize: vars.fontSize.sm,
  color: vars.color.textMuted,
  textAlign: "center",
  padding: `${vars.space.sm} 0`,
});

export const ingameSection = style({
  marginBottom: vars.space.lg,
});

export const ingameTitle = style({
  fontSize: vars.fontSize.base,
  fontWeight: "700",
  marginBottom: vars.space.sm,
  display: "flex",
  alignItems: "center",
  gap: vars.space.sm,
});

export const ingameDot = style({
  width: "8px",
  height: "8px",
  borderRadius: "50%",
  backgroundColor: "#22c55e",
  display: "inline-block",
  boxShadow: "0 0 6px #22c55e",
});

export const ingameCard = style({
  display: "flex",
  alignItems: "center",
  gap: vars.space.md,
  padding: `8px 14px`,
  backgroundColor: `${"#22c55e"}11`,
  border: `1px solid ${"#22c55e"}33`,
  borderRadius: vars.radius.md,
  marginBottom: vars.space.sm,
});

export const ingameName = style({
  fontWeight: "700",
  fontSize: vars.fontSize.base,
});

export const ingameChamp = style({
  fontSize: vars.fontSize.sm,
  color: vars.color.textSecondary,
});

export const ingameTime = style({
  marginLeft: "auto",
  fontSize: vars.fontSize.xs,
  color: vars.color.textMuted,
});
