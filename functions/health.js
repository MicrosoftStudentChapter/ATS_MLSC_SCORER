// Cloudflare Pages Function - Health Check Proxy

const BACKEND_URL = 'https://backcv.mlsctiet.com';

export async function onRequest(context) {
  const { request } = context;
  
  try {
    // Forward the health check request
    const backendResponse = await fetch(`${BACKEND_URL}/health`, {
      method: request.method,
      headers: request.headers,
    });
    
    // Create response with CORS headers
    const response = new Response(backendResponse.body, {
      status: backendResponse.status,
      statusText: backendResponse.statusText,
      headers: backendResponse.headers,
    });
    
    response.headers.set('Access-Control-Allow-Origin', '*');
    
    return response;
  } catch (error) {
    console.error('Health check proxy error:', error);
    return new Response(JSON.stringify({ error: 'Health check failed', details: error.message }), {
      status: 502,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}
