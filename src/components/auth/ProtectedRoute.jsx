import { Navigate, useLocation } from 'react-router-dom'
import { selectIsAuthenticated, useAuthStore } from '../../stores/useAuthStore'

// Route guard for pages that need a logged-in user.
export function ProtectedRoute({ children }) {
  const location = useLocation()
  const isAuthenticated = useAuthStore(selectIsAuthenticated)

  if (!isAuthenticated) {
    // Remember the page they wanted so login can send them back to it.
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}
