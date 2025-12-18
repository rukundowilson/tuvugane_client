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

export async function GET() {
  try {
    const response = await axios.get(`${API_BASE_URL}/agencies`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching agencies:', error);
    
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { error: error.response?.data?.message || 'Failed to fetch agencies' },
        { status: error.response?.status || 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch agencies' },
      { status: 500 }
    );
  }
} 