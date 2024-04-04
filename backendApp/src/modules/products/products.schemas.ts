import { Type, type Static } from '@sinclair/typebox'

export const productEditSchema = Type.Object({
  id: Type.Integer(),
  code: Type.String(),
  name: Type.String(),
  categoryId: Type.Integer(),
  hasStock: Type.Boolean(),
})

export const productHistorySchema = Type.Object({
  productId: Type.Integer(),
  code: Type.String(),
  name: Type.String(),
  categoryId: Type.Integer(),
  hasStock: Type.Boolean(),
  updateAt: Type.Date(),
})

export const productSearchSchema = Type.Object({
  code: Type.String(),
  name: Type.String(),
  category: Type.String(),
  hasStock: Type.Boolean(),
})

export type ProductEditBody = Static<typeof productEditSchema>
export type ProductHistoryBody = Static<typeof productHistorySchema>
export type ProductSearchBody = Static<typeof productSearchSchema>
