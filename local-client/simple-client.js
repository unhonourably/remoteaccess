import DiscordRPC from 'discord-rpc';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const CLIENT_ID = process.env.DISCORD_CLIENT_ID || '1234567890123456789';
const VERCEL_URL = process.env.VERCEL_URL || 'http://localhost:3000';

const rpc = new DiscordRPC.Client({ transport: 'ipc' });

let isDiscordConnected = false;
let currentActivity = null;
let lastKnownData = null;
let lastClearCheck = Date.now();

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
  try {
    await rpc.login({ clientId: CLIENT_ID });
    isDiscordConnected = true;
    log('Connected to Discord RPC successfully!', 'success');
    
    rpc.on('disconnected', () => {
      isDiscordConnected = false;
      log('Disconnected from Discord RPC - attempting reconnection in 5 seconds', 'warning');
      setTimeout(connectToDiscord, 5000);
    });
    
  } catch (error) {
    log(`Failed to connect to Discord RPC: ${error.message}`, 'error');
    log('Retrying connection in 10 seconds...', 'info');
    setTimeout(connectToDiscord, 10000);
  }
};

const updateDiscordActivity = async (data) => {
  if (!isDiscordConnected) {
    log('Discord not connected - cannot update activity', 'error');
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
    
    if (Object.keys(activity).length === 1 && activity.startTimestamp) {
      await rpc.clearActivity();
      currentActivity = null;
      log('Discord activity cleared successfully', 'success');
    } else {
      await rpc.setActivity(activity);
      currentActivity = activity;
      log('Discord activity updated successfully!', 'success');
      log(`Active presence: ${activity.details || 'No title'} | ${activity.state || 'No state'}`, 'info');
    }
    
    return true;
  } catch (error) {
    log(`Failed to update Discord activity: ${error.message}`, 'error');
    return false;
  }
};

const isDataEmpty = (data) => {
  return !data.image && !data.title && !data.line1 && !data.line2;
};

const pollForUpdates = async () => {
  try {
    const response = await fetch(`${VERCEL_URL}/api/rpc/update`);
    
    if (response.ok) {
      const data = await response.json();
      const newData = data.currentData;
      
      // Check if data has changed
      const dataChanged = JSON.stringify(newData) !== JSON.stringify(lastKnownData);
      
      if (dataChanged) {
        if (isDataEmpty(newData) && lastKnownData && !isDataEmpty(lastKnownData)) {
          log('Clear command detected from server', 'network');
          log('Clearing Discord activity', 'info');
        } else if (!isDataEmpty(newData)) {
          log('New RPC data detected from server', 'network');
          log(`Data: ${JSON.stringify(newData)}`, 'debug');
        } else {
          log('RPC data updated', 'network');
        }
        
        await updateDiscordActivity(newData);
        lastKnownData = newData;
      }
    } else {
      log('Failed to poll server for updates', 'error');
    }
  } catch (error) {
    log(`Error polling server: ${error.message}`, 'error');
  }
};

const startClient = async () => {
  log('Starting Discord RPC Simple Client (Polling Mode)...', 'info');
  log(`Vercel URL: ${VERCEL_URL}`, 'info');
  log(`Discord Client ID: ${CLIENT_ID}`, 'info');
  
  await connectToDiscord();
  
  // Poll for updates every 2 seconds
  log('Starting polling for RPC updates (every 2 seconds)', 'info');
  setInterval(pollForUpdates, 2000);
  
  // Initial poll
  setTimeout(pollForUpdates, 1000);
  
  log('Client ready! Polling for RPC updates...', 'success');
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

startClient().catch(console.error);
