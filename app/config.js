// Update BASE_URL to your backend host (use PC LAN IP for phone testing)
// For local testing use localhost, for device testing use your PC's IP

// Detect platform
import { Platform } from 'react-native';

// Your computer's IP address (change if needed)
const COMPUTER_IP = '192.168.91.89';

// Use localhost for web, computer IP for Android/iOS
export const BASE_URL = Platform.OS === 'web' 
  ? 'http://localhost:3001/api'
  : `http://${COMPUTER_IP}:3001/api`;

export default { BASE_URL };
