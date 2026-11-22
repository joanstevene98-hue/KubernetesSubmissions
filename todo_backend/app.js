const http = require('http')
const { Pool } = require('pg')

const PORT = process.env.PORT
if (!PORT) throw new Error('Missing environment variable PORT')
const MAX_TODO_LENGTH = 140

const log = (message, fields = {}) => {
  console.log(JSON.stringify({ time: new Date().toISOString(), message, ...fields }))
}

// Connection settings come from PGHOST, PGUSER, PGPASSWORD, PGDATABASE env variables
const pool = new Pool()

const initDb = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS todos (
      id SERIAL PRIMARY KEY,
      text VARCHAR(140) NOT NULL,
      done BOOLEAN NOT NULL DEFAULT false
    )`)
}

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
  log('request', { method: req.method, url: req.url })
  try {
    if (req.method === 'GET' && req.url === '/todos') {
      const { rows } = await pool.query('SELECT id, text, done FROM todos ORDER BY id')
      return sendJson(res, 200, rows)
    }
    if (req.method === 'POST' && req.url === '/todos') {
      let text
      try {
        text = JSON.parse(await readBody(req)).text
      } catch {
        log('todo rejected', { reason: 'invalid JSON' })
        return sendJson(res, 400, { error: 'invalid JSON' })
      }
      if (typeof text !== 'string' || !text.trim()) {
        log('todo rejected', { reason: 'text is required' })
        return sendJson(res, 400, { error: 'text is required' })
      }
      if (text.trim().length > MAX_TODO_LENGTH) {
        log('todo rejected', { reason: 'too long', length: text.trim().length, todo: text })
        return sendJson(res, 400, { error: `todo can be at most ${MAX_TODO_LENGTH} characters` })
      }
      const { rows } = await pool.query(
        'INSERT INTO todos (text) VALUES ($1) RETURNING id, text, done',
        [text.trim()],
      )
      log('todo created', { todo: rows[0].text })
      return sendJson(res, 201, rows[0])
    }
    sendJson(res, 404, { error: 'not found' })
  } catch (error) {
    console.error(error)
    sendJson(res, 500, { error: 'internal server error' })
  }
})

const start = async () => {
  // The database may still be starting, so retry for a while
  for (let attempt = 1; ; attempt++) {
    try {
      await initDb()
      break
    } catch (error) {
      if (attempt >= 30) throw error
      console.log(`Database not ready (${error.message}), retrying...`)
      await new Promise((resolve) => setTimeout(resolve, 2000))
    }
  }
  server.listen(PORT, () => {
    console.log(`Server started in port ${PORT}`)
  })
}

start()
