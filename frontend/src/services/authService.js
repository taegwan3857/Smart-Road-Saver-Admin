import apiClient from '../api/client';

export const authService = {
  login: async (loginId, password) => {
    const response = await apiClient.post('/api/auth/login', { login_id: loginId, password });
    const result = response.data?.data || response.data;
    const token = result?.token || result?.access_token || response.data?.token || response.data?.access_token;
    if (token) {
      localStorage.setItem('accessToken', token);
      localStorage.setItem('access_token', token);
    }
    const user = result?.user || result;
    if (user) {
      localStorage.setItem('user', JSON.stringify({
        email: user.email || loginId,
        name: user.name || '관리자',
        role: user.role || 'ADMIN'
      }));
    }
    return result;
  },
  getMe: async () => {
    const response = await apiClient.get('/api/auth/me');
    return response.data?.data || response.data;
  },
  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  }
};
