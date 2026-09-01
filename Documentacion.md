# DOCUMENTO DE DISEÑO DE SOFTWARE

**Introducción del Sistema**
* El sistema es una aplicación web de tipo SPA (Single Page Application) desarrollada con React y TypeScript para la gestión integral, publicación y visualización de eventos y categorías.
* Permite consultar eventos, visualizar detalles, filtrarlos por categorías, administrar favoritos y controlar el acceso a funcionalidades mediante autenticación y roles de usuario.

**Objetivos del Sistema**
* Proveer una interfaz web rápida, modular y completamente responsiva utilizando React 18+, Vite y Tailwind CSS.
* Garantizar la integridad y consistencia de los datos mediante el tipado estricto con TypeScript.
* Implementar un control de acceso robusto basado en roles (`User` y `Admin`) mediante la protección de rutas y componentes condicionales.

**Actores o Usuarios**
* **Usuario Regular**: Actor que interactúa consultando eventos, filtrando categorías, visualizando detalles específicos, marcando favoritos y manteniendo una sesión activa.
* **Administrador**: Actor con privilegios elevados que puede crear nuevos eventos, utilizar componentes protegidos mediante `AdminRoute` y gestionar los dominios de la plataforma.

**Requisitos Funcionales y No Funcionales**
* **Funcionales**: 
  * Autenticación de usuarios y gestión de sesión persistente.
  * Listado, detalle, filtrado y navegación entre eventos y categorías.
  * Sistema interactivo de favoritos.
  * Creación y gestión restringida de eventos para administradores.
* **No Funcionales**: 
  * Arquitectura modular orientada a funcionalidades dentro de `src/feature/`.
  * Comunicación HTTP asíncrona centralizada mediante una instancia personalizada de Axios.
  * Manejo centralizado de errores y pruebas unitarias automatizadas con Vitest y React Testing Library.

**Arquitectura del Software**
El proyecto adopta una estructura modular organizada por responsabilidades dentro del directorio principal:
* **Capa de Componentes (`components/`)**: Elementos visuales reutilizables divididos por dominios (auth, categories, common, events, layout).
* **Capa de Vistas (`pages/`)**: Páginas asociadas directamente al sistema de enrutamiento (`AppRoutes`).
* **Capa de Estado y Contexto (`context/`)**: Gestión global de la sesión (`AuthContext`) y los favoritos (`FavoritesContext`).
* **Capa de Servicios (`services/`)**: Módulos aislados para la comunicación con la API REST (`authService`, `eventService`, `categoryService`, `favoriteService`).
* **Capa de Red (`lib/`)**: Cliente HTTP base configurado con Axios (`axiosClient.ts`).

**Tecnologías a Utilizar**
* **Frontend**: React 18+, TypeScript, Vite.
* **Estilos**: Tailwind CSS.
* **Enrutamiento**: React Router.
* **Estado y Comunicación**: Context API, Axios.
* **Testing**: Vitest, React Testing Library.

---

## DIAGRAMAS DE LENGUAJE UNIFICADO DE MODELADO (UML)

**Diagrama de Casos de Uso**
* **Autenticación y Sesión**: El usuario inicia sesión o se registra, actualizando el estado global administrado por `AuthContext`.
* **Exploración de Contenido**: El usuario navega por las rutas públicas para consultar eventos y categorías.
* **Gestión de Favoritos**: El usuario interactúa con la aplicación para guardar o quitar elementos de su lista personal.
* **Gestión Administrativa**: El administrador valida su rol para acceder a formularios de creación protegidos (`/events/new`).

**Diagrama de Clases y Componentes**
* Estructura jerárquica donde las páginas contenedoras (`EventsPage`, `EventDetailPage`, `CategoriesPage`) consumen hooks personalizados (`useFetch`) y servicios específicos (`eventService`).
* Definición estricta de contratos de datos mediante interfaces de TypeScript (`Event`, `Category`, `User`, `Favorite`).

