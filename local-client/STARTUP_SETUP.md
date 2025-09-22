# 🚀 Auto-Start Setup for Discord RPC Client

This guide will help you set up the Discord RPC client to start automatically when your PC boots up.

## 📋 Prerequisites

1. Make sure you have already set up your `.env` file with:
   ```env
   DISCORD_CLIENT_ID=your_discord_app_id
   VERCEL_URL=https://panel.kurochat.org
   ```

2. Test that the client works manually:
   ```bash
   npm run simple
   ```

## 🎯 Installation Options

### Option 1: Visible Window (Recommended for Testing)

**What it does:** Shows a console window when the client starts
**Good for:** Debugging, seeing logs, first-time setup

**To install:**
1. Right-click `install-startup.bat`
2. Select "Run as administrator" (recommended)
3. Follow the prompts

**To uninstall:**
1. Run `uninstall-startup.bat`

---

### Option 2: Hidden Background Service (Recommended for Daily Use)

**What it does:** Runs silently in the background, no visible windows
**Good for:** Daily use, clean desktop experience

**To install:**
1. Right-click `install-startup-hidden.bat`
2. Select "Run as administrator" (recommended)
3. Follow the prompts

**To uninstall:**
1. Run `uninstall-startup-hidden.bat`
2. End any running "node.exe" processes in Task Manager if needed

---

## 🔧 How It Works

### Files Created:
- **Startup Shortcut**: Added to `%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup`
- **Target**: Points to `start-on-boot.bat` which runs `npm run simple`
- **Working Directory**: Set to your local-client folder

### Process Flow:
1. **Windows starts** → Startup folder executes
2. **Batch file runs** → Changes to correct directory
3. **npm run simple** → Starts the Discord RPC client
4. **Client connects** → Registers with your Vercel website
5. **Ready to use** → Your Discord status can be controlled remotely

## 🔍 Troubleshooting

### Check if it's running:
1. Open **Task Manager** (Ctrl+Shift+Esc)
2. Look for **"node.exe"** in the Processes tab
3. If found, the client is running

### View logs (visible version only):
- The console window will show connection status and errors
- Keep the window open to monitor the client

### Common issues:
- **"npm not found"**: Make sure Node.js is installed and in your PATH
- **"Discord not connected"**: Ensure Discord desktop app is running
- **"Failed to register"**: Check your VERCEL_URL in the .env file

### Manual start:
If auto-start fails, you can always run manually:
```bash
cd local-client
npm run simple
```

## 📱 Usage After Setup

1. **Start your PC** → Client starts automatically
2. **Open Discord** → Client connects to Discord RPC
3. **Use your website** → Control your status remotely
4. **Everything works** → Your Discord status updates in real-time

## 🛑 Stopping the Service

### Temporary stop:
- Close the console window (visible version)
- End "node.exe" in Task Manager (hidden version)

### Permanent removal:
- Run the appropriate uninstall script
- The client will no longer start with Windows

## ⚙️ Advanced Options

### Custom startup delay:
Edit `start-on-boot.bat` and add:
```batch
timeout /t 30 /nobreak
```
This waits 30 seconds before starting (useful if you want Discord to start first).

### Different environment:
Create a custom `.env` file for production vs development settings.

---

**✅ Once installed, your Discord RPC client will start automatically every time you boot your PC!**
