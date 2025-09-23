@echo off
echo Starting Discord RPC Client with Unique Process Name...
echo.

REM Change to the script directory
cd /d "%~dp0"

REM Check if unique executable exists
if exist "%~dp0discord-rpc-client.exe" (
    echo ✅ Using unique process: discord-rpc-client.exe
    echo This allows coexistence with other Node.js applications.
    echo.
    start /MIN "%~dp0discord-rpc-client.exe" simple-client.js
    echo ✅ Discord RPC Client started in background!
    echo Process name: discord-rpc-client.exe
) else (
    echo ❌ Unique executable not found.
    echo Please run setup-unique-process.bat first to create it.
    echo.
    echo Falling back to standard method...
    call "%~dp0start-hidden-manual.bat"
)

echo.
echo Check Task Manager for "discord-rpc-client.exe" to verify it's running.
echo.
pause
