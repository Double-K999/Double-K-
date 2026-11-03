@echo off
title Double K - 本地预览
cd /d "%~dp0"

echo ============================================
echo   Double K 个人网站 - 本地预览
echo ============================================
echo.

set "NODE="
where node >nul 2>nul && set "NODE=node"
if not defined NODE if exist "%USERPROFILE%\.dsh\dsh-runtimes\dsh-primary-runtime\dependencies\node\bin\node.exe" set "NODE=%USERPROFILE%\.dsh\dsh-runtimes\dsh-primary-runtime\dependencies\node\bin\node.exe"
if not defined NODE goto nonode

if not exist "node_modules" goto installdeps
goto start

:nonode
echo [错误] 没找到 Node.js。
echo 去 https://nodejs.org 下载 LTS 版本，双击安装，一路下一步，然后重新双击本文件。
echo.
pause
exit /b 1

:installdeps
echo 第一次运行，正在安装依赖，可能要 1-3 分钟...
echo.
set "PNPM="
where pnpm >nul 2>nul && set "PNPMOK=1"
if defined PNPMOK (
  call pnpm install
) else (
  "%NODE%" "%USERPROFILE%\.dsh\dsh-runtimes\dsh-primary-runtime\dependencies\pnpm\bin\pnpm.mjs" install
)
if errorlevel 1 goto installfail
goto start

:installfail
echo.
echo [错误] 依赖安装失败，把上面的报错截图发给 AI 助手。
pause
exit /b 1

:start
echo.
echo 正在启动，浏览器会自动打开 http://localhost:5173
echo 改代码保存后页面会自动刷新。
echo.
echo >>> 关掉这个黑窗口 = 停止预览 <<<
echo.
start "" http://localhost:5173
"%NODE%" "node_modules\vite\bin\vite.js"
pause
