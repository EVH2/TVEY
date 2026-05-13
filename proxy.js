// 真实 API 地址，Base64 隐藏
const API_OIAPI = atob('aHR0cHM6Ly93d3cub2lhcGkubmV0L2FwaS9CaWdNb2RlbA==');
const API_CUNYU = atob('aHR0cHM6Ly93d3cuY3VueXVhcGkudG9wL2RlZXBzZWVr');
const API_MUSIC = atob('aHR0cHM6Ly93d3cuY3VueXVhcGkudG9wLzE2M211c2ljX3NlYXJjaA==');

exports.handler = async (event) => {
  const path = event.path.split('/').pop();   // oiapi / cunyu / music
  const query = event.queryStringParameters || {};
  const body = event.body;
  const method = event.httpMethod;

  // 跨域头
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (method === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    let targetUrl;
    let fetchOptions = {
      method,
      headers: { 'Content-Type': 'application/json' }
    };

    if (path === 'oiapi' && method === 'POST') {
      targetUrl = API_OIAPI;
      fetchOptions.body = body;
    } else if (path === 'cunyu' && method === 'GET') {
      targetUrl = API_CUNYU + '?' + new URLSearchParams(query).toString();
    } else if (path === 'music' && method === 'GET') {
      targetUrl = API_MUSIC + '?' + new URLSearchParams(query).toString();
    } else {
      return { statusCode: 404, headers, body: JSON.stringify({ error: 'Not Found' }) };
    }

    const response = await fetch(targetUrl, fetchOptions);
    const data = await response.json();

    return {
      statusCode: response.status,
      headers,
      body: JSON.stringify(data)
    };
  } catch (error) {
    return {
      statusCode: 502,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};
