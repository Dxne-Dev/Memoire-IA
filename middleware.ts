import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Liste des routes protégées
const protectedRoutes = ['/dashboard', '/profile', '/settings', '/documents', '/ai-analysis', '/history']

export function middleware(request: NextRequest) {
  // On vérifie la présence d'un cookie d'authentification (ex: auth_token)
  const token = request.cookies.get('auth_token')?.value

  // Si la route est protégée et pas de token, on redirige vers /login
  if (protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))) {
    if (!token) {
      const loginUrl = request.nextUrl.clone()
      loginUrl.pathname = '/login'
      loginUrl.search = ''
      return NextResponse.redirect(loginUrl)
    }
  }

  // Sinon, on laisse passer
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*', '/settings/:path*', '/documents/:path*', '/ai-analysis/:path*', '/history/:path*'],
}
