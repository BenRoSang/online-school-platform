import 'dotenv/config'
import { createServer } from 'node:http'
import { createApp } from './app.js'
import { disconnectDatabase } from './config/database.js'
import { getEnvironment } from './config/env.js'

const environment = getEnvironment()
const server = createServer(createApp())

server.on('error', (error) => {
  console.error('Failed to start API server', error)
  process.exitCode = 1
})

server.listen(environment.PORT, () => {
  console.log(`API listening on http://localhost:${environment.PORT}`)
})

async function shutdown(signal: string) {
  console.log(`${signal} received, shutting down`)

  server.close(async (error) => {
    await disconnectDatabase()

    if (error) {
      console.error(error)
      process.exit(1)
    }

    process.exit(0)
  })
}

process.on('SIGINT', () => void shutdown('SIGINT'))
process.on('SIGTERM', () => void shutdown('SIGTERM'))
