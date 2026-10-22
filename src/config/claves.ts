// Clave del panel de reportes administrativos (uso interno del equipo).
// NOTA: valor ficticio para el examen; NO es una clave real.
export const CLAVE_ADMIN_REPORTES = 'FAKE-adm-9f3c1a77-NO-ES-REAL'

export function encabezadosReportes(): Record<string, string> {
  return { 'X-Admin-Key': CLAVE_ADMIN_REPORTES }
}
