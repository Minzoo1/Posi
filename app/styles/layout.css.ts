import { style } from "@vanilla-extract/css";
import { vars } from "./theme.css";

export const appShell = style({
  display: "flex",
  minHeight: "100vh",
});

export const sidebar = style({
  width: "220px",
  flexShrink: 0,
  backgroundColor: vars.color.bgCard,
  borderRight: `1px solid ${vars.color.border}`,
  display: "flex",
  flexDirection: "column",
  position: "fixed",
  top: 0,
  left: 0,
  height: "100vh",
  zIndex: 100,
  overflowY: "auto",
});

export const sidebarLogo = style({
  padding: `${vars.space.lg} ${vars.space.md}`,
  borderBottom: `1px solid ${vars.color.border}`,
  display: "flex",
  alignItems: "center",
  gap: vars.space.sm,
});

export const logoText = style({
  fontSize: vars.fontSize.xl,
  fontWeight: "800",
  background: "linear-gradient(135deg, #2563eb, #7c3aed)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
  letterSpacing: "-0.5px",
});

export const sidebarNav = style({
  padding: vars.space.md,
  display: "flex",
  flexDirection: "column",
  gap: vars.space.xs,
  flex: 1,
});

export const navGroup = style({
  marginBottom: vars.space.md,
});

export const navGroupLabel = style({
  fontSize: vars.fontSize.xs,
  color: vars.color.textMuted,
  fontWeight: "600",
  textTransform: "uppercase",
  letterSpacing: "1px",
  padding: `${vars.space.xs} ${vars.space.sm}`,
  marginBottom: vars.space.xs,
});

export const navLink = style({
  display: "flex",
  alignItems: "center",
  gap: vars.space.sm,
  padding: `${vars.space.sm} ${vars.space.md}`,
  borderRadius: vars.radius.md,
  color: vars.color.textSecondary,
  fontSize: vars.fontSize.sm,
  fontWeight: "500",
  transition: "all 0.15s ease",
  ":hover": {
    backgroundColor: vars.color.bgHover,
    color: vars.color.text,
  },
});

export const navLinkActive = style({
  backgroundColor: `${vars.color.primary}22`,
  color: vars.color.primary,
  ":hover": {
    backgroundColor: `${vars.color.primary}33`,
    color: vars.color.primary,
  },
});

export const mainContent = style({
  marginLeft: "220px",
  flex: 1,
  padding: vars.space.xl,
  minHeight: "100vh",
});

export const pageHeader = style({
  marginBottom: vars.space.xl,
});

export const pageTitle = style({
  fontSize: vars.fontSize["3xl"],
  fontWeight: "800",
  color: vars.color.text,
  marginBottom: vars.space.xs,
});

export const pageSubtitle = style({
  color: vars.color.textMuted,
  fontSize: vars.fontSize.base,
});

export const card = style({
  backgroundColor: vars.color.bgCard,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.lg,
  padding: vars.space.lg,
  boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
});

export const grid2 = style({
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: vars.space.lg,
});

export const grid3 = style({
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: vars.space.lg,
});

export const grid4 = style({
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: vars.space.lg,
});
