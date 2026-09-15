import apiClient from '../api/client';

export const detectionService = {
  getDetections: async (params = {}) => {
    // /api/events 사용 - 도로명 주소가 포함된 데이터 반환
    const query = new URLSearchParams(params).toString();
    const response = await apiClient.get(`/api/events${query ? `?${query}` : ''}`);
    return response.data?.data || response.data;
  },
  getDetection: async (id) => {
    // 단건 조회: events 먼저 시도, 없으면 detections 폴백
    try {
      const response = await apiClient.get(`/api/events/${encodeURIComponent(id)}`);
      return response.data?.data || response.data;
    } catch (e) {
      const response = await apiClient.get(`/api/detections/${encodeURIComponent(id)}`);
      return response.data?.data || response.data;
    }
  }
};
