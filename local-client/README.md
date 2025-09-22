# Discord RPC Local Client

This is the local client that runs on your PC to handle Discord Rich Presence updates from your Vercel-hosted website.

## Setup Instructions

### 1. Create a Discord Application

1. Go to https://discord.com/developers/applications
2. Click "New Application" and give it a name
3. Copy the "Application ID" (Client ID)
4. Go to "Rich Presence" → "Art Assets" to upload images if needed

### 2. Configure the Client

1. Copy `env.example` to `.env`
2. Fill in your Discord Application ID:
   ```
   DISCORD_CLIENT_ID=your_actual_client_id_here
   VERCEL_URL=https://your-vercel-app.vercel.app
   LOCAL_PORT=3001
   ```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run the Client

```bash
npm start
```

The client will:
- Connect to Discord RPC
- Register with your Vercel website
- Listen for RPC updates from the web interface
- Update your Discord status in real-time

## How It Works

1. **Website**: You control your Discord status from the web interface
2. **Vercel API**: Stores the RPC data and sends webhooks to registered clients
3. **Local Client**: Receives webhooks and updates Discord RPC on your PC
4. **Discord**: Shows your custom Rich Presence to others

## Troubleshooting

- Make sure Discord is running on your PC
- Check that the Discord Application ID is correct
- Ensure your PC can reach the Vercel website
- The client will automatically reconnect if Discord or the server goes offline

## Status Indicators

- ✅ Connected to Discord RPC
- 📡 Registered with Vercel server
- 📥 Receiving updates from website
- 🧹 Activity cleared
- ❌ Connection issues (will auto-retry)
