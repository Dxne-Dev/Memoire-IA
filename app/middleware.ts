import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Liste des routes protégées
const protectedRoutes = ['/dashboard', '/profile', '/settings', '/documents', '/ai-analysis', '/history']

// Redirection automatique de la landing page si session active
const landingRoutes = ['/', '']

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value
  const { pathname } = request.nextUrl

  // Si on accède à la landing page et qu'on a un token, on redirige vers /dashboard
  if (landingRoutes.includes(pathname) && token) {
    const dashboardUrl = request.nextUrl.clone()
    dashboardUrl.pathname = '/dashboard'
    dashboardUrl.search = ''
    return NextResponse.redirect(dashboardUrl)
  }

  // Si la route est protégée et pas de token, on redirige vers /login
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!token) {
      const loginUrl = request.nextUrl.clone()
      loginUrl.pathname = '/login'
      loginUrl.search = ''
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/settings/:path*',
    '/documents/:path*',
    '/ai-analysis/:path*',
    '/history/:path*',
    '/', // Ajoute la landing page à la surveillance du middleware
  ],
}
