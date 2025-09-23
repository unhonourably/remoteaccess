@echo off
echo Starting Discord RPC Client (Hidden)...

REM Get the current directory
set "SCRIPT_DIR=%~dp0"

REM Start the client hidden using VBScript
wscript.exe "%SCRIPT_DIR%start-hidden.vbs" "%SCRIPT_DIR%start-on-boot.bat"

echo Discord RPC Client started in background.
echo Check Task Manager for "node.exe" to verify it's running.
echo.
pause
