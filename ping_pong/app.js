const http = require('http')
const { Pool } = require('pg')

const PORT = process.env.PORT || 3000

// Connection settings come from PGHOST, PGUSER, PGPASSWORD, PGDATABASE env variables
const pool = new Pool()

const initDb = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS counter (
      id INTEGER PRIMARY KEY,
      value INTEGER NOT NULL
    )`)
  await pool.query('INSERT INTO counter (id, value) VALUES (1, 0) ON CONFLICT (id) DO NOTHING')
}

const increment = async () => {
  const { rows } = await pool.query('UPDATE counter SET value = value + 1 WHERE id = 1 RETURNING value')
  return rows[0].value - 1
}

const current = async () => {
  const { rows } = await pool.query('SELECT value FROM counter WHERE id = 1')
  return rows[0].value
}

const server = http.createServer(async (req, res) => {
  try {
    if (req.method === 'GET' && req.url === '/pingpong') {
      res.writeHead(200, { 'Content-Type': 'text/plain' })
      return res.end(`pong ${await increment()}`)
    }
    // GKE load balancer health check
    if (req.method === 'GET' && req.url === '/') {
      res.writeHead(200, { 'Content-Type': 'text/plain' })
      return res.end('ok')
    }
    if (req.method === 'GET' && req.url === '/pings') {
      res.writeHead(200, { 'Content-Type': 'application/json' })
      return res.end(JSON.stringify({ pings: await current() }))
    }
    res.writeHead(404)
    res.end('Not found')
  } catch (error) {
    console.error(error)
    res.writeHead(500)
    res.end('Internal server error')
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
