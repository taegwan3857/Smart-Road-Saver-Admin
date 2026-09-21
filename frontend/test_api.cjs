const axios = require('axios');

async function test() {
  try {
    const loginRes = await axios.post('https://smart-road-saver-api.onrender.com/api/auth/login', {
      login_id: 'admin',
      password: 'password123'
    });
    const token = loginRes.data.access_token || loginRes.data.data?.access_token;
    
    const eventsRes = await axios.get('https://smart-road-saver-api.onrender.com/api/events', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const events = eventsRes.data.data || eventsRes.data;
    console.log("Total events:", events.length);
    
    const missing = [];
    const eventIds = events.map(e => e.event_id || e.id || e._id);
    console.log("First 15 event IDs:", eventIds.slice(0, 15).join(', '));
    
    // Check missing sequence numbers
    // Assuming event_id format is like "EVT-001" or just "1"
    const nums = eventIds
      .map(id => {
        if (typeof id === 'string' && id.startsWith('EVT-')) {
          return parseInt(id.replace('EVT-', ''), 10);
        }
        return parseInt(id, 10);
      })
      .filter(n => !isNaN(n))
      .sort((a,b) => a-b);
      
    if (nums.length > 0) {
      const min = nums[0];
      const max = nums[nums.length-1];
      for (let i = min; i <= max; i++) {
        if (!nums.includes(i)) {
          missing.push(i);
        }
      }
      console.log("Min ID:", min, "Max ID:", max);
      console.log("Missing numbers in sequence:", missing);
    }
    
    // Also check detections API to see if events are aggregations
    const detRes = await axios.get('https://smart-road-saver-api.onrender.com/api/detections', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const dets = detRes.data.data || detRes.data;
    console.log("Total raw detections:", dets.length);
    
  } catch(e) {
    console.error(e.response ? e.response.data : e.message);
  }
}
test();
