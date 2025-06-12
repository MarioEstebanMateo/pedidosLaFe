# La Fe - Sistema de Pedidos

![Logo La Fe](src/assets/img/logo-lafe.png)

## Descripción

Sistema web para gestión de pedidos de productos La Fe. Esta aplicación simplifica el proceso de realizar y enviar pedidos entre sucursales y la central, permitiendo seleccionar productos por categoría, especificar cantidades, y generar documentos PDF compartibles por WhatsApp.

## Características

- **Selección de Sucursal o Cliente**: Elija la sucursal para la cual se realiza el pedido o seleccione "Clientes Varios" para pedidos personalizados
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

## Uso

1. Seleccione una fecha de entrega
2. Seleccione la sucursal para el pedido o elija "Clientes Varios" para ingresar un cliente personalizado
   - Si selecciona "Clientes Varios", aparecerá un campo de texto para ingresar el nombre del cliente
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
