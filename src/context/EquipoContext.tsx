import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { escucharSesion, registrarUsuario, entrarUsuario, salirUsuario } from '../services/authService'
import { obtenerEquipo, agregarMiembro, actualizarRol, quitarMiembro, sembrarEquipo } from '../services/equipoService'
import type { MiembroEquipo, PokemonDetalle, Rol, UsuarioActual } from '../types'

function claveCache(uid: string): string {
  return `@equipo_cache:${uid}`
}

async function guardarCache(uid: string, lista: MiembroEquipo[]): Promise<void> {
  await AsyncStorage.setItem(claveCache(uid), JSON.stringify(lista))
}

async function leerCache(uid: string): Promise<MiembroEquipo[]> {
  try {
    const crudo = await AsyncStorage.getItem(claveCache(uid))
    if (!crudo) return []
    const datos = JSON.parse(crudo)
    return Array.isArray(datos) ? datos : []
  } catch {
    await AsyncStorage.removeItem(claveCache(uid))
    return []
  }
}

interface ValorContexto {
  usuario: UsuarioActual | null
  cargandoAuth: boolean
  equipo: MiembroEquipo[]
  cargandoEquipo: boolean
  errorEquipo: string
  registrar: (email: string, contrasena: string) => Promise<void>
  entrar: (email: string, contrasena: string) => Promise<void>
  salir: () => Promise<void>
  cargarEquipo: () => Promise<void>
  agregar: (pokemon: PokemonDetalle) => Promise<'agregado' | 'duplicado'>
  quitar: (id: string) => Promise<void>
  cambiarRol: (id: string, rol: Rol) => Promise<void>
  sembrar: () => Promise<void>
}

const EquipoContext = createContext<ValorContexto | null>(null)

export function EquipoProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<UsuarioActual | null>(null)
  const [cargandoAuth, setCargandoAuth] = useState(true)
  const [equipo, setEquipo] = useState<MiembroEquipo[]>([])
  const [cargandoEquipo, setCargandoEquipo] = useState(false)
  const [errorEquipo, setErrorEquipo] = useState('')

  // Una sola suscripción a la sesión de Firebase; la función de limpieza la cancela al desmontar.
  useEffect(() => {
    const cancelar = escucharSesion((u) => {
      setUsuario(u ? { uid: u.uid, email: u.email ?? '' } : null)
      if (!u) setEquipo([])
      setCargandoAuth(false)
    })
    return cancelar
  }, [])

  // Al haber usuario: primero se muestra la caché y luego se pide el equipo a Firestore.
  useEffect(() => {
    if (!usuario) return
    const uid = usuario.uid
    async function iniciar() {
      const cache = await leerCache(uid)
      setEquipo(cache)
      await cargarEquipo(uid)
    }
    iniciar()
  }, [usuario?.uid])

  function uidActual(): string {
    if (!usuario) throw new Error('No hay sesión')
    return usuario.uid
  }

  async function cargarEquipo(uid: string = uidActual()): Promise<void> {
    setCargandoEquipo(true)
    setErrorEquipo('')
    try {
      const datos = await obtenerEquipo(uid)
      setEquipo(datos)
      await guardarCache(uid, datos)
    } catch (e) {
      setErrorEquipo('No se pudo cargar tu equipo. Revisa tu conexión y las reglas de Firestore.')
    } finally {
      setCargandoEquipo(false)
    }
  }

  async function agregar(pokemon: PokemonDetalle): Promise<'agregado' | 'duplicado'> {
    if (equipo.some((m) => m.pokemonId === pokemon.id)) return 'duplicado'
    const nuevo = await agregarMiembro(uidActual(), pokemon)
    const lista = [...equipo, nuevo]
    setEquipo(lista)
    await guardarCache(uidActual(), lista)
    return 'agregado'
  }

  async function quitar(id: string): Promise<void> {
    await quitarMiembro(uidActual(), id)
    const lista = equipo.filter((m) => m.id !== id)
    setEquipo(lista)
    await guardarCache(uidActual(), lista)
  }

  async function cambiarRol(id: string, rol: Rol): Promise<void> {
    const lista = equipo.map((m) => (m.id === id ? { ...m, rol } : m))
    setEquipo(lista)
    await guardarCache(uidActual(), lista)
    await actualizarRol(uidActual(), id, rol)
  }

  async function sembrar(): Promise<void> {
    await sembrarEquipo(uidActual())
    await cargarEquipo()
  }

  async function registrar(email: string, contrasena: string): Promise<void> {
    await registrarUsuario(email, contrasena)
  }

  async function entrar(email: string, contrasena: string): Promise<void> {
    await entrarUsuario(email, contrasena)
  }

  async function salir(): Promise<void> {
    if (usuario) await AsyncStorage.removeItem(claveCache(usuario.uid))
    setEquipo([])
    await salirUsuario()
  }

  return (
    <EquipoContext.Provider
      value={{ usuario, cargandoAuth, equipo, cargandoEquipo, errorEquipo, registrar, entrar, salir, cargarEquipo, agregar, quitar, cambiarRol, sembrar }}
    >
      {children}
    </EquipoContext.Provider>
  )
}

export function useEquipo(): ValorContexto {
  const valor = useContext(EquipoContext)
  if (!valor) throw new Error('useEquipo debe usarse dentro de EquipoProvider')
  return valor
}
