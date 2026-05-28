const fs = require('fs');
const http = require('http');
const path = require('path');

const port = Number(process.env.PORT || 3000);
const root = path.join(__dirname, 'build');

const types = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
};

http
  .createServer((req, res) => {
    const urlPath = decodeURIComponent(new URL(req.url, `http://localhost:${port}`).pathname);
    const requestedPath = path.normalize(path.join(root, urlPath));
    const safePath = requestedPath.startsWith(root) ? requestedPath : path.join(root, 'index.html');
    const filePath = fs.existsSync(safePath) && fs.statSync(safePath).isFile()
      ? safePath
      : path.join(root, 'index.html');

    res.setHeader('Content-Type', types[path.extname(filePath)] || 'application/octet-stream');
    fs.createReadStream(filePath)
      .on('error', () => {
        res.writeHead(500);
        res.end('Unable to read file');
      })
      .pipe(res);
  })
  .listen(port, () => {
    console.log(`Serving ${root} at http://localhost:${port}`);
  });
