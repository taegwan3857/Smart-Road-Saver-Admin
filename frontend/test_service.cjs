const axios = require('axios');
async function test() {
    let allData = [];
    let page = 1;
    let hasMore = true;
    
    while(hasMore && page <= 50) { // 안전을 위해 최대 50페이지 제한
      const query = new URLSearchParams({page}).toString();
      const response = await axios.get(`https://smart-road-saver-api.onrender.com/api/events?${query}`);
      const data = response.data?.data || response.data;
      
      if (!data || data.length === 0) {
        hasMore = false;
      } else {
        allData = [...allData, ...data];
        if (data.length < 10) hasMore = false; // 10개 미만이면 마지막 페이지
        page++;
      }
    }
    console.log("Total fetched:", allData.length);
    console.log("IDs:", allData.map(e => e.event_id).join(', '));
}
test();
