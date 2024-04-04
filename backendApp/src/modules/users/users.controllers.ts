import { FastifyReply, FastifyRequest } from 'fastify'
import { LoginBody } from './users.schemas'
import { findUserByUsername } from './users.services'

export const loginHandler = async (
  request: FastifyRequest<{ Body: LoginBody }>,
  reply: FastifyReply
) => {
  const { user, password } = request.body

  const userAccount = await findUserByUsername(user)

  if (!userAccount) {
    return reply.code(400).send({ message: 'Invalid user o password' })
  }

  const correctPassword = password === userAccount.password!

  if (!correctPassword) {
    return reply.code(400).send({ message: 'Invalid user o password' })
  }
  return userAccount.user
}
