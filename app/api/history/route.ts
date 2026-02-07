import { NextRequest, NextResponse } from 'next/server'
import { firestore } from '@/lib/firebase-admin';
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    const userId = decoded.userId;

    let snapshots;
    try {
      snapshots = await firestore.collection('history')
        .where('user_id', '==', userId)
        .orderBy('created_at', 'desc')
        .get();
    } catch (indexError: any) {
      // If index is missing, fallback to raw fetch and sort in memory
      if (indexError.message?.includes('index')) {
        console.warn('History index missing, sorting in memory.');
        snapshots = await firestore.collection('history')
          .where('user_id', '==', userId)
          .get();
      } else {
        throw indexError;
      }
    }

    let history = snapshots.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        created_at: (data.created_at as any)?.toDate ? (data.created_at as any).toDate() : data.created_at
      };
    });

    // Tri manuel en mémoire au cas où l'index manquait
    history.sort((a: any, b: any) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return dateB - dateA;
    });

    return NextResponse.json(history)
  } catch (error) {
    console.error('History fetch error:', error);
    return NextResponse.json({ error: 'Error fetching history' }, { status: 500 });
  }
}
