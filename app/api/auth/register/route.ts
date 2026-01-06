import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('Register body:', body);
    const { email, password, name } = body;
    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Email, mot de passe et nom complet requis' }, { status: 400 });
    }

    // Vérifie le modèle correct selon le schéma Prisma généré
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'Utilisateur déjà existant' }, { status: 409 });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password_hash,
        name, // Enregistre le nom complet
        created_at: new Date(),
      },
    });

    return NextResponse.json({ success: true, user: { id: user.id, email: user.email } }, { status: 201 });
  } catch (error) {
    console.error('Erreur inscription:', error);
    return NextResponse.json({ error: 'Erreur serveur lors de l\'inscription.' }, { status: 500 });
  }
}
