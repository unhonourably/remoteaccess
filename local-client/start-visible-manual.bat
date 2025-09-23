@echo off
echo Starting Discord RPC Client (Visible)...

REM Change to the script directory
cd /d "%~dp0"

REM Start the simple client (visible)
npm run simple
