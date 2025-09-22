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
let connectionAttempts = 0;
let lastRegistrationTime = null;
let serverRegistrationStatus = 'unknown';

const log = (message, type = 'info') => {
  const timestamp = new Date().toLocaleTimeString();
  const prefix = {
    info: '📝',
    success: '✅',
    error: '❌',
    warning: '⚠️',
    debug: '🔍',
    network: '📡'
  }[type] || '📝';
  
  console.log(`[${timestamp}] ${prefix} ${message}`);
};

const connectToDiscord = async () => {
  connectionAttempts++;
  log(`Attempting Discord connection (attempt ${connectionAttempts})`, 'network');
  
  try {
    await rpc.login({ clientId: CLIENT_ID });
    isDiscordConnected = true;
    connectionAttempts = 0;
    log('Connected to Discord RPC successfully!', 'success');
    
    rpc.on('ready', () => {
      log('Discord RPC ready event received', 'success');
    });
    
    rpc.on('disconnected', () => {
      isDiscordConnected = false;
      log('Disconnected from Discord RPC - attempting reconnection in 5 seconds', 'warning');
      setTimeout(connectToDiscord, 5000);
    });
    
  } catch (error) {
    log(`Failed to connect to Discord RPC: ${error.message}`, 'error');
    log(`Client ID being used: ${CLIENT_ID}`, 'debug');
    
    if (error.message.includes('ENOENT')) {
      log('Discord app might not be running. Make sure Discord is open!', 'warning');
    }
    
    const retryDelay = Math.min(10000 + (connectionAttempts * 2000), 30000);
    log(`Retrying connection in ${retryDelay/1000} seconds...`, 'info');
    setTimeout(connectToDiscord, retryDelay);
  }
};

const updateDiscordActivity = async (data) => {
  log('Received RPC update request', 'network');
  log(`Data received: ${JSON.stringify(data)}`, 'debug');
  
  if (!isDiscordConnected) {
    log('Discord not connected - cannot update activity', 'error');
    log('Attempting to reconnect to Discord...', 'info');
    connectToDiscord();
    return false;
  }

  try {
    const activity = {};
    
    if (data.title) {
      activity.details = data.title;
      log(`Set activity title: ${data.title}`, 'debug');
    }
    
    if (data.line1) {
      activity.state = data.line1;
      log(`Set activity state: ${data.line1}`, 'debug');
    }
    
    if (data.line2) {
      if (activity.state) {
        activity.state += ` • ${data.line2}`;
      } else {
        activity.state = data.line2;
      }
      log(`Added line2 to state: ${activity.state}`, 'debug');
    }
    
    if (data.image) {
      activity.largeImageKey = data.image;
      activity.largeImageText = data.title || 'Discord RPC';
      log(`Set activity image: ${data.image}`, 'debug');
    }
    
    activity.startTimestamp = Date.now();
    
    if (Object.keys(activity).length === 1 && activity.startTimestamp) {
      log('No activity data provided - clearing Discord activity', 'info');
      await rpc.clearActivity();
      currentActivity = null;
      log('Discord activity cleared successfully', 'success');
    } else {
      log(`Setting Discord activity with data: ${JSON.stringify(activity)}`, 'debug');
      await rpc.setActivity(activity);
      currentActivity = activity;
      log('Discord activity updated successfully!', 'success');
      log(`Active presence: ${activity.details || 'No title'} | ${activity.state || 'No state'}`, 'info');
    }
    
    return true;
  } catch (error) {
    log(`Failed to update Discord activity: ${error.message}`, 'error');
    log('Full error details:', 'debug');
    console.error(error);
    
    if (error.message.includes('RPC_CONNECTION_TIMEOUT')) {
      log('Discord RPC connection timeout - attempting reconnection', 'warning');
      isDiscordConnected = false;
      connectToDiscord();
    }
    
    return false;
  }
};

