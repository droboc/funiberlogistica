import { Type, type Static } from '@sinclair/typebox'

export const loginSchema = Type.Object({
  user: Type.String(),
  password: Type.String(),
})

export type LoginBody = Static<typeof loginSchema>
