import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import GamePage from './pages/GamePage'
import NotFoundPage from './pages/NotFoundPage'
import { AuthProvider, useAuth } from './hooks/useAuth'

function HomeRedirect() {
  const { user, loading } = useAuth()

  if (loading) {
    return null
  }

  return <Navigate to={user ? '/game' : '/login'} replace />
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/game" element={<GamePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
