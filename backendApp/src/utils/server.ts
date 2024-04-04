import fastify from 'fastify'
import { logger } from './logger'
import { userRoutes } from '../modules/users/users.routes'
import { productRoutes } from '../modules/products/products.routes'
import { measurementRoutes } from '../modules/measurements/measurements.routes'
import cors from '@fastify/cors'

export const buildServer = async () => {
  const app = fastify({
    logger,
  })

  //register plugins
  app.register(cors)

  //register routes
  app.register(userRoutes, { prefix: '/api/users' })
  app.register(productRoutes, { prefix: '/api/products' })
  app.register(measurementRoutes, { prefix: '/api/measurements' })

  await app.ready()

  return app
}
