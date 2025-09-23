@echo off
echo Restarting Discord RPC Client...
echo.

echo Step 1: Stopping existing processes...
call "%~dp0kill-client-silent.bat"

echo Step 2: Waiting 2 seconds...
timeout /t 2 /nobreak >NUL

echo Step 3: Starting client in background...
call "%~dp0start-hidden-manual.bat"

echo.
echo ✅ Discord RPC Client restarted successfully!
echo Check Task Manager for "node.exe" to verify it's running.
echo.
