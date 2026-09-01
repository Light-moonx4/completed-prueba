# 📅 Gestor de Eventos y Categorías

Aplicación web **SPA (Single Page Application)** desarrollada con **React + TypeScript** para la gestión integral de eventos y categorías.

El sistema permite consultar eventos, visualizar detalles, filtrarlos por categorías, administrar favoritos y controlar el acceso a funcionalidades mediante autenticación y roles de usuario.

---

## 🚀 Características principales

* 🔐 Autenticación y gestión de sesión.
* 👤 Control de acceso basado en roles.
* 📅 Listado y detalle de eventos.
* ➕ Creación de eventos para administradores.
* 🏷️ Gestión y consulta de categorías.
* ⭐ Sistema de favoritos.
* 🔎 Filtrado y navegación entre eventos.
* ⚡ Comunicación asíncrona con API REST.
* 🛡️ Manejo centralizado de errores.
* 📱 Interfaz responsive.
* 🧪 Pruebas unitarias y de componentes.
* 🧩 Arquitectura modular orientada a funcionalidades.

---

# 🛠️ Tecnologías

| Tecnología                | Uso                                                             |
| ------------------------- | --------------------------------------------------------------- |
| **React 18+**             | Construcción de la interfaz mediante componentes reutilizables. |
| **TypeScript**            | Tipado estático, interfaces y contratos de datos.               |
| **Vite**                  | Servidor de desarrollo y sistema de build rápido.               |
| **React Router**          | Navegación y protección de rutas dentro de la SPA.              |
| **Axios**                 | Comunicación HTTP con el backend.                               |
| **Tailwind CSS**          | Diseño responsive mediante clases utilitarias.                  |
| **Context API**           | Gestión del estado global de autenticación y favoritos.         |
| **Vitest**                | Ejecución de pruebas unitarias.                                 |
| **React Testing Library** | Pruebas de comportamiento de componentes React.                 |

### ¿Por qué este stack?

La combinación permite mantener una aplicación **rápida, escalable, tipada y modular**, evitando dependencias innecesarias y separando la interfaz, lógica de negocio, comunicación con la API y estado global.

---

# 📁 Arquitectura del proyecto

El proyecto utiliza una arquitectura modular organizada principalmente por funcionalidades y responsabilidades.

```text
src/
├── feature/
│   ├── components/
│   │   ├── auth/
│   │   ├── categories/
│   │   ├── common/
│   │   ├── events/
│   │   └── layout/
│   │
│   ├── context/
│   │   ├── AuthContext
│   │   └── FavoritesContext
│   │
│   ├── error/
│   │   └── ApiError
│   │
│   ├── hooks/
│   │   └── useFetch
│   │
│   ├── interfaces/
│   │   ├── Category
│   │   ├── Event
│   │   ├── Favorite
│   │   └── User
│   │
│   ├── lib/
│   │   └── axiosClient
│   │
│   ├── pages/
│   │   ├── EventsPage
│   │   ├── EventDetailPage
│   │   ├── EventFormPage
│   │   └── CategoriesPage
│   │
│   ├── routes/
│   │   └── AppRoutes
│   │
│   ├── services/
│   │   ├── authService
│   │   ├── eventService
│   │   ├── categoryService
│   │   └── favoriteService
│   │
│   └── utils/
│
├── App.tsx
├── main.tsx
├── index.css
└── test/
```

### Separación de responsabilidades

**Components**
Contienen los elementos visuales reutilizables de la aplicación.

**Pages**
Representan las vistas asociadas a las diferentes rutas.

**Services**
Centralizan las peticiones HTTP y la comunicación con el backend.

**Context**
Gestiona información global como la sesión del usuario y sus favoritos.

**Interfaces**
Define los contratos de datos utilizados por TypeScript.

**Hooks**
Contiene lógica reutilizable entre componentes.

**Routes**
Centraliza la navegación y protección de rutas.

**Error**
Centraliza el tratamiento tipado de errores provenientes de la API.

---

# 🔐 Autenticación y autorización

El sistema diferencia las funcionalidades disponibles según el rol del usuario.

### 👤 Usuario regular

Puede:

* Consultar eventos.
* Consultar categorías.
* Ver detalles de eventos.
* Filtrar eventos.
* Gestionar favoritos.

### 👑 Administrador

Además de las funcionalidades anteriores puede:

* Crear eventos.
* Acceder a rutas administrativas.
* Utilizar funcionalidades protegidas mediante `AdminRoute`.

Las rutas sensibles se protegen mediante componentes como:

```text
ProtectedRoute
AdminRoute
```

Por ejemplo:

```text
/events
/events/:id
/categories
/favorites

/events/new       🔒 Administrador
```

El botón **"+ Nuevo Evento"** también se muestra únicamente cuando el usuario tiene los permisos necesarios.

---

# 📝 Preguntas Frecuentes y Justificaciones Técnicas (Requerimientos de Entrega)

### 1. ⚙️ Cómo correr el proyecto localmente
```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar el servidor de desarrollo
npm run dev

# 3. Ejecutar las pruebas automatizadas
npm test

# 4. Compilar para producción (TypeScript + Vite)
npm run build
```

