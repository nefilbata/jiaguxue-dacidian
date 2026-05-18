"use client";
import { useState } from "react";
import Nav from "../../components/Nav";

const BG_TEXT = "卜龜甲貞王商殷祀祭弗受有佑亡翌祖妣兄子父母田獵雨風年黍禾刀弓戈矛車馬牛羊豕犬鳥魚";

// Common radicals with approximate counts
const RADICALS = [
  { char: "｜", name: "直",  count: 74 },
  { char: "亻", name: "人",  count: 48 },
  { char: "口", name: "口",  count: 53 },
  { char: "女", name: "女",  count: 29 },
  { char: "宀", name: "宀",  count: 41 },
  { char: "心", name: "心",  count: 36 },
  { char: "手", name: "手",  count: 32 },
  { char: "日", name: "日",  count: 38 },
  { char: "月", name: "月",  count: 27 },
  { char: "木", name: "木",  count: 45 },
  { char: "水", name: "水",  count: 43 },
  { char: "火", name: "火",  count: 26 },
  { char: "土", name: "土",  count: 31 },
  { char: "金", name: "金",  count: 28 },
  { char: "言", name: "言",  count: 33 },
  { char: "糸", name: "糸",  count: 24 },
  { char: "馬", name: "馬",  count: 41 },
  { char: "牛", name: "牛",  count: 29 },
  { char: "王", name: "王",  count: 25 },
  { char: "…",  name: "更多", count: 0, more: true },
];

// Sample entries for 甲 radical
const SAMPLE_ENTRIES = [
  { glyph: "甲", char: "甲", pinyin: "jiǎ", def: "天干之首；居第一位。",           count: 812 },
  { glyph: "申", char: "申", pinyin: "shēn", def: "地支之九；申時，下午三時至五時。", count: 645 },
  { glyph: "中", char: "中", pinyin: "zhōng", def: "中間；中心。",                  count: 512 },
  { glyph: "｜", char: "｜", pinyin: "gǔn", def: "直；豎。",                        count: 478 },
  { glyph: "卜", char: "卜", pinyin: "bǔ",  def: "占卜；以龜甲或獸骨問卜。",        count: 412 },
];

export default function BushouPage() {
  const [activeRad, setActiveRad] = useState(RADICALS[0]);
  const [page, setPage] = useState(1);

  return (
    <div>
      <Nav />

      {/* PAGE HERO */}
      <section className="page-hero">
        <div className="page-hero-bg-chars" aria-hidden="true">{BG_TEXT.repeat(3)}</div>
        <div className="page-hero-bone">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/bone.png" alt="" />
        </div>
        <div className="breadcrumb">
          <a href="/">首頁</a>
          <span className="breadcrumb-sep">›</span>
          <span>按部首瀏覽</span>
        </div>
        <h1 className="page-title">按部首瀏覽</h1>
        <p className="page-subtitle" style={{ fontSize: 14 }}>以形索義・按部首檢索甲骨文字</p>
        <div className="page-hero-landscape" aria-hidden="true" />
      </section>

      <div className="content-wrap">
        {/* RADICAL GRID */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700 }}>常用部首</h2>
          <button style={{ fontSize: 12, color: "var(--text-mute)", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>
            ？部首檢索説明
          </button>
        </div>

        <div style={{
          display: "grid", gridTemplateColumns: "repeat(10, 1fr)",
          gap: 8, marginBottom: 40
        }}>
          {RADICALS.map(r => (
            <button
              key={r.char}
              onClick={() => !r.more && setActiveRad(r)}
              style={{
                border: `1.5px solid ${activeRad.char === r.char && !r.more ? "var(--primary)" : "var(--border)"}`,
                background: activeRad.char === r.char && !r.more ? "var(--primary-lt)" : "var(--bg-card)",
                borderRadius: 4, padding: "12px 8px", cursor: "pointer",
                textAlign: "center", fontFamily: "inherit",
                color: activeRad.char === r.char && !r.more ? "var(--primary)" : "var(--text)",
                transition: "all 0.12s"
              }}
            >
              <div style={{ fontSize: 22, fontWeight: 700, lineHeight: 1, marginBottom: 4 }}>{r.char}</div>
              <div style={{ fontSize: 11, color: "var(--text-mute)" }}>{r.name}</div>
              {!r.more && <div style={{ fontSize: 11, color: "var(--text-mute)" }}>({r.count})</div>}
              {r.more && <div style={{ fontSize: 16, color: "var(--text-mute)" }}>∨</div>}
            </button>
          ))}
        </div>

        {/* ENTRY TABLE */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700 }}>
            部首「{activeRad.char} {activeRad.name}」的字形列表
            <span style={{ fontSize: 13, fontWeight: 400, color: "var(--text-mute)", marginLeft: 8 }}>
              共 {activeRad.count} 個字
            </span>
          </h3>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--text-mute)" }}>
            排序：
            <select style={{
              border: "1px solid var(--border)", background: "var(--bg-card)",
              borderRadius: 3, padding: "4px 10px", fontSize: 13, fontFamily: "inherit",
              color: "var(--text)"
            }}>
              <option>按出現頻率</option>
              <option>按筆畫</option>
              <option>按拼音</option>
            </select>
          </div>
        </div>

        <table className="entry-table">
          <thead>
            <tr>
              <th style={{ width: 80 }}>字形</th>
              <th style={{ width: 120 }}>字頭</th>
              <th style={{ width: 100 }}>讀音</th>
              <th>釋義</th>
              <th style={{ width: 100 }}>出現次數</th>
              <th style={{ width: 100 }}>例組</th>
            </tr>
          </thead>
          <tbody>
            {SAMPLE_ENTRIES.map(e => (
              <tr key={e.char}>
                <td>
                  <span style={{ fontSize: 32, fontWeight: 700, color: "var(--text)" }}>{e.glyph}</span>
                </td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 18, fontWeight: 700 }}>{e.char}</span>
                    <span style={{ fontSize: 16, color: "var(--text-mute)" }}>🔊</span>
                  </div>
                </td>
                <td style={{ fontStyle: "italic", color: "var(--text-mute)" }}>{e.pinyin}</td>
                <td style={{ fontSize: 13 }}>{e.def}</td>
                <td style={{ fontSize: 14, fontWeight: 500 }}>{e.count}</td>
                <td>
                  <button className="view-btn">查看例組 ›</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* PAGINATION */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 24 }}>
          <span style={{ fontSize: 12, color: "var(--text-mute)" }}>第 {page} 頁，共 8 頁</span>
          <div className="pagination" style={{ marginTop: 0 }}>
            <button className="page-btn arrow">‹</button>
            {[1,2,3,4,5].map(n => (
              <button key={n} className={`page-btn ${page === n ? "active" : ""}`} onClick={() => setPage(n)}>{n}</button>
            ))}
            <span style={{ padding: "0 4px", color: "var(--text-mute)" }}>…</span>
            <button className="page-btn">8</button>
            <button className="page-btn arrow">›</button>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--text-mute)" }}>
            每頁顯示：
            <select style={{
              border: "1px solid var(--border)", background: "var(--bg-card)",
              borderRadius: 3, padding: "4px 10px", fontSize: 13, fontFamily: "inherit", color: "var(--text)"
            }}>
              <option>10 條</option>
              <option>20 條</option>
              <option>50 條</option>
            </select>
          </div>
        </div>
      </div>

      <footer className="site-footer">甲骨學大辭典 版權所有 © 2024</footer>
    </div>
  );
}
