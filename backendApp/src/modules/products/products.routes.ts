import { FastifyInstance } from 'fastify'
import { productEditSchema, productSearchSchema } from './products.schemas'
import {
  getProducHandler,
  getProductHistoryHandler,
  getProductsHandler,
  searchHandler,
  updateProductHandler,
} from './products.controllers'

export const productRoutes = async (app: FastifyInstance) => {
  app.get('/', getProductsHandler)
  app.get('/:productId/history', getProductHistoryHandler)
  app.put('/', { schema: productEditSchema }, updateProductHandler)
  app.get('/search', searchHandler)
  app.get('/:productId', getProducHandler)
}
