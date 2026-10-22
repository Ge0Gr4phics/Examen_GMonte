import type { PokemonDetalle, PokemonResumen } from '../types'

const BASE = 'https://pokeapi.co/api/v2'

type RespuestaDetallePokemon = {
  id?: number
  name?: string
  sprites?: { front_default?: string | null }
  types?: Array<{ type: { name: string } }>
  height?: number
  weight?: number
}

export async function obtenerLista(limite = 30): Promise<PokemonResumen[]> {
  const res = await fetch(`${BASE}/pokemon?limit=${limite}`)
  const datos = await res.json()
  return datos.results.map((r: { name: string }, i: number) => ({ id: i + 1, nombre: r.name }))
}

export async function obtenerDetalle(nombre: string): Promise<PokemonDetalle> {
  const res = await fetch(`${BASE}/pokemon/${encodeURIComponent(nombre)}`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const datos: RespuestaDetallePokemon = await res.json()
  if (typeof datos?.id !== 'number' || typeof datos?.name !== 'string') throw new Error('Respuesta inesperada')
  return {
    id: datos.id,
    nombre: datos.name,
    sprite: datos.sprites?.front_default ?? null,
    tipos: (datos.types ?? []).map((t) => t.type.name),
    altura: datos.height ?? 0,
    peso: datos.weight ?? 0,
  }
}
