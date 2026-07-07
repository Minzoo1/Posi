import { style, styleVariants } from "@vanilla-extract/css";
import { vars } from "../styles/theme.css";

export const section = style({
  marginBottom: vars.space.xl,
});

export const sectionTitle = style({
  fontSize: vars.fontSize.lg,
  fontWeight: "800",
  marginBottom: vars.space.sm,
  display: "flex",
  alignItems: "center",
  gap: vars.space.sm,
});

export const sectionDesc = style({
  fontSize: vars.fontSize.sm,
  color: vars.color.textMuted,
  marginBottom: vars.space.md,
});

export const rankList = style({
  display: "flex",
  flexDirection: "column" as const,
  gap: "10px",
});

export const rankRow = style({
  display: "flex",
  alignItems: "center",
  gap: vars.space.md,
  padding: `12px ${vars.space.md}`,
  backgroundColor: vars.color.bgCard,
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.color.border}`,
});

export const rankRowAccent = styleVariants({
  loss: {
    borderColor: "#ef444430",
    backgroundColor: "#ef444408",
  },
  win: {
    borderColor: "#22c55e30",
    backgroundColor: "#22c55e08",
  },
  neutral: {},
});

export const rankNum = style({
  fontSize: vars.fontSize.base,
  fontWeight: "800",
  minWidth: "28px",
  color: vars.color.textMuted,
});

export const rankFirst = style({
  color: "#f59e0b",
  fontSize: vars.fontSize.lg,
});

export const playerNames = style({
  flex: 1,
  fontWeight: "700",
  fontSize: vars.fontSize.base,
});

export const playerSub = style({
  fontSize: vars.fontSize.xs,
  color: vars.color.textSecondary,
  marginTop: "2px",
});

export const statBadge = styleVariants({
  loss: {
    marginLeft: "auto",
    fontSize: vars.fontSize.sm,
    fontWeight: "800",
    color: "#ef4444",
    whiteSpace: "nowrap" as const,
  },
  win: {
    marginLeft: "auto",
    fontSize: vars.fontSize.sm,
    fontWeight: "800",
    color: "#22c55e",
    whiteSpace: "nowrap" as const,
  },
  neutral: {
    marginLeft: "auto",
    fontSize: vars.fontSize.sm,
    fontWeight: "700",
    color: vars.color.textSecondary,
    whiteSpace: "nowrap" as const,
  },
});

export const emptyState = style({
  color: vars.color.textMuted,
  fontSize: vars.fontSize.sm,
  textAlign: "center" as const,
  padding: `${vars.space.lg} 0`,
});

export const grid2 = style({
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: vars.space.lg,
  "@media": {
    "(max-width: 768px)": {
      gridTemplateColumns: "1fr",
    },
  },
});
