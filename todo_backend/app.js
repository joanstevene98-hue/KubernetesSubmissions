const http = require('http')

const PORT = process.env.PORT
if (!PORT) throw new Error('Missing environment variable PORT')

const todos = ['Learn JavaScript', 'Learn React', 'Build a project']

const readBody = (req) => new Promise((resolve, reject) => {
  let data = ''
  req.on('data', (chunk) => { data += chunk })
  req.on('end', () => resolve(data))
  req.on('error', reject)
})

const sendJson = (res, status, body) => {
  res.writeHead(status, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(body))
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'GET' && req.url === '/todos') {
    return sendJson(res, 200, todos)
  }
  if (req.method === 'POST' && req.url === '/todos') {
    try {
      const { text } = JSON.parse(await readBody(req))
      if (typeof text !== 'string' || !text.trim()) {
        return sendJson(res, 400, { error: 'text is required' })
      }
      todos.push(text.trim())
      return sendJson(res, 201, text.trim())
    } catch {
      return sendJson(res, 400, { error: 'invalid JSON' })
    }
  }
  sendJson(res, 404, { error: 'not found' })
})

server.listen(PORT, () => {
  console.log(`Server started in port ${PORT}`)
})
