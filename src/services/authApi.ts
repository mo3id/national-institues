// Auth API Service - Backend Authentication
const API_URL = import.meta.env.VITE_API_URL || '/api.php';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  status: 'success' | 'error';
  token?: string;
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  message?: string;
}

export interface VerifyTokenResponse {
  status: 'success' | 'error';
  user?: {
    id: string;
    email: string;
    role: string;
  };
  message?: string;
}

/**
 * Login with email and password
 */
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}?action=login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Login failed');
  }
  
  return response.json();
}

/**
 * Verify if current token is valid
 */
export async function verifyToken(token: string): Promise<VerifyTokenResponse> {
  const response = await fetch(`${API_URL}?action=verify_token&token=${encodeURIComponent(token)}`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Token verification failed');
  }
  
  return response.json();
}

/**
 * Get auth headers for API requests
 */
export function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('auth_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

/**
 * Store auth data in localStorage
 */
export function storeAuth(token: string, user: AuthResponse['user']): void {
  localStorage.setItem('auth_token', token);
  if (user) {
    localStorage.setItem('auth_user', JSON.stringify(user));
  }
}

/**
 * Clear auth data from localStorage
 */
export function clearAuth(): void {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_user');
}

/**
 * Get stored user data
 */
export function getStoredUser(): AuthResponse['user'] | null {
  const userStr = localStorage.getItem('auth_user');
  return userStr ? JSON.parse(userStr) : null;
}

/**
 * Get stored token
 */
export function getStoredToken(): string | null {
  return localStorage.getItem('auth_token');
}
