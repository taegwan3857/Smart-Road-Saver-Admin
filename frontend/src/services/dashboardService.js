import apiClient from '../api/client';

export const dashboardService = {
  getSummary: async () => {
    const response = await apiClient.get('/api/dashboard/summary');
    return response.data?.data || response.data;
  },
  getEvents: async (params = {}) => {
    const { lat, lng, radiusMeters } = params;
    let url = '/api/events';
    const query = [];
    if (lat) query.push(`lat=${lat}`);
    if (lng) query.push(`lng=${lng}`);
    if (radiusMeters) query.push(`radius_meters=${radiusMeters}`);
    if (query.length > 0) url += `?${query.join('&')}`;
    
    const response = await apiClient.get(url);
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
