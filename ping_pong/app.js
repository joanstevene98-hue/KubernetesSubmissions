const fs = require('fs')
const http = require('http')
const path = require('path')

const PORT = process.env.PORT || 3000
const COUNTER_FILE = process.env.COUNTER_FILE || path.join(__dirname, 'files', 'pingpong.txt')

fs.mkdirSync(path.dirname(COUNTER_FILE), { recursive: true })

const readCounter = () => {
  try {
    return Number(fs.readFileSync(COUNTER_FILE, 'utf8')) || 0
  } catch {
    return 0
  }
}

let counter = readCounter()

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/pingpong') {
    const current = counter++
    fs.writeFileSync(COUNTER_FILE, String(counter))
    res.writeHead(200, { 'Content-Type': 'text/plain' })
    return res.end(`pong ${current}`)
  }
  res.writeHead(404)
  res.end('Not found')
})

server.listen(PORT, () => {
  console.log(`Server started in port ${PORT}`)
})
