# 交接用 Skill 包

两个现成技能，可以直接丢给 Codex / Claude Code / Cursor 等工具，让它们按步骤干活。

| 文件 | 什么时候用 |
| --- | --- |
| [`setup-windows.md`](setup-windows.md) | 新电脑，什么都没有，要装环境 + 把项目跑起来 |
| [`publish.md`](publish.md) | 改完内容要发布（含字体子集、回归、推送） |

## 文件什么时候才存在（重要）

新电脑刚开机时，**仓库还没克隆，这些文件一个都不存在**。所以顺序不能反：

| 阶段 | 磁盘上有什么 | 你该发什么 |
| --- | --- | --- |
| 全新电脑 | 什么都没有 | 发 `setup-windows.md` 的**全文内容**（不是路径） |
| 装环境过程中 | 开始 clone 之后才有 | 技能里第 4 步就是 `git clone`，文件到这一步才落地 |
| 装完之后 | `AGENTS.md`、`docs/`、`src/` 都在 | 可以说「读 `AGENTS.md`」，或直接给绝对路径 |

判断依据：装完后在仓库目录里 `Test-Path AGENTS.md` 返回 True，文件就都在了。

最容易翻车的不是文件不存在，而是**工具的当前目录不对**：工具开在 `D:\` 而不是 `D:\Double-K-`，就找不到 `AGENTS.md`。这种情况让它 `cd` 进去，或直接告诉它绝对路径。

> 纯网页聊天（没有文件系统权限的工具）永远读不到本地文件，只能把内容粘给它。能跑命令的 Agent（Codex CLI / Cursor Agent / Claude Code）才行。

## 怎么用

### 方式 A：把它当提示词（最通用）

把文件内容整段复制给工具，然后加一句：

> 按这个技能执行，全程你来装、你来跑，装完告诉我结果。

### 方式 B：放进工具的 skills 目录

支持技能目录的工具，把 `.md` 放进对应位置即可（文件顶部的 YAML frontmatter 已经写好 `name` / `description`）：

| 工具 | 位置 |
| --- | --- |
| Claude Code | `.claude/skills/<名字>/SKILL.md` |
| Cursor | `.cursor/rules/<名字>.mdc`（去掉 frontmatter 即可） |
| Codex | 仓库根目录已有 `AGENTS.md`，技能文件用方式 A 贴给它 |
| 其他 | 大多数支持「指令文件」的工具都能直接读 Markdown |

### 方式 C：让它读文件

仓库已经 clone 下来的话，直接说：

> 读 `docs/skills/setup-windows.md`，照它执行。

## 顺序建议

1. 新电脑：先发 `setup-windows.md` → 让它装好、跑起来
2. 之后改内容：正常跟它说需求即可，它会读 `AGENTS.md`
3. 要发布：发 `publish.md`，或直接说「发了吧」

## 注意

- 装 Node / Git 时 Windows 会弹 UAC，需要用户点「是」，这点任何工具都绕不过
- 首次 `pnpm install` 和 `npx playwright install chromium` 都要下载，慢是正常的
- 国内网络连 GitHub 需要代理，技能里已写了配置命令
