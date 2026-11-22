const crypto = require('crypto')
const http = require('http')

const PORT = process.env.PORT || 3000
const randomString = crypto.randomUUID()

const status = () => `${new Date().toISOString()}: ${randomString}`

const printStatus = () => {
  console.log(status())
}

printStatus()
setInterval(printStatus, 5000)

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
