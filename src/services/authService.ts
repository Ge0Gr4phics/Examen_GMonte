import { auth } from '../firebase/config'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'
import type { User } from 'firebase/auth'

export async function registrarUsuario(email: string, contrasena: string): Promise<User> {
  const credencial = await createUserWithEmailAndPassword(auth, email, contrasena)
  return credencial.user
}

export async function entrarUsuario(email: string, contrasena: string): Promise<User> {
  const credencial = await signInWithEmailAndPassword(auth, email, contrasena)
  return credencial.user
}

export async function salirUsuario(): Promise<void> {
  await signOut(auth)
}

// onAuthStateChanged devuelve la función que cancela la suscripción.
export function escucharSesion(callback: (usuario: User | null) => void): () => void {
  return onAuthStateChanged(auth, callback)
}

export function traducirErrorAuth(error: unknown): string {
  const codigo = (error as { code?: string } | null)?.code
  const mensajes: Record<string, string> = {
    'auth/invalid-email': 'El correo no tiene un formato válido.',
    'auth/email-already-in-use': 'Ya existe una cuenta con este correo.',
    'auth/weak-password': 'La contraseña es demasiado débil (mínimo 6 caracteres).',
    'auth/invalid-credential': 'Correo o contraseña incorrectos.',
    'auth/too-many-requests': 'Demasiados intentos. Espera unos minutos.',
    'auth/network-request-failed': 'Sin conexión. Revisa tu internet.',
  }
  return (codigo && mensajes[codigo]) || 'Ocurrió un error inesperado. Intenta de nuevo.'
}
