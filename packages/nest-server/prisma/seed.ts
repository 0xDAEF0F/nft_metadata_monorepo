import { PrismaClient } from '@prisma/client'
const db = new PrismaClient()

async function seed() {
  await Promise.all(
    getUsers().map((user) => {
      return db.user.create({
        data: { username: user.username, password: user.password },
      })
    }),
  )
}

seed()

function getUsers() {
  return [
    {
      username: 'daemon',
      // hashed version of "twixrox"
      password: '$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1u',
    },
    {
      username: 'daemonTwo',
      password: '$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1u',
    },
  ]
}
