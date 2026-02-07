import { NextRequest, NextResponse } from 'next/server'
// import { prisma } from '@/lib/prisma' // Removed
import jwt from 'jsonwebtoken'

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('auth_token')?.value
    if (!token) {
      return NextResponse.json([], { status: 200 })
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }

    const { firestore } = await import('@/lib/firebase-admin');

    let snapshots;
    try {
      snapshots = await firestore.collection('documents')
        .where('user_id', '==', decoded.userId)
        .orderBy('upload_date', 'desc')
        .get();
    } catch (indexError: any) {
      if (indexError.message?.includes('index')) {
        console.warn('ATTENTION: Index Firestore manquant. Utilisez ce lien pour le créer:',
          'https://console.firebase.google.com/v1/r/project/memoire-ia-88600/firestore/indexes?create_composite=ClJwcm9qZWN0cy9tZW1vaXJlLWlhLTg4NjAwL2RhdGFiYXNlcy8oZGVmYXVsdCkvY29sbGVjdGlvbkdyb3Vwcy9kb2N1bWVudHMvaW5kZXhlcy9fEAEaCwoHdXNlcl9pZBABGg8KC3VwbG9hZF9kYXRlEAIaDAoIX19uYW1lX18QAg'
        );
        // Fallback: Récupération sans tri (le tri sera fait en mémoire)
        snapshots = await firestore.collection('documents')
          .where('user_id', '==', decoded.userId)
          .get();
      } else {
        throw indexError;
      }
    }

    let docs = snapshots.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        upload_date: (data.upload_date as any)?.toDate ? (data.upload_date as any).toDate() : data.upload_date
      };
    }) as any[];

    // Tri en mémoire si nécessaire (au cas où le orderBy a échoué)
    docs.sort((a, b) => {
      const dateA = new Date(a.upload_date).getTime();
      const dateB = new Date(b.upload_date).getTime();
      return dateB - dateA;
    });

    return NextResponse.json(docs)
  } catch (error) {
    console.error('Error fetching documents:', error);
    // Retourner un tableau vide en cas d'erreur ou si l'index n'existe pas encore
    return NextResponse.json([], { status: 200 })
  }
}
