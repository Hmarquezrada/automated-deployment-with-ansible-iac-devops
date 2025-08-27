'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { LocalUser, LocalSession, isSessionValid, getUserFromSession } from '@/lib/localAuth'

interface AuthContextType {
  user: LocalUser | null
  loading: boolean
  session: LocalSession | null
  setSession: (session: LocalSession | null) => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  session: null,
  setSession: () => {},
})

export function useAuthContext() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<LocalUser | null>(null)
  const [session, setSession] = useState<LocalSession | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar si hay una sesión guardada en localStorage
    const savedSession = localStorage.getItem('localAuthSession')
    if (savedSession) {
      try {
        const parsedSession: LocalSession = JSON.parse(savedSession)
        if (isSessionValid(parsedSession)) {
          setSession(parsedSession)
          setUser(parsedSession.user)
        } else {
          // Sesión expirada, limpiar
          localStorage.removeItem('localAuthSession')
        }
      } catch (error) {
        console.error('Error parsing saved session:', error)
        localStorage.removeItem('localAuthSession')
      }
    }
    setLoading(false)
  }, [])

  // Actualizar usuario cuando cambie la sesión
  useEffect(() => {
    if (session) {
      setUser(getUserFromSession(session))
      // Guardar en localStorage
      localStorage.setItem('localAuthSession', JSON.stringify(session))
    } else {
      setUser(null)
      localStorage.removeItem('localAuthSession')
    }
  }, [session])

  return (
    <AuthContext.Provider value={{ user, loading, session, setSession }}>
      {children}
    </AuthContext.Provider>
  )
}