@echo off
echo Stopping Discord RPC Client processes...
echo.

REM Kill all node.exe processes (this will stop the Discord RPC client)
tasklist /FI "IMAGENAME eq node.exe" 2>NUL | find /I /N "node.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo Found node.exe processes. Stopping them...
    taskkill /F /IM node.exe >NUL 2>&1
    if %ERRORLEVEL% EQU 0 (
        echo ✅ Discord RPC Client processes stopped successfully!
    ) else (
        echo ❌ Failed to stop some processes. You may need to run as administrator.
    )
) else (
    echo ⚠️  No node.exe processes found. Client may not be running.
)

echo.

REM Also kill any lingering npm processes
tasklist /FI "IMAGENAME eq npm.cmd" 2>NUL | find /I /N "npm.cmd">NUL
if "%ERRORLEVEL%"=="0" (
    echo Found npm processes. Stopping them...
    taskkill /F /IM npm.cmd >NUL 2>&1
    echo ✅ NPM processes stopped.
)

echo.
echo All Discord RPC Client background processes have been terminated.
echo.
pause
