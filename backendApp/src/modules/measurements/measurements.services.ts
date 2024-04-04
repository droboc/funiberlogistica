import { eq } from 'drizzle-orm'
import { db } from '../../db'
import { CreateMeasurementBody } from './measurements.schemas'
import { measurements, productsMeasurements } from '../../db/schema'

export const createMeasurement = async (name: string) => {
  await db.insert(measurements).values({ name: name })
}

export const createProductMeasurement = async (
  data: CreateMeasurementBody,
  id: number
) => {
  await db.insert(productsMeasurements).values({
    measurementId: id,
    productId: data.productId,
    value: data.value.toLowerCase(),
  })
}

export const getMeasurementsByProductId = async (productId: number) => {
  const result = await db
    .select({
      id: productsMeasurements.measurementId,
      name: measurements.name,
      value: productsMeasurements.value,
      createAt: productsMeasurements.createdAt,
    })
    .from(productsMeasurements)
    .innerJoin(
      measurements,
      eq(productsMeasurements.measurementId, measurements.id)
    )
    .where(eq(productsMeasurements.productId, productId))
  return result
}

export const getMeasurementsByName = async (name: string) => {
  const result = await db
    .select({
      id: measurements.id,
      name: measurements.name,
    })
    .from(measurements)
    .where(eq(measurements.name, name.toLowerCase()))
  if (!result) {
    return null
  }
  return result[0]
}
