import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
// import { prisma } from "@/lib/prisma" // Removed
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const session = await getServerSession()
  if (!session?.user?.id) return NextResponse.json({ error: "Non autorisé" }, { status: 401 })

  const { theme } = await req.json()
  if (!theme || (theme !== 'dark' && theme !== 'light')) {
    return NextResponse.json({ error: "Thème invalide" }, { status: 400 })
  }
  try {
    // Firestore ID est une chaine.
    const userId = session.user.id

    const { firestore } = await import('@/lib/firebase-admin');

    // Mise à jour directe
    await firestore.collection('users').doc(userId).update({
      theme_preference: theme
    })

    return NextResponse.json({ success: true })
  } catch (e: any) {
    console.error(e);
    // Gestion d'erreur explicite
    return NextResponse.json({ error: e.message || 'Erreur serveur lors de la mise à jour du thème.' }, { status: 500 })
  }
}
