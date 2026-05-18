import Nav from "../../components/Nav";

const BG_TEXT = "卜龜甲貞王商殷祀祭弗受有佑亡翌祖妣兄子父母田獵雨風年黍禾刀弓戈矛車馬牛羊豕犬鳥魚";

export default function AboutPage() {
  return (
    <div>
      <Nav />
      <section className="page-hero">
        <div className="page-hero-bg-chars" aria-hidden="true">{BG_TEXT.repeat(3)}</div>
        <div className="breadcrumb">
          <a href="/">首頁</a>
          <span className="breadcrumb-sep">›</span>
          <span>關於本辭典</span>
        </div>
        <h1 className="page-title">關於本辭典</h1>
        <p className="page-subtitle" style={{ fontSize: 14 }}>辭典簡介與説明</p>
        <div className="page-hero-landscape" aria-hidden="true" />
      </section>

      <div className="content-wrap">
        <div style={{
          maxWidth: 780, background: "var(--bg-card)",
          border: "1px solid var(--border)", borderRadius: 3,
          padding: "36px 40px"
        }}>
          <div className="section-label" style={{ marginBottom: 20 }}>
            <div className="section-label-bar" />
            辭典介紹
          </div>
          <div className="intro-body">
            <p>
              《甲骨學大辭典》是一部系統收録甲骨學相關術語、遺址文物、語言文字、歷史文獻、
              研究成果及學術活動影響的重要工具書，由鄭州大學漢字文明研究中心《甲骨學大辭典》
              項目組編纂，2026年4月完成修訂稿。
            </p>
            <p>
              全書共六編，收録詞條 3,881 條，涵蓋甲骨學研究的主要領域，
              為甲骨學研究者與學習者提供全面、權威的學術參考。
            </p>
            <p style={{ fontStyle: "italic", color: "var(--text-mute)", fontSize: 13 }}>
              （内部材料，請勿外傳）
            </p>
          </div>

          <div style={{ borderTop: "1px solid var(--border)", marginTop: 28, paddingTop: 24 }}>
            <div className="section-label" style={{ marginBottom: 16 }}>
              <div className="section-label-bar" />
              使用説明
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {[
                { icon: "🔤", title: "按音序瀏覽", desc: "輸入拼音首字母，按 A–Z 字母順序瀏覽詞條。" },
                { icon: "⼝", title: "按部首瀏覽", desc: "選擇漢字部首，按傳統字書體例查找詞條。" },
                { icon: "☰", title: "按編類瀏覽", desc: "依六大編分類體系，系統瀏覽各類詞條。" },
                { icon: "🔍", title: "關鍵詞搜索", desc: "在首頁搜索框輸入詞條名、拼音或關鍵字。" },
              ].map(item => (
                <div key={item.title} style={{
                  border: "1px solid var(--border)", borderRadius: 3,
                  padding: "16px", display: "flex", gap: 12, alignItems: "flex-start"
                }}>
                  <span style={{ fontSize: 20 }}>{item.icon}</span>
                  <div>
                    <div style={{ fontWeight: 700, marginBottom: 4 }}>{item.title}</div>
                    <div style={{ fontSize: 13, color: "var(--text-mute)" }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ borderTop: "1px solid var(--border)", marginTop: 24, paddingTop: 20, fontSize: 13, color: "var(--text-mute)" }}>
            <div style={{ fontWeight: 500, color: "var(--text-mid)", marginBottom: 6 }}>版權聲明</div>
            本網站為《甲骨學大辭典》數字化查詢系統，詞條目録版權歸鄭州大學漢字文明研究中心所有。
            網站設計與開發：甲骨學大辭典項目組。© 2024
          </div>
        </div>
      </div>

      <footer className="site-footer">甲骨學大辭典 版權所有 © 2024</footer>
    </div>
  );
}