const registerWithServer = async () => {
  log(`Attempting to register with server: ${VERCEL_URL}`, 'network');
  
  try {
    const clientUrl = `http://localhost:${LOCAL_PORT}`;
    log(`Registering client URL: ${clientUrl}`, 'debug');
    
    const response = await fetch(`${VERCEL_URL}/api/rpc/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        clientUrl: clientUrl
      }),
      timeout: 10000
    });

    const responseData = await response.json();
    log(`Server response: ${JSON.stringify(responseData)}`, 'debug');

    if (response.ok) {
      serverRegistrationStatus = 'connected';
      lastRegistrationTime = new Date();
      log(`Successfully registered with server! Total clients: ${responseData.totalClients}`, 'success');
    } else {
      serverRegistrationStatus = 'failed';
      log(`Failed to register with server. Status: ${response.status}`, 'error');
      log(`Response: ${JSON.stringify(responseData)}`, 'debug');
    }
  } catch (error) {
    serverRegistrationStatus = 'error';
    log(`Error registering with server: ${error.message}`, 'error');
    
    if (error.message.includes('ENOTFOUND') || error.message.includes('ECONNREFUSED')) {
      log('Server might be offline or URL is incorrect', 'warning');
      log(`Current VERCEL_URL: ${VERCEL_URL}`, 'debug');
    }
  }
};

app.post('/update', async (req, res) => {
  const clientIP = req.ip || req.connection.remoteAddress;
  log(`Webhook received from ${clientIP}: UPDATE`, 'network');
  log(`Request body: ${JSON.stringify(req.body)}`, 'debug');
  
  const success = await updateDiscordActivity(req.body);
  
  if (success) {
    log('Webhook processed successfully - Discord updated', 'success');
    res.json({ success: true, message: 'Discord activity updated' });
  } else {
    log('Webhook processing failed', 'error');
    res.status(500).json({ success: false, message: 'Failed to update Discord activity' });
  }
});

app.post('/clear', async (req, res) => {
  const clientIP = req.ip || req.connection.remoteAddress;
  log(`Webhook received from ${clientIP}: CLEAR`, 'network');
  
  const success = await updateDiscordActivity({});
  
  if (success) {
    log('Clear webhook processed successfully', 'success');
    res.json({ success: true, message: 'Discord activity cleared' });
  } else {
    log('Clear webhook processing failed', 'error');
    res.status(500).json({ success: false, message: 'Failed to clear Discord activity' });
  }
});

app.get('/status', (req, res) => {
  const status = {
    status: 'online',
    discordConnected: isDiscordConnected,
    serverRegistration: serverRegistrationStatus,
    lastRegistration: lastRegistrationTime,
    currentActivity: currentActivity,
    connectionAttempts: connectionAttempts,
    timestamp: new Date().toISOString()
  };
  
  log('Status check requested', 'debug');
  res.json(status);
});

const printStatusSummary = () => {
  log('='.repeat(60), 'info');
  log('CLIENT STATUS SUMMARY', 'info');
  log('='.repeat(60), 'info');
  log(`Discord RPC: ${isDiscordConnected ? '✅ Connected' : '❌ Disconnected'}`, 'info');
  log(`Server Registration: ${serverRegistrationStatus}`, 'info');
  log(`Last Registration: ${lastRegistrationTime || 'Never'}`, 'info');
  log(`Connection Attempts: ${connectionAttempts}`, 'info');
  log(`Current Activity: ${currentActivity ? 'Active' : 'None'}`, 'info');
  if (currentActivity) {
    log(`  → Title: ${currentActivity.details || 'None'}`, 'info');
    log(`  → State: ${currentActivity.state || 'None'}`, 'info');
  }
  log('='.repeat(60), 'info');
};

const startClient = async () => {
  log('Starting Discord RPC Local Client...', 'info');
  log(`Vercel URL: ${VERCEL_URL}`, 'info');
  log(`Discord Client ID: ${CLIENT_ID}`, 'info');
  log(`Local Port: ${LOCAL_PORT}`, 'info');
  
  app.listen(LOCAL_PORT, () => {
    log(`Local webhook server running on http://localhost:${LOCAL_PORT}`, 'success');
  });
  
  log('Step 1: Connecting to Discord RPC...', 'info');
  await connectToDiscord();
  
  log('Step 2: Registering with Vercel server...', 'info');
  await registerWithServer();
  
  log('Setting up periodic server registration (every 30 seconds)', 'info');
  setInterval(registerWithServer, 30000);
  
  log('Setting up status summary (every 5 minutes)', 'info');
  setInterval(printStatusSummary, 300000);
  
  log('Client startup complete! Ready for RPC updates...', 'success');
  
  setTimeout(printStatusSummary, 2000);
};

process.on('SIGINT', async () => {
  log('Shutting down client...', 'warning');
  if (isDiscordConnected) {
    log('Clearing Discord activity before shutdown', 'info');
    await rpc.clearActivity();
    rpc.destroy();
  }
  log('Client shutdown complete', 'info');
  process.exit(0);
});

process.on('uncaughtException', (error) => {
  log(`Uncaught Exception: ${error.message}`, 'error');
  console.error('Full error:', error);
});

process.on('unhandledRejection', (error) => {
  log(`Unhandled Rejection: ${error.message}`, 'error');
  console.error('Full error:', error);
});

startClient().catch(console.error);
