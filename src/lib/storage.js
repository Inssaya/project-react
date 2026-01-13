// Storage utilities using AsyncStorage
import AsyncStorage from "@react-native-async-storage/async-storage";
import { config } from "../constants/config";

export const storage = {
  // Token management
  async getToken() {
    try {
      return await AsyncStorage.getItem(config.storage.tokenKey);
    } catch {
      return null;
    }
  },

  async setToken(token) {
    try {
      await AsyncStorage.setItem(config.storage.tokenKey, token);
      return true;
    } catch {
      return false;
    }
  },

  async removeToken() {
    try {
      await AsyncStorage.removeItem(config.storage.tokenKey);
      return true;
    } catch {
      return false;
    }
  },

  // User management
  async getUser() {
    try {
      const user = await AsyncStorage.getItem(config.storage.userKey);
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },

  async setUser(user) {
    try {
      await AsyncStorage.setItem(config.storage.userKey, JSON.stringify(user));
      return true;
    } catch {
      return false;
    }
  },

  async removeUser() {
    try {
      await AsyncStorage.removeItem(config.storage.userKey);
      return true;
    } catch {
      return false;
    }
  },

  // Clear all auth data
  async clearAuth() {
    try {
      await AsyncStorage.multiRemove([
        config.storage.tokenKey,
        config.storage.userKey,
      ]);
      return true;
    } catch {
      return false;
    }
  },
};

export default storage;
