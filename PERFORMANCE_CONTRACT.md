# Contrato de estabilidad y rendimiento — Voltflow3

## Baseline funcional
El usuario confirma que la versión GitHub `2.9.2` / build `2026.10.13.0100`, commit `e63d6aefb3da754e9a5cd8c924f7e1093a3835bb`, funciona en su portátil Intel Celeron N4020 con 8 GB de RAM.

Esta constatación es operativa: **no hay todavía una medición de referencia en ese portátil**. No se deben inventar tiempos de respuesta ni prometer ausencia total de bloqueos.

## Invariantes de futuras versiones
1. El dashboard y la navegación deben continuar respondiendo durante mantenimiento, snapshots, backups, tours y sincronización.
2. Los cambios de estado no deben provocar cascadas de renderizado no acotadas.
3. Las lecturas de cobertura no deben reescribir datos sin cambios.
4. La deduplicación B2B no debe recuperar sectores previamente descartados: mantener y probar `getMergeableSectors`.
5. Leads, campañas, historial, credenciales y configuraciones existentes siguen siendo compatibles.
6. Errores de cuota, fallos de Workers o CDN no deben causar pérdida silenciosa de datos.
7. Se conserva el mecanismo de restauración y el respaldo de datos independiente del código.

## Puerta de calidad
Antes de cada cambio de producción:
- `node --check` para módulos JavaScript, y comprobación de versión/recursos mediante `node tools/check-release-integrity.cjs`.
- `git diff --check` y revisión de archivos modificados.
- Pruebas de regresión B2B, IndexedDB y funcionales disponibles en la versión candidata.
- Pruebas de navegador comparables de la versión estable y la candidata con datos sintéticos, CPU limitada y operaciones diferidas (al menos hasta 6 minutos; preferible 10+).
- Registrar tareas largas reales del hilo principal, latencia de interacción, memoria y errores de consola. Diferenciar mediciones del scheduler de las del navegador.
- Si no pueden ejecutarse las pruebas de navegador, informar explícitamente de que la puerta de rendimiento queda pendiente, aunque el chequeo automatizado de GitHub sea verde.

## Activación y reversión
Consultar `PROCEDIMIENTO_PUBLICACION.md`. No eliminar jamás información real del navegador como método de recuperación. No modificar esta referencia sin validación y permiso del usuario.
