const axios = require('axios');
async function test() {
  try {
    const login = await axios.post('https://smart-road-saver-api.onrender.com/api/auth/login', {
      login_id: 'admin',
      password: 'password123'
    });
    const token = login.data.token || login.data.data.token;
    
    const summary = await axios.get('https://smart-road-saver-api.onrender.com/api/dashboard/summary', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(JSON.stringify(summary.data, null, 2));
  } catch(e) { console.error(e.response?.data || e.message); }
}
test();
