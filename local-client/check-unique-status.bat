@echo off
echo Checking Discord RPC Client Status (Unique Process)...
echo.

REM Check if discord-rpc-client.exe is running
tasklist /FI "IMAGENAME eq discord-rpc-client.exe" 2>NUL | find /I /N "discord-rpc-client.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo ✅ Discord RPC Client is RUNNING (unique process)
    echo.
    echo Active discord-rpc-client.exe processes:
    tasklist /FI "IMAGENAME eq discord-rpc-client.exe" /FO TABLE
) else (
    echo ❌ Discord RPC Client is NOT running as unique process
    echo.
    echo Checking for standard node.exe processes...
    
    REM Check for node.exe running our script
    for /f "tokens=2" %%i in ('wmic process where "name='node.exe' and commandline like '%%simple-client.js%%'" get processid /format:value ^| find "="') do (
        echo ✅ Found Discord RPC Client running as node.exe (PID: %%i)
        set FOUND_NODE=1
    )
    
    if not defined FOUND_NODE (
        echo ❌ Discord RPC Client is NOT running at all
    )
)

echo.

REM Show all node.exe processes for reference
tasklist /FI "IMAGENAME eq node.exe" 2>NUL | find /I /N "node.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo 📋 All node.exe processes currently running:
    tasklist /FI "IMAGENAME eq node.exe" /FO TABLE
    echo.
    echo ⚠️  Multiple node.exe processes may cause conflicts
    echo Consider using the unique process setup: setup-unique-process.bat
)

echo.
echo Status check complete.
echo.
pause
