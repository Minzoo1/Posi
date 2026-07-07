"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import * as s from "../styles/layout.css";

const navItems = [
  {
    group: "메인",
    items: [
      { href: "/", label: "대시보드" },
      { href: "/matches", label: "경기 기록" },
    ],
  },
  {
    group: "팀",
    items: [
      { href: "/team-builder", label: "팀 뽑기" },
    ],
  },
  {
    group: "통계",
    items: [
      { href: "/players", label: "플레이어 통계" },
      { href: "/hall-of-fame", label: "명예의 전당" },
      { href: "/fun-stats", label: "패배의 원인" },
    ],
  },
  {
    group: "관리",
    items: [
      { href: "/members", label: "멤버 관리" },
      { href: "/matches/new", label: "경기 입력" },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // 라우트 이동 시 닫기
  useEffect(() => { setOpen(false); }, [pathname]);

  // 스크롤 잠금
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const navContent = (
    <>
      <div className={s.sidebarLogo}>
        <span className={s.logoText}>선한영향력</span>
      </div>
      <nav className={s.sidebarNav}>
        {navItems.map((group) => (
          <div key={group.group} className={s.navGroup}>
            <div className={s.navGroupLabel}>{group.group}</div>
            {group.items.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${s.navLink} ${isActive ? s.navLinkActive : ""}`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
    </>
  );

  return (
    <>
      {/* 모바일 상단 헤더 */}
      <div className={s.mobileHeader}>
        <button className={s.hamburger} onClick={() => setOpen(true)} aria-label="메뉴 열기">
          <span className={s.hamburgerLine} />
          <span className={s.hamburgerLine} />
          <span className={s.hamburgerLine} />
        </button>
        <span className={s.mobileLogoText}>선한영향력</span>
      </div>

      {/* 오버레이 (모바일 메뉴 열렸을 때 배경) */}
      {open && <div className={s.overlay} onClick={() => setOpen(false)} />}

      {/* 사이드바 */}
      <aside className={`${s.sidebar} ${open ? s.sidebarOpen : ""}`}>
        {navContent}
      </aside>
    </>
  );
}
