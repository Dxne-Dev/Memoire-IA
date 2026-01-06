import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const session = await getServerSession()
  if (!session?.user?.id) return NextResponse.json({ error: "Non autorisé" }, { status: 401 })

  const { theme } = await req.json()
  if (!theme || (theme !== 'dark' && theme !== 'light')) {
    return NextResponse.json({ error: "Thème invalide" }, { status: 400 })
  }
  try {
    // Cast l'id utilisateur en number pour Prisma
    const userId = Number(session.user.id)
    // Vérifie que le champ existe dans Prisma (sinon erreur explicite)
    const userModelFields = Object.keys(prisma.user.fields || {})
    if (!userModelFields.includes('theme_preference')) {
      return NextResponse.json({ error: "Champ 'theme_preference' manquant dans le modèle Prisma. Lancez la migration." }, { status: 500 })
    }
    await prisma.user.update({
      where: { id: userId },
      data: { theme_preference: theme },
    })
    return NextResponse.json({ success: true })
  } catch (e: any) {
    // Gestion d'erreur explicite
    return NextResponse.json({ error: e.message || 'Erreur serveur lors de la mise à jour du thème.' }, { status: 500 })
  }
}
