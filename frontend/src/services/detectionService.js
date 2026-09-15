import apiClient from '../api/client';

export const detectionService = {
  getDetections: async (params = {}) => {
    // /api/events 사용 - 도로명 주소가 포함된 데이터 반환
    const query = new URLSearchParams(params).toString();
    const response = await apiClient.get(`/api/events${query ? `?${query}` : ''}`);
    return response.data?.data || response.data;
  },
  getDetection: async (id) => {
    // events 상세 조회: { event: {...}, detections: [...] } 구조를 평탄화
    try {
      const response = await apiClient.get(`/api/events/${encodeURIComponent(id)}`);
      const raw = response.data?.data || response.data;
      // events 상세는 { event: {...}, detections: [...] } 구조
      if (raw?.event) {
        const merged = { ...raw.event };
        // detections 배열에서 이미지 등 추가 정보 병합
        if (raw.detections && raw.detections.length > 0) {
          const det = raw.detections[0];
          merged.detection_images = det.detection_images || merged.detection_images;
          merged.confidence = det.confidence || merged.confidence;
          merged.detected_at = det.detected_at || merged.detected_at;
          merged.vehicle_id = det.vehicle_id || merged.vehicle_id;
          merged.device_id = det.device_id || merged.device_id;
        }
        return merged;
      }
      return raw;
    } catch (e) {
      // 폴백: /api/detections 사용
      const response = await apiClient.get(`/api/detections/${encodeURIComponent(id)}`);
      return response.data?.data || response.data;
    }
  }
};
