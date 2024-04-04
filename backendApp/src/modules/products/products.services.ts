import { and, desc, eq, like, sql } from 'drizzle-orm'
import { db } from '../../db'
import { categories, products, productsHistory } from '../../db/schema'
import { ProductEditBody, ProductHistoryBody } from './products.schemas'

export const getProducts = async () => {
  const results = await db
    .select({
      id: products.id,
      code: products.code,
      name: products.name,
      category: categories.name,
      hasStock: products.hasStock,
      updateAt: products.updateAt,
    })
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
  return results
}

export const getProductHistory = async (id: number) => {
  const results = await db
    .select({
      id: productsHistory.id,
      code: productsHistory.code,
      name: productsHistory.name,
      category: categories.name,
      hasStock: productsHistory.hasStock,
      updateAt: productsHistory.updateAt,
    })
    .from(productsHistory)
    .innerJoin(categories, eq(productsHistory.categoryId, categories.id))
    .where(eq(productsHistory.productId, id))
    .orderBy(desc(productsHistory.updateAt))
  return results
}

export const getProductById = async (id: number) => {
  const result = await db
    .select({
      id: products.id,
      code: products.code,
      name: products.name,
      category: categories.name,
      hasStock: products.hasStock,
      updateAt: products.updateAt,
      createdAt: products.updateAt,
      categoryId: categories.id,
    })
    .from(products)
    .where(eq(products.id, id))
    .innerJoin(categories, eq(products.categoryId, categories.id))
  if (!result.length) {
    return null
  }
  const product = result[0]
  return product
}

export const getProductsByCode = async (code: string) => {
  const result = await db.select().from(products).where(eq(products.code, code))
  if (!result.length) {
    return null
  }
  return result
}

export const updateProduct = async (data: ProductEditBody) => {
  await db
    .update(products)
    .set({
      code: data.code,
      name: data.name,
      categoryId: data.categoryId,
      updateAt: sql`(strftime('%s', 'now'))`,
    })
    .where(eq(products.id, data.id))
}

export const insertHistoryProduct = async (data: ProductHistoryBody) => {
  await db.insert(productsHistory).values(data)
}

export const searchProducts = async (
  name: string,
  code: string,
  category: string,
  hasStock: boolean
) => {
  let query = db
    .select({
      id: products.id,
      code: products.code,
      name: products.name,
      category: sql<string | null>`${categories.name}`,
      hasStock: products.hasStock,
    })
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .$dynamic()

  const conditions = []

  if (category) {
    conditions.push(eq(categories.name, category))
  }

  if (name) {
    conditions.push(like(products.name, `%${name}%`))
  }

  if (code) {
    conditions.push(like(products.code, `%${code}%`))
  }
  console.log(typeof hasStock)
  if (typeof hasStock === 'boolean') {
    conditions.push(eq(products.hasStock, hasStock))
  }

  if (conditions.length > 0) {
    query = query.where(and(...conditions))
  }

  const results = await query
  return results
}
