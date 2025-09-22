@echo off
echo Uninstalling Discord RPC Client from Windows Startup (Hidden)...

set "STARTUP_DIR=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup"
set "SHORTCUT_PATH=%STARTUP_DIR%\Discord RPC Client Hidden.lnk"

if exist "%SHORTCUT_PATH%" (
    del "%SHORTCUT_PATH%"
    echo ✅ Discord RPC Client hidden startup shortcut removed successfully!
) else (
    echo ⚠️  Discord RPC Client hidden startup shortcut not found.
)

echo.
echo The hidden client will no longer start automatically with Windows.
echo.
echo If the client is currently running, you may need to end the "node.exe" 
echo process in Task Manager to fully stop it.
echo.
pause
