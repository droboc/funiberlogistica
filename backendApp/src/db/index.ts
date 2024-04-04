import { drizzle } from 'drizzle-orm/libsql'
import { createClient } from '@libsql/client'

const client = createClient({
  authToken:
    'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3MTIxOTQ2MjMsImlkIjoiZWMyZGM0ZTctOGJlMi00MWZmLWJmMzItZWJlNTNjNThhMmY2In0.rc2fPBdKuFb6_IzGn7PTlOMaX1Gn94bdKcQWrt4luR5mApUNfvyc-V0-BiYbzAylXMkoJ01DnCsMc3j6gPgUAA',
  url: 'libsql://funiber-droboc.turso.io',
})
export const db = drizzle(client)
