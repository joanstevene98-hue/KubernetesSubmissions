const fs = require('fs')
const http = require('http')
const path = require('path')

const PORT = process.env.PORT || 3000
const IMAGE_DIR = process.env.IMAGE_DIR || path.join(__dirname, 'files')
const IMAGE_URL = process.env.IMAGE_URL || 'https://picsum.photos/1200'
const IMAGE_TTL_MS = 10 * 60 * 1000

const imagePath = path.join(IMAGE_DIR, 'image.jpg')
const metaPath = path.join(IMAGE_DIR, 'image.json')

fs.mkdirSync(IMAGE_DIR, { recursive: true })

const readMeta = () => {
  try {
    return JSON.parse(fs.readFileSync(metaPath, 'utf8'))
  } catch {
    return null
  }
}

const writeMeta = (meta) => fs.writeFileSync(metaPath, JSON.stringify(meta))

const fetchImage = async () => {
  const response = await fetch(IMAGE_URL)
  if (!response.ok) throw new Error(`Image fetch failed: ${response.status}`)
  const buffer = Buffer.from(await response.arrayBuffer())
  fs.writeFileSync(imagePath, buffer)
  writeMeta({ fetchedAt: Date.now(), servedAfterExpiry: false })
  console.log('Fetched a new image')
}

// The image stays the same for 10 minutes. After that the old image is
// served once more, and the next request gets a new one.
const ensureImage = async () => {
  const meta = readMeta()
  if (!meta || !fs.existsSync(imagePath)) return fetchImage()

  const expired = Date.now() - meta.fetchedAt > IMAGE_TTL_MS
  if (!expired) return
  if (!meta.servedAfterExpiry) return writeMeta({ ...meta, servedAfterExpiry: true })
  return fetchImage()
}

const page = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>The project App</title>
  </head>
  <body>
    <h1>The project App</h1>
    <img src="/image" alt="Random image" style="max-width: 400px">
    <p>DevOps with Kubernetes 2026</p>
  </body>
</html>`

const server = http.createServer(async (req, res) => {
  try {
    if (req.method === 'GET' && req.url === '/') {
      await ensureImage()
      res.writeHead(200, { 'Content-Type': 'text/html' })
      return res.end(page)
    }
    if (req.method === 'GET' && req.url === '/image') {
      if (!fs.existsSync(imagePath)) await fetchImage()
      res.writeHead(200, { 'Content-Type': 'image/jpeg' })
      return fs.createReadStream(imagePath).pipe(res)
    }
    // For testing that the cached image survives a container crash
    if (req.method === 'GET' && req.url === '/shutdown') {
      res.end('Shutting down')
      return setTimeout(() => process.exit(1), 100)
    }
    res.writeHead(404)
    res.end('Not found')
  } catch (error) {
    console.error(error)
    res.writeHead(500)
    res.end('Internal server error')
  }
})

server.listen(PORT, () => {
  console.log(`Server started in port ${PORT}`)
})
