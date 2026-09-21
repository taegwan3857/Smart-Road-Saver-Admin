import apiClient from '../api/client';
import { detectionService } from './detectionService';

export const dashboardService = {
  getSummary: async () => {
    const response = await apiClient.get('/api/dashboard/summary');
    return response.data?.data || response.data;
  },
  getEvents: async (params = {}) => {
    // detectionService.getDetections에 페이지네이션 반복 로직이 이미 구현되어 있음
    // 동일한 /api/events 를 사용하므로 이를 재사용하여 모든 데이터를 가져옵니다.
    const { lat, lng, radiusMeters } = params;
    const queryParams = {};
    if (lat) queryParams.lat = lat;
    if (lng) queryParams.lng = lng;
    if (radiusMeters) queryParams.radius_meters = radiusMeters;
    
    return await detectionService.getDetections(queryParams);
  },
  getEvent: async (id) => {
    return await detectionService.getDetection(id);
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
