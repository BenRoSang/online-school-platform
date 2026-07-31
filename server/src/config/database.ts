import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../generated/prisma/client.ts'
import { getEnvironment } from './env.js'

let database: PrismaClient | undefined

export function getDatabase(): PrismaClient {
  if (!database) {
    const adapter = new PrismaPg({
      connectionString: getEnvironment().DATABASE_URL,
      connectionTimeoutMillis: 5_000,
      idleTimeoutMillis: 300_000,
    })

    database = new PrismaClient({ adapter })
  }

  return database
}

export async function disconnectDatabase(): Promise<void> {
  await database?.$disconnect()
}
