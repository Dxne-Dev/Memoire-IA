import { NextResponse } from 'next/server'
import { getUserByEmail } from '@/lib/firestore-utils'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { serialize } from 'cookie'

export async function POST(req: Request) {
  const { email, password } = await req.json()
  if (!email || !password) {
    return NextResponse.json({ error: 'Email et mot de passe requis' }, { status: 400 })
  }

  const user = await getUserByEmail(email)
  if (!user) {
    return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 })
  }

  const valid = await bcrypt.compare(password, user.password_hash)
  if (!valid) {
    return NextResponse.json({ error: 'Mot de passe incorrect' }, { status: 401 })
  }

  // Génère un JWT
  const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET!, {
    expiresIn: '1h',
  })
  // Place le JWT dans un cookie httpOnly sécurisé
  const response = NextResponse.json({ user: { id: user.id, email: user.email } }, { status: 200 })
  response.headers.set('Set-Cookie', serialize('auth_token', token, {
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60, // 1h
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  }))
  return response
}
