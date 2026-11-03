/**
 * Playwright / Chrome 解析器——让回归脚本换台电脑也能跑。
 *
 * 查找顺序：
 *   1. 环境变量 PLAYWRIGHT_PATH（指向 playwright 包目录）
 *   2. 项目内安装的 playwright（pnpm add -D playwright）
 *   3. 本机 DSH 运行时里自带的那份（换机器后可删掉这条）
 *
 * Chrome：
 *   - 环境变量 CHROME_PATH 优先
 *   - 常见安装路径
 *   - 都没有就用 Playwright 自带的 Chromium（需 `npx playwright install chromium`）
 */
const fs = require('node:fs');
const path = require('node:path');

const PW_CANDIDATES = [
  process.env.PLAYWRIGHT_PATH,
  'playwright',
  'C:/Users/administered/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright',
].filter(Boolean);

let playwright = null;
for (const candidate of PW_CANDIDATES) {
  try { playwright = require(candidate); break; } catch { /* 试下一个 */ }
}
if (!playwright) {
  throw new Error(
    '找不到 playwright。\n' +
    '  在项目里执行：pnpm add -D playwright && npx playwright install chromium\n' +
    '  或设置环境变量 PLAYWRIGHT_PATH 指向已安装的 playwright 目录。'
  );
}

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
].filter(Boolean);

const executablePath = CHROME_CANDIDATES.find(p => fs.existsSync(p));

/** 启动浏览器；找不到系统 Chrome 时退回 Playwright 自带的 Chromium。 */
function launch() {
  return playwright.chromium.launch({
    headless: true,
    ...(executablePath ? { executablePath } : {}),
  });
}

module.exports = { launch, chromium: playwright.chromium, executablePath };
