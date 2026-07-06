import type { Metadata } from "next";
import Sidebar from "./components/Sidebar";
import "./styles/global.css";
import * as s from "./styles/layout.css";

export const metadata: Metadata = {
  title: "PosiEf - 롤 내전 관리",
  description: "League of Legends 내전 팀 뽑기 및 전적 관리 시스템",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <div className={s.appShell}>
          <Sidebar />
          <main className={s.mainContent}>{children}</main>
        </div>
      </body>
    </html>
  );
}
