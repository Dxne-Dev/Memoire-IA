import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import { PrivateRoute } from '@/components/PrivateRoute'

/* Pages */
import LoginPage    from '@/pages/LoginPage'
import RegisterPage from '@/pages/RegisterPage'
import AppLayout    from '@/layouts/AppLayout'
import Dashboard    from '@/pages/Dashboard'
import Projects     from '@/pages/Projects'
import Documents    from '@/pages/Documents'
import History      from '@/pages/History'
import NewStep1     from '@/pages/new/Step1Upload'
import NewStep2     from '@/pages/new/Step2Context'
import Workspace    from '@/pages/Workspace'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public */}
        <Route path="/login"    element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected */}
        <Route element={<PrivateRoute />}>
          <Route element={<AppLayout />}>
            <Route index                      element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard"          element={<Dashboard />} />
            <Route path="/projects"           element={<Projects />} />
            <Route path="/documents"          element={<Documents />} />
            <Route path="/history"            element={<History />} />
            <Route path="/new"                element={<NewStep1 />} />
            <Route path="/new/context"        element={<NewStep2 />} />
            <Route path="/workspace/:id"      element={<Workspace />} />
          </Route>
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  )
}
