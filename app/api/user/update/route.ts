import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('auth_token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number }
    const body = await req.json()
    // Limite les champs modifiables pour la sécurité
    const { email } = body
    const updated = await prisma.user.update({
      where: { id: decoded.userId },
      data: { email },
    })
    return NextResponse.json({ success: true, user: updated })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
