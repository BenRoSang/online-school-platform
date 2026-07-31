import { z } from 'zod'

const passwordSchema = z
  .string()
  .min(8)
  .max(72)
  .regex(/[a-z]/, 'Password must include a lowercase letter')
  .regex(/[A-Z]/, 'Password must include an uppercase letter')
  .regex(/[0-9]/, 'Password must include a number')

const emailSchema = z.string().trim().toLowerCase().pipe(z.email().max(320))

export const registerRequestSchema = z.object({
  body: z.object({
    email: emailSchema,
    password: passwordSchema,
    fullName: z.string().trim().min(2).max(120),
    role: z.enum(['STUDENT', 'TEACHER']),
  }),
})

export const loginRequestSchema = z.object({
  body: z.object({
    email: emailSchema,
    password: z.string().min(1).max(72),
  }),
})

export type RegisterRequest = z.infer<typeof registerRequestSchema>
export type LoginRequest = z.infer<typeof loginRequestSchema>
