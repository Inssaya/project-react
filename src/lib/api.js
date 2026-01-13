// API client with centralized error handling and auth
import { config } from "../constants/config";
import { storage } from "./storage";

class ApiError extends Error {
  constructor(message, status, data = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

// Base request function
async function request(endpoint, options = {}) {
  const { method = "GET", body, headers = {}, requiresAuth = true } = options;

  const url = `${config.api.baseUrl}${endpoint}`;

  const requestHeaders = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...headers,
  };

  // Add auth token if required
  if (requiresAuth) {
    const token = await storage.getToken();
    if (token) {
      requestHeaders.Authorization = `Bearer ${token}`;
    }
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), config.api.timeout);

  try {
    const response = await fetch(url, {
      method,
      headers: requestHeaders,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Parse response
    let data;
    try {
      const text = await response.text();
      data = text ? JSON.parse(text) : {};
    } catch {
      data = {};
    }

    // Handle error responses
    if (!response.ok) {
      const message =
        data.message || data.error || `Request failed with status ${response.status}`;
      throw new ApiError(message, response.status, data);
    }

    return data;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error.name === "AbortError") {
      throw new ApiError("Request timeout", 408);
    }

    if (error instanceof ApiError) {
      throw error;
    }

    // Network error
    throw new ApiError(
      "Unable to connect to server. Please check your connection.",
      0
    );
  }
}

// API methods
export const api = {
  // Generic methods
  get: (endpoint, options) => request(endpoint, { ...options, method: "GET" }),
  post: (endpoint, body, options) =>
    request(endpoint, { ...options, method: "POST", body }),
  put: (endpoint, body, options) =>
    request(endpoint, { ...options, method: "PUT", body }),
  patch: (endpoint, body, options) =>
    request(endpoint, { ...options, method: "PATCH", body }),
  delete: (endpoint, options) =>
    request(endpoint, { ...options, method: "DELETE" }),

  // Auth endpoints
  auth: {
    login: (email, password) =>
      request("/auth/login", {
        method: "POST",
        body: { email, password },
        requiresAuth: false,
      }),
    register: (data) =>
      request("/auth/register", {
        method: "POST",
        body: data,
        requiresAuth: false,
      }),
    me: () => request("/auth/me"),
  },

  // Schools
  schools: {
    list: () => request("/schools"),
    get: (id) => request(`/schools/${id}`),
    create: (data) => request("/schools", { method: "POST", body: data }),
    update: (id, data) =>
      request(`/schools/${id}`, { method: "PUT", body: data }),
    delete: (id) => request(`/schools/${id}`, { method: "DELETE" }),
  },

  // Classes
  classes: {
    list: (params) => {
      const query = params ? `?${new URLSearchParams(params)}` : "";
      return request(`/classes${query}`);
    },
    get: (id) => request(`/classes/${id}`),
    create: (data) => request("/classes", { method: "POST", body: data }),
    update: (id, data) =>
      request(`/classes/${id}`, { method: "PUT", body: data }),
    delete: (id) => request(`/classes/${id}`, { method: "DELETE" }),
    students: (id) => request(`/classes/${id}/students`),
  },

  // Students
  students: {
    list: (params) => {
      const query = params ? `?${new URLSearchParams(params)}` : "";
      return request(`/students${query}`);
    },
    get: (id) => request(`/students/${id}`),
    create: (data) => request("/students", { method: "POST", body: data }),
    update: (id, data) =>
      request(`/students/${id}`, { method: "PUT", body: data }),
    delete: (id) => request(`/students/${id}`, { method: "DELETE" }),
  },

  // Teachers
  teachers: {
    list: () => request("/teachers"),
    get: (id) => request(`/teachers/${id}`),
    create: (data) => request("/teachers", { method: "POST", body: data }),
    update: (id, data) =>
      request(`/teachers/${id}`, { method: "PUT", body: data }),
    delete: (id) => request(`/teachers/${id}`, { method: "DELETE" }),
  },

  // Attendance
  attendance: {
    list: (params) => {
      const query = params ? `?${new URLSearchParams(params)}` : "";
      return request(`/attendance${query}`);
    },
    record: (data) => request("/attendance", { method: "POST", body: data }),
    bulkRecord: (records) =>
      request("/attendance/bulk", { method: "POST", body: { records } }),
  },

  // Grades
  grades: {
    list: (params) => {
      const query = params ? `?${new URLSearchParams(params)}` : "";
      return request(`/grades${query}`);
    },
    record: (data) => request("/grades", { method: "POST", body: data }),
    update: (id, data) =>
      request(`/grades/${id}`, { method: "PUT", body: data }),
  },

  // Subjects
  subjects: {
    list: () => request("/subjects"),
    get: (id) => request(`/subjects/${id}`),
  },

  // Majors
  majors: {
    list: () => request("/majors"),
    get: (id) => request(`/majors/${id}`),
    create: (data) => request("/majors", { method: "POST", body: data }),
  },
};

export { ApiError };
export default api;
