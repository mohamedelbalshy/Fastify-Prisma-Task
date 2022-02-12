import { z } from 'zod'

export const User = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  preferences: z.string().array().optional(),
})

export const Users = z.array(User)

export type User = z.infer<typeof User>
