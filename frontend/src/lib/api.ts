// Use environment variable, fallback to production backend. No localhost fallback.
let API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://smartcredit-ai-zqhj.onrender.com/api/v1';

// Failsafe: If somehow Vercel env var is still stuck on localhost but we are in production
if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && API_BASE_URL.includes('localhost')) {
  API_BASE_URL = 'https://smartcredit-ai-zqhj.onrender.com/api/v1';
}
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
