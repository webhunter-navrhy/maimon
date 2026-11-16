#!/usr/bin/env python3
"""Loga MAIMON – 3 návrhy jako čisté SVG křivky (Bricolage Grotesque, OFL).
A = slovo „maimon“, tečka nad i je hlava (limetka)
B = „M“ ze dvou postav – firma a člověk, spojené rukama
C = „M“ vyplněné v rozpisu směn 5×5 (koncept webu)"""
import pathlib
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen

here = pathlib.Path(__file__).parent
out = here.parent / 'static' / 'brand'; out.mkdir(parents=True, exist_ok=True)
LIME, INK, PAPER, MUTED = '#D2F53C', '#15171A', '#F1EFE8', '#8C8F94'

def inst(**ax):
    return instantiateVariableFont(TTFont(here / 'Bricolage.ttf'), ax)
F_WORD = inst(wght=640, wdth=82, opsz=96)
F_SUB = inst(wght=500, wdth=100, opsz=14)

def glyph(font, name, x, y, sc):
    gs = font.getGlyphSet(); pen = SVGPathPen(gs)
    gs[name].draw(TransformPen(pen, (sc, 0, 0, -sc, x, y)))
    bp = BoundsPen(gs); gs[name].draw(bp)
    return pen.getCommands(), gs[name].width * sc, bp.bounds

def text(font, s, x, y, size, track=0, dotless_i=False):
    sc = size / font['head'].unitsPerEm; cm = font.getBestCmap(); d = []; cx = x; marks = []
    for ch in s:
        if ch == ' ': cx += 0.26 * size + track; continue
        name = cm[ord(ch)]
        if ch == 'i' and dotless_i: name = cm[0x131]
        cmd, adv, b = glyph(font, name, cx, y, sc)
        if ch == 'i' and dotless_i: marks.append((cx + (b[0] + b[2]) / 2 * sc, b[2] - b[0]))
        d.append(cmd); cx += adv + track
    return ' '.join(d), cx - track - x, marks

def xh(font):
    return font['OS/2'].sxHeight / font['head'].unitsPerEm

def svg(w, h, body, title='Maimon – agentura práce', bg=None):
    r = f'<rect width="{w:.0f}" height="{h:.0f}" fill="{bg}"/>' if bg else ''
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w:.0f} {h:.0f}" role="img" aria-label="{title}">'
            f'<title>{title}</title>{r}{body}</svg>\n')

def circ(cx, cy, r, fill):
    return f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="{r:.1f}" fill="{fill}"/>'

# ---------- A: wordmark, hlava nad i ----------
def word_a(x, base, size, fg, head=LIME, track=-0.02):
    d, w, marks = text(F_WORD, 'maimon', x, base, size, track * size, dotless_i=True)
    mx, stem = marks[0]
    r = stem * size / F_WORD['head'].unitsPerEm * 0.78
    hy = base - xh(F_WORD) * size - r * 1.05 - size * 0.035
    return f'<path d="{d}" fill="{fg}"/>' + circ(mx, hy, r, head), w

def logo_a(fg, sub, head=LIME):
    size = 200; pad = 40; base = pad + 200
    els, w = word_a(pad, base, size, fg, head)
    sd, sw, _ = text(F_SUB, 'agentura práce', pad + 6, base + 62, 44, 0.5)
    return svg(w + 2 * pad, base + 62 + pad, els + f'<path d="{sd}" fill="{sub}"/>')

# ---------- B: dvě postavy tvoří M ----------
def mark_b(x, y, s, fg, head=LIME):
    """M v čtverci s×s: dva sloupy (těla), V mezi nimi (spojené ruce), dvě hlavy."""
    k = s / 200
    P = [(24,82),(60,82),(100,140),(140,82),(176,82),(176,198),(144,198),(144,134),(112,182),(88,182),(56,134),(56,198),(24,198)]
    d = 'M' + ' L'.join(f'{x+px*k:.1f} {y+py*k:.1f}' for px, py in P) + 'Z'
    return f'<path d="{d}" fill="{fg}"/>' + circ(x + 40 * k, y + 42 * k, 23 * k, fg) + circ(x + 160 * k, y + 42 * k, 23 * k, head)

