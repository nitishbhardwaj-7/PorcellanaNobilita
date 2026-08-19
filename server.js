const { createServer } = require('http');
const next = require('next');

const port = parseInt(process.env.PORT, 10) || 3001;
const dev = process.env.NODE_ENV !== 'production';

const app = next({ dev, dir: __dirname });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => handle(req, res)).listen(port, '127.0.0.1', () => {
    console.log(`Nobilita Next.js app listening on 127.0.0.1:${port}`);
  });
});
