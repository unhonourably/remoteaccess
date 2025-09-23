@echo off
echo Starting Discord RPC Local Client...

REM Change to the script directory
cd /d "%~dp0"

REM Check if unique executable exists
if exist "%~dp0discord-rpc-client.exe" (
    echo Using unique process name: discord-rpc-client.exe
    "%~dp0discord-rpc-client.exe" simple-client.js
) else (
    echo Using standard npm command
    npm run simple
)

REM Keep window open if there's an error
pause
