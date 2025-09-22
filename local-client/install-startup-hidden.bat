@echo off
echo Installing Discord RPC Client as Hidden Windows Startup Service...

REM Get the current directory
set "SCRIPT_DIR=%~dp0"
set "STARTUP_DIR=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup"

REM Create a shortcut that runs hidden
echo Creating hidden startup shortcut...
powershell -Command "& {$WshShell = New-Object -comObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%STARTUP_DIR%\Discord RPC Client Hidden.lnk'); $Shortcut.TargetPath = 'wscript.exe'; $Shortcut.Arguments = '\"%SCRIPT_DIR%start-hidden.vbs\" \"%SCRIPT_DIR%start-on-boot.bat\"'; $Shortcut.WorkingDirectory = '%SCRIPT_DIR%'; $Shortcut.WindowStyle = 7; $Shortcut.Save()}"

echo.
echo ✅ Discord RPC Client has been installed to start automatically (hidden)!
echo.
echo The client will now start silently every time you log into Windows.
echo No console window will appear, but the client will run in the background.
echo.
echo To check if it's running: Open Task Manager and look for "node.exe"
echo To uninstall, run: uninstall-startup-hidden.bat
echo.
pause
