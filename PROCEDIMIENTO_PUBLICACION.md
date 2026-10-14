# Publicación y recuperación segura

1. Guardar como referencia el commit de `BASELINE_ESTABLE.json`, sin reetiquetarlo silenciosamente. Se puede crear una etiqueta `STABLE-CELERON-2026-10-14` apuntando exactamente a dicho commit desde una cuenta con permiso de escritura.
2. Desarrollar cambios en rama aparte y abrir Pull Request hacia `main`.
3. Revisar que la acción **Voltflow3 basic quality gate** esté verde. **Esta acción solo cubre sintaxis y coherencia de versión: NO verifica por sí sola el rendimiento real ni la persistencia.** Ejecutar las comprobaciones manuales o automatizadas adicionales de `PERFORMANCE_CONTRACT.md` antes del merge.
4. Habilitar protección de `main` en Settings > Rules > Rulesets (o Branch protection), exigir PR y el check `static-integrity` cuando la cuenta y el plan lo permitan. Verificar qué reglas realmente se aplican al repositorio público.
5. No publicar sin comparar previamente el diff, registrar el commit previo y contar con posibilidad de reversión.

## Reversión
Si una publicación reciente falla, revertir exclusivamente el commit de publicación con `git revert <SHA>` y `git push origin main`, tras comprobar que no contiene otros cambios que sea necesario preservar. Esto genera una nueva publicación con el código anterior sin reescribir historia.

**Importante:** revertir código no restaura leads, datos de Chrome ni IndexedDB. Conserva y verifica copias de seguridad independientes antes de cualquier migración de datos. No usar `localStorage.clear()` ni borrar los datos del sitio como solución de emergencia.

## Limitaciones
Crear una etiqueta o cambiar las reglas del repositorio requiere permisos de escritura/administración; estos archivos por sí solos no activan protecciones remotas. La protección fuerte exige configurar reglas del repositorio. Si el despliegue se hace mediante carga manual directa a `main`, una regla de PR puede impedir ese flujo; migrar primero a publicación mediante PR.
