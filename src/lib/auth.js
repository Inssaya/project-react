// Auth service - manages authentication state
import { api } from "./api";
import { storage } from "./storage";

export const auth = {
  // Login user
  async login(email, password) {
    const response = await api.auth.login(email, password);

    if (response.success && response.data?.token) {
      await storage.setToken(response.data.token);
      if (response.data.user) {
        await storage.setUser(response.data.user);
      }
      return { success: true, user: response.data.user };
    }

    throw new Error(response.message || "Login failed");
  },

  // Register user
  async register(data) {
    const response = await api.auth.register(data);

    if (response.success && response.data?.token) {
      await storage.setToken(response.data.token);
      if (response.data.user) {
        await storage.setUser(response.data.user);
      }
      return { success: true, user: response.data.user };
    }

    throw new Error(response.message || "Registration failed");
  },

  // Logout user
  async logout() {
    await storage.clearAuth();
    return { success: true };
  },

  // Get current user
  async getCurrentUser() {
    const token = await storage.getToken();
    if (!token) {
      return null;
    }

    const user = await storage.getUser();
    return user;
  },

  // Check if user is authenticated
  async isAuthenticated() {
    const token = await storage.getToken();
    return !!token;
  },

  // Refresh user data from server
  async refreshUser() {
    try {
      const response = await api.auth.me();
      if (response.success && response.data) {
        await storage.setUser(response.data);
        return response.data;
      }
    } catch {
      // If refresh fails, user may need to re-login
      return null;
    }
    return null;
  },
};

export default auth;
