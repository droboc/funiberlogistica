import { FastifyInstance } from 'fastify'
import { createMeasurementSchema } from './measurements.schemas'
import {
  createMeasurmentHandler,
  getMeasurementByProductId,
} from './measurements.controllers'

export const measurementRoutes = async (app: FastifyInstance) => {
  app.post('/', { schema: createMeasurementSchema }, createMeasurmentHandler)
  app.get('/:productId', getMeasurementByProductId)
}
