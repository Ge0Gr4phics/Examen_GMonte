import { useEffect, useState } from 'react'
import { View, Text, Image, Pressable, ActivityIndicator, StyleSheet } from 'react-native'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { obtenerDetalle } from '../services/pokeService'
import { useEquipo } from '../context/EquipoContext'
import type { EstadoPeticion, PokemonDetalle, RootStackParamList } from '../types'
import { C } from '../tema'

type Props = NativeStackScreenProps<RootStackParamList, 'Detalle'>

export default function DetalleScreen({ route, navigation }: Props) {
  const { nombre } = route.params
  const { agregar } = useEquipo()
  const [estado, setEstado] = useState<EstadoPeticion<PokemonDetalle>>({ tipo: 'cargando' })
  const [aviso, setAviso] = useState('')

  useEffect(() => {
    let activo = true
    obtenerDetalle(nombre)
      .then((datos) => { if (activo) setEstado({ tipo: 'exito', datos }) })
      .catch(() => { if (activo) setEstado({ tipo: 'error', mensaje: 'No se pudo cargar este Pokémon.' }) })
    return () => { activo = false }
  }, [nombre])

  async function agregarAlEquipo(datos: PokemonDetalle) {
    try {
      const r = await agregar(datos)
      setAviso(r === 'agregado' ? '✅ Agregado a tu equipo' : 'Ya está en tu equipo')
    } catch {
      setAviso('No se pudo agregar. Revisa tu conexión.')
    }
  }

  return (
    <View style={estilos.pantalla}>
      <Pressable onPress={() => navigation.goBack()} style={estilos.volver}><Text style={estilos.textoVolver}>← Volver</Text></Pressable>
      {estado.tipo === 'cargando' && <ActivityIndicator size="large" color={C.acento} style={{ marginTop: 40 }} />}
      {estado.tipo === 'error' && <Text style={estilos.error}>{estado.mensaje}</Text>}
      {estado.tipo === 'exito' && (
        <View style={estilos.contenido}>
          {estado.datos.sprite ? <Image source={{ uri: estado.datos.sprite }} style={estilos.imagen} /> : <Text style={estilos.placeholder}>❔</Text>}
          <Text style={estilos.nombre}>{estado.datos.nombre}</Text>
          <Text style={estilos.dato}>Tipos: {estado.datos.tipos.join(', ')}</Text>
          <Text style={estilos.dato}>Altura: {estado.datos.altura} · Peso: {estado.datos.peso}</Text>
          <Pressable style={estilos.boton} onPress={() => agregarAlEquipo(estado.datos)}>
            <Text style={estilos.textoBoton}>Agregar a mi equipo</Text>
          </Pressable>
          {aviso !== '' && <Text style={estilos.aviso}>{aviso}</Text>}
        </View>
      )}
    </View>
  )
}

const estilos = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: C.fondo, paddingTop: 55 },
  volver: { minHeight: 44, justifyContent: 'center', paddingHorizontal: 20 },
  textoVolver: { color: C.suave, fontWeight: '600' },
  error: { color: C.error, textAlign: 'center', marginTop: 40 },
  contenido: { alignItems: 'center', padding: 24, gap: 10 },
  imagen: { width: 160, height: 160 },
  placeholder: { fontSize: 80 },
  nombre: { color: C.texto, fontSize: 28, fontWeight: '800', textTransform: 'capitalize' },
  dato: { color: C.suave, fontSize: 15 },
  boton: { backgroundColor: C.acento, borderRadius: 10, minHeight: 48, paddingHorizontal: 24, justifyContent: 'center', marginTop: 16 },
  textoBoton: { color: '#0b1120', fontWeight: '800' },
  aviso: { color: C.texto, marginTop: 8 },
})
