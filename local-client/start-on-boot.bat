@echo off
echo Starting Discord RPC Local Client...

REM Change to the script directory
cd /d "%~dp0"

REM Start the simple client
npm run simple

REM Keep window open if there's an error
pause
