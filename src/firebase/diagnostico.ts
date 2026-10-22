// Verifica que el archivo .env se cargó. No toca la red ni Firebase.
export function verificarConfiguracion(): { ok: boolean; faltantes: string[]; proyecto: string } {
  const valores: Record<string, string | undefined> = {
    EXPO_PUBLIC_FIREBASE_API_KEY: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    EXPO_PUBLIC_FIREBASE_PROJECT_ID: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    EXPO_PUBLIC_FIREBASE_APP_ID: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  }
  const faltantes = Object.keys(valores).filter((k) => !valores[k])
  return { ok: faltantes.length === 0, faltantes, proyecto: valores.EXPO_PUBLIC_FIREBASE_PROJECT_ID ?? '' }
}
