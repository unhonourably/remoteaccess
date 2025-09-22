@echo off
echo Uninstalling Discord RPC Client from Windows Startup...

set "STARTUP_DIR=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup"
set "SHORTCUT_PATH=%STARTUP_DIR%\Discord RPC Client.lnk"

if exist "%SHORTCUT_PATH%" (
    del "%SHORTCUT_PATH%"
    echo ✅ Discord RPC Client startup shortcut removed successfully!
) else (
    echo ⚠️  Discord RPC Client startup shortcut not found.
)

echo.
echo The client will no longer start automatically with Windows.
echo.
pause
