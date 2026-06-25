// Get raw env var or fallback to production backend.
let rawBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://smartcredit.onrender.com';

// CRITICAL FIX: NEVER allow localhost or 127.0.0.1 in production Vercel builds.
if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
  if (rawBaseUrl.includes('localhost') || rawBaseUrl.includes('127.0.0.1')) {
    rawBaseUrl = 'https://smartcredit.onrender.com';
  }
}

// Ensure base URL doesn't have a trailing slash or duplicated /api/v1
rawBaseUrl = rawBaseUrl.replace(/\/api\/v1\/?$/, '').replace(/\/$/, '');

const API_BASE_URL = `${rawBaseUrl}/api/v1`;
export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Handle form data which shouldn't have Content-Type set manually
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch (e) {
      errorData = { detail: 'An unexpected error occurred' };
    }
    throw new Error(errorData.detail || 'API request failed');
  }

  return response.json();
};
