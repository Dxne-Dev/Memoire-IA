import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function logAction(user_id: number, action: string, details?: string) {
  return prisma.history.create({
    data: {
      user_id,
      action,
      details,
      created_at: new Date(),
    },
  })
}
