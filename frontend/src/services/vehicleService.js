import apiClient from '../api/client';

export const vehicleService = {
  getVehicles: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const response = await apiClient.get(`/api/vehicles${query ? `?${query}` : ''}`);
    return response.data?.data || response.data;
  },
  getVehicle: async (id) => {
    const response = await apiClient.get(`/api/vehicles/${encodeURIComponent(id)}`);
    return response.data?.data || response.data;
  },
  updateVehicle: async (id, data) => {
    const response = await apiClient.patch(`/api/vehicles/${encodeURIComponent(id)}`, data);
    return response.data?.data || response.data;
  }
};
