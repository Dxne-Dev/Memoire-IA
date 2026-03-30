import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

export function PrivateRoute() {
  const { session, loading } = useAuth()

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-[#071510]">
      <div className="w-8 h-8 border-2 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin" />
    </div>
  )

  return session ? <Outlet /> : <Navigate to="/login" replace />
}
