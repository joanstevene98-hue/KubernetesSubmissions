const fs = require('fs')
const http = require('http')
const path = require('path')

const PORT = process.env.PORT || 3000
const FILE_PATH = process.env.LOG_FILE || path.join(__dirname, 'files', 'log.txt')
const PINGPONG_URL = process.env.PINGPONG_URL || 'http://ping-pong-svc/pings'
const INFO_FILE = process.env.INFO_FILE || path.join(__dirname, 'config', 'information.txt')
const MESSAGE = process.env.MESSAGE

const readFile = (file, fallback) => {
  try {
    return fs.readFileSync(file, 'utf8')
  } catch {
    return fallback
  }
}

const fetchPongs = async () => {
  try {
    const response = await fetch(PINGPONG_URL)
    const { pings } = await response.json()
    return pings
  } catch (error) {
    console.error('Could not reach ping-pong:', error.message)
    return 'unavailable'
  }
}

const status = async () => {
  const lines = readFile(FILE_PATH, '').trim().split('\n')
  const lastLine = lines[lines.length - 1] || 'No log yet'
  const pongs = await fetchPongs()
  const info = readFile(INFO_FILE, '').trim()
  return [
    `file content: ${info}`,
    `env variable: MESSAGE=${MESSAGE}`,
    `${lastLine}.`,
    `Ping / Pongs: ${pongs}`,
  ].join('\n')
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'GET' && (req.url === '/' || req.url === '/status')) {
    res.writeHead(200, { 'Content-Type': 'text/plain' })
    return res.end(await status())
  }
  res.writeHead(404)
  res.end('Not found')
})

server.listen(PORT, () => {
  console.log(`Server started in port ${PORT}`)
})
