import { NextResponse } from 'next/server'
import { firestore } from '@/lib/firebase-admin'
import { getUserByEmail } from '@/lib/firestore-utils'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('Register body:', body);
    const { email, password, name } = body;
    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Email, mot de passe et nom complet requis' }, { status: 400 });
    }

    // Vérifie si l'utilisateur existe déjà via Firestore
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json({ error: 'Utilisateur déjà existant' }, { status: 409 });
    }

    const password_hash = await bcrypt.hash(password, 10);

    // Création dans Firestore
    const userRef = firestore.collection('users').doc(); // Auto-generated ID
    const userData = {
      email,
      password_hash,
      name,
      created_at: new Date(),
      is_admin: false,
      // theme_preference: 'light', // Optionnel par défaut
    };

    await userRef.set(userData);

    return NextResponse.json({ success: true, user: { id: userRef.id, email } }, { status: 201 });
  } catch (error) {
    console.error('Erreur inscription:', error);
    return NextResponse.json({ error: 'Erreur serveur lors de l\'inscription.' }, { status: 500 });
  }
}
