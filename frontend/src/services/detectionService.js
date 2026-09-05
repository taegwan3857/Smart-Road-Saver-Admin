import apiClient from '../api/client';

export const detectionService = {
  getDetections: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const response = await apiClient.get(`/api/detections${query ? `?${query}` : ''}`);
    return response.data?.data || response.data;
  },
  getDetection: async (id) => {
    const response = await apiClient.get(`/api/detections/${encodeURIComponent(id)}`);
    return response.data?.data || response.data;
  }
};
