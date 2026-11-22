const fs = require('fs')
const http = require('http')
const path = require('path')

const PORT = process.env.PORT || 3000
const FILE_PATH = process.env.LOG_FILE || path.join(__dirname, 'files', 'log.txt')
const COUNTER_FILE = process.env.COUNTER_FILE || path.join(__dirname, 'files', 'pingpong.txt')

const readFile = (file, fallback) => {
  try {
    return fs.readFileSync(file, 'utf8')
  } catch {
    return fallback
  }
}

const status = () => {
  const lines = readFile(FILE_PATH, '').trim().split('\n')
  const lastLine = lines[lines.length - 1] || 'No log yet'
  const pongs = Number(readFile(COUNTER_FILE, '0')) || 0
  return `${lastLine}.\nPing / Pongs: ${pongs}`
}

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/status') {
    res.writeHead(200, { 'Content-Type': 'text/plain' })
    return res.end(status())
  }
  res.writeHead(404)
  res.end('Not found')
})

server.listen(PORT, () => {
  console.log(`Server started in port ${PORT}`)
})
