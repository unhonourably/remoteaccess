import DiscordRPC from 'discord-rpc';
import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const CLIENT_ID = process.env.DISCORD_CLIENT_ID || '1234567890123456789';
const VERCEL_URL = process.env.VERCEL_URL || 'http://localhost:3000';
const LOCAL_PORT = process.env.LOCAL_PORT || 3001;

const rpc = new DiscordRPC.Client({ transport: 'ipc' });
const app = express();

app.use(express.json());

let isDiscordConnected = false;
let currentActivity = null;

const connectToDiscord = async () => {
  try {
    await rpc.login({ clientId: CLIENT_ID });
    isDiscordConnected = true;
    console.log('✅ Connected to Discord RPC');
    
    rpc.on('disconnected', () => {
      isDiscordConnected = false;
      console.log('❌ Disconnected from Discord RPC');
      setTimeout(connectToDiscord, 5000);
    });
    
  } catch (error) {
    console.log('❌ Failed to connect to Discord RPC:', error.message);
    console.log('🔄 Retrying in 10 seconds...');
    setTimeout(connectToDiscord, 10000);
  }
};

const updateDiscordActivity = async (data) => {
  if (!isDiscordConnected) {
    console.log('❌ Discord not connected, cannot update activity');
    return false;
  }

  try {
    const activity = {};
    
    if (data.title) {
      activity.details = data.title;
    }
    
    if (data.line1) {
      activity.state = data.line1;
    }
    
    if (data.line2) {
      if (activity.state) {
        activity.state += ` • ${data.line2}`;
      } else {
        activity.state = data.line2;
      }
    }
    
    if (data.image) {
      activity.largeImageKey = data.image;
      activity.largeImageText = data.title || 'Discord RPC';
    }
    
    activity.startTimestamp = Date.now();
    
    if (Object.keys(activity).length === 0) {
      await rpc.clearActivity();
      currentActivity = null;
      console.log('🧹 Cleared Discord activity');
    } else {
      await rpc.setActivity(activity);
      currentActivity = activity;
      console.log('✅ Updated Discord activity:', activity);
    }
    
    return true;
  } catch (error) {
    console.log('❌ Failed to update Discord activity:', error.message);
    return false;
  }
};

const registerWithServer = async () => {
  try {
    const response = await fetch(`${VERCEL_URL}/api/rpc/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        clientUrl: `http://localhost:${LOCAL_PORT}`
      })
    });

    if (response.ok) {
      console.log('✅ Registered with Vercel server');
    } else {
      console.log('❌ Failed to register with server');
    }
  } catch (error) {
    console.log('❌ Error registering with server:', error.message);
  }
};

app.post('/update', async (req, res) => {
  console.log('📥 Received update request:', req.body);
  
  const success = await updateDiscordActivity(req.body);
  
  if (success) {
    res.json({ success: true, message: 'Discord activity updated' });
  } else {
    res.status(500).json({ success: false, message: 'Failed to update Discord activity' });
  }
});

app.post('/clear', async (req, res) => {
  console.log('📥 Received clear request');
  
  const success = await updateDiscordActivity({});
  
  if (success) {
    res.json({ success: true, message: 'Discord activity cleared' });
  } else {
    res.status(500).json({ success: false, message: 'Failed to clear Discord activity' });
  }
});

app.get('/status', (req, res) => {
  res.json({
    status: 'online',
    discordConnected: isDiscordConnected,
    currentActivity: currentActivity,
    timestamp: new Date().toISOString()
  });
});

const startClient = async () => {
  console.log('🚀 Starting Discord RPC Local Client...');
  console.log(`📡 Vercel URL: ${VERCEL_URL}`);
  console.log(`🎮 Discord Client ID: ${CLIENT_ID}`);
  console.log(`🌐 Local Port: ${LOCAL_PORT}`);
  
  app.listen(LOCAL_PORT, () => {
    console.log(`🌐 Local server running on http://localhost:${LOCAL_PORT}`);
  });
  
  await connectToDiscord();
  
  await registerWithServer();
  
  setInterval(registerWithServer, 60000);
  
  console.log('✅ Client ready! Waiting for RPC updates...');
};

process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down...');
  if (isDiscordConnected) {
    await rpc.clearActivity();
    rpc.destroy();
  }
  process.exit(0);
});

process.on('uncaughtException', (error) => {
  console.log('❌ Uncaught Exception:', error.message);
});

process.on('unhandledRejection', (error) => {
  console.log('❌ Unhandled Rejection:', error.message);
});

startClient().catch(console.error);
