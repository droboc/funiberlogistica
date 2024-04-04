import { db } from './db'
import { users } from './db/schema'
import { seed } from './db/seed'
import { buildServer } from './utils/server'
import { migrate } from 'drizzle-orm/libsql/migrator'

async function gracefulShutdown({
  app,
}: {
  app: Awaited<ReturnType<typeof buildServer>>
}) {
  await app.close()
}

async function main() {
  const app = await buildServer()
  const PORT: number = 5000
  const HOST: string = '0.0.0.0'

  await app.listen({
    port: PORT,
    host: HOST,
  })

  await migrate(db, {
    migrationsFolder: './migrations',
  })

  const usersExist = await db.select().from(users).limit(1)
  if (!usersExist.length) {
    await seed()
  }

  const signals = ['SIGINT', 'SIGTERM']
  for (const signal of signals) {
    process.on(signal, () => {
      gracefulShutdown({
        app,
      })
    })
  }
}

main()
