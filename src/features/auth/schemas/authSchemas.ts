import { z } from 'zod'

const passwordSchema = z
  .string()
  .min(8, 'Password must contain at least 8 characters')
  .max(72, 'Password cannot exceed 72 characters')
  .regex(/[a-z]/, 'Add a lowercase letter')
  .regex(/[A-Z]/, 'Add an uppercase letter')
  .regex(/[0-9]/, 'Add a number')

export const loginSchema = z.object({
  email: z.string().trim().email('Enter a valid email address'),
  password: z.string().min(1, 'Enter your password'),
})

export const registerSchema = z.object({
  fullName: z.string().trim().min(2, 'Enter your full name').max(120),
  email: z.string().trim().email('Enter a valid email address'),
  password: passwordSchema,
  role: z.enum(['STUDENT', 'TEACHER']),
})

export type LoginFormValues = z.infer<typeof loginSchema>
export type RegisterFormValues = z.infer<typeof registerSchema>
