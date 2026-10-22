import { useState } from 'react'
import { View, Text, TextInput, Pressable, ActivityIndicator, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native'
import { useEquipo } from '../context/EquipoContext'
import { traducirErrorAuth } from '../services/authService'
import { verificarConfiguracion } from '../firebase/diagnostico'
import { C } from '../tema'

export default function LoginScreen() {
  const { entrar, registrar } = useEquipo()
  const [modo, setModo] = useState<'login' | 'registro'>('login')
  const [email, setEmail] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [diagnostico, setDiagnostico] = useState('')

  async function enviar() {
    if (!email.includes('@') || contrasena.length < 6) {
      setError('Escribe un correo válido y una contraseña de al menos 6 caracteres.')
      return
    }
    setError('')
    setEnviando(true)
    try {
      if (modo === 'registro') await registrar(email.trim(), contrasena)
      else await entrar(email.trim(), contrasena)
    } catch (e) {
      setError(traducirErrorAuth(e))
    } finally {
      setEnviando(false)
    }
  }

  function diagnosticar() {
    const r = verificarConfiguracion()
    setDiagnostico(r.ok ? `✅ Configuración completa (proyecto: ${r.proyecto})` : `❌ Faltan variables: ${r.faltantes.join(', ')}`)
  }

  return (
    <KeyboardAvoidingView style={estilos.pantalla} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Text style={estilos.titulo}>Equipo Pokémon</Text>
      <Text style={estilos.subtitulo}>{modo === 'login' ? 'Inicia sesión' : 'Crea tu cuenta'}</Text>
      <TextInput style={estilos.input} placeholder="Correo electrónico" placeholderTextColor={C.suave} autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} />
      <TextInput style={estilos.input} placeholder="Contraseña" placeholderTextColor={C.suave} secureTextEntry value={contrasena} onChangeText={setContrasena} />
      {error !== '' && <Text style={estilos.error}>{error}</Text>}
      <Pressable style={[estilos.boton, enviando && { opacity: 0.6 }]} onPress={enviar} disabled={enviando}>
        {enviando ? <ActivityIndicator color="#0b1120" /> : <Text style={estilos.textoBoton}>{modo === 'login' ? 'Entrar' : 'Crear cuenta'}</Text>}
      </Pressable>
      <Pressable style={estilos.enlace} onPress={() => { setModo(modo === 'login' ? 'registro' : 'login'); setError('') }}>
        <Text style={estilos.textoEnlace}>{modo === 'login' ? '¿Primera vez? Crea tu cuenta' : '¿Ya tienes cuenta? Inicia sesión'}</Text>
      </Pressable>
      <Pressable style={estilos.enlace} onPress={diagnosticar}>
        <Text style={estilos.textoEnlace}>Verificar configuración de Firebase</Text>
      </Pressable>
      {diagnostico !== '' && <Text style={estilos.diagnostico}>{diagnostico}</Text>}
    </KeyboardAvoidingView>
  )
}

const estilos = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: C.fondo, padding: 28, justifyContent: 'center', gap: 12 },
  titulo: { color: C.texto, fontSize: 28, fontWeight: '800', textAlign: 'center' },
  subtitulo: { color: C.suave, fontSize: 15, textAlign: 'center', marginBottom: 12 },
  input: { backgroundColor: C.tarjeta, borderWidth: 1, borderColor: C.borde, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 13, color: C.texto, fontSize: 15 },
  error: { color: C.error, fontSize: 13, textAlign: 'center' },
  boton: { backgroundColor: C.acento, borderRadius: 10, minHeight: 48, alignItems: 'center', justifyContent: 'center', marginTop: 6 },
  textoBoton: { color: '#0b1120', fontWeight: '800', fontSize: 15 },
  enlace: { minHeight: 44, alignItems: 'center', justifyContent: 'center' },
  textoEnlace: { color: C.acento, fontWeight: '600' },
  diagnostico: { color: C.suave, textAlign: 'center', fontSize: 13 },
})