**Diagrama de Secuencia o Actividad**
1. El usuario interactúa con la interfaz y solicita una acción o navegación.
2. `React Router` evalúa la ruta y comprueba las restricciones de acceso mediante componentes de protección (`ProtectedRoute`, `AdminRoute`).
3. Si el acceso es válido, el componente invoca al servicio correspondiente dentro de `services/`.
4. El cliente HTTP (`axiosClient`) procesa la petición hacia la API REST y devuelve la respuesta tipada para actualizar el estado de la aplicación.

---

## PROTOTIPO DE SOLUCIÓN DE SOFTWARE

**Diseño de Interfaces y Navegación**
* **Pantalla Principal / Listado de Eventos (`EventsPage`)**: Interfaz principal que incorpora una barra de navegación superior responsiva (`Navbar`) con opciones dinámicas según el rol del usuario, seguida de una distribución de tarjetas interactivas.
* **Detalle de Eventos y Categorías (`EventDetailPage`, `CategoriesPage`)**: Vistas dedicadas para profundizar en la información de los eventos y navegar a través de las categorías disponibles.
* **Gestión de Favoritos (`FavoritesPage`)**: Vista exclusiva para usuarios autenticados donde se listan los eventos marcados como favoritos.
* **Formularios de Creación (`EventFormPage`)**: Interfaces controladas para el alta de eventos, accesibles únicamente por perfiles administrativos.

---

## MODELO DE BASE DE DATOS

**Identificación de Entidades y Relaciones**
* **User (Usuarios)**: Almacena las credenciales, información general y el rol del usuario para el control de acceso.
* **Category (Categorías)**: Define las clasificaciones temáticas. Mantiene una relación de **1 a N** con la entidad Event (una categoría agrupa múltiples eventos).
* **Event (Eventos)**: Contiene la información principal de los eventos (identificador, nombre, descripción, precio, capacidad, fecha, ubicación, categoría e imágenes).
* **Favorite (Favoritos)**: Tabla o entidad intermedia que gestiona la relación **N a M** entre los usuarios y los eventos seleccionados como favoritos.

**Estructura de Datos (Esquema Relacional)**

| Tabla | Campos Principales | Claves Primarias y Foráneas |
| :--- | :--- | :--- |
| **users** | id, name, email, password, role | PK: `id` |
| **categories** | id, name, description | PK: `id` |
| **events** | id, name, description, price, capacity, date, location, categoryId, images | PK: `id`, FK: `categoryId` references `categories(id)` |
| **favorites** | id, userId, eventId | PK: `id`, FKs: `userId`, `eventId` |

---

## GUÍA DE INSTALACIÓN Y EJECUCIÓN DEL PROYECTO

Sigue estos pasos para clonar, configurar y poner en marcha el entorno de desarrollo local:

* **Paso 1: Clonar el repositorio**
  Clona el proyecto en tu máquina local usando la URL oficial:
  ```bash
  git clone [https://github.com/Light-moonx4/prueba-desenpe-o-type.git](https://github.com/Light-moonx4/prueba-desenpe-o-type.git)

    Paso 2: Entrar a la carpeta del proyecto
    Navega hacia el directorio principal del repositorio recién clonado:

    Bash
    cd <NOMBRE_DEL_PROYECTO>
    Paso 3: Instalar las dependencias
    Ejecuta el gestor de paquetes para instalar todos los módulos necesarios:

    Bash
    npm install

    Paso 4: Configurar las variables de entorno
    Crea un archivo llamado .env en la raíz del proyecto y añade la URL de tu API backend:

    Fragmento de código
    VITE_API_URL=http://localhost:3000/api

    Paso 5: Iniciar el servidor de desarrollo
    Ejecuta el script para poner en marcha Vite en tu entorno local:

    Bash
    npm run dev
    La aplicación web estará disponible típicamente en http://localhost:5173.