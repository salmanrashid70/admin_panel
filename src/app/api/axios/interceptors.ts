import { PUBLIC_API_ENDPOINTS } from "@/lib/constants";
import axios, {
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { handleApiError } from "./errorHandler";

// Create Axios Instance
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 20000,  // 20 seconds timeout
  headers: {
    "Content-Type": "application/json",
 },
  withCredentials: true,
});

// Prevent multiple refresh token requests
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

// Function to apply the new token to queued requests
const onRefreshed = (token: string): void => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

// ✅ Request Interceptor (Exclude Public APIs)
axiosInstance.interceptors.request.use(
    (request: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    
    // Set Content-Type to multipart/form-data for FormData
    if (request.data instanceof FormData) {
      request.headers.set("Content-Type", "multipart/form-data");
    }

    // Exclude public APIs from authentication
    if (PUBLIC_API_ENDPOINTS.some((url) => request.url?.startsWith(url))) {
      return request;
    }

    // ✅ Browser-Specific Code: No need for Authorization header (cookies handle it)
    if (typeof window !== "undefined") {
      console.log("Using HTTP-only cookies for authentication (Browser mode)");
      return request;
    }

    return request;
  },
  (error) => Promise.reject(error)
);

// ✅ Response Interceptor (Handle 401 & Refresh Token)
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
    async (error) => {
      
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          refreshSubscribers.push((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            resolve(axiosInstance(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log("Refreshing token using HTTP-only cookies (Browser mode)");

        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/refresh`,
          {},
          { withCredentials: true }
        );

        isRefreshing = false;
        onRefreshed(response.data.accessToken);

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);

        // ✅ Always call handleAuthError() to trigger redirection to signin
        localStorage.clear();
        location.replace("/");

        isRefreshing = false;
        return Promise.reject(refreshError);
      }
    }
        
    const handledError = handleApiError(error);

    return Promise.reject(handledError);
  }
);


export default axiosInstance;