const http = require('http')

const PORT = process.env.PORT || 3000

const page = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>The project App</title>
  </head>
  <body>
    <h1>The project App</h1>
    <p>DevOps with Kubernetes 2026</p>
  </body>
</html>`

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' })
    return res.end(page)
  }
  res.writeHead(404)
  res.end('Not found')
})

server.listen(PORT, () => {
  console.log(`Server started in port ${PORT}`)
})
