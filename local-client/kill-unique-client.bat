@echo off
echo Stopping Discord RPC Client (Unique Process)...
echo.

REM Kill discord-rpc-client.exe processes specifically
tasklist /FI "IMAGENAME eq discord-rpc-client.exe" 2>NUL | find /I /N "discord-rpc-client.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo Found discord-rpc-client.exe processes. Stopping them...
    taskkill /F /IM discord-rpc-client.exe >NUL 2>&1
    if %ERRORLEVEL% EQU 0 (
        echo ✅ Discord RPC Client processes stopped successfully!
    ) else (
        echo ❌ Failed to stop some processes. You may need to run as administrator.
    )
) else (
    echo ⚠️  No discord-rpc-client.exe processes found.
    echo Checking for standard node.exe processes running our client...
    
    REM Fallback to killing node processes running our specific script
    for /f "tokens=2" %%i in ('wmic process where "name='node.exe' and commandline like '%%simple-client.js%%'" get processid /format:value ^| find "="') do (
        echo Found Discord RPC Client process (PID: %%i)
        taskkill /F /PID %%i >NUL 2>&1
        if %ERRORLEVEL% EQU 0 (
            echo ✅ Discord RPC Client process %%i stopped successfully!
        ) else (
            echo ❌ Failed to stop process %%i
        )
    )
)

echo.
echo Discord RPC Client processes terminated.
echo Other Node.js applications were left running.
echo.
pause
