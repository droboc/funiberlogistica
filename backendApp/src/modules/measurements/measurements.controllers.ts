import { FastifyReply, FastifyRequest } from 'fastify'
import { CreateMeasurementBody } from './measurements.schemas'
import {
  createMeasurement,
  createProductMeasurement,
  getMeasurementsByName,
  getMeasurementsByProductId,
} from './measurements.services'

export const createMeasurmentHandler = async (
  request: FastifyRequest<{ Body: CreateMeasurementBody }>,
  reply: FastifyReply
) => {
  const { name, productId } = request.body
  try {
    const measurements = await getMeasurementsByProductId(productId)

    const measurement = await getMeasurementsByName(name)
    if (!measurement) {
      await createMeasurement(name)
      const measurement = await getMeasurementsByName(name)
      if (measurements.length > 0) {
        for (const m of measurements) {
          if (m.id === measurement?.id) {
            return reply
              .code(422)
              .send(`${name} already exists for this product`)
          }
        }
      }
      await createProductMeasurement(request.body, measurement?.id!)
      return reply.code(201).send('Measurement created')
    }

    if (measurements.length > 0) {
      for (const m of measurements) {
        if (m.id === measurement?.id) {
          return reply.code(422).send(`${name} already exists for this product`)
        }
      }
    }
    await createProductMeasurement(request.body, measurement?.id!)
    return reply.code(201).send('Measurement created')
  } catch (e) {
    return reply.code(500).send(e)
  }
}

export const getMeasurementByProductId = async (
  request: FastifyRequest<{ Params: { productId: string } }>,
  reply: FastifyReply
) => {
  const { productId } = request.params

  const measurements = await getMeasurementsByProductId(Number(productId))
  return measurements
}
