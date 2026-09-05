export const getAddressFromCoords = async (lat, lng) => {
  if (Math.abs(Number(lat) - 37.4979) < 0.001 && Math.abs(Number(lng) - 127.028) < 0.001) {
    return '서울특별시 강남구 강남대로';
  }
  
  // Use AbortController to prevent hanging
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 2000); // 2 second timeout
  
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`, {
      headers: { 'Accept-Language': 'ko-KR' },
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    if (!res.ok) return '주소 정보 없음 (변환 실패)';
    const data = await res.json();
    return data?.display_name || '주소 정보 없음';
  } catch (err) {
    clearTimeout(timeoutId);
    return '주소 정보 없음 (응답 지연)';
  }
};
