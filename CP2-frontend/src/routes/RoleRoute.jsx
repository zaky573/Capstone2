import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Loading from '../components/common/Loading'

export default function RoleRoute({ role, children }) {
  const { user, loading } = useAuth()

  if (loading) return <Loading fullScreen />
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== role) return <Navigate to={`/${user.role}`} replace />

  return children
}
