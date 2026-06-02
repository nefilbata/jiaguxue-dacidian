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

// --- Build an entry-detail link that remembers where it came from ---
// origin: {from:'search'|'pinyin'|'bian', q?, L?, b?, z?}
function entryHref(id, origin){
  const p = new URLSearchParams();
  p.set('id', id);
  if (origin && origin.from){
    p.set('from', origin.from);
    if (origin.q) p.set('q', origin.q);
    if (origin.L) p.set('L', origin.L);
    if (origin.b) p.set('b', origin.b);
    if (origin.z) p.set('z', origin.z);
  }
  return 'entry.html?' + p.toString();
}

// --- Resolve the "back" target + label from an entry's URL params ---
function resolveBack(params){
  const from = params.get('from');
  if (from === 'search'){
    const q = params.get('q') || '';
    return { href: 'index.html' + (q ? '?q=' + encodeURIComponent(q) : ''),
             label: '‹ 返回搜索結果', crumbHref: 'index.html' + (q ? '?q=' + encodeURIComponent(q) : ''), crumbText: '搜索結果' };
  }
  if (from === 'pinyin'){
    const L = (params.get('L') || '').toUpperCase();
    return { href: 'pinyin.html' + (L ? '#' + L : ''),
             label: '‹ 返回音序瀏覽', crumbHref: 'pinyin.html' + (L ? '#' + L : ''), crumbText: '按音序' };
  }
  if (from === 'bian'){
    const b = params.get('b') || '', z = params.get('z') || '';
    const qs = [];
    if (b) qs.push('b=' + encodeURIComponent(b));
    if (z) qs.push('z=' + encodeURIComponent(z));
    const href = 'bian.html' + (qs.length ? '?' + qs.join('&') : '');
    return { href, label: '‹ 返回目錄', crumbHref: href, crumbText: '按編類' };
  }
  // default / legacy links with no origin
  return { href: 'bian.html', label: '‹ 返回目錄', crumbHref: 'bian.html', crumbText: '按編類' };
}

// --- Has-text manifest ---
let _hasTextSet=null;
function loadHasText(){ if(!_hasTextSet){_hasTextSet=fetch('data/has_text.json',{cache:'no-cache'}).then(r=>r.json()).then(a=>new Set(a)).catch(()=>new Set());} return _hasTextSet; }
