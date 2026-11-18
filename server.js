const express = require('express');
const path = require('path');

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const HOST = '0.0.0.0';

const PUBLIC_DIR = path.join(__dirname, 'public');
const D3_BUNDLE = path.join(__dirname, 'node_modules', 'd3', 'dist', 'd3.min.js');

app.get('/vendor/d3.min.js', (req, res) => {
  res.sendFile(D3_BUNDLE);
});

app.use(express.static(PUBLIC_DIR, {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.webmanifest')) {
      res.setHeader('Content-Type', 'application/manifest+json; charset=utf-8');
    } else if (filePath.endsWith(`${path.sep}sw.js`)) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    }
  }
}));

app.use((req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, 'index.html'));
});

app.listen(PORT, HOST, () => {
  console.log(`Kas Saku server listening on http://${HOST}:${PORT}`);
});
