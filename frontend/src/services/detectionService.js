import apiClient from '../api/client';

export const detectionService = {
  getDetections: async (params = {}) => {
    // If limit is 1, just fetch one page and return early
    if (params.limit === 1) {
      const query = new URLSearchParams({...params, page: 1}).toString();
      const response = await apiClient.get(`/api/events${query ? `?${query}` : ''}`);
      const data = response.data?.data || response.data;
      return Array.isArray(data) ? data.slice(0, 1) : [];
    }

    // For dashboard and lists, fetch concurrently in batches to drastically reduce delay
    let allData = [];
    let page = 1;
    let hasMore = true;
    
    while(hasMore && page <= 50) {
      // Fetch 5 pages concurrently
      const promises = [];
      for(let i=0; i<5; i++) {
        const query = new URLSearchParams({...params, page: page + i}).toString();
        promises.push(apiClient.get(`/api/events${query ? `?${query}` : ''}`).catch(() => null));
      }
      
      const responses = await Promise.all(promises);
      
      for(let i=0; i<responses.length; i++) {
        const res = responses[i];
        if (!res) {
          hasMore = false;
          break;
        }
        const data = res.data?.data || res.data;
        if (!data || data.length === 0) {
          hasMore = false;
          break;
        }
        allData = [...allData, ...data];
        if (data.length < 10) {
          hasMore = false;
          break;
        }
      }
      page += 5;
      
      // If called from dashboard with a soft limit, we can break early, but keeping it simple
    }
    
    // Sort allData by date descending just in case concurrent fetching messed up order slightly across batches
    allData.sort((a, b) => {
      const dA = new Date(b.first_detected_at || b.created_at || b.detected_at || 0);
      const dB = new Date(a.first_detected_at || a.created_at || a.detected_at || 0);
      return dA - dB;
    });
    
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
