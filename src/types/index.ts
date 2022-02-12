import { buildJsonSchemas } from 'fastify-zod'
import { User, Users } from './User'

export const { schemas, $ref } = buildJsonSchemas({
  User,
  Users,
})
