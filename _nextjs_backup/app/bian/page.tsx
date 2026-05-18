"use client";
import { useEffect, useMemo, useState } from "react";
import Nav from "../../components/Nav";

type Entry = {
  id: number; title: string; pinyin: string; pinyinInitial: string;
  bian: string; zhang: string; jie: string; xiao: string;
  page: number | null; imageUrl: string | null;
};

const BIAN_ICONS = ["📖", "🏺", "文", "📜", "🔬", "🎭"];
const BIAN_DESCS: Record<string, string> = {
  "第一編 理論術語類": "收録甲骨學研究的基本概念、學科理論、研究方法、專門術語等，為理解甲骨學知識體系之基礎。",
  "第二編 考古文物類": "收録甲骨考古發現、遺址遺跡、典型甲骨遺物及文物保護相關條目。",
  "第三編 語言文字類": "收録甲骨文字學、語音學、詞彙學、語法學等語言文字研究相關條目。",
  "第四編 歷史文獻類": "收録商史人物、方國地理、社會制度、著録書目等歷史文獻相關條目。",
  "第五編 研究成果類": "收録甲骨學學術著作、工具書、學者傳略及研究機構相關條目。",
  "第六編 活動影響類": "收録學術組織、代表性期刊、數據庫、收藏單位及宣傳教育相關條目。",
};
const BG_TEXT = "卜龜甲貞王商殷祀祭弗受有佑亡翌祖妣兄子父母田獵雨風年黍禾刀弓戈矛車馬牛羊豕犬鳥魚";

export default function BianPage() {
  const [entries,     setEntries]     = useState<Entry[]>([]);
  const [activeBian,  setActiveBian]  = useState(0);
  const [activeZhang, setActiveZhang] = useState<string | null>(null);

  useEffect(() => {
    fetch("/data/entries.json").then(r => r.json()).then((d: Entry[]) => {
      setEntries(d);
    });
  }, []);

  // Build structure: bian → zhang → entries
  const structure = useMemo(() => {
    const bianMap: Record<string, Record<string, Entry[]>> = {};
    for (const e of entries) {
      if (!e.bian) continue;
      if (!bianMap[e.bian]) bianMap[e.bian] = {};
      const zh = e.zhang || "其他";
      if (!bianMap[e.bian][zh]) bianMap[e.bian][zh] = [];
      bianMap[e.bian][zh].push(e);
    }
    return bianMap;
  }, [entries]);

  const bianNames = Object.keys(structure);
  const currentBian = bianNames[activeBian] ?? "";
  const currentZhangs = structure[currentBian] ?? {};
  const zhangNames = Object.keys(currentZhangs);
  const displayZhang = activeZhang ?? zhangNames[0] ?? "";
  const sampleEntries = (currentZhangs[displayZhang] ?? []).slice(0, 3);
  const totalInBian = Object.values(currentZhangs).reduce((s, a) => s + a.length, 0);

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
          <span>按編類瀏覽</span>
        </div>
        <h1 className="page-title">按編類 <span className="red">瀏覽</span></h1>
        <p className="page-subtitle" style={{ fontSize: 14 }}>
          依《甲骨學大辭典》六大編分類瀏覽條目，系統了解甲骨學知識體系
        </p>
        <div className="page-hero-landscape" aria-hidden="true" />
      </section>

      {/* TWO-COLUMN LAYOUT */}
      <div className="bian-layout">
        {/* SIDEBAR */}
        <aside className="bian-sidebar">
          <div className="bian-sidebar-title">
            <span>📋</span> 編類目錄
          </div>
          {bianNames.map((b, i) => {
            const count = Object.values(structure[b] ?? {}).reduce((s, a) => s + a.length, 0);
            const isActive = i === activeBian;
            return (
              <div key={b}>
                <button
                  className={`bian-item ${isActive ? "active" : ""}`}
                  onClick={() => { setActiveBian(i); setActiveZhang(null); }}
                >
                  <span className="bian-item-label">
                    <span className="bian-item-arrow">{isActive ? "∨" : "›"}</span>
                    {b}
                  </span>
                  <span className="bian-count">{count.toLocaleString()} 條</span>
                </button>
                {isActive && (
                  <div className="bian-sub">
                    {Object.entries(currentZhangs).map(([zh, arr]) => (
                      <button
                        key={zh}
                        className={`bian-sub-item ${displayZhang === zh ? "active" : ""}`}
                        onClick={() => setActiveZhang(zh)}
                      >
                        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span className="bian-sub-dot" />
                          {zh}
                        </span>
                        <span style={{ fontSize: 11, color: "var(--text-mute)" }}>{arr.length} 條</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          <div className="bian-footer">
            共 6 編，{entries.length.toLocaleString()} 條目
          </div>
        </aside>

        {/* MAIN */}
        <main className="bian-main">
          {currentBian && (
            <>
              {/* BIAN HEADER */}
              <div className="bian-main-header">
                <div className="bian-main-icon">
                  {BIAN_ICONS[activeBian] ?? "📖"}
                </div>
                <div style={{ flex: 1 }}>
                  <div className="bian-main-title">{currentBian}</div>
                  <div className="bian-main-desc">
                    {BIAN_DESCS[currentBian] ?? ""}
                  </div>
                </div>
                <div className="bian-main-count">共 {totalInBian.toLocaleString()} 條</div>
              </div>

              {/* ZHANG TABLE */}
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>章節列表</div>
              <table className="zhang-table">
                <thead>
                  <tr>
                    <th>章節</th>
                    <th style={{ width: 100 }}>條目數</th>
                    <th style={{ width: 100 }}>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {zhangNames.map(zh => (
                    <tr key={zh} onClick={() => setActiveZhang(zh)}>
                      <td>
                        <div className="zhang-name">
                          <span className="zhang-arrow">›</span>
                          {zh}
                        </div>
                      </td>
                      <td style={{ color: "var(--text-mute)", fontSize: 13 }}>
                        {currentZhangs[zh].length} 條
                      </td>
                      <td>
                        <button
                          className="view-btn"
                          onClick={e => { e.stopPropagation(); setActiveZhang(zh); }}
                        >
                          查看條目
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* SAMPLE ENTRIES */}
              {displayZhang && sampleEntries.length > 0 && (
                <div>
                  <div className="sample-section-title">
                    條目精選（{displayZhang}）
                    <span className="sample-more">更多條目 ›</span>
                  </div>
                  {sampleEntries.map(e => (
                    <div key={e.id} className="sample-row">
                      <div className="sample-char-col">
                        <div className="sample-char-name">{e.title}</div>
                        <div className="sample-char-py">{e.pinyin}</div>
                      </div>
                      <div className="sample-desc" style={{ color: "var(--text-mute)", fontSize: 13 }}>
                        {e.jie || e.zhang || "甲骨學相關術語條目。"}
                      </div>
                      <span className="sample-link">查看詳情 ›</span>
                    </div>
                  ))}
                  <div className="sample-see-all">
                    查看本章全部 {currentZhangs[displayZhang]?.length ?? 0} 條 ∨
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      <footer className="site-footer">甲骨學大辭典 版權所有 © 2024</footer>
    </div>
  );
}
