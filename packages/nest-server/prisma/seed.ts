import { PrismaClient, DeveloperAccount } from '@prisma/client'
const db = new PrismaClient()

async function seed() {
  await Promise.all(
    getTestUsers().map((user) => {
      return db.developerAccount.create({
        data: user,
      })
    }),
  )
}

seed()

function getTestUsers(): DeveloperAccount[] {
  return []
}
