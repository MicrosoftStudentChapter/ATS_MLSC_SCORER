// Simple local CORS proxy for development
// Run this with: node local-proxy.js
// Then update API_BASE_URL in apiService.js to: http://localhost:8080

const http = require('http');
const https = require('https');
const url = require('url');

const TARGET_URL = 'https://backcv.mlsctiet.com';
const PORT = 8080;

const server = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-API-Key');
  res.setHeader('Access-Control-Max-Age', '86400');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);

  // Parse the request URL
  const targetUrl = TARGET_URL + req.url;
  const options = url.parse(targetUrl);
  options.method = req.method;
  options.headers = req.headers;
  options.headers.host = url.parse(TARGET_URL).host;

  // Forward the request
  const proxyReq = https.request(options, (proxyRes) => {
    console.log(`  ← Status: ${proxyRes.statusCode}`);
    
    // Forward status code
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    
    // Forward response
    proxyRes.pipe(res);
  });

  proxyReq.on('error', (err) => {
    console.error('  ✗ Proxy error:', err.message);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Proxy error', message: err.message }));
  });

  // Forward request body
  req.pipe(proxyReq);
});

server.listen(PORT, () => {
  console.log('🚀 CORS Proxy Server running on http://localhost:' + PORT);
  console.log('📡 Forwarding requests to:', TARGET_URL);
  console.log('');
  console.log('💡 Update your apiService.js to use:');
  console.log('   const API_BASE_URL = "http://localhost:' + PORT + '";');
  console.log('');
});
