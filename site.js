/* ============ Shared site JS for 甲骨學大辭典 ============ */

// --- Pinyin normalize (strip tone marks for fuzzy search) ---
const TONE_MAP = {ā:'a',á:'a',ǎ:'a',à:'a',ē:'e',é:'e',ě:'e',è:'e',ī:'i',í:'i',ǐ:'i',ì:'i',ō:'o',ó:'o',ǒ:'o',ò:'o',ū:'u',ú:'u',ǔ:'u',ù:'u',ǖ:'v',ǘ:'v',ǚ:'v',ǜ:'v',ü:'v'};
function stripTones(s){
  return (s||'').toLowerCase().replace(/[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜü]/g, m => TONE_MAP[m] || m);
}

// --- Mobile menu toggle ---
function toggleMobileMenu(){
  const m = document.getElementById('mmenu');
  if (m) m.classList.toggle('open');
}

// --- Load entries (cached on window) ---
let _entriesPromise = null;
function loadEntries(){
  if (!_entriesPromise){
    _entriesPromise = fetch('data/entries.json').then(r => r.json()).catch(() => []);
  }
  return _entriesPromise;
}

// --- Search ---
function searchEntries(entries, kw){
  if (!kw) return [];
  const lower = kw.toLowerCase();
  const stripped = stripTones(kw);
  return entries.filter(e => {
    if (e.title && e.title.includes(kw)) return true;
    if (e.pinyin && e.pinyin.toLowerCase().includes(lower)) return true;
    if (e.pinyin && stripTones(e.pinyin).includes(stripped)) return true;
    if (e.bian && e.bian.includes(kw)) return true;
    if (e.zhang && e.zhang.includes(kw)) return true;
    return false;
  });
}

// --- Render pagination control ---
function renderPager(container, total, pageSize, current, onPage){
  const pages = Math.max(1, Math.ceil(total / pageSize));
  if (pages <= 1){ container.innerHTML = ''; return; }
  const items = [];
  function btn(label, page, opts){
    opts = opts || {};
    if (opts.cur) items.push(`<span class="cur">${label}</span>`);
    else if (opts.ell) items.push(`<span class="ell">${label}</span>`);
    else items.push(`<a data-p="${page}">${label}</a>`);
  }
  if (current > 1) btn('‹', current - 1);
  const showWindow = 2;
  const visited = new Set();
  function emit(p){
    if (p < 1 || p > pages || visited.has(p)) return;
    visited.add(p);
    btn(p, p, {cur: p === current});
  }
  emit(1);
  if (current - showWindow > 2) btn('…', 0, {ell: true});
  for (let p = current - showWindow; p <= current + showWindow; p++) emit(p);
  if (current + showWindow < pages - 1) btn('…', 0, {ell: true});
  emit(pages);
  if (current < pages) btn('›', current + 1);
  container.innerHTML = items.join('');
  container.querySelectorAll('a[data-p]').forEach(a => {
    a.addEventListener('click', () => onPage(parseInt(a.dataset.p, 10)));
  });
}

// --- HTML escape ---
function esc(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
