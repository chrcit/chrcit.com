#!/usr/bin/env python3
"""Build the chrcit favicon set: Apfel Grotezk C, dt-5 dithered, on paper.

Tokens match src/styles/global.css:
  --paper: #f3f0e7
  --ink:   #191611
  .dt-5    ink fill with paper dots on a 5px grid

Requires: pillow, fonttools, brotli (woff2).
"""

from __future__ import annotations

import io
import re
import struct
from pathlib import Path

from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
FONT_WOFF = ROOT / "public/fonts/apfel-grotezk/ApfelGrotezk-Satt.woff2"

PAPER = (243, 240, 231)  # #f3f0e7
INK = (25, 22, 17)  # #191611
LETTER = "C"
# Fraction of the canvas the glyph bbox should occupy (iOS squircle safe zone).
FILL = 0.78

# CSS .dt-5: circle at 2.5px 2.5px, paper r=1.05, tile 5px.
CSS_CELL = 5.0
CSS_RADIUS = 1.09


def load_font() -> TTFont:
    return TTFont(str(FONT_WOFF))


def ttf_for_pillow(tt: TTFont, dest: Path) -> Path:
    dest.parent.mkdir(parents=True, exist_ok=True)
    tt.save(str(dest))
    return dest


def glyph_path(tt: TTFont) -> tuple[str, tuple[float, float, float, float]]:
    gs = tt.getGlyphSet()
    name = tt.getBestCmap()[ord(LETTER)]
    bp = BoundsPen(gs)
    gs[name].draw(bp)
    pen = SVGPathPen(gs)
    gs[name].draw(pen)
    assert bp.bounds is not None
    return pen.getCommands(), bp.bounds


def mask_c(size: int, ttf_path: Path) -> Image.Image:
    # Size the em so the C bbox (not the em square) fills FILL of the canvas.
    tt = TTFont(str(ttf_path))
    _, (x0, y0, x1, y1) = glyph_path(tt)
    upem = tt["head"].unitsPerEm
    glyph_h = y1 - y0
    font_px = int(round(size * FILL * (upem / glyph_h)))
    font = ImageFont.truetype(str(ttf_path), font_px)
    img = Image.new("L", (size, size), 0)
    draw = ImageDraw.Draw(img)
    bbox = draw.textbbox((0, 0), LETTER, font=font, anchor="lt")
    w, h = bbox[2] - bbox[0], bbox[3] - bbox[1]
    # Open counter on the right: nudge east so it sits optically centered.
    x = (size - w) / 2 - bbox[0] + size * 0.018
    y = (size - h) / 2 - bbox[1]
    draw.text((x, y), LETTER, font=font, fill=255, anchor="lt")
    return img


def dither_dt5(mask: Image.Image, cell: float, radius: float) -> Image.Image:
    """Ink C with paper dots. cell/radius in pixels, matching .dt-5 ratios."""
    size = mask.size[0]
    src = mask.load()
    out = Image.new("RGB", (size, size), PAPER)
    dst = out.load()
    r2 = radius * radius
    for y in range(size):
        for x in range(size):
            if src[x, y] < 128:
                continue
            lx = (x + 0.5) % cell - cell / 2
            ly = (y + 0.5) % cell - cell / 2
            dst[x, y] = PAPER if (lx * lx + ly * ly) <= r2 else INK
    return out


def cell_for(size: int) -> tuple[float, float]:
    # Keep the CSS 5px module at apple-touch (180). Scale down for tabs so
    # the C still has a few dots; never go below 2px or the holes eat the stem.
    cell = max(2.0, round(size * (CSS_CELL / 180) * 2) / 2)
    radius = cell * (CSS_RADIUS / CSS_CELL)
    return cell, radius


