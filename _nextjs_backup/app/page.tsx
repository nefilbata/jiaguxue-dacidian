"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Nav from "../components/Nav";

type Entry = {
  id: number; title: string; pinyin: string; pinyinInitial: string;
  bian: string; zhang: string; jie: string; xiao: string;
  page: number | null; imageUrl: string | null;
};

const HOT = ["甲骨", "卜辭", "殷商", "王卜", "貞人", "甲骨文", "殷墟"];
const BG  = "卜龜甲貞王商殷祀祭弗受有佑亡告翌祖妣兄子父母田獵雨風年黍禾刀弓戈矛車馬牛羊豕犬鳥魚";

export default function Home() {
  const [entries, setEntries]   = useState<Entry[]>([]);
  const [query,   setQuery]     = useState("");
  const [loading, setLoading]   = useState(true);
  const [page,    setPage]      = useState(0);
  const PAGE = 36;

  useEffect(() => {
    fetch("/data/entries.json").then(r => r.json()).then((d: Entry[]) => {
      setEntries(d); setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.trim().toLowerCase();
    return entries.filter(e =>
      e.title.includes(q) || e.pinyin.toLowerCase().includes(q) ||
      e.zhang.includes(q) || e.jie.includes(q)
    );
  }, [entries, query]);

  const shown = results.slice(0, (page + 1) * PAGE);
  const isSearching = query.trim().length > 0;

  return (
    <div>
      <Nav />

      {/* ── HOME HERO ── */}
      <section className="home-hero">
        <div className="home-hero-bg-chars" aria-hidden="true">{BG}</div>
        <div className="home-hero-left">
          <p className="home-eyebrow">ORACLE BONE STUDIES LEXICON</p>
          <h1 className="home-title">甲骨學 <span className="red">大辭典</span></h1>
          <p className="home-subtitle">匯集甲骨學術語精要・傳承與研究的知識之庫</p>
          <div className="search-bar">
            <button className="search-type">詞條 ▾</button>
            <input
              className="search-input"
              type="text"
              placeholder="輸入詞條、拼音或關鍵字"
              value={query}
              onChange={e => { setQuery(e.target.value); setPage(0); }}
            />
            <button className="search-btn">🔍 搜索</button>
          </div>
          <div className="hot-tags">
            <span className="hot-label">熱門：</span>
            {HOT.map(t => (
              <button key={t} className="hot-tag" onClick={() => { setQuery(t); setPage(0); }}>{t}</button>
            ))}
          </div>
        </div>
        <div className="home-hero-bone">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/bone.png" alt="甲骨拓片" />
        </div>
      </section>

      {/* ── QUICK NAV ── */}
      <div className="quick-nav">
        {[
          { href: "/pinyin",   icon: "A-Z", title: "按音序瀏覽", sub: "A-Z 音序檢索" },
          { href: "/bushou",   icon: "⼝",  title: "按部首瀏覽", sub: "按部首分類檢索" },
          { href: "/bian",     icon: "☰",   title: "按編類瀏覽", sub: "六編體例檢索瀏覽" },
          { href: "/appendix", icon: "≡",   title: "附錄",       sub: "表格與索引資料" },
          { href: "/about",    icon: "⊞",   title: "關於本辭典", sub: "辭典簡介與説明" },
        ].map(item => (
          <Link key={item.href} href={item.href} className="quick-item">
            <div className="quick-icon">{item.icon}</div>
            <div>
              <div className="quick-title">{item.title}</div>
              <div className="quick-sub">{item.sub}</div>
            </div>
            <span className="quick-arrow">›</span>
          </Link>
        ))}
      </div>

      {/* ── SEARCH RESULTS ── */}
      {isSearching && (
        <div className="content-wrap">
          <div style={{ marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <h2 style={{ fontSize: 18, fontWeight: 700 }}>
              「{query}」的搜索結果
            </h2>
            <span style={{ fontSize: 13, color: "var(--text-mute)" }}>
              {loading ? "載入中…" : `共 ${results.length} 條`}
            </span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
            {shown.map(e => (
              <div key={e.id} style={{
                background: "var(--bg-card)", border: "1px solid var(--border)",
                borderRadius: 3, padding: "16px", cursor: "pointer"
              }}>
                <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{e.title}</div>
                <div style={{ fontSize: 12, color: "var(--primary)", fontStyle: "italic", marginBottom: 8 }}>{e.pinyin}</div>
                <div style={{ fontSize: 11, color: "var(--text-mute)" }}>
                  {[e.bian, e.zhang, e.jie].filter(Boolean).join(" / ")}
                </div>
              </div>
            ))}
          </div>
          {results.length === 0 && !loading && (
            <p style={{ textAlign: "center", padding: "48px 0", color: "var(--text-mute)" }}>
              未找到相關詞條，請嘗試其他關鍵字
            </p>
          )}
          {shown.length < results.length && (
            <div style={{ textAlign: "center", marginTop: 24 }}>
              <button
                onClick={() => setPage(p => p + 1)}
                style={{
                  background: "var(--bg-card)", border: "1px solid var(--border)",
                  borderRadius: 3, padding: "10px 32px", fontSize: 13,
                  color: "var(--text-mid)", cursor: "pointer", fontFamily: "inherit"
                }}
              >
                加載更多（還有 {results.length - shown.length} 條）
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── INTRO ── */}
      {!isSearching && (
        <section className="intro-section">
          <div className="intro-landscape" aria-hidden="true" />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div className="section-label">
              <div className="section-label-bar" />
              辭典簡介
              <span className="section-label-icon">📖</span>
            </div>
            <div className="intro-body">
              <p>
                《甲骨學大辭典》是一部系統收録甲骨學相關術語、器物、文物、語言文字、歷史文獻、
                研究成果及學術流派的綜合性工具書。其内容涵蓋甲骨學研究的主要領域，
                收録條目逾數萬條，力求準確、簡明、實用，並注重學術性與可檢索性相結合，
                服務於學術研究與教學。
              </p>
              <p>
                本辭典以六編體例（甲骨學理論編、甲骨著録編、甲骨字形編、甲骨卜辭編、
                甲骨考釋編、甲骨綜合編）為框架，兼顧傳統分類與現代檢索需求，
                是甲骨學研究與相關學科不可或缺的參考工具。
              </p>
              <Link href="/about" className="intro-link">了解更多 →</Link>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, minWidth: 160, position: "relative", zIndex: 1 }}>
            {[
              { num: loading ? "…" : entries.length.toLocaleString(), label: "詞條總數" },
              { num: "六",   label: "分類編目" },
              { num: "26",   label: "音序字母" },
            ].map(s => (
              <div key={s.label} style={{
                background: "var(--bg-card)", border: "1px solid var(--border)",
                borderRadius: 3, padding: "16px 22px", textAlign: "center"
              }}>
                <div style={{ fontSize: 32, fontWeight: 900, color: "var(--primary)", lineHeight: 1, marginBottom: 4 }}>
                  {s.num}
                </div>
                <div style={{ fontSize: 11, color: "var(--text-mute)" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      <footer className="site-footer">甲骨學大辭典 版權所有 © 2024</footer>
    </div>
  );
}
