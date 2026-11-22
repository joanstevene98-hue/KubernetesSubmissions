const crypto = require('crypto')

const randomString = crypto.randomUUID()

const printStatus = () => {
  console.log(`${new Date().toISOString()}: ${randomString}`)
}

printStatus()
setInterval(printStatus, 5000)
