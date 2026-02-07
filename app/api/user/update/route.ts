import { NextRequest, NextResponse } from 'next/server'
// import { prisma } from '@/lib/prisma' // Removed
import jwt from 'jsonwebtoken'

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('auth_token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }
    const body = await req.json()
    // Limite les champs modifiables pour la sécurité
    const { email } = body;

    const { firestore } = await import('@/lib/firebase-admin');

    await firestore.collection('users').doc(decoded.userId).update({
      email
    });

    // Pour renvoyer l'objet à jour, on le relit ou on construit une réponse partielle
    // Firestore update ne retourne pas le doc.
    return NextResponse.json({ success: true, user: { id: decoded.userId, email } })
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
