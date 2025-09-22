# 🌐 Exposing Local Client to Internet

## Option 1: Using ngrok (Recommended)

### Install ngrok:
1. Go to https://ngrok.com/download
2. Download and install ngrok
3. Sign up for a free account and get your auth token

### Setup:
```bash
# Install ngrok globally
npm install -g ngrok

# Authenticate (replace YOUR_TOKEN with your actual token)
ngrok authtoken YOUR_TOKEN

# Start your local client first
npm start

# In another terminal, expose port 3001
ngrok http 3001
```

### Result:
ngrok will give you a public URL like: `https://abc123.ngrok.io`

### Update your local client:
Edit your `.env` file to use the ngrok URL:
```env
DISCORD_CLIENT_ID=your_discord_app_id
VERCEL_URL=https://panel.kurochat.org
LOCAL_PORT=3001
PUBLIC_URL=https://abc123.ngrok.io
```

## Option 2: Using localtunnel (Alternative)

```bash
# Install localtunnel
npm install -g localtunnel

# Start your local client first
npm start

# In another terminal, expose port 3001
lt --port 3001 --subdomain your-unique-name
```

This gives you: `https://your-unique-name.loca.lt`

## Option 3: Using Cloudflare Tunnel (Advanced)

```bash
# Install cloudflared
# Download from: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/

# Start tunnel
cloudflared tunnel --url http://localhost:3001
```
