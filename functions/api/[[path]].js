// Cloudflare Pages Function - API Proxy
// This proxies all /api/* requests to your HTTP backend

const BACKEND_URL = 'https://backcv.mlsctiet.com';

export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  
  // Get the path after /api/
  const path = context.params.path.join('/');
  
  // Construct the backend URL
  const backendUrl = `${BACKEND_URL}/api/${path}${url.search}`;
  
  console.log(`Proxying request to: ${backendUrl}`);
  
  try {
    // Forward the request to the backend
    const backendRequest = new Request(backendUrl, {
      method: request.method,
      headers: request.headers,
      body: request.method !== 'GET' && request.method !== 'HEAD' ? await request.blob() : undefined,
    });
    
    // Get response from backend
    const backendResponse = await fetch(backendRequest);
    
    // Create a new response with CORS headers
    const response = new Response(backendResponse.body, {
      status: backendResponse.status,
      statusText: backendResponse.statusText,
      headers: backendResponse.headers,
    });
    
    // Add CORS headers
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, X-API-Key');
    
    return response;
  } catch (error) {
    console.error('Proxy error:', error);
    return new Response(JSON.stringify({ error: 'Proxy error', details: error.message }), {
      status: 502,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}

// Handle OPTIONS requests for CORS preflight
export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-API-Key',
      'Access-Control-Max-Age': '86400',
    },
  });
}