def logo_b(fg, sub, head=LIME):
    pad = 40; s = 230
    m = mark_b(pad, pad, s, fg, head)
    d, w, _ = text(F_WORD, 'maimon', 0, 0, 150)
    tx = pad + s + 44; base = pad + s * 0.98 - 70
    d, w, _ = text(F_WORD, 'maimon', tx, base, 150, -3)
    sd, sw, _ = text(F_SUB, 'agentura práce', tx + 4, base + 58, 40, 0.5)
    return svg(tx + w + pad, pad * 2 + s, m + f'<path d="{d}" fill="{fg}"/><path d="{sd}" fill="{sub}"/>')

# ---------- C: rozpis směn – M v mřížce 5×5 ----------
M_CELLS = {(0,r) for r in range(5)} | {(4,r) for r in range(5)} | {(1,1),(2,2),(3,1)}
def mark_c(x, y, s, fg, empty, on=LIME, cells=M_CELLS):
    g = s / 5; pad = g * 0.12; r = g * 0.18; out = []
    for c in range(5):
        for rr in range(5):
            fill = on if (c, rr) in cells else empty
            out.append(f'<rect x="{x+c*g+pad:.1f}" y="{y+rr*g+pad:.1f}" width="{g-2*pad:.1f}" height="{g-2*pad:.1f}" rx="{r:.1f}" fill="{fill}"/>')
    return ''.join(out)

def logo_c(fg, sub, empty):
    pad = 40; s = 230
    m = mark_c(pad, pad, s, fg, empty, on=fg if fg == INK else LIME)
    tx = pad + s + 44; base = pad + s * 0.98 - 70
    d, w, _ = text(F_WORD, 'maimon', tx, base, 150, -3)
    sd, sw, _ = text(F_SUB, 'agentura práce', tx + 4, base + 58, 40, 0.5)
    return svg(tx + w + pad, pad * 2 + s, m + f'<path d="{d}" fill="{fg}"/><path d="{sd}" fill="{sub}"/>')

def write(name, s): (out / name).write_text(s)

for mode, fg, sub, empty in [('light', INK, '#5D6066', '#DEDAD0'), ('dark', PAPER, '#A9ACB1', '#2A2D31')]:
    write(f'a-{mode}.svg', logo_a(fg, sub))
    write(f'b-{mode}.svg', logo_b(fg, sub))
    write(f'c-{mode}.svg', logo_c(fg, sub, empty))
write('a-lime.svg', logo_a(INK, INK, head=PAPER))
write('b-lime.svg', logo_b(INK, INK, head=PAPER))
# C na limetce (barevná verze)
write('c-lime.svg', logo_c(INK, INK, '#BEDD33'))
# symboly
write('sym-a.svg', svg(240, 240, word_a(0, 0, 1, INK)[0][:0] + f'<rect width="240" height="240" rx="48" fill="{INK}"/>' + text(F_WORD,'m',0,0,1)[0][:0] + f'<path d="{text(F_WORD,"m",36,182,230)[0]}" fill="{PAPER}"/>' + circ(196, 58, 20, LIME)))
write('sym-b.svg', svg(240, 240, f'<rect width="240" height="240" rx="48" fill="{LIME}"/>' + mark_b(36, 34, 168, INK, head=PAPER)))
write('sym-c.svg', svg(240, 240, f'<rect width="240" height="240" rx="48" fill="{INK}"/>' + mark_c(30, 30, 180, None, '#2E3236')))
write('favicon.svg', svg(64, 64, f'<rect width="64" height="64" rx="14" fill="{INK}"/>' + mark_c(8, 8, 48, None, '#3A3E43')))
print('ok', sorted(p.name for p in out.iterdir()))
