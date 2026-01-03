import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';

const PORT = process.env.PORT || 3001;
const HOST = '0.0.0.0'; // Listen on all network interfaces

app.listen(PORT, HOST, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
  console.log(`📱 For Android/iOS devices use: http://YOUR_COMPUTER_IP:${PORT}`);
  console.log(`🌐 Make sure Windows Firewall allows port ${PORT}`);
});
