# Especial ChequeaBolivia: promesas de Rodrigo Paz

Sitio editorial estático, sin base de datos ni dependencias de ejecución. La portada, los artículos y sus metadatos se generan desde archivos locales. La carpeta `dist/` se puede servir desde Vercel o desde un hosting estático convencional.

## Ejecutar localmente

Requiere Node.js 18 o posterior y npm. Desde esta carpeta:

```sh
npm run dev
```

Abre `http://localhost:4173`. Para generar solo el sitio listo para publicar, ejecuta `npm run build`. `npm start` sirve el directorio `dist/` que ya se generó.

Si tu instalación de Node no incluye npm, los equivalentes son `node scripts/build.mjs` y después `node scripts/serve.mjs dist`.

## Publicar en Vercel

Importa el repositorio en Vercel. La configuración de `vercel.json` usa `npm run build` y publica `dist/`; no requiere variables de entorno, base de datos ni servicios exclusivos de Vercel. También se puede ejecutar el mismo comando en el flujo de integración continua antes del despliegue.

En los ajustes del proyecto Vercel, **Root Directory** debe apuntar a la carpeta que contiene juntos `package.json`, `vercel.json` y `scripts/build.mjs`. Si subes los archivos de este proyecto directamente a la raíz del repositorio, deja Root Directory como `./`. Si quedan dentro de una carpeta `chequeabolivia-especial/`, selecciona esa carpeta como raíz del proyecto.

## Subir el proyecto a GitHub

Sube el contenido de esta carpeta a un repositorio nuevo. Desde una terminal abierta aquí, puedes crear el primer commit y enlazar el remoto que te entregue GitHub:

```sh
git init
git add .
git commit -m "Publica el especial de ChequeaBolivia"
git branch -M main
git remote add origin https://github.com/USUARIO/NOMBRE-DEL-REPOSITORIO.git
git push -u origin main
```

Reemplaza `USUARIO/NOMBRE-DEL-REPOSITORIO` por la dirección de tu repositorio. El directorio `dist/` se genera durante el despliegue y está excluido del control de versiones.

## Editar y publicar verificaciones

Todo el contenido está separado de la interfaz en `data/verifications.json`. Hay 20 espacios vacíos con identificadores permanentes (`verificacion-01` a `verificacion-20`). Vacíos, no aparecen como artículos ni cuentan en las estadísticas.

1. Abre un objeto de la lista y completa `title`, `status`, `published`, `bodyHtml` y, cuando corresponda, `date`, `coverImage`, `coverAlt` e `images`.
2. Para publicar, asigna `published: true` y uno de estos valores exactos en `status`: `cumplida`, `incumplida`, `demorada` o `adelantada`. La portada, los iconos y los contadores se actualizan automáticamente.
3. Escribe el artículo completo en `bodyHtml` con HTML editorial sencillo: `<p>`, `<h2>`, `<h3>`, `<strong>`, `<em>`, `<a>`, `<ul>` y `<ol>`. No hay campos separados para promesa, análisis o fuentes.
4. Copia las imágenes a `images/` y añade elementos a `images`, por ejemplo `{"src":"images/documento.jpg","alt":"Detalle del documento","caption":"Pie de foto opcional."}`. Se muestran dentro del artículo, conservan su proporción y se pueden ampliar. `coverImage` es una imagen opcional para la tarjeta.
5. Ejecuta `npm run dev` para revisar o `npm run build` para generar la publicación. Cada artículo conserva la URL `/verificaciones/verificacion-NN/` aunque cambie su titular.

El contenido HTML de `bodyHtml` está pensado para edición por la redacción y se inserta como HTML. Mantén el contenido bajo control editorial; no pegues código de terceros.

## Portada e identidad

El titular y el subtítulo provisionales están en `index.html`; el arte reservado para portada está en `.hero-art` dentro de ese archivo y puede sustituirse por una imagen del especial. Los colores y tipografías se concentran como variables al inicio de `styles.css`.

Se consultó `chequeabolivia.bo`; la referencia disponible mostró su estructura de medio de verificación y un recurso editorial de ChequeaBolivia describió el logotipo blanco sobre un fondo verde azulado oscuro. El acceso de esta sesión no permitió leer la hoja de estilos del sitio ni comprobar/descargar los cuatro PNG proporcionados. Por eso el proyecto deja tokens de marca fáciles de ajustar, usa una aproximación tipográfica del nombre (no el archivo oficial del logotipo) y dibuja iconos vectoriales de respaldo con etiqueta. Sustituye el wordmark por el SVG oficial y ajusta `--brand` cuando la redacción proporcione sus recursos de identidad. Las definiciones de evaluación están transcritas tal como fueron entregadas.

## Migrar a otro hosting

El sitio publicado es HTML, CSS, JavaScript, JSON e imágenes. Para migrar, ejecuta `npm run build` y sube el contenido de `dist/` a cualquier servidor de archivos estáticos; conserva las rutas `/verificaciones/verificacion-NN/`, `/data/` y `/images/`. No necesita adaptadores de Vercel. Si el nuevo hosting publica bajo un subdirectorio y no en la raíz del dominio, ajusta las rutas absolutas que empiezan con `/` en `index.html`, `app.js`, `article.js` y la generación de metadatos en `scripts/build.mjs`.