### 2. 🔐 Dónde guardaste el token de sesión (localStorage vs sessionStorage) y por qué
- **Opción elegida:** `localStorage` (clave `'accessToken'`).
- **Justificación:** Se eligió `localStorage` para garantizar la **persistencia de la sesión del usuario** incluso si recarga la página o abre la aplicación en una nueva pestaña del mismo navegador. Esto evita exigir al usuario iniciar sesión constantemente en cada recarga o en pestañas simultáneas. Cuando el usuario presiona "Cerrar sesión", el `AuthContext` limpia de forma segura el almacenamiento local mediante `localStorage.removeItem('accessToken')` y ejecuta la petición al servidor `POST /auth/logout`.

### 3. 🌐 Qué librería usaste para las peticiones HTTP y cómo resolviste el interceptor de autenticación
- **Librería utilizada:** `Axios`.
- **Implementación del Interceptor:**
  - Se configuró una instancia personalizada en `src/feature/lib/axiosClient.ts`.
  - **Interceptor de Petición (Request Interceptor):** Revisa si existe un `accessToken` en `localStorage` antes de enviar cualquier solicitud y lo adjunta en los encabezados HTTP como `Authorization: Bearer <token>`.
  - **Interceptor de Respuesta (Response Interceptor):** Escucha las respuestas de la API. Si el backend responde con un estado de error `401 Unauthorized` (token expirado o inválido), el interceptor dispara un evento global `auth-logout` que desloguea automáticamente al usuario en `AuthContext` y limpia la sesión local sin romper la experiencia del cliente.

---

# 🌐 Comunicación con la API

La comunicación con el backend se centraliza mediante una instancia personalizada de Axios:

```text
src/feature/lib/axiosClient.ts
```

Este cliente permite:

* Configurar automáticamente la URL base.
* Adjuntar tokens de autenticación.
* Estandarizar las peticiones HTTP.
* Centralizar errores.
* Evitar repetir configuración en cada servicio.

Los servicios se encuentran separados por dominio:

```text
authService
eventService
categoryService
favoriteService
```

Esto permite mantener aislada la lógica de comunicación respecto a los componentes de interfaz.

---

# ⚙️ Variables de entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
VITE_API_URL=http://localhost:3000/api
```

> Ajusta la URL según la configuración de tu backend.

No almacenes credenciales, tokens privados u otros secretos en variables `VITE_*`, ya que estas variables pueden terminar expuestas en el cliente.

---

# 📦 Instalación

### 1. Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
```

### 2. Entrar al proyecto

```bash
cd <NOMBRE_DEL_PROYECTO>
```

### 3. Instalar dependencias

```bash
npm install
```

### 4. Configurar las variables de entorno

Crear:

```text
.env
```

con:

```env
VITE_API_URL=http://localhost:3000/api
```

### 5. Iniciar el servidor

```bash
npm run dev
```

La aplicación estará disponible normalmente en:

```text
http://localhost:5173
```

---

# 🧪 Testing

El proyecto utiliza **Vitest** y **React Testing Library**.

Para ejecutar las pruebas:

```bash
npm test
```

Las pruebas permiten verificar componentes y funcionalidades críticas, especialmente aquellas relacionadas con formularios y autenticación.

Ejemplo:

```text
LoginForm.test.tsx
```

---

# 📜 Scripts

Los comandos principales del proyecto son:

| Comando           | Descripción                          |
| ----------------- | ------------------------------------ |
| `npm install`     | Instala las dependencias.            |
| `npm run dev`     | Inicia el servidor de desarrollo.    |
| `npm test`        | Ejecuta las pruebas.                 |
| `npm run build`   | Genera la versión de producción.     |
| `npm run preview` | Previsualiza el build de producción. |

> Los últimos dos comandos requieren que estén definidos en `package.json`.

---

# 🔄 Flujo general de la aplicación

```text
Usuario
   │
   ▼
React Router
   │
   ├── Ruta pública
   │      └── Events / Categories
   │
   └── Ruta protegida
          │
          ▼
     AuthContext
          │
          ▼
     Verificación de rol
          │
       ┌──┴──┐
       │     │
     User   Admin
       │     │
       ▼     ▼
   Lectura  Gestión
          │
          ▼
       Services
          │
          ▼
      Axios Client
          │
          ▼
      Backend API
```

---

# 🎯 Objetivo técnico

El proyecto busca demostrar la implementación de una aplicación frontend moderna utilizando buenas prácticas de desarrollo:

* Componentización.
* Tipado estricto.
* Separación de responsabilidades.
* Manejo de estado global.
* Protección de rutas.
* Control de permisos.
* Consumo de APIs REST.
* Manejo centralizado de errores.
* Diseño responsive.
* Testing automatizado.
* Arquitectura preparada para crecimiento.

---

## 📌 Estado del proyecto

**Frontend:** React + TypeScript
**Arquitectura:** SPA modular
**Backend:** API REST
**Autenticación:** Token-based
**Autorización:** Roles de usuario
**Testing:** Vitest + React Testing Library

---

## 👨‍💻 Desarrollo

Este proyecto está estructurado para facilitar el mantenimiento, la incorporación de nuevas funcionalidades y la escalabilidad del sistema a medida que aumentan los dominios y responsabilidades de la aplicación.

repositorio:https://github.com/Light-moonx4/prueba-desenpe-o-type.git