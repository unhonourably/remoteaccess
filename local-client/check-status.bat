@echo off
echo Checking Discord RPC Client Status...
echo.

REM Check if node.exe is running
tasklist /FI "IMAGENAME eq node.exe" 2>NUL | find /I /N "node.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo ✅ Discord RPC Client is RUNNING
    echo.
    echo Active node.exe processes:
    tasklist /FI "IMAGENAME eq node.exe" /FO TABLE
) else (
    echo ❌ Discord RPC Client is NOT running
    echo.
    echo No node.exe processes found.
)

echo.

REM Check if npm is running
tasklist /FI "IMAGENAME eq npm.cmd" 2>NUL | find /I /N "npm.cmd">NUL
if "%ERRORLEVEL%"=="0" (
    echo ⚠️  NPM processes are also running:
    tasklist /FI "IMAGENAME eq npm.cmd" /FO TABLE
    echo.
)

echo Status check complete.
echo.
pause
