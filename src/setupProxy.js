const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://backcv.mlsctiet.com',
      changeOrigin: true,
      secure: false,
      logLevel: 'debug',
      pathRewrite: {
        '^/api': '/api' // Keep /api in the path
      },
      onProxyReq: (proxyReq, req, res) => {
        console.log('🔄 Proxying:', req.method, req.url, '-> https://backcv.mlsctiet.com' + req.url);
        // Ensure headers are properly forwarded
        if (req.headers['x-api-key']) {
          proxyReq.setHeader('X-API-Key', req.headers['x-api-key']);
        }
      },
      onProxyRes: (proxyRes, req, res) => {
        console.log('✅ Proxy response:', proxyRes.statusCode, req.url);
        // Add CORS headers to response
        proxyRes.headers['Access-Control-Allow-Origin'] = '*';
        proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
        proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, X-API-Key';
      },
      onError: (err, req, res) => {
        console.error('❌ Proxy error:', err.message);
        res.status(500).json({ error: 'Proxy error', message: err.message });
      }
    })
  );

  app.use(
    '/health',
    createProxyMiddleware({
      target: 'https://backcv.mlsctiet.com',
      changeOrigin: true,
      secure: false,
      logLevel: 'debug',
      onProxyReq: (proxyReq, req, res) => {
        console.log('🏥 Health check proxy:', req.method, req.url);
      }
    })
  );
};
