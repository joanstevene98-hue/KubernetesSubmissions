const http = require('http')

const PORT = process.env.PORT || 3000

let counter = 0

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/pingpong') {
    res.writeHead(200, { 'Content-Type': 'text/plain' })
    return res.end(`pong ${counter++}`)
  }
  if (req.method === 'GET' && req.url === '/pings') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    return res.end(JSON.stringify({ pings: counter }))
  }
  res.writeHead(404)
  res.end('Not found')
})

server.listen(PORT, () => {
  console.log(`Server started in port ${PORT}`)
})
