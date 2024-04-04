import { FastifyReply, FastifyRequest } from 'fastify'
import {
  getProductsByCode,
  getProductById,
  getProducts,
  updateProduct,
  insertHistoryProduct,
  getProductHistory,
  searchProducts,
} from './products.services'
import { ProductEditBody, ProductSearchBody } from './products.schemas'

export const getProductsHandler = async () => {
  const products = await getProducts()
  return products
}

export const getProductHistoryHandler = async (
  request: FastifyRequest<{ Params: { productId: string } }>,
  reply: FastifyReply
) => {
  const { productId } = request.params

  const productHistory = await getProductHistory(Number(productId))

  return productHistory
}

export const getProducHandler = async (
  request: FastifyRequest<{ Params: { productId: string } }>,
  reply: FastifyReply
) => {
  const { productId } = request.params

  const product = await getProductById(Number(productId))

  return product
}

export const updateProductHandler = async (
  request: FastifyRequest<{ Body: ProductEditBody }>,
  reply: FastifyReply
) => {
  const { id, code, name, categoryId, hasStock } = request.body

  const productsByCode = await getProductsByCode(code)

  if (productsByCode) {
    if (productsByCode[0]?.id != id)
      return reply.code(409).send({ message: 'Product code conflict' })
  }

  const product = await getProductById(id)

  if (!product) {
    return reply.code(400).send({ message: 'Invalid product id' })
  }

  let editProduct = {
    id: product.id,
    code: product.code,
    categoryId: product.categoryId!,
    name: product.name,
    hasStock: hasStock,
  }
  await insertHistoryProduct({
    categoryId: product.categoryId!,
    productId: product.id,
    code: product.code,
    name: product.name,
    hasStock: product.hasStock,
    updateAt: product.updateAt!,
  })

  if (name) {
    editProduct.name = name
  }
  if (categoryId) {
    editProduct.categoryId = categoryId
  }
  if (code) {
    editProduct.code = code
  }

  await updateProduct(editProduct)
}

export const searchHandler = async (
  request: FastifyRequest<{ Querystring: ProductSearchBody }>,
  reply: FastifyReply
) => {
  const { code, name, category } = request.query
  let hasStock = request.query.hasStock

  hasStock =
    typeof hasStock === 'string'
      ? hasStock === 'true'
        ? true
        : hasStock === 'false'
        ? false
        : hasStock
      : hasStock

  console.log('hasStock final', hasStock)
  const products = await searchProducts(name, code, category, hasStock)

  return products
}
