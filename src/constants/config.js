// API Configuration
import Constants from "expo-constants";
import { Platform } from "react-native";

const BACKEND_PORT = "3001";

// Auto-detect IP from Expo dev server, or use manual fallback
const getBackendIP = () => {
  // In development, try to get the IP from Expo
  if (__DEV__ && Constants.expoConfig?.hostUri) {
    // hostUri is like "192.168.1.100:8081" - extract the IP
    const hostIp = Constants.expoConfig.hostUri.split(":")[0];
    if (hostIp) return hostIp;
  }
  // Fallback: Change this to your PC's local IP if auto-detect fails
  // Run 'ipconfig' in PowerShell and find your WiFi IPv4 address
  return "192.168.1.100";
};

// Use localhost for web, actual IP for native devices
export const API_BASE_URL =
  Platform.OS === "web"
    ? `http://localhost:${BACKEND_PORT}/api`
    : `http://${getBackendIP()}:${BACKEND_PORT}/api`;

export const config = {
  api: {
    baseUrl: API_BASE_URL,
    timeout: 10000,
  },
  storage: {
    tokenKey: "myschools_token",
    userKey: "myschools_user",
  },
};

export default config;
