# La Fe - Sistema de Pedidos

![Logo La Fe](src/assets/img/logo-lafe.png)

## Descripción

Sistema web para gestión de pedidos de productos La Fe. Esta aplicación simplifica el proceso de realizar y enviar pedidos entre sucursales y la central, permitiendo seleccionar productos por categoría, especificar cantidades, y generar documentos PDF compartibles por WhatsApp.

## Características

- **Selección de Sucursal**: Elija la sucursal para la cual se realiza el pedido
- **Selección de Fecha de Entrega**: Especifique cuándo debe entregarse el pedido
- **Categorías de Productos**: Interfaz organizada por categorías:
  - Helados
  - Palitos
  - Postres
  - Crocker
  - Dietéticos
  - Buffet
  - Softs
  - Dulces
  - Paletas
  - Bites
  - Térmicos
  - Barritas
- **Control de Cantidades**: Interfaz intuitiva para añadir/quitar unidades de cada producto
- **Resumen del Pedido**: Vista completa del pedido organizado por categorías
- **Generación de PDF**: Cree documentos PDF con el pedido completo
- **Integración con WhatsApp**: Comparta fácilmente los pedidos a través de WhatsApp

## Tecnologías Utilizadas

- **Frontend**: React.js, TailwindCSS
- **Enrutamiento**: React Router
- **Base de Datos**: Supabase
- **Generación PDF**: jsPDF, jsPDF-AutoTable
- **Gestión de Estado**: React Context API
- **Alertas**: SweetAlert2
- **Herramientas de Desarrollo**: Vite, ESLint

## Pre-requisitos

- Node.js (versión 18.x o superior)
- npm o yarn
- Cuenta en Supabase con las tablas necesarias

## Instalación

1. Clone el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/pedidosLaFe.git
   cd pedidosLaFe
   ```

Collecting workspace informationI'll create a README.md file for your project that explains what the application does, its features, how to set it up, and other relevant information.

````markdown
# La Fe - Sistema de Pedidos

![Logo La Fe](src/assets/img/logo-lafe.png)

## Descripción

Sistema web para gestión de pedidos de productos La Fe. Esta aplicación simplifica el proceso de realizar y enviar pedidos entre sucursales y la central, permitiendo seleccionar productos por categoría, especificar cantidades, y generar documentos PDF compartibles por WhatsApp.

## Características

- **Selección de Sucursal**: Elija la sucursal para la cual se realiza el pedido
- **Selección de Fecha de Entrega**: Especifique cuándo debe entregarse el pedido
- **Categorías de Productos**: Interfaz organizada por categorías:
  - Helados
  - Palitos
  - Postres
  - Crocker
  - Dietéticos
  - Buffet
  - Softs
  - Dulces
  - Paletas
  - Bites
  - Térmicos
  - Barritas
- **Control de Cantidades**: Interfaz intuitiva para añadir/quitar unidades de cada producto
- **Resumen del Pedido**: Vista completa del pedido organizado por categorías
- **Generación de PDF**: Cree documentos PDF con el pedido completo
- **Integración con WhatsApp**: Comparta fácilmente los pedidos a través de WhatsApp

## Tecnologías Utilizadas

- **Frontend**: React.js, TailwindCSS
- **Enrutamiento**: React Router
- **Base de Datos**: Supabase
- **Generación PDF**: jsPDF, jsPDF-AutoTable
- **Gestión de Estado**: React Context API
- **Alertas**: SweetAlert2
- **Herramientas de Desarrollo**: Vite, ESLint

## Pre-requisitos

- Node.js (versión 18.x o superior)
- npm o yarn
- Cuenta en Supabase con las tablas necesarias

## Instalación

1. Clone el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/pedidosLaFe.git
   cd pedidosLaFe
   ```
````

2. Instale las dependencias:

   ```bash
   npm install
   ```

3. Cree un archivo `.env` en la raíz del proyecto con su clave de Supabase:

   ```
   VITE_SUPABASE_KEY=tu_clave_supabase
   ```

4. Inicie el servidor de desarrollo:
   ```bash
   npm run dev
   ```

## Estructura de la Base de Datos

La aplicación utiliza las siguientes tablas en Supabase:

- `sucursales`: Lista de sucursales disponibles
- `helados`, `palitos`, `postres`, `crocker`, `dieteticos`, `buffet`, `softs`, `dulces`, `paletas`, `bites`, `termicos`, `barritas`: Tablas para cada categoría de productos

Cada tabla de productos debe tener al menos los campos:

- `id`: Identificador único (bigint)
- `title`: Nombre del producto (text)

## Despliegue

Para construir la versión de producción:

```bash
npm run build
```

Los archivos generados estarán en el directorio `dist/` listos para ser desplegados en cualquier servidor web estático.

## Uso

1. Seleccione una fecha de entrega
2. Seleccione la sucursal para el pedido
3. Agregue productos por categoría usando los botones + y -
4. Haga clic en "Revisar Pedido" para ver el resumen
5. En la página de revisión:
   - Verifique los productos y cantidades
   - Guarde como PDF o comparta por WhatsApp
   - Vuelva atrás para realizar cambios si es necesario

## Autor

Diseñado y desarrollado por [Mario E. Mateo](mailto:memateo@gmail.com) para La Fe S.A.

## Licencia

Todos los derechos reservados © 2024 - La Fe S.A.
