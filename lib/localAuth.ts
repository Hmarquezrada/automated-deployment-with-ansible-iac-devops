// Sistema de autenticación local simple
export interface LocalUser {
  id: string
  email: string
  name: string
  role: string
}

export interface LocalSession {
  user: LocalUser
  accessToken: string
  expiresAt: number
}

// Credenciales hardcodeadas para pruebas
const HARDCODED_CREDENTIALS = {
  email: 'admin@admin.com',
  password: 'admin',
  user: {
    id: '1',
    email: 'admin@admin.com',
    name: 'Administrador',
    role: 'admin'
  }
}

// Generar un token simple
function generateToken(): string {
  return 'local_token_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now()
}

// Verificar credenciales
export function verifyCredentials(email: string, password: string): boolean {
  return email === HARDCODED_CREDENTIALS.email && password === HARDCODED_CREDENTIALS.password
}

// Iniciar sesión
export function signInLocal(email: string, password: string): LocalSession | null {
  if (verifyCredentials(email, password)) {
    const expiresAt = Date.now() + (24 * 60 * 60 * 1000) // 24 horas
    
    return {
      user: HARDCODED_CREDENTIALS.user,
      accessToken: generateToken(),
      expiresAt
    }
  }
  return null
}

// Verificar si la sesión es válida
export function isSessionValid(session: LocalSession | null): boolean {
  if (!session) return false
  return Date.now() < session.expiresAt
}

// Obtener usuario de la sesión
export function getUserFromSession(session: LocalSession | null): LocalUser | null {
  if (isSessionValid(session) && session) {
    return session.user
  }
  return null
}
