import { Navigate } from 'react-router-dom'
import { adminApi } from '../services/adminApi'

interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const token = adminApi.getAuthToken()
  
  if (!token) {
    // Redirect to login if no token
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute
