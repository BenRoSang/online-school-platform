import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../generated/prisma/client.ts'
import { getEnvironment } from './env.js'

const adapter = new PrismaPg({
  connectionString: getEnvironment().DATABASE_URL,
  connectionTimeoutMillis: 5_000,
  idleTimeoutMillis: 300_000,
})

export const database = new PrismaClient({ adapter })
