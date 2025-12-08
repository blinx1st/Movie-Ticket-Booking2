import { apiClient } from '@/lib/api/ApiClient';
import { cookies } from 'next/headers';

export const AuthService = {
  async signin(email: string, password: string) {
    try {
      const res = await apiClient.post('/auth/login', { "username": email, "password": password });
      console.log(res);
      if (res?.access_token) {
        localStorage.setItem('token', res.access_token);
        document.cookie = `token=${res.access_token}; path=/; max-age=3600;`;
        return res;
      }
      throw new Error('No access token received');
    } catch (err: any) {
      // wrap or rethrow for UI
      throw new Error(err.message || 'Invalid email or password');
    }
  },
  async signup(email: string, password: string) {
    return apiClient.post('/auth/register', { email, password });
  },
  logout() {
    localStorage.removeItem('token');
  },
};
