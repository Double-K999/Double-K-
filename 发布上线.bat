@echo off
title Double K - 发布上线
cd /d "%~dp0"

echo ============================================
echo   Double K 个人网站 - 发布上线
echo ============================================
echo.

set "GIT="
where git >nul 2>nul && set "GIT=git"
if not defined GIT if exist "%LOCALAPPDATA%\GitHubDesktop\app-3.6.10\resources\app\git\cmd\git.exe" set "GIT=%LOCALAPPDATA%\GitHubDesktop\app-3.6.10\resources\app\git\cmd\git.exe"
if not defined GIT goto nogit

"%GIT%" add -A
"%GIT%" diff --cached --quiet
if not errorlevel 1 goto nochange

echo 这次改了什么？（一句话，直接回车用默认）
set "MSG="
set /p MSG=^> 
if "%MSG%"=="" set "MSG=更新站点内容"

echo.
echo 正在提交并推送...
"%GIT%" commit -m "%MSG%"
"%GIT%" -c http.proxy=http://127.0.0.1:7890 push
if errorlevel 1 goto pushfail

echo.
echo ============================================
echo   已推送！Cloudflare 正在自动构建，
echo   等 20 秒左右刷新线上地址就是新版：
echo   https://double-k-35s.pages.dev/
echo ============================================
echo.
pause
exit /b 0

:nogit
echo [错误] 没找到 Git。装一个 GitHub Desktop 或 Git for Windows 后重试。
echo.
pause
exit /b 1

:nochange
echo 没有检测到任何改动，无需发布。
echo.
pause
exit /b 0

:pushfail
echo.
echo [失败] 推送没成功。常见原因：网络没连上 GitHub，或需要登录一次账号。
echo 把上面的报错截图发给 AI 助手。
echo.
pause
exit /b 1
