import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@app/providers/auth/use-auth'
import { Loader } from '@shared/ui/loader'

export function ProtectedRoute() {
  const location = useLocation()
  const { isAuthenticated, isReady } = useAuth()

  if (!isReady) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader label="Loading access..." />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate replace state={{ from: location }} to="/sign-in" />
  }

  return <Outlet />
}
