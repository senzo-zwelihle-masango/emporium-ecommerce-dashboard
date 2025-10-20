import z from 'zod'

export const signUpFormSchema = z.object({
  username: z.string().min(3),
  email: z.email(),
  password: z.string().min(8),
})
