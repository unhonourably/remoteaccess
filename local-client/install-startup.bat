@echo off
echo Installing Discord RPC Client as Windows Startup Service...

REM Get the current directory
set "SCRIPT_DIR=%~dp0"
set "STARTUP_DIR=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup"

REM Create a shortcut in the startup folder
echo Creating startup shortcut...
powershell -Command "& {$WshShell = New-Object -comObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%STARTUP_DIR%\Discord RPC Client.lnk'); $Shortcut.TargetPath = '%SCRIPT_DIR%start-on-boot.bat'; $Shortcut.WorkingDirectory = '%SCRIPT_DIR%'; $Shortcut.WindowStyle = 7; $Shortcut.Save()}"

echo.
echo ✅ Discord RPC Client has been installed to start automatically!
echo.
echo The client will now start every time you log into Windows.
echo You can find it in: %STARTUP_DIR%
echo.
echo To uninstall, run: uninstall-startup.bat
echo.
pause
