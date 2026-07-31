import type { Role } from '../../generated/prisma/enums.ts'

declare global {
  namespace Express {
    interface Request {
      auth?: {
        userId: string
        role: Role
      }
    }
  }
}

export {}
