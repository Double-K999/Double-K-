#!/usr/bin/env python
"""把腾讯体裁剪成只含站点实际用到的字符，输出 woff2。

用法：
    python scripts/subset-font.py

原理：把 index.html + src 下所有源码当成字符集，再从字体里只保留这些字形。
7817 KB 的原始 TTF 裁剪后约 129 KB。

什么时候要重跑：
  - 改了文案、加了新的中文/标点（尤其是新增项目标题、章节名）
  - 跑完 `pnpm build` 之前记得重跑一次，否则新字会掉回系统字体

源文件在 assets/fonts-src/tencent-sans-w7.ttf（不参与部署），
产物在 public/fonts/tencent-sans-w7.woff2。
"""
import glob
import os
import sys

from fontTools import subset
from fontTools.ttLib import TTFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "assets", "fonts-src", "tencent-sans-w7.ttf")
OUT = os.path.join(ROOT, "public", "fonts", "tencent-sans-w7.woff2")

# 1) 收集字符：源码文案 + ASCII + 常用中文标点/全角符号
chars = set()
for pattern in ("index.html", "src/**/*.jsx", "src/**/*.js"):
    for path in glob.glob(os.path.join(ROOT, pattern), recursive=True):
        with open(path, encoding="utf-8") as fh:
            chars |= set(fh.read())

chars |= {chr(code) for code in range(32, 127)}
chars |= set("　、。，．·；：？！…—～‖（）〔〕【】《》〈〉「」『』［］｛｝“”‘’±×÷°％＋－＝＜＞０１２３４５６７８９")
chars -= {"\n", "\r", "\t"}

font = TTFont(SRC)
cmap = font.getBestCmap()
keep = sorted(ch for ch in chars if ord(ch) in cmap)
dropped = [ch for ch in chars if ord(ch) not in cmap]

text_file = os.path.join(ROOT, "artifacts", "charset.txt")
os.makedirs(os.path.dirname(text_file), exist_ok=True)
with open(text_file, "w", encoding="utf-8") as fh:
    fh.write("".join(keep))

args = [
    SRC,
    f"--text-file={text_file}",
    f"--output-file={OUT}",
    "--flavor=woff2",
    "--layout-features=*",
    "--no-hinting",
    "--drop-tables+=DSIG",
]
subset.main(args)

before = os.path.getsize(SRC) / 1024
after = os.path.getsize(OUT) / 1024
print(f"字符 {len(keep)} 个；字体里没有的 {len(dropped)} 个（会回退系统字体）")
print(f"{before:.0f} KB → {after:.0f} KB  ({after / before * 100:.1f}%)")
print(f"输出 {OUT}")
