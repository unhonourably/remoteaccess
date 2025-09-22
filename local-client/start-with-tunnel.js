#!/usr/bin/env node

import { spawn } from 'child_process';
import { createServer } from 'http';

const LOCAL_PORT = process.env.LOCAL_PORT || 3001;

console.log('🚀 Starting Discord RPC Client with Tunnel...');

// Check if port is available
const checkPort = () => {
  return new Promise((resolve) => {
    const server = createServer();
    server.listen(LOCAL_PORT, () => {
      server.close();
      resolve(true);
    });
    server.on('error', () => {
      resolve(false);
    });
  });
};

const startNgrok = () => {
  return new Promise((resolve, reject) => {
    console.log(`📡 Starting ngrok tunnel on port ${LOCAL_PORT}...`);
    
    const ngrok = spawn('ngrok', ['http', LOCAL_PORT], {
      stdio: ['ignore', 'pipe', 'pipe']
    });

    let output = '';
    
    ngrok.stdout.on('data', (data) => {
      output += data.toString();
      if (output.includes('started tunnel') || output.includes('https://')) {
        const match = output.match(/https:\/\/[a-zA-Z0-9-]+\.ngrok\.io/);
        if (match) {
          resolve(match[0]);
        }
      }
    });

    ngrok.stderr.on('data', (data) => {
      console.error(`ngrok error: ${data}`);
    });

    ngrok.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`ngrok exited with code ${code}`));
      }
    });

    // Timeout after 30 seconds
    setTimeout(() => {
      reject(new Error('ngrok startup timeout'));
    }, 30000);
  });
};

const main = async () => {
  try {
    // Check if port is available
    const portAvailable = await checkPort();
    if (!portAvailable) {
      console.error(`❌ Port ${LOCAL_PORT} is already in use`);
      process.exit(1);
    }

    // Try to start ngrok
    try {
      const tunnelUrl = await startNgrok();
      console.log(`✅ Tunnel created: ${tunnelUrl}`);
      console.log(`📝 Add this to your .env file:`);
      console.log(`PUBLIC_URL=${tunnelUrl}`);
      console.log('');
      console.log('🔄 Restarting client with tunnel URL...');
      
      // Set environment variable and start client
      process.env.PUBLIC_URL = tunnelUrl;
      
      // Import and start the main client
      const { default: startClient } = await import('./client.js');
      
    } catch (ngrokError) {
      console.log('❌ ngrok failed, trying localtunnel...');
      
      // Try localtunnel as fallback
      const lt = spawn('lt', ['--port', LOCAL_PORT], {
        stdio: ['ignore', 'pipe', 'pipe']
      });

      let ltOutput = '';
      
      lt.stdout.on('data', (data) => {
        ltOutput += data.toString();
        const match = ltOutput.match(/https:\/\/[a-zA-Z0-9-]+\.loca\.lt/);
        if (match) {
          const tunnelUrl = match[0];
          console.log(`✅ Localtunnel created: ${tunnelUrl}`);
          console.log(`📝 Add this to your .env file:`);
          console.log(`PUBLIC_URL=${tunnelUrl}`);
          
          process.env.PUBLIC_URL = tunnelUrl;
        }
      });

      lt.on('close', (code) => {
        if (code !== 0) {
          console.error('❌ Both ngrok and localtunnel failed');
          console.log('💡 Please manually set up a tunnel and update PUBLIC_URL in .env');
          process.exit(1);
        }
      });
    }

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    console.log('');
    console.log('🛠️  Manual setup required:');
    console.log('1. Install ngrok: https://ngrok.com/download');
    console.log('2. Run: ngrok http 3001');
    console.log('3. Copy the https URL to PUBLIC_URL in .env');
    console.log('4. Run: npm start');
    process.exit(1);
  }
};

main().catch(console.error);
