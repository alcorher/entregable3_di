# Sazón Comunitario

## Descripción
Esta es una aplicación web para compartir y explorar recetas de cocina.
Está realizada usando Next.js y TailwindCSS.

## Arquitectura
- **Frontend:** desarrollado con Next.js y TailwindCSS.
- **Backend (API Routes):** Acceso a datos y operaciones CRUD. Endpoints en la carpeta `src/app/api/`.
- **Base de datos (Supabase):** Guarda las recetas, usuarios y favoritos, se encarga de la persistencia de datos.

## Estructura de la Base de Datos
La base de datos está en Supabase y cuenta con las siguientes tablas principales:
- **Perfiles:** Almacena la información de los usuarios de la plataforma, conectada a la tabla auth de supabase.
- **Recetas:** Guarda la información de cada receta (título, descripción, ingredientes, pasos a seguir, etc.).
- **Favoritos:** Tabla intermedia para gestionar las recetas que los usuarios guardan como favoritas.

## Endpoints de la API
**Autenticación**
- `POST /api/auth/register` - Registro de nuevos usuarios.
- `POST /api/auth/login` - Inicio de sesión.

**Recetas**
- `GET, POST /api/recetas` - Listar recetas paginadas dependiendo de si hay un parámetro de busqueda, subir recetas.
- `GET, PUT, DELETE, PATCH /api/recetas/[id]` - Información detallada, actualizar, eliminar o cambiar de visibilidad de una receta específica.
- `GET /api/recetas/usuario/[id]` - Lista de recetas de un usuario específico.

**Usuarios y Perfil**
- `GET /api/usuarios` - Listar y buscar usuarios.
- `GET, PUT /api/perfil/[id]` - Obtener información de un perfil, editar el propio perfil. (`/api/perfil/me` para tu propio perfil).
- `PATCH /api/perfil/bloquear` - Bloquear/desbloquear un perfil (solo admin).

**Interacciones y Otros**
- `GET, POST /api/favoritos` - Obtener lista de favoritos, añadir una receta a favoritos.
- `DELETE /api/favoritos/[id]` - Eliminar una receta de favoritos.
- `POST /api/upload` - Subir imágenes.

## Variables de Entorno
Para que funcione la conexión con la base de datos, hay que crear un archivo `.env.local` en la raíz del proyecto con las variables:

```env
NEXT_PUBLIC_SUPABASE_URL=url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=clave_supabase

## Requisitos

- `Node.js`
- `npm` (se instala con Node.js).

## Instalación y ejecución

1. Abre la terminal y sitúate en la raíz del proyecto
2. Instala las dependencias:

```sh
npm install

```

3. Inicia el proyecto en local

```sh
npm run dev


```

4. Abre `http://localhost:3000` en el navegador.

---
