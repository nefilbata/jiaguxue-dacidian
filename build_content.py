#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
甲骨學大辭典 · 正文构建管线 (v2)
docx -> data/content/<id>.html + images/(自动裁剪到字形/图版外接框)

要点:
- 真词条 = 【X】 且 X 不含《》，; 不含"出版社/学位论文/页"，长度<=12
- 引文行【...】 -> 上一条"參考文獻"
- 行内字形图(与文字同段) -> <img class="glyph">
- 图版(独占段落) + 紧随的"圖N：..."注 -> 按【圖号】一一配对
- 段末(作者) -> byline
- emf 引用自动改 png；所有 png 自动裁白边
"""
import os, re, json, glob, docx
from docx.oxml.ns import qn
from PIL import Image, ImageChops

SRC="/mnt/user-data/uploads/理论术语類数据测试.docx"
MEDIA="/home/claude/jiagu/_media"; OUTC="/home/claude/jiagu/data/content"; OUTI="/home/claude/jiagu/images"
os.makedirs(OUTC,exist_ok=True); os.makedirs(OUTI,exist_ok=True)
A_BLIP=qn('a:blip'); R_EMBED=qn('r:embed')
V_NS='urn:schemas-microsoft-com:vml'; R_NS='http://schemas.openxmlformats.org/officeDocument/2006/relationships'
doc=docx.Document(SRC); rels=doc.part.rels

CN={'一':1,'二':2,'三':3,'四':4,'五':5,'六':6,'七':7,'八':8,'九':9,'十':10}
def cnum(s): return CN.get(s, int(s)) if not s.isdigit() else int(s)

def fix_ext(fn):
    if fn.lower().endswith('.emf'):
        png=fn[:-4]+'.png'
        if os.path.exists(os.path.join(MEDIA,png)): return png
    return fn
def esc(s): return s.replace('&','&amp;').replace('<','&lt;').replace('>','&gt;')
def is_headword(x):
    if any(c in x for c in '《》，；'): return False
    if any(k in x for k in ['出版社','學位論文','学位论文','頁','页']): return False
    return 0<len(x)<=12
def para_tokens(p):
    toks=[]
    for el in p._p.iter():
        tag=el.tag.split('}')[-1]
        if tag=='t' and el.text: toks.append(('t',el.text))
        elif tag=='blip':
            r=el.get(R_EMBED)
            if r in rels: toks.append(('img',rels[r].target_ref.split('/')[-1]))
        elif tag=='imagedata':
            r=el.get('{%s}id'%R_NS)
            if r in rels: toks.append(('img',rels[r].target_ref.split('/')[-1]))
    return toks
def para_bold(p):
    rr=[r for r in p.runs if r.text.strip()]
    return bool(rr) and all(r.bold for r in rr)

def autocrop(path,pad=2,thr=14):
    im=Image.open(path).convert("RGBA")
    bg=Image.new("RGBA",im.size,(255,255,255,255))
    flat=Image.alpha_composite(bg,im).convert("L")
    mask=ImageChops.invert(flat).point(lambda p:255 if p>thr else 0)
    bb=mask.getbbox()
    if not bb: 
        im.convert("RGB").save(path); return
    l,t,r,b=bb; W,H=im.size
    l=max(0,l-pad);t=max(0,t-pad);r=min(W,r+pad);b=min(H,b+pad)
    c=im.crop((l,t,r,b))
    out=Image.alpha_composite(Image.new("RGBA",c.size,(255,255,255,255)),c).convert("RGB")
    out.save(path)

def new_entry(t): return {'title':t,'paras':[],'fig_imgs':[],'fig_caps':{},'refs':[],'author':None}

entries=[]; cur=None; used=set()
for p in doc.paragraphs:
    text=p.text.strip(); toks=para_tokens(p)
    has_img=any(k=='img' for k,_ in toks); has_txt=any(k=='t' and v.strip() for k,v in toks)
    m=re.match(r'^【(.+?)】$',text)
    if m and is_headword(m.group(1)):
        cur=new_entry(m.group(1)); entries.append(cur); continue
    if cur is None: continue
    if m and not is_headword(m.group(1)):
        cur['refs'].append(m.group(1)); continue
    # 结构行(编号/小节)跳过
    if re.match(r'^[-－]?\s*([0-9]+\.|（[一二三四五六七八九十]+）|[一二三四五六七八九十]+、)',text) and not has_img:
        continue
    # 图版段(独占图片)
    if has_img and not has_txt:
        for k,v in toks:
            if k=='img':
                v=fix_ext(v); used.add(v); cur['fig_imgs'].append(v)
        continue
    # 图注段 "圖N：..."(可能一行多个) -> 按圖号入字典
    if re.match(r'^圖\s*[0-9一二三四五六七八九十]',text) and not has_img:
        for mm in re.finditer(r'圖\s*([0-9一二三四五六七八九十]+)\s*[:：]\s*(.*?)(?=圖\s*[0-9一二三四五六七八九十]+\s*[:：]|$)',text):
            n=cnum(mm.group(1)); cap=mm.group(2).strip()
            cur['fig_caps'][n]=f"圖{mm.group(1)}：{cap}"
        continue
    # 正文段(可含行内字形图)
    if has_txt or has_img:
        author=None
        am=re.search(r'[（(]([\u4e00-\u9fff·]{2,6})[）)]\s*$',text)
        if am and toks and toks[-1][0]=='t': author=am.group(1)
        buf=[]
        for k,v in toks:
            if k=='t': buf.append(esc(v))
            else:
                v=fix_ext(v); used.add(v); buf.append(f'<img class="glyph" src="images/{v}" alt="字形">')
        html=''.join(buf).strip()
        if not html: continue
        if author:
            html=re.sub(r'[（(]'+re.escape(author)+r'[）)]\s*$','',html).strip(); cur['author']=author
        kind='h' if para_bold(p) else 'p'
        if html: cur['paras'].append((kind,html))

# 复制 + 裁剪图片
for fn in used:
    s=os.path.join(MEDIA,fn)
    if os.path.exists(s):
        d=os.path.join(OUTI,fn); open(d,'wb').write(open(s,'rb').read())
        if fn.lower().endswith('.png'):
            try: autocrop(d)
            except Exception as e: print('crop fail',fn,e)

# 输出
manifest=[]
for idx,e in enumerate(entries,start=1):
    parts=[]
    for kind,html in e['paras']:
        parts.append(f'<h3 class="sec">{html}</h3>' if kind=='h' else f'<p>{html}</p>')
    if e['fig_imgs']:
        parts.append('<div class="figs">')
        for i,img in enumerate(e['fig_imgs'],start=1):
            cap=e['fig_caps'].get(i,'')
            caph=f'<figcaption>{esc(cap)}</figcaption>' if cap else ''
            parts.append(f'<figure><img src="images/{img}" alt="圖">{caph}</figure>')
        parts.append('</div>')
    if e['author']: parts.append(f'<p class="byline">（撰稿：{esc(e["author"])}）</p>')
    if e['refs']:
        parts.append('<div class="refs"><h4>參考文獻</h4><ul>')
        for r in e['refs']: parts.append(f'<li>{esc(r)}</li>')
        parts.append('</ul></div>')
    open(os.path.join(OUTC,f'{idx}.html'),'w',encoding='utf-8').write('\n'.join(parts))
    manifest.append({'id':idx,'title':e['title'],'figs':len(e['fig_imgs']),
                     'caps':len(e['fig_caps']),'author':e['author']})
print(f"{len(entries)} 条；图版条目的图/注配对：")
for mf in manifest:
    if mf['figs']: print(f"  id{mf['id']:>2} {mf['title']:<8} 图{mf['figs']} 注{mf['caps']}  {'✓配齐' if mf['figs']==mf['caps'] or mf['caps']==0 else '部分'}")
