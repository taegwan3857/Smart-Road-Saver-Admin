import apiClient from '../api/client';

export const userService = {
  getUsers: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const response = await apiClient.get(`/api/users${query ? `?${query}` : ''}`);
    return response.data?.data || response.data;
  },
  getUser: async (id) => {
    const response = await apiClient.get(`/api/users/${encodeURIComponent(id)}`);
    return response.data?.data || response.data;
  },
  deleteUser: async (id) => {
    const response = await apiClient.delete(`/api/users/${encodeURIComponent(id)}`);
    return response.data?.data || response.data;
  },
  updateUser: async (id, data) => {
    const response = await apiClient.patch(`/api/users/${encodeURIComponent(id)}`, data);
    return response.data?.data || response.data;
  }
};
