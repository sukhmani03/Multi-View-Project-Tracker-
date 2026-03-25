const http = require('node:http')
const fs = require('node:fs')
const path = require('node:path')

const root = path.join(__dirname, 'dist')
const port = 4173

const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.json': 'application/json; charset=utf-8',
}

const server = http.createServer((request, response) => {
  const requestUrl = new URL(request.url || '/', `http://${request.headers.host}`)
  const pathname = requestUrl.pathname === '/' ? '/index.html' : requestUrl.pathname
  const filePath = path.join(root, pathname)
  const safePath = path.normalize(filePath)

  if (!safePath.startsWith(root)) {
    response.writeHead(403)
    response.end('Forbidden')
    return
  }

  fs.readFile(safePath, (error, file) => {
    if (error) {
      response.writeHead(404)
      response.end('Not found')
      return
    }

    const ext = path.extname(safePath)
    response.writeHead(200, {
      'Content-Type': mimeTypes[ext] || 'application/octet-stream',
      'Cache-Control': 'no-cache',
    })
    response.end(file)
  })
})

server.listen(port, '127.0.0.1', () => {
  console.log(`Static server running at http://127.0.0.1:${port}`)
})
