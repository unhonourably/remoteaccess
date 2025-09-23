# 🔧 Unique Process Setup for Discord RPC Client

This guide helps you set up your Discord RPC client with a unique process name so it can coexist with other Node.js applications and Discord RPC clients.

## 🎯 Problem Solved

**Issue:** Multiple Discord RPC clients running as `node.exe` interfere with each other
**Solution:** Run your client as `discord-rpc-client.exe` instead

## 📋 Setup Steps

### Step 1: Create Unique Executable
1. Run `setup-unique-process.bat` as administrator
2. This creates `discord-rpc-client.exe` (a copy of `node.exe`)
3. Your client will now have a unique process name

### Step 2: Use New Scripts
After setup, use these scripts instead:

- **Start:** `start-unique-manual.bat`
- **Stop:** `kill-unique-client.bat` 
- **Check Status:** `check-unique-status.bat`

## 🚀 Script Overview

### Setup Scripts:
- `setup-unique-process.bat` - Creates the unique executable (run once)

### Management Scripts:
- `start-unique-manual.bat` - Starts client with unique process name
- `kill-unique-client.bat` - Stops only YOUR Discord RPC client
- `check-unique-status.bat` - Shows status of your specific client

### Legacy Scripts (still work):
- All original scripts still function as fallbacks
- Automatically detect and use unique process if available

## 🎉 Benefits

### Before (Problems):
- ❌ Both RPC clients run as `node.exe`
- ❌ Killing one kills both
- ❌ Processes interfere with each other
- ❌ Can't tell which is which

### After (Solution):
- ✅ Your client runs as `discord-rpc-client.exe`
- ✅ Other client still runs as `node.exe`
- ✅ Can kill them independently
- ✅ No more interference
- ✅ Easy to identify in Task Manager

## 🔍 Verification

### In Task Manager you'll see:
- `discord-rpc-client.exe` - YOUR Discord RPC client
- `node.exe` - Other Node.js apps/RPC clients
- Both can run simultaneously without conflicts!

### Process Names:
- **Your Client:** `discord-rpc-client.exe`
- **Other RPC:** `node.exe` 
- **Other Node Apps:** `node.exe`

## 🛠️ Usage Examples

### Start your client:
```batch
start-unique-manual.bat
```

### Check if YOUR client is running:
```batch
check-unique-status.bat
```

### Stop ONLY your client:
```batch
kill-unique-client.bat
```

### The other RPC client remains unaffected! 🎯

## 🔄 Startup Integration

The startup scripts automatically detect the unique executable:
- If `discord-rpc-client.exe` exists, uses it
- If not, falls back to standard `node.exe`
- No changes needed to existing startup setup

## ⚠️ Important Notes

- **Run setup as administrator** for best results
- **Unique executable is ~30MB** (copy of node.exe)
- **Other Node.js apps unaffected** by this change
- **Can revert anytime** by deleting `discord-rpc-client.exe`

## 🎯 Perfect Coexistence

Now you can run:
- ✅ Your Discord RPC client (discord-rpc-client.exe)
- ✅ Other Discord RPC client (node.exe)  
- ✅ Any other Node.js applications (node.exe)
- ✅ All simultaneously without conflicts!

---

**Result: Multiple Discord RPC clients can now coexist peacefully! 🚀**
