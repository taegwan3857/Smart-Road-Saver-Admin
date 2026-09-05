import apiClient from '../api/client';

export const dashboardService = {
  getSummary: async () => {
    const response = await apiClient.get('/api/dashboard/summary');
    return response.data?.data || response.data;
  },
  getEvents: async ({ lat = 37.5665, lng = 126.978, radiusMeters = 10000 } = {}) => {
    const response = await apiClient.get(`/api/events?lat=${lat}&lng=${lng}&radius_meters=${radiusMeters}`);
    return response.data?.data || response.data;
  },
  getEvent: async (id) => {
    const response = await apiClient.get(`/api/events/${encodeURIComponent(id)}`);
    return response.data?.data || response.data;
  },
  updateEventStatus: async (id, status) => {
    const response = await apiClient.patch(`/api/events/${encodeURIComponent(id)}/status`, { status });
    return response.data?.data || response.data;
  },
  deleteEvent: async (id) => {
    const response = await apiClient.delete(`/api/events/${encodeURIComponent(id)}`);
    return response.data?.data || response.data;
  }
};
