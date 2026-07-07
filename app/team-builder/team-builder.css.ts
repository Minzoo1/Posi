import { style, styleVariants } from "@vanilla-extract/css";
import { vars } from "../styles/theme.css";

export const playerList = style({
  display: "flex",
  flexDirection: "column",
  gap: "6px",
  maxHeight: "500px",
  overflowY: "auto",
});

export const playerItem = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: `10px 14px`,
  borderRadius: vars.radius.md,
  cursor: "pointer",
  transition: "all 0.15s ease",
  border: `1px solid ${vars.color.border}`,
  backgroundColor: vars.color.bg,
  ":hover": { borderColor: vars.color.primary },
});

export const playerItemSelected = style({
  border: `1px solid ${vars.color.primary}`,
  backgroundColor: `${vars.color.primary}18`,
});

export const checkCircle = style({
  width: "20px",
  height: "20px",
  borderRadius: "50%",
  border: `2px solid ${vars.color.border}`,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
});

export const checkCircleSelected = style({
  border: `2px solid ${vars.color.primary}`,
  backgroundColor: vars.color.primary,
});

export const checkMark = style({
  color: vars.color.text,
  fontSize: vars.fontSize.xs,
});

export const playerInfo = style({
  display: "flex",
  alignItems: "center",
  gap: vars.space.sm,
});

export const playerName = style({
  fontWeight: "600",
  fontSize: vars.fontSize.base,
});

export const playerTier = style({ fontSize: vars.fontSize.xs });

export const eloValue = style({
  fontWeight: "700",
  fontSize: vars.fontSize.base,
  color: vars.color.text,
});

export const listHeader = style({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: vars.space.md,
});

export const listHeaderBtns = style({
  display: "flex",
  gap: vars.space.sm,
});

export const countText = style({ color: vars.color.textMuted, fontSize: vars.fontSize.base });
export const countTextReady = style({ color: vars.color.win, fontSize: vars.fontSize.base });

export const buildBtn = style({
  width: "100%",
  marginTop: vars.space.md,
});

export const resultPlaceholder = style({
  textAlign: "center",
  padding: vars.space["2xl"],
});

export const placeholderText = style({ color: vars.color.textMuted });

export const resultStack = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.space.md,
});

export const resultHeader = style({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
});

export const resultTitle = style({
  fontSize: vars.fontSize.lg,
  fontWeight: "700",
});

export const teamsGrid = style({
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: vars.space.md,
});

export const teamCard = styleVariants({
  blue: {
    backgroundColor: vars.color.bgCard,
    border: `2px solid #2563eb55`,
    borderRadius: vars.radius.lg,
    padding: vars.space.lg,
  },
  red: {
    backgroundColor: vars.color.bgCard,
    border: `2px solid #ef444455`,
    borderRadius: vars.radius.lg,
    padding: vars.space.lg,
  },
});

export const teamHeader = style({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: vars.space.md,
});

export const teamName = styleVariants({
  blue: { fontWeight: "700", color: "#3b82f6" },
  red: { fontWeight: "700", color: "#ef4444" },
});

export const avgElo = style({ fontSize: vars.fontSize.sm, color: vars.color.textSecondary });

export const teamPlayerList = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.space.sm,
});

export const teamPlayerRow = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: `8px 10px`,
  backgroundColor: vars.color.bg,
  borderRadius: vars.radius.sm,
  border: `1px solid ${vars.color.border}`,
});

export const teamPlayerLeft = style({
  display: "flex",
  alignItems: "center",
  gap: vars.space.sm,
});

export const posLabel = styleVariants({
  blue: { fontSize: vars.fontSize.xs, fontWeight: "700", color: "#3b82f6", width: "28px" },
  red: { fontSize: vars.fontSize.xs, fontWeight: "700", color: "#ef4444", width: "28px" },
});

export const teamPlayerName = style({
  fontSize: vars.fontSize.base,
  fontWeight: "600",
});

export const teamPlayerElo = style({
  fontSize: vars.fontSize.xs,
  color: vars.color.textMuted,
});

export const balanceCard = style({
  backgroundColor: vars.color.bgCard,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.lg,
  padding: vars.space.lg,
  textAlign: "center",
});

export const balanceLabel = style({
  fontSize: vars.fontSize.sm,
  color: vars.color.textMuted,
  marginBottom: vars.space.sm,
});

export const balanceValue = styleVariants({
  good: { fontSize: vars.fontSize["2xl"], fontWeight: "800", color: vars.color.win },
  warn: { fontSize: vars.fontSize["2xl"], fontWeight: "800", color: vars.color.gold },
});

export const balanceSub = style({
  fontSize: vars.fontSize.xs,
  color: vars.color.textMuted,
  marginTop: "4px",
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
  padding: `4px 12px`,
  fontSize: vars.fontSize.xs,
});

export const modeTab = styleVariants({
  active: {
    padding: `6px 20px`,
    borderRadius: vars.radius.md,
    fontSize: vars.fontSize.sm,
    fontWeight: "700",
    cursor: "pointer",
    border: "none",
    backgroundColor: vars.color.primary,
    color: vars.color.text,
  },
  inactive: {
    padding: `6px 20px`,
    borderRadius: vars.radius.md,
    fontSize: vars.fontSize.sm,
    fontWeight: "600",
    cursor: "pointer",
    border: `1px solid ${vars.color.border}`,
    backgroundColor: "transparent",
    color: vars.color.textSecondary,
    ":hover": { backgroundColor: vars.color.bgHover },
  },
});

export const modeTabs = style({
  display: "flex",
  gap: vars.space.sm,
  marginBottom: vars.space.lg,
});

export const sizeTabRow = style({
  display: "flex",
  gap: vars.space.sm,
  marginBottom: vars.space.md,
});

export const sizeTab = styleVariants({
  active: {
    padding: `4px 14px`,
    borderRadius: vars.radius.md,
    fontSize: vars.fontSize.sm,
    fontWeight: "700",
    cursor: "pointer",
    border: `2px solid ${vars.color.primary}`,
    backgroundColor: `${vars.color.primary}22`,
    color: vars.color.primary,
  },
  inactive: {
    padding: `4px 14px`,
    borderRadius: vars.radius.md,
    fontSize: vars.fontSize.sm,
    fontWeight: "600",
    cursor: "pointer",
    border: `1px solid ${vars.color.border}`,
    backgroundColor: "transparent",
    color: vars.color.textSecondary,
    ":hover": { backgroundColor: vars.color.bgHover },
  },
});
