import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('auth_token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number }
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } })
    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 })
    }
    // Ajoute ici les stats/documents si tu veux les renvoyer aussi
    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name, // Ajout du nom
      created_at: user.created_at,
      is_admin: user.is_admin,
      // Ajoute d'autres champs du profil si besoin
    })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
