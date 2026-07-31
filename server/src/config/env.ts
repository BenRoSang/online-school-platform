import { z } from 'zod'

const environmentSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65_535).default(5000),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN_DAYS: z.coerce.number().int().positive().default(7),
  CLIENT_URL: z.url(),
  FILE_STORAGE_PROVIDER: z
    .enum(['local', 'cloudinary', 'r2', 'backblaze', 'uploadcare'])
    .default('local'),
  MAX_PDF_SIZE_MB: z.coerce.number().positive().max(50).default(10),
  LOCAL_UPLOAD_DIRECTORY: z.string().min(1).default('uploads'),
})

export type Environment = z.infer<typeof environmentSchema>

let cachedEnvironment: Environment | undefined

export function parseEnvironment(input: NodeJS.ProcessEnv): Environment {
  const result = environmentSchema.safeParse(input)

  if (!result.success) {
    const details = result.error.issues
      .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      .join('; ')

    throw new Error(`Invalid server environment: ${details}`)
  }

  return result.data
}

export function getEnvironment(): Environment {
  cachedEnvironment ??= parseEnvironment(process.env)
  return cachedEnvironment
}
