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

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    // Forward the request to the backend server using axios
    const response = await axios.post(`${API_BASE_URL}/tickets`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error submitting ticket:', error);
    
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { message: error.response?.data?.message || error.message || 'Failed to submit ticket' },
        { status: error.response?.status || 500 }
      );
    }
    
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
} 