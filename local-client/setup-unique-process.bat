@echo off
echo Setting up unique process name for Discord RPC Client...
echo.

REM Find Node.js installation path
for /f "tokens=*" %%i in ('where node 2^>NUL') do set "NODE_PATH=%%i"

if "%NODE_PATH%"=="" (
    echo ❌ Node.js not found in PATH. Please install Node.js first.
    pause
    exit /b 1
)

echo Found Node.js at: %NODE_PATH%
echo.

REM Copy node.exe to our local directory with a unique name
echo Creating unique process executable...
copy "%NODE_PATH%" "%~dp0discord-rpc-client.exe" >NUL

if %ERRORLEVEL% EQU 0 (
    echo ✅ Created discord-rpc-client.exe successfully!
    echo.
    echo Your Discord RPC client will now run as "discord-rpc-client.exe" 
    echo instead of "node.exe", allowing it to coexist with other Node.js apps.
    echo.
    echo File created: %~dp0discord-rpc-client.exe
) else (
    echo ❌ Failed to create unique executable.
    echo You may need to run as administrator.
)

echo.
pause
