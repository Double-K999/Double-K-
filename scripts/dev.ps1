# 启动本地开发服务器：http://localhost:5173
# 本机 node 未加入 PATH，优先用系统 node，找不到时回退到 DSH 内置运行时。
# vite 在 Windows 上偶尔会因为文件被占用而整个退出，这里加一层自动重启（Ctrl+C 退出）。
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
# 本机 DSH 运行时里的 node；换电脑后如果 PATH 里已有 node，这行可以删掉
$bundled = 'C:\Users\administered\.dsh\dsh-runtimes\dsh-primary-runtime\dependencies\node\bin\node.exe'

$systemNode = Get-Command node -ErrorAction SilentlyContinue
if ($systemNode) { $node = $systemNode.Source }
elseif (Test-Path $bundled) { $node = $bundled }
else { throw '未找到 node，请安装 Node.js 20.19+ / 22.12+，或修改本脚本中的 $bundled 路径。' }

Set-Location $root
Write-Host "node: $node"

while ($true) {
  & $node 'node_modules\vite\bin\vite.js' --host 0.0.0.0 --port 5173 --strictPort
  Write-Host "[dev] vite 退出（code $LASTEXITCODE），2 秒后重启…" -ForegroundColor Yellow
  Start-Sleep -Seconds 2
}
