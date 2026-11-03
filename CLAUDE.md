# CLAUDE.md

本项目的完整交接说明在 **[AGENTS.md](AGENTS.md)**，请先读它。

要点速览：

- React 19 + Vite 7 单页站，纯静态，`pnpm dev` / `pnpm build`
- 文案都集中在 `src/content.js`
- 改中文文案后必须跑 `python scripts/subset-font.py`（字体是 129KB 子集，缺字会回退系统字体）
- 改完跑 `node scripts/checks/verify.cjs`（六断点回归）
- 提交推送到 main 即自动上线（Cloudflare Pages，约 20 秒）
