import { eq } from 'drizzle-orm'
import { db } from '../../db'
import { users } from '../../db/schema'

export const findUserByUsername = async (username: string) => {
  const result = await db.select().from(users).where(eq(users.user, username))
  if (!result.length) {
    return null
  }
  const user = result[0]
  return user
}
