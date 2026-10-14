# Instrucciones obligatorias para Codex: Voltflow3

La estabilidad confirmada por el usuario tiene prioridad sobre nuevas funcionalidades.

## Referencia conocida
Consulta `BASELINE_ESTABLE.json`. No cambies la referencia estable al actualizar la build; solo se actualiza con autorización expresa del usuario tras confirmar que la nueva versión funciona en su portátil.

## Reglas de cambio
- No modificar directamente `main` ni publicar sin autorización expresa.
- Desarrollar en una rama separada y conservar el commit estable.
- Mantener `getMergeableSectors`, protección de datos, IndexedDB, backups, modo de recuperación y las optimizaciones ya presentes.
- No sustituir una operación costosa por un `setTimeout` más largo como única solución.
- No introducir trabajos sin límite en el hilo principal. Las operaciones largas deben dividirse o procesarse fuera de él cuando sea seguro.
- No borrar ni reiniciar almacenamiento del usuario, ni realizar pruebas con credenciales o APIs reales.
- Ejecutar las comprobaciones de `.github/workflows/quality-gate.yml` antes de proponer publicación.
- Registrar resultados reales, limitaciones y diferencias respecto a la versión estable. Una prueba automatizada no demuestra por sí sola estabilidad en el hardware específico.
- No revelar claves API ni contenido sensible en trazas o informes.

## Publicación
- Verificar el diff, el commit destino, la coherencia del build en `app.html`, `index.html`, `version.json` y las URLs de recursos.
- Si falla cualquier prueba obligatoria, detener publicación.
- Documentar reversión de código y protección de datos por separado.
