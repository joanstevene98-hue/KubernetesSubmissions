const fs = require('fs')
const http = require('http')
const path = require('path')

const PORT = process.env.PORT || 3000
const FILE_PATH = process.env.LOG_FILE || path.join(__dirname, 'files', 'log.txt')

const readLog = () => {
  try {
    return fs.readFileSync(FILE_PATH, 'utf8')
  } catch {
    return 'No log yet'
  }
}

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/status') {
    res.writeHead(200, { 'Content-Type': 'text/plain' })
    return res.end(readLog())
  }
  res.writeHead(404)
  res.end('Not found')
})

server.listen(PORT, () => {
  console.log(`Server started in port ${PORT}`)
})
