# 🚀 Sistema de Gestión - Angular 20 + Zard UI

Sistema CRUD completo construido con Angular 20 y Zard UI, una alternativa de shadcn para Angular.

![Angular](https://img.shields.io/badge/Angular-20-red?style=flat-square&logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Zard UI](https://img.shields.io/badge/Zard_UI-Latest-purple?style=flat-square)

## 📋 Tabla de Contenidos

- [Características](#características)
- [Tecnologías](#tecnologías)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Módulos Implementados](#módulos-implementados)
- [API Endpoints](#api-endpoints)
- [Capturas de Pantalla](#capturas-de-pantalla)
- [Comandos Útiles](#comandos-útiles)

---

## ✨ Características

### 🎨 **UI/UX Moderna**
- ✅ Layout responsive con sidebar colapsable
- ✅ Menú hamburguesa para móviles con overlay
- ✅ Sistema de navegación con rutas protegidas
- ✅ Breadcrumbs dinámicos
- ✅ Dark mode (configuración de Zard UI)

### 📊 **Gestión de Datos**
- ✅ CRUD completo de Categorías
- ✅ CRUD completo de Productos
- ✅ Tablas con datos dinámicos
- ✅ Estados visuales (activo/inactivo)
- ✅ Formato de fechas localizado

### 🔔 **Notificaciones y Feedback**
- ✅ Toasts para operaciones exitosas
- ✅ Toasts para errores del servidor
- ✅ Validación en tiempo real
- ✅ Mensajes de error por campo
- ✅ Estados de carga (loading spinners)

### 📝 **Formularios Inteligentes**
- ✅ Validación del cliente (required, minlength, min)
- ✅ Validación del servidor (422 responses)
- ✅ Modales de confirmación para eliminación
- ✅ Pre-llenado automático en edición
- ✅ Carga dinámica de selects

### 🛡️ **Arquitectura**
- ✅ Servicios HTTP con TypeScript
- ✅ Signals para gestión de estado
- ✅ Componentes standalone
- ✅ Separación de responsabilidades
- ✅ Manejo centralizado de errores

---

## 🛠️ Tecnologías

| Tecnología | Versión | Uso |
|-----------|---------|-----|
| **Angular** | 20.x | Framework principal |
| **TypeScript** | 5.x | Lenguaje de programación |
| **Zard UI** | Latest | Biblioteca de componentes |
| **Tailwind CSS** | 3.x | Estilos utility-first |
| **ngx-sonner** | Latest | Sistema de notificaciones |
| **RxJS** | 7.x | Programación reactiva |
| **Lucide Angular** | Latest | Iconos |

---

## 📦 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** >= 18.x
- **npm** >= 9.x (o **pnpm**, **yarn**, **bun**)
- **Angular CLI** >= 20.x

```bash
# Verificar versiones instaladas
node --version
npm --version
ng version
```

---

## 🚀 Instalación

### 1️⃣ **Clonar el repositorio**

```bash
git clone <tu-repositorio>
cd angular-fe
```

### 2️⃣ **Instalar dependencias**

```bash
npm install
```

### 3️⃣ **Configurar el backend**

Url de repositorio laravel-starter:

[https://github.com/Fernixp/laravel-mvc-starter](https://github.com/Fernixp/laravel-mvc-starter)

Asegúrate de que el backend Laravel esté corriendo en:

```
http://localhost:8000
```

Si tu backend está en otra URL, actualiza `apiUrl` en los servicios:

```typescript
// src/app/services/categoria.services.ts
private apiUrl = 'http://tu-backend.com/api/categorias';
```

### 4️⃣ **Ejecutar el proyecto**

```bash
npm start
```

La aplicación estará disponible en: `http://localhost:4200`

---

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── pages/
│   │   ├── categorias/
│   │   │   ├── categorias.ts          # Componente principal
│   │   │   ├── categorias.html        # Template
│   │   │   ├── categorias.css         # Estilos
│   │   │   └── categoria-form-dialog.ts  # Formulario modal
│   │   ├── productos/
│   │   │   ├── productos.ts
│   │   │   ├── productos.html
│   │   │   └── producto-form-dialog.ts
│   │   └── dashboard/
│   │       ├── dashboard.ts
│   │       └── dashboard.html
│   ├── services/
│   │   ├── categoria.services.ts      # Servicio HTTP Categorías
│   │   └── producto.services.ts       # Servicio HTTP Productos
│   ├── layout/
│   │   ├── layout.ts                  # Layout principal
│   │   └── layout.html                # Template con sidebar
│   ├── shared/
│   │   └── components/                # Componentes Zard UI
│   │       ├── table/
│   │       ├── button/
│   │       ├── dialog/
│   │       ├── icon/
│   │       └── ...
│   ├── app.routes.ts                  # Configuración de rutas
│   ├── app.config.ts                  # Configuración global
│   └── app.ts                         # Componente raíz
├── styles.css                         # Estilos globales
└── index.html                         # HTML principal
```

---

## 📋 Módulos Implementados

### 🏷️ **1. Módulo de Categorías**

**Ruta:** `/categorias`

**Funcionalidades:**
- ✅ Listar todas las categorías
- ✅ Crear nueva categoría
- ✅ Editar categoría existente
- ✅ Eliminar categoría (con confirmación)
- ✅ Filtrar solo categorías activas

**Campos:**
- `id` - Identificador único
- `nombre` - Nombre de la categoría (mín. 3 caracteres)
- `estado` - activo | inactivo
- `created_at` - Fecha de creación
- `updated_at` - Fecha de actualización

**Validaciones:**
- ✅ Nombre requerido
- ✅ Nombre único (validado por backend)
- ✅ Mínimo 3 caracteres

---

### 📦 **2. Módulo de Productos** (Estructura lista)

**Ruta:** `/productos`

**Funcionalidades:**
- ✅ Listar todos los productos
- ✅ Crear nuevo producto
- ✅ Editar producto existente
- ✅ Eliminar producto (con confirmación)
- ✅ Relacionar con categorías

**Campos:**
- `id` - Identificador único
- `nombre` - Nombre del producto (mín. 3 caracteres)
- `precio` - Precio del producto (> 0)
- `categoria_id` - Relación con categoría
- `estado` - activo | inactivo

**Validaciones:**
- ✅ Nombre requerido (mín. 3 caracteres)
- ✅ Precio requerido (mayor a 0)
- ✅ Categoría requerida
- ✅ Select dinámico carga categorías activas

---

## 🔌 API Endpoints

### **Categorías**

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/categorias` | Listar todas las categorías |
| `POST` | `/api/categorias` | Crear nueva categoría |
| `PUT` | `/api/categorias/{id}` | Actualizar categoría |
| `DELETE` | `/api/categorias/{id}` | Eliminar categoría |

**Ejemplo de respuesta:**

```json
[
  {
    "id": 1,
    "nombre": "Electrónica",
    "estado": "activo",
    "created_at": "2025-10-17T00:25:53.000000Z",
    "updated_at": "2025-10-17T00:25:53.000000Z"
  }
]
```

**Error 422 (Validación):**

```json
{
  "message": "Existen errores de validación",
  "errors": {
    "nombre": ["The nombre has already been taken."]
  }
}
```

### **Productos**

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/productos` | Listar todos los productos |
| `POST` | `/api/productos` | Crear nuevo producto |
| `PUT` | `/api/productos/{id}` | Actualizar producto |
| `DELETE` | `/api/productos/{id}` | Eliminar producto |

---

### **Estructura de Archivos Angular**

```bash
# Listar estructura del proyecto (sin node_modules)
find src -type f | head -100

# Ver solo carpetas
find src -type d
```

---


---

## 📚 Recursos

- [Angular Documentation](https://angular.dev)
- [Zard UI Components](https://zardui.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Lucide Icons](https://lucide.dev)

---

## 👨‍💻 Autor

Desarrollado por [Fernixp](https://github.com/Fernixp) con ❤️ usando Angular 20 y Zard UI

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

---

## 🤝 Contribuir

¿Encontraste un bug o quieres agregar una nueva funcionalidad?

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

---

## 🎉 ¡Gracias por usar este proyecto!

Si te fue útil, no olvides dejar una ⭐
