import apiClient from '../api/client';

export const detectionService = {
  getDetections: async (params = {}) => {
    // /api/events 사용 - 도로명 주소가 포함된 데이터 반환
    // 백엔드가 한 페이지에 10개씩만 반환하므로 모든 페이지를 불러와 병합
    let allData = [];
    let page = 1;
    let hasMore = true;
    
    while(hasMore && page <= 50) { // 안전을 위해 최대 50페이지 제한
      const query = new URLSearchParams({...params, page}).toString();
      const response = await apiClient.get(`/api/events${query ? `?${query}` : ''}`);
      const data = response.data?.data || response.data;
      
      if (!data || data.length === 0) {
        hasMore = false;
      } else {
        allData = [...allData, ...data];
        if (data.length < 10) hasMore = false; // 10개 미만이면 마지막 페이지
        page++;
      }
    }
    return allData;
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
