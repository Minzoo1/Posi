import { globalStyle } from "@vanilla-extract/css";
import { vars } from "./theme.css";

globalStyle("*, *::before, *::after", {
  boxSizing: "border-box",
  margin: 0,
  padding: 0,
});

globalStyle("html, body", {
  backgroundColor: vars.color.bg,
  color: vars.color.text,
  fontFamily: "'Pretendard', 'Noto Sans KR', system-ui, sans-serif",
  fontSize: vars.fontSize.base,
  lineHeight: "1.6",
  minHeight: "100vh",
});

globalStyle("a", {
  color: "inherit",
  textDecoration: "none",
});

globalStyle("::-webkit-scrollbar", {
  width: "6px",
  height: "6px",
});

globalStyle("::-webkit-scrollbar-track", {
  background: vars.color.bg,
});

globalStyle("::-webkit-scrollbar-thumb", {
  background: vars.color.border,
  borderRadius: vars.radius.full,
});
