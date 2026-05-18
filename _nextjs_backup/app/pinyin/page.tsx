"use client";
import { useEffect, useMemo, useState } from "react";
import Nav from "../../components/Nav";

type Entry = {
  id: number; title: string; pinyin: string; pinyinInitial: string;
  bian: string; zhang: string; jie: string; xiao: string;
  page: number | null; imageUrl: string | null;
};

const ALL_LETTERS = "ABCDEFGHJKLMNOPQRSTWXYZ".split("");
const BG_TEXT = "卜龜甲貞王商殷祀祭弗受有佑亡翌祖妣兄子父母田獵雨風年黍禾刀弓戈矛車馬牛羊豕犬鳥魚";

export default function PinyinPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [letter,  setLetter]  = useState("A");
  const [pageNum, setPageNum] = useState(1);
  const PER_PAGE = 10;

  useEffect(() => {
    fetch("/data/entries.json").then(r => r.json()).then((d: Entry[]) => {
      setEntries(d);
    });
  }, []);

  const byLetter = useMemo(() => {
    const map: Record<string, Entry[]> = {};
    for (const e of entries) {
      const l = e.pinyinInitial?.toUpperCase() || "?";
      if (!map[l]) map[l] = [];
      map[l].push(e);
    }
    // Sort within each letter by pinyin
    for (const l in map) map[l].sort((a, b) => a.pinyin.localeCompare(b.pinyin));
    return map;
  }, [entries]);

  const hasLetter = (l: string) => (byLetter[l]?.length ?? 0) > 0;
  const current   = byLetter[letter] ?? [];
  const totalPages = Math.ceil(current.length / PER_PAGE);
  const shown = current.slice((pageNum - 1) * PER_PAGE, pageNum * PER_PAGE);

  function changeLetter(l: string) {
    if (!hasLetter(l)) return;
    setLetter(l); setPageNum(1);
  }

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
          <span>按音序</span>
          <span className="breadcrumb-sep">›</span>
          <span>瀏覽</span>
        </div>
        <h1 className="page-title">按音序瀏覽</h1>
        <p className="page-subtitle">按漢語拼音音序（A–Z）瀏覽辭條。</p>
      </section>

      {/* LETTER STRIP */}
      <div className="letter-strip">
        {ALL_LETTERS.map(l => (
          <button
            key={l}
            className={`letter-btn ${letter === l ? "active" : ""} ${!hasLetter(l) ? "disabled" : ""}`}
            onClick={() => changeLetter(l)}
          >
            {l}
          </button>
        ))}
      </div>

      {/* TABLE */}
      <div className="content-wrap">
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 16 }}>
          <div>
            <div className="content-label">當前字母：<strong style={{ color: "var(--primary)" }}>{letter}</strong></div>
          </div>
          <div className="content-count">共 {current.length} 條辭條</div>
        </div>

        <table className="entry-table">
          <thead>
            <tr>
              <th style={{ width: 80 }}>辭條</th>
              <th style={{ width: 160 }}>釋義 / 分類簡述</th>
              <th>所屬編類 / 編號</th>
            </tr>
          </thead>
          <tbody>
            {shown.map((e, i) => (
              <tr key={e.id}>
                <td>
                  <div className="entry-char">{e.title}</div>
                  <div className="entry-pinyin-cell">［{e.pinyin}］</div>
                </td>
                <td className="entry-desc" style={{ color: "var(--text-mute)", fontSize: 13 }}>
                  {e.zhang}{e.jie ? `・${e.jie}` : ""}
                </td>
                <td>
                  <div className="entry-path">{e.bian}</div>
                  <div className="entry-num" style={{ marginTop: 2 }}>
                    / {String((pageNum - 1) * PER_PAGE + i + 1).padStart(3, "0")}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="pagination">
            <button className="page-btn arrow" onClick={() => setPageNum(p => Math.max(1, p - 1))}>‹</button>
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              const n = i + 1;
              return (
                <button
                  key={n}
                  className={`page-btn ${pageNum === n ? "active" : ""}`}
                  onClick={() => setPageNum(n)}
                >
                  {n}
                </button>
              );
            })}
            {totalPages > 7 && <span style={{ padding: "0 4px" }}>…</span>}
            {totalPages > 7 && (
              <button
                className={`page-btn ${pageNum === totalPages ? "active" : ""}`}
                onClick={() => setPageNum(totalPages)}
              >
                {totalPages}
              </button>
            )}
            <button className="page-btn arrow" onClick={() => setPageNum(p => Math.min(totalPages, p + 1))}>›</button>
          </div>
        )}
        {totalPages > 1 && (
          <div style={{ textAlign: "center", fontSize: 13, color: "var(--text-mute)", marginTop: 12 }}>
            共 {current.length} 條辭條
          </div>
        )}
      </div>

      <footer className="site-footer">甲骨學大辭典 版權所有 © 2024</footer>
    </div>
  );
}
