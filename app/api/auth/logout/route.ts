import { NextResponse } from 'next/server'
import { serialize } from 'cookie'

export async function POST() {
  // Supprime le cookie auth_token
  const response = NextResponse.json({ success: true })
  response.headers.set('Set-Cookie', serialize('auth_token', '', {
    httpOnly: true,
    path: '/',
    maxAge: 0,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  }))
  return response
}
