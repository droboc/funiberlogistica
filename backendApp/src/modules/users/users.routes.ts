import { FastifyInstance } from 'fastify'
import { loginSchema } from './users.schemas'
import { loginHandler } from './users.controllers'

export const userRoutes = async (app: FastifyInstance) => {
  app.post('/login', { schema: loginSchema }, loginHandler)
}
