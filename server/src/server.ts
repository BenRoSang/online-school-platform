import 'dotenv/config'
import { createServer } from 'node:http'
import { createApp } from './app.js'
import { database } from './config/database.js'
import { getEnvironment } from './config/env.js'

const environment = getEnvironment()
const server = createServer(createApp())

server.listen(environment.PORT, () => {
  console.log(`API listening on http://localhost:${environment.PORT}`)
})

async function shutdown(signal: string) {
  console.log(`${signal} received, shutting down`)

  server.close(async (error) => {
    await database.$disconnect()

    if (error) {
      console.error(error)
      process.exit(1)
    }

    process.exit(0)
  })
}

process.on('SIGINT', () => void shutdown('SIGINT'))
process.on('SIGTERM', () => void shutdown('SIGTERM'))
