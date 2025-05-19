const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://tuvugane-server.onrender.com/api';

interface ErrorResponse {
  message?: string;
}

export const apiService = {
  async get<T>(endpoint: string, token?: string): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    return response.json() as Promise<T>;
  },

  async post<T, D = Record<string, unknown>>(endpoint: string, data: D, token?: string): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      // Try to get detailed error information
      try {
        const errorData = await response.json() as ErrorResponse;
        throw new Error(`API error: ${response.status} ${response.statusText} - ${errorData.message || JSON.stringify(errorData)}`);
      } catch (_) {
        // Fallback if error response is not JSON
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
    }

    return response.json() as Promise<T>;
  },

  async put<T, D = Record<string, unknown>>(endpoint: string, data: D, token?: string): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    return response.json() as Promise<T>;
  },

  async delete<T>(endpoint: string, token?: string): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    return response.json() as Promise<T>;
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
  }
}; 