def svg_path_fitted(tt: TTFont, vb: int = 128) -> str:
    """C outline already mapped into viewBox space so the dither tile stays square."""
    gs = tt.getGlyphSet()
    name = tt.getBestCmap()[ord(LETTER)]
    bp = BoundsPen(gs)
    gs[name].draw(bp)
    assert bp.bounds is not None
    x0, y0, x1, y1 = bp.bounds
    gw, gh = x1 - x0, y1 - y0
    s = (vb * FILL) / max(gw, gh)
    cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
    tx = vb / 2 - cx * s + vb * 0.018
    ty = vb / 2 + cy * s
    # scale(s, -s) then translate(tx, ty)
    a, d_ = s, -s
    e, f = tx, ty
    pen = SVGPathPen(gs)
    gs[name].draw(TransformPen(pen, (a, 0, 0, d_, e, f)))
    raw = pen.getCommands()
    return re.sub(r"(-?\d+\.\d+)", lambda m: f"{float(m.group(1)):.2f}", raw)


def svg_markup(d: str, vb: int = 128) -> str:
    cell = 4
    r = cell * (CSS_RADIUS / CSS_CELL)
    paper = "#f3f0e7"
    ink = "#191611"
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {vb} {vb}" fill="none">
  <title>chrcit</title>
  <defs>
    <pattern id="dt5" width="{cell}" height="{cell}" patternUnits="userSpaceOnUse">
      <rect width="{cell}" height="{cell}" fill="{ink}"/>
      <circle cx="{cell / 2}" cy="{cell / 2}" r="{r:.3f}" fill="{paper}"/>
    </pattern>
  </defs>
  <rect width="{vb}" height="{vb}" fill="{paper}"/>
  <path d="{d}" fill="url(#dt5)"/>
</svg>
"""


def write_ico(path: Path, images: list[Image.Image]) -> None:
    payloads: list[tuple[int, int, bytes]] = []
    for im in images:
        buf = io.BytesIO()
        im.save(buf, format="PNG")
        payloads.append((im.size[0], im.size[1], buf.getvalue()))
    offset = 6 + 16 * len(payloads)
    out = bytearray()
    out += struct.pack("<HHH", 0, 1, len(payloads))
    for w, h, data in payloads:
        out += struct.pack(
            "<BBBBHHII",
            w if w < 256 else 0,
            h if h < 256 else 0,
            0,
            0,
            1,
            32,
            len(data),
            offset,
        )
        offset += len(data)
    for _, _, data in payloads:
        out += data
    path.write_bytes(bytes(out))


def main() -> None:
    tt = load_font()
    ttf_path = ttf_for_pillow(tt, Path("/tmp/chrcit-icons/ApfelGrotezk-Satt.ttf"))

    targets = {
        "favicon-16x16.png": 16,
        "favicon-32x32.png": 32,
        "apple-touch-icon.png": 180,
    }
    rasters: dict[int, Image.Image] = {}
    for name, size in targets.items():
        cell, radius = cell_for(size)
        # 16px: holes at 2px eat the stem. Keep the C solid; SVG carries the dither.
        if size <= 16:
            mask = mask_c(size, ttf_path)
            img = Image.new("RGB", (size, size), PAPER)
            src, dst = mask.load(), img.load()
            for y in range(size):
                for x in range(size):
                    if src[x, y] >= 128:
                        dst[x, y] = INK
        else:
            img = dither_dt5(mask_c(size, ttf_path), cell, radius)
        rasters[size] = img
        dest = PUBLIC / name
        img.save(dest, "PNG")
        print(f"wrote {dest.relative_to(ROOT)} {size}x{size} cell={cell}")

    (PUBLIC / "favicon.svg").write_text(svg_markup(svg_path_fitted(tt)))
    print("wrote public/favicon.svg")

    write_ico(PUBLIC / "favicon.ico", [rasters[16], rasters[32]])
    print("wrote public/favicon.ico")

    preview_dir = Path("/tmp/chrcit-icons")
    preview_dir.mkdir(parents=True, exist_ok=True)
    master = dither_dt5(
        mask_c(512, ttf_path),
        512 * CSS_CELL / 180,
        512 * CSS_RADIUS / 180,
    )
    master.save(preview_dir / "master-512.png")
    print("preview /tmp/chrcit-icons/master-512.png")


if __name__ == "__main__":
    main()
