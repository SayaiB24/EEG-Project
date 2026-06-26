import express from 'express';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3000;

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

function tryListen(port, maxAttempts = 10) {
  const server = app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
    console.log(`Local: http://localhost:${port}/`);
    console.log(`Loopback: http://127.0.0.1:${port}/`);
    // attempt to find a LAN IPv4 address to display
    const nets = os.networkInterfaces();
    let localIp = null;
    for (const name of Object.keys(nets)) {
      for (const net of nets[name]) {
        if (net.family === 'IPv4' && !net.internal) {
          localIp = net.address;
          break;
        }
      }
      if (localIp) break;
    }
    if (localIp) console.log(`On Your Network: http://${localIp}:${port}/`);
  });

  server.on('error', (err) => {
    if (err && err.code === 'EADDRINUSE') {
      console.warn(`Port ${port} in use. Trying port ${port + 1}...`);
      server.close?.();
      if (maxAttempts > 0) {
        tryListen(port + 1, maxAttempts - 1);
      } else {
        console.error('No available ports found. Exiting.');
        process.exit(1);
      }
    } else {
      console.error('Server error:', err);
      process.exit(1);
    }
  });
}

tryListen(DEFAULT_PORT);
