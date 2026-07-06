"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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

  return (
    <aside className={s.sidebar}>
      <div className={s.sidebarLogo}>
        <span className={s.logoText}>PosiEf</span>
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
    </aside>
  );
}
