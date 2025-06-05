echo "# Documentación - Sistema de Pedidos La Fe

## Descripción del Proyecto

El Sistema de Pedidos La Fe es una aplicación web desarrollada con React y Vite que permite a los usuarios gestionar pedidos para diferentes sucursales de la empresa La Fe, facilitando la selección de productos por categorías, especificando cantidades y generando documentos PDF que pueden compartirse vía WhatsApp.

## Estructura del Proyecto

\`\`\`
pedidosLaFe/
├── public/
│ └── vite.svg
├── src/
│ ├── assets/
│ │ └── img/
│ │ ├── iconPdf.png
│ │ ├── iconWhatsapp.png
│ │ └── logo-lafe.png
│ ├── components/
│ │ ├── Footer.jsx
│ │ ├── Home.jsx
│ │ └── ReviewOrder.jsx
│ ├── context/
│ │ └── OrderContext.jsx
│ ├── db/
│ │ ├── SupabaseClient.jsx
│ │ └── testSupabase.js
│ ├── App.jsx
│ ├── index.css
│ └── main.jsx
├── .env
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── product-and-order-management-system-1747963838997.sql
├── README.md
└── vite.config.js
\`\`\`

## Tecnologías Utilizadas

- **Frontend**: React 19.1.0, TailwindCSS 4.1.7
- **Enrutamiento**: React Router 7.6.0
- **Base de Datos**: Supabase
- **Generación PDF**: jsPDF 3.0.1, jsPDF-AutoTable 5.0.2
- **Gestión de Estado**: React Context API
- **Alertas**: SweetAlert2 11.21.2
- **Herramientas de Desarrollo**: Vite 6.3.5, ESLint 9.25.0

## Arquitectura de la Aplicación

### Componentes Principales

#### 1. App.jsx

Componente raíz que configura el enrutamiento y envuelve la aplicación con el proveedor de contexto para los pedidos.

#### 2. Home.jsx

Página principal donde los usuarios:

- Seleccionan la fecha de entrega
- Eligen la sucursal
- Agregan productos organizados por categorías
- Procesan el pedido para revisión

#### 3. ReviewOrder.jsx

Página de revisión de pedido que permite:

- Revisar todos los productos seleccionados
- Generar un PDF del pedido
- Compartir el pedido vía WhatsApp
- Volver a la página principal para editar

#### 4. OrderContext.jsx

Gestiona el estado global de la aplicación para mantener la información del pedido entre componentes.

### Integración con Base de Datos

#### SupabaseClient.jsx

Configura la conexión con Supabase utilizando variables de entorno para las credenciales.

#### testSupabase.js

Proporciona funciones para verificar la conexión con Supabase antes de realizar operaciones.

## Flujo de la Aplicación

1. **Inicio**: El usuario accede a la página principal.
2. **Selección**: Especifica fecha de entrega y selecciona una sucursal.
3. **Productos**: Agrega productos organizados por categorías utilizando los botones de incremento/decremento.
4. **Revisión**: Navega a la página de revisión para confirmar los productos seleccionados.
5. **Documentación**: Genera un PDF del pedido o comparte por WhatsApp.

## Modelos de Datos

La aplicación utiliza las siguientes tablas en Supabase:

- \`sucursales\`: Almacena información sobre las sucursales
- \`helados\`, \`palitos\`, \`postres\`, etc.: Tablas para cada categoría de productos
- \`pedidos\`: Registra los pedidos realizados (estructura principal en formato JSON)

## Características Destacadas

### Generación de PDF

La aplicación utiliza jsPDF y jsPDF-AutoTable para generar documentos PDF estructurados con:

- Encabezado con información de la sucursal y fecha de entrega
- Presentación en dos columnas para optimizar el espacio
- Secciones organizadas por categorías de productos
- Adaptación dinámica del tamaño de fuente según la cantidad de productos

### Integración con WhatsApp

Implementa funciones para compartir el PDF generado:

- Utiliza Web Share API cuando está disponible
- Incluye fallbacks para navegadores que no soporten esta funcionalidad
- Genera un mensaje personalizado con la información básica del pedido

### Gestión de Estado

Utiliza Context API para:

- Mantener el estado global del pedido
- Permitir la navegación entre páginas sin perder la información
- Actualizar eficientemente solo las partes necesarias del estado

## Configuración y Desarrollo

### Requisitos Previos

- Node.js 16.0 o superior
- npm o yarn

### Variables de Entorno

Crear un archivo \`.env\` con:

\`\`\`
VITE_SUPABASE_KEY=your_supabase_anon_key
\`\`\`

### Comandos Disponibles

\`\`\`bash

# Instalar dependencias

npm install

# Iniciar servidor de desarrollo

npm run dev

# Compilar para producción

npm run build

# Ejecutar linting

npm run lint

# Vista previa de la build

npm run preview
\`\`\`

## Despliegue

1. Ejecutar \`npm run build\` para generar los archivos estáticos
2. Desplegar los archivos de la carpeta \`dist\` en el servidor web

## Consideraciones para Futuras Mejoras

1. **Persistencia de Pedidos**: Implementar almacenamiento de pedidos para recuperarlos posteriormente
2. **Autenticación de Usuarios**: Agregar sistema de login para diferentes tipos de usuarios
3. **Interfaz Administrativa**: Desarrollar panel para gestionar productos y sucursales
4. **Modo Offline**: Permitir funcionamiento sin conexión y sincronización posterior
5. **Seguimiento de Pedidos**: Implementar estados y notificaciones sobre el progreso de los pedidos

## Autor

Diseñado y desarrollado por [Mario E. Mateo](mailto:memateo@gmail.com) para La Fe S.A.

## Licencia

Todos los derechos reservados © 2024 - La Fe S.A." > DOCUMENTATION.md
