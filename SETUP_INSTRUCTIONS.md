# 🚀 Setup Instructions for Discord RPC Control Panel

## 🔧 Issue Fix

Based on your logs, your local client is connecting to the wrong server. Here's how to fix it:

### Step 1: Fix Your Local Client Configuration

1. Go to the `local-client` folder
2. Copy `env.example` to `.env`:
   ```bash
   cd local-client
   cp env.example .env
   ```

3. Edit the `.env` file with your actual details:
   ```env
   DISCORD_CLIENT_ID=your_actual_discord_app_id
   VERCEL_URL=https://your-actual-vercel-app.vercel.app
   LOCAL_PORT=3001
   ```

**IMPORTANT:** Replace `https://panel.kurochat.org` with your actual Vercel URL!

### Step 2: Get Your Discord Application ID

1. Go to https://discord.com/developers/applications
2. Create a new application or select an existing one
3. Copy the "Application ID" from the General Information tab
4. Paste it as `DISCORD_CLIENT_ID` in your `.env` file

### Step 3: Deploy to Vercel and Get URL

1. Deploy your Next.js app to Vercel:
   ```bash
   cd nextjstemplate
   npm run build
   # Then deploy using Vercel CLI or GitHub integration
   ```

2. Once deployed, you'll get a URL like: `https://your-app-name.vercel.app`
3. Use this URL as your `VERCEL_URL` in the `.env` file

### Step 4: Start Your Local Client

```bash
cd local-client
npm install
npm start
```

You should see logs like:
```
[8:24:40 PM] ✅ Connected to Discord RPC successfully!
[8:24:40 PM] ✅ Successfully registered with server! Total clients: 1
```

## 🔍 Debugging

### Check Your Configuration:
- **Discord App Running?** Make sure Discord desktop is open
- **Correct Client ID?** Verify your Discord Application ID
- **Correct Vercel URL?** Make sure it's your actual deployed URL, not kurochat.org
- **Port Available?** Make sure port 3001 isn't being used by another app

### Test Your Local Client:
```bash
npm test
```

This will test your local Discord RPC directly.

### Check Vercel Logs:
In your Vercel dashboard, you should see:
```
📋 Client registration request received
✅ Client registered successfully. Total clients: 1
📥 RPC Update request received
📡 Sending webhooks to 1 clients
✅ Webhook success: http://localhost:3001
```

## 🎯 Expected Flow

1. **Local Client Starts** → Connects to Discord + Registers with Vercel
2. **Website Update** → Vercel sends webhook to your PC
3. **PC Receives Webhook** → Updates Discord RPC
4. **Discord Shows Status** → Your custom Rich Presence appears

## ⚠️ Common Issues

- **"0 clients connected"** = Local client not registered with correct Vercel URL
- **"Webhook failed"** = Local client not running or wrong port
- **"Discord not connected"** = Discord app not running or wrong Client ID
- **"Connection timeout"** = Firewall blocking or wrong URL

The key issue in your case is the wrong server URL - make sure your `.env` file has the correct Vercel URL!
