# Bitácora de auditoría — Examen práctico parcial

**Nombre:** ______________________   **Fecha:** ____________   **Repositorio:** ______________________

> Complete **una fila por cada corrección**. Si revisó algo y decidió **no** cambiarlo (porque funciona), anótelo en la sección "Revisado sin cambios".
> Use identificadores propios (C1, C2, C3...) y cítelos en los mensajes de sus commits.

## 1. Correcciones realizadas

| ID | Síntoma (qué se observaba) | Causa (por qué ocurría) | Cambio realizado (archivo y qué cambió; commit) | Prueba que confirma la solución (acción + resultado) | ¿IA? (Sí / No / Parcial) | Prompt utilizado (literal) y qué ajustó de la respuesta |
|---|---|---|---|---|---|---|
| C1 | | | | | | |
| C2 | | | | | | |
| C3 | | | | | | |
| C4 | | | | | | |
| C5 | | | | | | |
| C6 | | | | | | |
| C7 | | | | | | |
| C8 | | | | | | |
| C9 | | | | | | |
| C10 | | | | | | |
| C11 | | | | | | |
| C12 | | | | | | |

(Agregue las filas que necesite.)

### Ejemplo de una fila bien completada (error distinto a los de este examen)
| ID | Síntoma | Causa | Cambio realizado | Prueba | ¿IA? | Prompt |
|---|---|---|---|---|---|---|
| C0 | Al marcar una tarea como hecha, la pantalla no cambia hasta reabrir la app | Se modificaba el objeto del arreglo y se pasaba la misma referencia a `setTareas` | `TareasContext.tsx`: se reemplazó la asignación directa por `map` que devuelve un objeto nuevo (commit `fix(C0): estado inmutable al marcar tarea`) | Marqué una tarea: la pantalla se actualizó al instante y al reabrir la app el cambio seguía | Parcial | "Esta función marca una tarea como hecha pero la pantalla no se actualiza, el estado es un arreglo de objetos, ¿qué hipótesis hay y cuál es el cambio mínimo?" → ajusté el nombre de la variable y añadí la actualización de la caché |

## 2. Revisado sin cambios
| Qué revisó (archivo y fragmento) | Por qué decidió no cambiarlo | Cómo lo comprobó |
|---|---|---|
| | | |

## 3. Errores no resueltos
| Qué detectó | Qué intentó | Hipótesis de la causa |
|---|---|---|
| | | |

## 4. Declaración sobre el uso de IA
- Plataformas o agentes de IA utilizados: ______________________
- Cantidad aproximada de conversaciones o consultas: ______________
- Declaro que la información de esta bitácora es veraz y que puedo explicar cada cambio realizado.

**Firma / nombre:** ______________________
