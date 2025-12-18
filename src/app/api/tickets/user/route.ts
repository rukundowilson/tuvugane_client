import { NextResponse } from 'next/server';
import axios from 'axios';

// Use localhost:5000/api in development, otherwise use environment variable or production URL
const getApiBaseUrl = (): string => {
  if (process.env.NODE_ENV === 'development') {
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  }
  return process.env.NEXT_PUBLIC_API_URL || 'https://tuvugane-server.onrender.com/api';
};

const API_BASE_URL = getApiBaseUrl();

export async function GET(request: Request) {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1];
    
    if (!token) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }

    // Forward the request to the backend server using axios
    const response = await axios.get(`${API_BASE_URL}/tickets/user`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error fetching user tickets:', error);
    
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { message: error.response?.data?.message || error.message || 'Failed to fetch tickets' },
        { status: error.response?.status || 500 }
      );
    }
    
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
} 