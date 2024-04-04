import { Type, type Static } from '@sinclair/typebox'

export const createMeasurementSchema = Type.Object({
  name: Type.String(),
  productId: Type.Integer(),
  value: Type.String(),
})

export type CreateMeasurementBody = Static<typeof createMeasurementSchema>
