const crypto = require('crypto')
const fs = require('fs')
const path = require('path')

const FILE_PATH = process.env.LOG_FILE || path.join(__dirname, 'files', 'log.txt')
const randomString = crypto.randomUUID()

fs.mkdirSync(path.dirname(FILE_PATH), { recursive: true })

const writeStatus = () => {
  const line = `${new Date().toISOString()}: ${randomString}`
  fs.appendFileSync(FILE_PATH, line + '\n')
  console.log(line)
}

writeStatus()
setInterval(writeStatus, 5000)
