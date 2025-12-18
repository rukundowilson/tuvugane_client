import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios';

// Use localhost:5000/api in development, otherwise use environment variable or production URL
const getApiBaseUrl = (): string => {
  // Check if we're in development mode
  if (process.env.NODE_ENV === 'development') {
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  }
  // Production mode - use environment variable or fallback to production URL
  return process.env.NEXT_PUBLIC_API_URL || 'https://tuvugane-server.onrender.com/api';
};

const API_BASE_URL = getApiBaseUrl();

interface ErrorResponse {
  message?: string;
}

// Create axios instance with default configuration
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
});

// Request interceptor to add auth token automatically
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from localStorage if available
    if (typeof window !== 'undefined') {
      const token =
        localStorage.getItem('adminToken') ||
        localStorage.getItem('superAdminToken') ||
        localStorage.getItem('userToken') ||
        localStorage.getItem('agencyToken');

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError<ErrorResponse>) => {
    // Handle common error cases
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || error.message;
      const status = error.response.status;
      
      // Handle 401 Unauthorized - clear tokens and redirect
      if (status === 401 && typeof window !== 'undefined') {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('superAdminToken');
        localStorage.removeItem('userToken');
        localStorage.removeItem('agencyToken');
        localStorage.removeItem('userData');
      }
      
      throw new Error(`API error: ${status} ${error.response.statusText} - ${message}`);
    } else if (error.request) {
      // Request was made but no response received
      throw new Error('Network error: No response from server');
    } else {
      // Something else happened
      throw new Error(error.message || 'An unexpected error occurred');
    }
  }
);

export const apiService = {
  async get<T>(endpoint: string, token?: string, config?: AxiosRequestConfig): Promise<T> {
    const requestConfig: AxiosRequestConfig = {
      ...config,
      headers: {
        ...config?.headers,
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    };

    const response = await axiosInstance.get<T>(endpoint, requestConfig);
    return response.data;
  },

  async post<T, D = Record<string, unknown>>(
    endpoint: string,
    data?: D,
    token?: string,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const requestConfig: AxiosRequestConfig = {
      ...config,
      headers: {
        ...config?.headers,
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    };

    const response = await axiosInstance.post<T>(endpoint, data, requestConfig);
    return response.data;
  },

  async put<T, D = Record<string, unknown>>(
    endpoint: string,
    data?: D,
    token?: string,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const requestConfig: AxiosRequestConfig = {
      ...config,
      headers: {
        ...config?.headers,
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    };

    const response = await axiosInstance.put<T>(endpoint, data, requestConfig);
    return response.data;
  },

  async delete<T>(endpoint: string, token?: string, config?: AxiosRequestConfig): Promise<T> {
    const requestConfig: AxiosRequestConfig = {
      ...config,
      headers: {
        ...config?.headers,
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    };

    const response = await axiosInstance.delete<T>(endpoint, requestConfig);
    return response.data;
  },

  // Method for file uploads (FormData)
  async postFormData<T>(
    endpoint: string,
    formData: FormData,
    token?: string,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const requestConfig: AxiosRequestConfig = {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config?.headers,
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    };

    const response = await axiosInstance.post<T>(endpoint, formData, requestConfig);
    return response.data;
  },

  // Helper method to get stored authentication token
  getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return (
        localStorage.getItem('adminToken') ||
        localStorage.getItem('superAdminToken') ||
        localStorage.getItem('userToken') ||
        localStorage.getItem('agencyToken')
      );
    }
    return null;
  },

  // Get the axios instance for advanced usage
  getAxiosInstance(): AxiosInstance {
    return axiosInstance;
  },
}; 