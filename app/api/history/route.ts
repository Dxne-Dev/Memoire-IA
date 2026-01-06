import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(req: NextRequest) {
  // À adapter selon ton système d'auth
  // Ici on suppose que session.user.id existe
  const session = await getServerSession()
  if (!session?.user?.id) return new Response('Unauthorized', { status: 401 })

  // Convertir l'ID utilisateur (string) en nombre attendu par Prisma (Int)
  const userId = Number(session.user.id)
  if (Number.isNaN(userId)) {
    return new Response('Invalid user id', { status: 400 })
  }

  const history = await prisma.history.findMany({
    where: { user_id: userId },
    orderBy: { created_at: 'desc' },
    take: 100,
  })
  return Response.json(history)
}
