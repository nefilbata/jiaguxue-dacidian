"use client";
import { useState } from "react";
import Nav from "../../components/Nav";

const BG_TEXT = "卜龜甲貞王商殷祀祭弗受有佑亡翌祖妣兄子父母田獵雨風年黍禾刀弓戈矛車馬牛羊豕犬鳥魚";

const APPENDIX_ITEMS = [
  { key: "zibiaoShang", icon: "夭", label: "甲骨文字表" },
  { key: "ganzhi",      icon: "干", label: "干支表" },
  { key: "shier",       icon: "⏰", label: "十二地支表" },
  { key: "zhenren",     icon: "👤", label: "貞人分期表" },
  { key: "shidai",      icon: "品", label: "商代世系表" },
  { key: "diming",      icon: "📍", label: "重要地名表" },
];

// Sample data for 甲骨文字表
const ZIBIAN_SAMPLE = [
  { seq: 1,  glyph: "𠂆", char: "日", pinyin: "rì",   def: "太陽；白天。",     example: "乙巳卜，貞：日夕風雨。", ref: "合集 10123" },
  { seq: 2,  glyph: "𠂇", char: "月", pinyin: "yuè",  def: "月亮；月。",       example: "丁卯卜，貞：月有食。",   ref: "合集 8692"  },
  { seq: 3,  glyph: "朩", char: "雨", pinyin: "yǔ",   def: "雨；降雨。",       example: "癸未卜，貞：今雨？",     ref: "合集 15234" },
  { seq: 4,  glyph: "氺", char: "水", pinyin: "shuǐ", def: "水；河流。",       example: "甲寅卜，貞：水多不？",   ref: "合集 6605"  },
  { seq: 5,  glyph: "𠂉", char: "山", pinyin: "shān", def: "山；高處。",       example: "戊辰卜，貞：登山。",     ref: "合集 1120"  },
  { seq: 6,  glyph: "灬", char: "火", pinyin: "huǒ",  def: "火；火焰。",       example: "辛丑卜，貞：火其亡災？", ref: "合集 3589"  },
  { seq: 7,  glyph: "朳", char: "木", pinyin: "mù",   def: "樹木；木材。",     example: "丙午卜，貞：伐木。",     ref: "合集 1756"  },
  { seq: 8,  glyph: "◎", char: "目", pinyin: "mù",   def: "眼；目光。",       example: "庚戌卜，貞：其目疾？",   ref: "合集 8801"  },
  { seq: 9,  glyph: "𠃜", char: "耳", pinyin: "ěr",   def: "耳；聽覺。",       example: "壬申卜，貞：其耳聾？",   ref: "合集 2211"  },
  { seq: 10, glyph: "囗", char: "口", pinyin: "kǒu",  def: "口；嘴。",         example: "己亥卜，貞：勿口舌。",   ref: "合集 3277"  },
];

const GANZHI_SAMPLE = [
  { tiangan: "甲", dizhi: "子", hezu: "甲子", seq: 1  },
  { tiangan: "乙", dizhi: "丑", hezu: "乙丑", seq: 2  },
  { tiangan: "丙", dizhi: "寅", hezu: "丙寅", seq: 3  },
  { tiangan: "丁", dizhi: "卯", hezu: "丁卯", seq: 4  },
  { tiangan: "戊", dizhi: "辰", hezu: "戊辰", seq: 5  },
  { tiangan: "己", dizhi: "巳", hezu: "己巳", seq: 6  },
  { tiangan: "庚", dizhi: "午", hezu: "庚午", seq: 7  },
  { tiangan: "辛", dizhi: "未", hezu: "辛未", seq: 8  },
  { tiangan: "壬", dizhi: "申", hezu: "壬申", seq: 9  },
  { tiangan: "癸", dizhi: "酉", hezu: "癸酉", seq: 10 },
];

