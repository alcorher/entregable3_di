# Sazón Comunitario

## Descripción
Esta es una aplicación web para compartir y explorar recetas de cocina.
Está realizada usando Next.js y TailwindCSS.

## Arquitectura
- **Frontend (Componentes):** Interfaz gráfica desarrollada con Next.js y TailwindCSS.
- **Backend (API Routes):** La lógica de acceso a datos y las operaciones CRUD. Endpoints propios creados en la carpeta `/app/api/`.
- **Base de datos (Supabase):** Se encarga de la persistencia real de los datos. La comunicación con Supabase se realiza única y exclusivamente desde el entorno del servidor (las API Routes).

## Estructura de la Base de Datos
La base de datos está implementada en Supabase y cuenta con las siguientes entidades principales:
- **Usuarios / Perfiles:** Almacena la información de los usuarios de la plataforma.
- **Recetas:** Guarda la información detallada de cada receta (título, descripción, ingredientes, pasos a seguir, etc.).
- **Favoritos:** Tabla intermedia/relacional para gestionar las recetas que los usuarios guardan como favoritas.

## Endpoints de la API
Se han desarrollado los siguientes endpoints para manejar las operaciones mediante métodos HTTP (GET, POST, PUT, DELETE, PATCH):

**Autenticación**
- `POST /api/auth/register` - Registro de nuevos usuarios.
- `POST /api/auth/login` - Inicio de sesión.

**Recetas**
- `GET, POST /api/recetas` - Listar recetas paginadas dependiedno de si hay un parámetro de busqueda, subir recetas.
- `GET /api/recetas/detalle` - Información sobre una receta.
- `GET /api/recetas/usuario` - Lista de recetas de un usuario.

**Usuarios y Perfil**
- `GET /api/usuarios` - Listar y buscar de usuarios.
- `GET, PUT /api/perfil` - Información de un perfil, editar tu propio perfil.
- `POST /api/perfil/bloquear` - Bloquear un perfil.

**Interacciones y Otros**
- `GET, POST, DELETE /api/favoritos` - Gestión de recetas favoritas de un usuario.
- `POST /api/upload` - Subida de imágenes.

## Variables de Entorno
Para que funcione la conexión con la base de datos, hay que crear un archivo `.env.local` en la raíz del proyecto con las variables:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_del_proyecto_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase

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
