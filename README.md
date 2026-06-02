# Voltium CRM

Aplicacion web CRM modular. El proyecto puede subirse a GitHub y abrirse en el navegador como una herramienta local, conservando los datos del usuario en el mismo navegador.

## Documento Critico Antes De Modificar

Antes de tocar la herramienta, revisar [CONFIGURACION_FUNCIONAL.md](CONFIGURACION_FUNCIONAL.md).

Ese documento define la configuracion que debe seguir funcionando: localStorage, GitHub, cache busting, scraping, multisector, volcado a leads, pipeline, cobertura y mapa.

## Entrada Correcta

Abrir la herramienta desde:

```text
app.html
```

Tambien se puede abrir la raiz del proyecto:

```text
index.html
```

`index.html` redirige automaticamente a `app.html?build=2026.06.02.1200` para evitar que GitHub o el navegador muestren una portada antigua.

## Actualizar Desde GitHub Sin Perder Datos

1. Subir a GitHub todos los archivos del proyecto.
2. Descargar o actualizar esos archivos en la misma carpeta local del usuario.
3. Abrir `app.html` en el mismo navegador de siempre.

La app conserva leads, scraping, seguimiento, cobertura, campanas, memoria comercial y API keys en el navegador. No hay que borrar datos del sitio ni limpiar `localStorage`.

## Por Que Ahora Carga Las Mejoras

La version actual usa un identificador unico de build:

```text
2026.06.02.1200
```

Ese identificador se aplica a `app.html`, `version.json`, `main.css` y todos los modulos JavaScript. Cuando el usuario abre la version actualizada, el navegador pide los archivos como recursos nuevos y no reutiliza los antiguos de cache.

La app tambien intenta eliminar Service Workers y CacheStorage heredados si alguna version antigua los hubiese creado. Eso no borra `localStorage`, asi que no elimina leads ni API keys.

## URLs Y Datos Guardados

El navegador guarda `localStorage` por origen. Estas entradas no comparten datos entre si:

```text
https://usuario.github.io/proyecto/app.html
http://localhost:8765/app.html
http://127.0.0.1:8765/app.html
file:///C:/.../app.html
```

Para mantener el trabajo del usuario, debe abrir siempre la app desde el mismo tipo de URL que ya usa normalmente.

## Recuperacion

En `Configuracion -> Gestion de Datos` hay herramientas para:

- Diagnosticar almacenamiento.
- Ver rescates criticos.
- Exportar rescate critico.
- Restaurar backup.
- Pegar backup JSON.
- Exportar datos portatiles.

## Servidor Local Opcional

`dev-server.cjs` e `INICIAR_GORDI_LOCAL.bat` quedan como opcion tecnica para pruebas locales con cabeceras anti-cache, pero no son obligatorios para usar la version subida a GitHub.
