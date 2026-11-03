"""把作品集 PDF 的页面导出成案例详情页用的 WebP。

两个案例各自对应一套 PDF：
    PUBG MOBILE  ←《2026-游戏交互作品集-1年经验.pdf》第 04–37 页 → public/case/pubg/
    BLOOD STRIKE ←《2025-游戏交互作品集-25届毕业生.pdf》第 03–33 页 → public/case/blood/
（第一个 PDF 的第 38 页是 THANKS，上面还是占位联系方式，不上站，所以只导到 37。）

用法（PDF 更新后重跑即可）：
    python scripts/build-case.py                       # 默认：PUBG，第 4–37 页
    python scripts/build-case.py <pdf> <起始页> <结束页> <输出目录>

例：
    python scripts/build-case.py "…/2025-游戏交互作品集-25届毕业生.pdf" 3 33 public/case/blood

依赖：pip install pymupdf Pillow
输出文件名沿用 PDF 页码：p04.webp、p05.webp……方便和 content.js 的 sections 对应。
"""

import io
import os
import sys

import pymupdf
from PIL import Image

DEFAULT_PDF = r"C:\Users\administered\Documents\xwechat_files\wxid_4akidaqxt3z622_cd6f\msg\file\2026-10\2026-游戏交互作品集-1年经验.pdf"
DEFAULT_FIRST, DEFAULT_LAST = 4, 37
DEFAULT_OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "public", "case", "pubg")
WIDTH = 1728          # 详情页最大显示宽度 1600，留一点余量
QUALITY = 80


def main() -> None:
    pdf = sys.argv[1] if len(sys.argv) > 1 else DEFAULT_PDF
    first = int(sys.argv[2]) if len(sys.argv) > 2 else DEFAULT_FIRST
    last = int(sys.argv[3]) if len(sys.argv) > 3 else DEFAULT_LAST
    out_dir = sys.argv[4] if len(sys.argv) > 4 else DEFAULT_OUT

    if not os.path.exists(pdf):
        raise SystemExit(f"找不到 PDF：{pdf}`n用法：python scripts/build-case.py <pdf 路径> <起始页> <结束页> <输出目录>")
    os.makedirs(out_dir, exist_ok=True)

    doc = pymupdf.open(pdf)
    last = min(last, doc.page_count)
    total = 0
    for n in range(first, last + 1):
        page = doc[n - 1]
        scale = WIDTH / page.rect.width
        pix = page.get_pixmap(matrix=pymupdf.Matrix(scale, scale), alpha=False)
        img = Image.open(io.BytesIO(pix.tobytes("png"))).convert("RGB")
        path = os.path.join(out_dir, f"p{n:02d}.webp")
        img.save(path, "WEBP", quality=QUALITY, method=6)
        size = os.path.getsize(path)
        total += size
        print(f"p{n:02d}.webp  {img.width}x{img.height}  {size / 1024:.0f} KB")
    print(f"共 {last - first + 1} 页，合计 {total / 1024 / 1024:.2f} MB → {out_dir}")


if __name__ == "__main__":
    main()
