import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Проверяем localStorage при загрузке
    const savedUser = localStorage.getItem('currentUser')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (e) {
        console.error('Failed to parse user data:', e)
        localStorage.removeItem('currentUser')
      }
    }
    setLoading(false)
  }, [])

  const register = (username, password) => {
    // Валидация
    if (!username || username.trim().length < 3) {
      throw new Error('Имя пользователя должно содержать минимум 3 символа')
    }
    if (!password || password.length < 6) {
      throw new Error('Пароль должен содержать минимум 6 символов')
    }

    // Проверяем существующих пользователей
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    if (users.find(u => u.username === username.trim())) {
      throw new Error('Пользователь с таким именем уже существует')
    }

    // Создаем нового пользователя
    const newUser = {
      id: Date.now().toString(),
      username: username.trim(),
      password: btoa(password), // Простое "хеширование" для демо
      createdAt: new Date().toISOString()
    }

    users.push(newUser)
    localStorage.setItem('users', JSON.stringify(users))

    // Логиним пользователя
    const userWithoutPassword = { ...newUser }
    delete userWithoutPassword.password
    setUser(userWithoutPassword)
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword))

    return userWithoutPassword
  }

  const login = (username, password) => {
    // Валидация
    if (!username || !password) {
      throw new Error('Заполните все поля')
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const user = users.find(u => u.username === username.trim())

    if (!user) {
      throw new Error('Пользователь не найден')
    }

    if (user.password !== btoa(password)) {
      throw new Error('Неверный пароль')
    }

    const userWithoutPassword = { ...user }
    delete userWithoutPassword.password
    setUser(userWithoutPassword)
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword))

    return userWithoutPassword
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('currentUser')
  }

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
