@echo off

REM Silent version - kills processes without any output or pause

REM Kill all node.exe processes
taskkill /F /IM node.exe >NUL 2>&1

REM Kill any npm processes
taskkill /F /IM npm.cmd >NUL 2>&1

REM Exit silently
exit /b
