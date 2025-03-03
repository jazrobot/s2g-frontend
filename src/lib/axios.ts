import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { env } from "@/env";

// Add custom type for the config to include _retry
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

import { getSession, signOut } from "next-auth/react";

// Create a base axios instance
const api = axios.create({
  baseURL: `${env.NEXT_PUBLIC_BACKEND_URL}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add the auth token to every request
api.interceptors.request.use(
  async (config) => {
    // Get the session to access the token
    const session = await getSession();

    // If there's a token in the session, add it to the request headers
    if (session?.user?.accessToken) {
      config.headers.Authorization = `Bearer ${session.user.accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(
      error instanceof Error ? error : new Error(String(error)),
    );
  },
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    // Handle 401 errors (unauthorized)
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      await signOut({ redirect: true, callbackUrl: "/auth/login" });
      return Promise.reject(new Error("Unauthorized access"));
    }

    // Handle other common errors
    if (error.response?.status === 400) {
      const responseData = error.response.data as Record<string, unknown>;
      const detail =
        typeof responseData.detail === "string"
          ? responseData.detail
          : "Bad Request";
      return Promise.reject(new Error(detail));
    }

    if (error.response?.status === 403) {
      return Promise.reject(new Error("Access Forbidden"));
    }

    if (error.response?.status === 404) {
      return Promise.reject(new Error("Resource not found"));
    }

    if (error.response?.status === 500) {
      return Promise.reject(new Error("Internal Server Error"));
    }

    // Handle unknown errors
    const errorMessage = error.message || "An unknown error occurred";
    return Promise.reject(new Error(errorMessage));
  },
);

// Special instance for auth endpoints that don't need the token
export const authApi = axios.create({
  baseURL: `${env.NEXT_PUBLIC_BACKEND_URL}/api/v1`,
});

export default api;
