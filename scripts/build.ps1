# 生产构建：输出到 dist/
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
& $node 'node_modules\vite\bin\vite.js' build
