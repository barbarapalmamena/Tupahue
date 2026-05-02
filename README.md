# ⛪ Iglesia Reformada Tupahue - Plataforma Web

Bienvenido al repositorio oficial de la **Iglesia Reformada Tupahue**, ubicada en Puerto Montt, Chile. Esta es una plataforma web moderna y robusta diseñada para gestionar la comunidad, la biblioteca y la comunicación de la iglesia.

## 🚀 Características Principales

### 🌐 Sitio Público
- **Página de Inicio:** Contenido dinámico (Misión, Videos Dominicales, Encuentros y Blog de Reflexión "Palabra de Vida").
- **Nosotros:** Información detallada sobre nuestras creencias, misión, visión y declaración de fe.
- **Ministerios:** Visualización de los diversos ministerios y el equipo pastoral (Pr. Raúl Laguna y Nena García, Ancianos Pablo Cosque y Carlos Garcés).
- **Actividades:** Calendario de Google integrado para eventos y servicios.
- **Biblioteca Virtual:** Sistema de préstamo de libros con filtros por categoría.

### 🔐 Área de Miembros
- **Autenticación:** Sistema de registro, inicio de sesión y recuperación de contraseña vía email.
- **Mis Reservas:** Panel personal para que los miembros gestionen sus préstamos de libros y vean fechas de devolución.

### 🛠️ Panel Administrativo (CMS)
Gestión completa del sitio sin necesidad de tocar código:
- **Configuración General:** Edición de textos del Home, enlaces de videos de YouTube y horarios.
- **Blog (Palabra de Vida):** Creación, edición y eliminación de artículos/reflexiones.
- **Biblioteca:** Gestión del inventario de libros (título, autor, categoría, stock e imagen).
- **Préstamos:** Control de reservas activas, devoluciones y alertas de atrasos.

## 🛠️ Tecnologías Utilizadas

- **Frontend:** [Next.js](https://nextjs.org/) (App Router)
- **Estilos:** CSS Modules (Diseño 100% responsivo y optimizado para móviles)
- **Backend/Base de Datos:** [Supabase](https://supabase.com/) (PostgreSQL + Auth)
- **Emails:** [Resend](https://resend.com/)
- **Iconografía:** [Bootstrap Icons](https://icons.getbootstrap.com/)
- **Despliegue:** [Vercel](https://vercel.com/)

## 💻 Configuración para Desarrollo

### Requisitos Previos
- Node.js (v18+)
- Cuenta en Supabase

### Instalación
1. Clonar el repositorio:
   ```bash
   git clone https://github.com/barbarapalmamena/Tupahue.git
   ```
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Configurar variables de entorno (`.env.local`):
   ```env
   NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
   RESEND_API_KEY=tu_api_key_de_resend
   ```
4. Ejecutar en modo desarrollo:
   ```bash
   npm run dev
   ```

## 📱 Diseño Responsivo
El sitio ha sido optimizado específicamente para dispositivos móviles, asegurando que el logo sea prominente y que todas las tablas y menús sean navegables desde cualquier smartphone.

## 📞 Ubicación y Contacto
- 📍 **Dirección:** Deber Cumplido 253, Puerto Montt, Los Lagos.
- 📱 **Teléfono:** +56 9 5608 8059
- 📷 **Instagram:** [@iglesiatupahue](https://www.instagram.com/iglesiatupahue)

---
© 2026 | **Iglesia Reformada Tupahue**. Todos los derechos reservados.
