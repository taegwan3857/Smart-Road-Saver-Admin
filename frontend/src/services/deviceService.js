import apiClient from '../api/client';

export const deviceService = {
  getDevices: async () => {
    const response = await apiClient.get('/api/devices');
    return response.data?.data || response.data;
  },
  getDevice: async (id) => {
    const response = await apiClient.get(`/api/devices/${encodeURIComponent(id)}`);
    return response.data?.data || response.data;
  },
  getDeviceHealth: async (id) => {
    const response = await apiClient.get(`/api/devices/${encodeURIComponent(id)}/health`);
    return response.data?.data || response.data;
  },
  updateDeviceStatus: async (id, status) => {
    const response = await apiClient.patch(`/api/devices/${encodeURIComponent(id)}/status`, { status });
    return response.data?.data || response.data;
  }
};
