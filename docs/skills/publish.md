---
name: publish-doublek
description: 修改并发布 Double K 作品集（改内容 → 字体子集 → 六断点回归 → 提交推送 → Cloudflare 自动上线）。当用户说「更新网站」「改完发布」「上线」时使用。
---

# 技能：发布 Double K 作品集

## 开工前必读

仓库根目录的 `AGENTS.md` 是项目说明书（目录、约定、硬约束），`docs/status.md` 是改动史。**先读这两个文件再动手**，尤其是：

| 硬约束 | 后果 |
| --- | --- |
| 改中文文案必须跑 `python scripts/subset-font.py` | 否则新字回退系统字体，字重突变 |
| 不要改 `public/case/**` 的 `pNN.webp` 命名 | 案例阅读器会缺页 |
| `styles.css` 与 `ui.css` 会互相覆盖 | 改了没生效，或意外改坏别处 |
| 不要提交 `node_modules` / `dist` / `artifacts` | 仓库膨胀 |

## 发布流程

```powershell
# 1. 改内容（src/content.js 改文字最快）
# 2. 改了中文 → 重裁字体
python scripts/subset-font.py

# 3. 本地预览确认
pnpm dev

# 4. 构建自检
pnpm build

# 5. 布局回归（首次需 pnpm add -D playwright && npx playwright install chromium）
node scripts/checks/verify.cjs
node scripts/checks/functional-check.cjs

# 6. 提交 + 推送
git add -A
git commit -m "一句话说明改了什么"
git push
```

推送后 Cloudflare 自动构建（约 20 秒），线上地址不变：`https://double-k-35s.pages.dev/`。

## 验证部署

```powershell
# 用 Cloudflare API 看最新部署状态（token 在 %APPDATA%\xdg.config\.wrangler\config\default.toml）
# 或者直接看线上：
Invoke-WebRequest https://double-k-35s.pages.dev/ | Select-Object StatusCode
```

构建失败时看 Cloudflare → Workers & Pages → `double-k` → Deployments 的日志；回退在同一页 `⋯` → Rollback。

## 汇报格式

```
✅ 改了：<文件 + 一句话>
✅ 字体：已重裁（129KB / N 字形）  ← 只在改了中文时
✅ 回归：六断点通过、无控制台报错
✅ 已推送：commit xxxx → https://double-k-35s.pages.dev/ 已更新
```

## 别做的事

- 不要为了「好看」重构版式，用户是设计师，视觉决策由他定
- 不要顺手升级依赖或改构建配置
- 不要在没跑 `subset-font.py` 的情况下提交中文文案
