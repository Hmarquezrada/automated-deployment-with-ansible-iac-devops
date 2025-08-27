'use client'

import { useAuthContext } from '@/components/AuthProvider'
import { signInLocal } from '@/lib/localAuth'
import { useRouter } from 'next/navigation'

export function useAuth() {
  const { user, loading, setSession } = useAuthContext()
  const router = useRouter()

  const signIn = async (email: string, password: string) => {
    try {
      const session = signInLocal(email, password)
      
      if (session) {
        setSession(session)
        router.push('/panel')
        return { data: { user: session.user }, error: null }
      } else {
        return { data: null, error: new Error('Credenciales inválidas') }
      }
    } catch (error) {
      return { data: null, error: error instanceof Error ? error : new Error('Error de autenticación') }
    }
  }

  const signOut = async () => {
    try {
      setSession(null)
      router.push('/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return {
    user,
    loading,
    signIn,
    signOut,
  }
}
