import { fastify } from 'fastify'
import { z } from 'zod'
import cors from 'fastify-cors'
import helmet from 'fastify-helmet'
import swagger from 'fastify-swagger'
import { withRefResolver } from 'fastify-zod'
import { isDev, envs } from './helpers/utils'
import { router } from './routes'

import { schemas } from './types'

const app = fastify({
  logger: { level: isDev() ? 'info' : 'warn' },
})

for (const schema of schemas) {
  app.addSchema(schema)
}

app.register(
  swagger,
  withRefResolver({
    routePrefix: `/docs`,
    exposeRoute: true,
    staticCSP: true,
    swagger: {
      info: {
        title: `Zod Fastify Task Server`,
        description: `API for Zod Fastify Task Server`,
        version: `0.0.0`,
      },
      tags: [{ name: 'user', description: 'User related end-points' }],
      securityDefinitions: {
        apiKey: {
          type: 'apiKey',
          name: 'authorization',
          in: 'header',
        },
      },
    },
  })
)

app.register(helmet)
app.register(cors, { credentials: true, origin: envs.CORS_HOST })
app.register(router)

export { app }
