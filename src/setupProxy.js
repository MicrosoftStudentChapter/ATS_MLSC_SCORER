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
      },
      onProxyRes: (proxyRes, req, res) => {
        console.log('✅ Proxy response:', proxyRes.statusCode, req.url);
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