export default function AppendixPage() {
  const [active, setActive] = useState("zibiaoShang");
  const [page,   setPage]   = useState(1);
  const TOTAL_MOCK = 200;

  return (
    <div>
      <Nav />

      {/* PAGE HERO */}
      <section className="page-hero" style={{ padding: "40px 64px 36px" }}>
        <div className="page-hero-bg-chars" aria-hidden="true">{BG_TEXT.repeat(3)}</div>
        <div className="page-hero-bone">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/bone.png" alt="" />
        </div>
        <div className="breadcrumb">
          <a href="/">首頁</a>
          <span className="breadcrumb-sep">›</span>
          <span>附錄</span>
        </div>
        <h1 className="page-title" style={{ fontSize: 38 }}>附 錄</h1>
        <p style={{ fontSize: 13, color: "var(--text-mute)", marginTop: 8 }}>
          本附錄收録甲骨學研究相關表格與資料，供讀者參考使用。
        </p>
        <div className="page-hero-landscape" aria-hidden="true" />
      </section>

      <div className="appendix-layout">
        {/* SIDEBAR */}
        <nav className="appendix-nav">
          {APPENDIX_ITEMS.map(item => (
            <button
              key={item.key}
              className={`appendix-nav-item ${active === item.key ? "active" : ""}`}
              onClick={() => { setActive(item.key); setPage(1); }}
            >
              <span className="appendix-nav-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}

          {/* Landscape painting decoration */}
          <div style={{ padding: "16px 0 0", opacity: 0.6 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/landscape_left.png" alt="" style={{ width: "100%", opacity: 0.5 }} />
          </div>
        </nav>

        {/* MAIN */}
        <main className="appendix-main">
          {active === "zibiaoShang" && (
            <>
              <div className="appendix-title">
                <div className="appendix-title-bar" />
                甲骨文字表
              </div>
              <p className="appendix-desc">
                本表依筆畫順序收録常見甲骨文字，列出其字形、讀音、釋義與出組例。
              </p>
              <table className="appendix-table">
                <thead>
                  <tr>
                    <th style={{ width: 60 }}>序號</th>
                    <th style={{ width: 100 }}>甲骨文字形</th>
                    <th style={{ width: 80 }}>隸定字</th>
                    <th style={{ width: 80 }}>拼音</th>
                    <th style={{ width: 160 }}>釋義</th>
                    <th>出組例</th>
                    <th style={{ width: 100 }}>著録號</th>
                  </tr>
                </thead>
                <tbody>
                  {ZIBIAN_SAMPLE.map(row => (
                    <tr key={row.seq}>
                      <td style={{ color: "var(--text-mute)", fontSize: 13 }}>{row.seq}</td>
                      <td><span className="appendix-glyph">{row.glyph}</span></td>
                      <td style={{ fontSize: 18, fontWeight: 700 }}>{row.char}</td>
                      <td style={{ color: "var(--text-mute)", fontStyle: "italic" }}>{row.pinyin}</td>
                      <td style={{ fontSize: 13 }}>{row.def}</td>
                      <td style={{ fontSize: 13, color: "var(--text-mid)" }}>{row.example}</td>
                      <td style={{ fontSize: 12, color: "var(--text-mute)" }}>{row.ref}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 12, color: "var(--text-mute)" }}>
                  共 {ZIBIAN_SAMPLE.length} 條記録
                </span>
                <div className="pagination" style={{ marginTop: 0 }}>
                  <button className="page-btn arrow">‹</button>
                  {[1,2,3,4,5].map(n => (
                    <button
                      key={n}
                      className={`page-btn ${page === n ? "active" : ""}`}
                      onClick={() => setPage(n)}
                    >{n}</button>
                  ))}
                  <span style={{ padding: "0 4px", color: "var(--text-mute)" }}>…</span>
                  <button className="page-btn">20</button>
                  <button className="page-btn arrow">›</button>
                </div>
              </div>
            </>
          )}

          {active === "ganzhi" && (
            <>
              <div className="appendix-title">
                <div className="appendix-title-bar" />
                干支表
              </div>
              <p className="appendix-desc">天干地支對照表，用於甲骨卜辭紀日。</p>
              <table className="appendix-table">
                <thead>
                  <tr>
                    <th style={{ width: 60 }}>序號</th>
                    <th>天干</th>
                    <th>地支</th>
                    <th>合稱</th>
                  </tr>
                </thead>
                <tbody>
                  {GANZHI_SAMPLE.map(row => (
                    <tr key={row.seq}>
                      <td style={{ color: "var(--text-mute)", fontSize: 13 }}>{row.seq}</td>
                      <td style={{ fontSize: 20, fontWeight: 700 }}>{row.tiangan}</td>
                      <td style={{ fontSize: 20, fontWeight: 700 }}>{row.dizhi}</td>
                      <td style={{ fontSize: 16, fontWeight: 500 }}>{row.hezu}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {!["zibiaoShang", "ganzhi"].includes(active) && (
            <div style={{ padding: "48px 0", textAlign: "center", color: "var(--text-mute)" }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>📋</div>
              <div style={{ fontSize: 15 }}>
                {APPENDIX_ITEMS.find(i => i.key === active)?.label}
              </div>
              <div style={{ fontSize: 13, marginTop: 8 }}>附録内容將與正式書稿同步更新</div>
            </div>
          )}
        </main>
      </div>

      <footer className="site-footer">甲骨學大辭典 版權所有 © 2024</footer>
    </div>
  );
}
