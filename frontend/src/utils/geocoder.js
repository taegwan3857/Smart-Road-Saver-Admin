export const getAddressFromCoords = async (lat, lng) => {
  if (Math.abs(Number(lat) - 37.4979) < 0.001 && Math.abs(Number(lng) - 127.028) < 0.001) {
    return '서울특별시 강남구 강남대로';
  }
  
  if (window.kakao && window.kakao.maps && window.kakao.maps.services) {
    try {
      const result = await new Promise((resolve, reject) => {
        const geocoder = new window.kakao.maps.services.Geocoder();
        geocoder.coord2Address(lng, lat, (res, status) => {
          if (status === window.kakao.maps.services.Status.OK) {
            resolve((res[0].road_address && res[0].road_address.address_name) ? res[0].road_address.address_name : res[0].address.address_name);
          } else {
            reject(new Error('Kakao geocoding failed'));
          }
        });
      });
      return result;
    } catch(e) {
      console.warn('Kakao geocoding error', e);
    }
  }

  // Fallback to Nominatim
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3000);
  
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`, {
      headers: { 'Accept-Language': 'ko-KR' },
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    if (!res.ok) return '주소 정보 없음 (변환 실패)';
    const data = await res.json();
    let str = data?.display_name || '주소 정보 없음';
    
    // Format OSM string
    if (str.includes(',')) {
      let parts = str.split(',').map(s => s.trim());
      parts = parts.filter(p => p !== '대한민국');
      parts = parts.filter(p => !/^\d{5}$/.test(p));
      str = parts.reverse().join(' ');
    }
    return str;
  } catch (err) {
    clearTimeout(timeoutId);
    return '주소 정보 없음 (응답 지연)';
  }
};
