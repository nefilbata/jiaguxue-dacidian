"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/",         label: "首頁" },
  { href: "/pinyin",   label: "按音序" },
  { href: "/bushou",   label: "按部首" },
  { href: "/bian",     label: "按編類" },
  { href: "/appendix", label: "附錄" },
  { href: "/about",    label: "關於本辭典" },
];

export default function Nav() {
  const path = usePathname();
  return (
    <nav className="nav">
      <Link className="nav-logo" href="/">
        <div className="nav-logo-icon">甲</div>
        <div className="nav-logo-text">
          甲骨學大辭典
          <span className="nav-logo-sub">JIAGUXUE DACIDIAN</span>
        </div>
      </Link>
      <div className="nav-links">
        {LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={`nav-link ${path === l.href ? "active" : ""}`}
          >
            {l.label}
          </Link>
        ))}
      </div>
      <div className="nav-right">
        <button className="nav-icon-btn">🔍</button>
        <div className="nav-divider" />
        <button className="nav-icon-btn">♡ 收藏</button>
        <button className="nav-icon-btn">分享</button>
      </div>
    </nav>
  );
}
