import { useNavigate } from 'react-router-dom'
import logoLaFe from '../assets/img/logo-lafe.png'

const Tutorial = () => {
  const navigate = useNavigate()

  const steps = [
    {
      number: 1,
      title: 'Fecha y Destino del Pedido',
      description: 'Primero, selecciona la fecha de entrega (debe ser igual o posterior a hoy). Luego, elige la sucursal de destino. Si es un cliente especial, selecciona "Clientes Varios" e ingresa el nombre del cliente.',
      icon: '📅',
      details: [
        'La fecha debe ser válida (presente o futuro)',
        'Puedes elegir entre sucursales existentes o crear un pedido especial'
      ]
    },
    {
      number: 2,
      title: 'Selecciona tus Productos',
      description: 'Explora las categorías disponibles (Helados, Palitos, Postres, Crocker, Dietéticos, Buffet, Softs, Dulces, Paletas, Bites, Térmicos y Barritas). Usa los botones "+" para agregar productos y "-" para quitar, o ingresa la cantidad directamente.',
      icon: '🛒',
      details: [
        'Puedes ordenar alfabéticamente los productos para encontrarlos más rápido',
        'Agrega la cantidad que necesites de cada producto',
        'El total se actualiza automáticamente'
      ]
    },
    {
      number: 3,
      title: 'Revisa tu Pedido',
      description: 'Haz clic en "Revisar Pedido" para ver un resumen completo organizado por categorías. Verifica los productos, cantidades y totales antes de confirmar.',
      icon: '👀',
      details: [
        'Revisa que todo esté correcto',
        'Puedes editar cantidades si es necesario',
        'Se muestra el desglose por categoría'
      ]
    },
    {
      number: 4,
      title: 'Confirma tu Pedido',
      description: 'Una vez verificado, presiona "Guardar PDF" o "Enviar por WhatsApp".',
      icon: '✅',
      details: [
        'Se generará un pdf con los detalles completos',
        'Si guardas el pdf o lo compartes por whatsapp pero ves que falta algo, puedes volver a la página principal y editar el pedido, luego guardarlo o compartirlo nuevamente por whatsapp, aclarando en el texto del whatsapp que el primer pedido tenía un error y que este es el correcto'
      ]
    },
    {
      number: 5,
      title: 'Descarga o Comparte',
      description: 'Después de confirmar, puedes generar un PDF del pedido para descargarlo, o compartirlo directamente por WhatsApp al número configurado para mantener un registro del pedido realizado.',
      icon: '📱',
      details: [
        'Genera un PDF profesional del pedido',
        'Comparte por WhatsApp con un solo clic',
        'Mantén un registro de tus pedidos'
      ]
    }
  ]

  return (
    <div className="w-full max-w-7xl mx-auto p-2.5 md:p-5 font-sans box-border min-h-screen">
      <div className="flex flex-col items-center mb-8">
        <img src={logoLaFe} alt="Logo La Fe" className="w-24 md:w-30 mb-2" width="120" height="120" />
        <h1 className="text-2xl md:text-4xl text-[#2c3e50] my-2 text-center font-bold">
          Tutorial de Uso
        </h1>
        <p className="text-gray-600 text-center text-sm md:text-base mt-2 max-w-2xl">
          Aprende a usar la aplicación de pedidos paso a paso
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-4 md:space-y-6 mb-8">
        {steps.map((step) => (
          <div 
            key={step.number}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-4 md:p-6 border-l-4 border-[#315988]"
          >
            <div className="flex items-start gap-3 md:gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#315988] text-white flex items-center justify-center font-bold text-lg md:text-xl">
                  {step.number}
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl md:text-3xl">{step.icon}</span>
                  <h2 className="text-lg md:text-xl font-bold text-[#2c3e50]">
                    {step.title}
                  </h2>
                </div>
                <p className="text-gray-700 text-sm md:text-base leading-relaxed mb-3">
                  {step.description}
                </p>
                {step.details && (
                  <ul className="space-y-1 ml-4">
                    {step.details.map((detail, idx) => (
                      <li key={idx} className="text-gray-600 text-xs md:text-sm flex items-start gap-2">
                        <span className="text-[#315988] font-bold">✓</span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-green-50 border-l-4 border-green-500 p-4 md:p-6 rounded-lg mb-8 max-w-4xl mx-auto">
        <div className="flex items-start gap-3">
          <span className="text-2xl md:text-3xl">💡</span>
          <div>
            <h3 className="font-bold text-[#2c3e50] text-base md:text-lg mb-3">
              Consejos para Usar la Aplicación
            </h3>
            <ul className="space-y-2 text-gray-700 text-sm md:text-base">
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span><strong>Revisa antes de confirmar:</strong> Una vez confirmado, no podrás editar el pedido, así que asegúrate de que todo esté correcto.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span><strong>Usa las categorías:</strong> Navega por categorías para encontrar los productos más rápidamente. Puedes ordenarlos alfabéticamente si lo necesitas.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span><strong>Guarda o comparte:</strong> Descarga el PDF o comparte por WhatsApp para mantener un registro de tu pedido.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span><strong>¿Necesitas ayuda?</strong> Usa el botón de WhatsApp en la página principal para contactarnos directamente.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="text-center mb-8">
        <button 
          onClick={() => navigate('/')}
          className="bg-[#315988] text-white px-6 md:px-8 py-3 md:py-4 text-base md:text-lg rounded-lg font-bold hover:bg-[#052c4e] transition-colors shadow-md hover:shadow-lg inline-flex items-center gap-2"
        >
          <span>←</span>
          Volver al Inicio
        </button>
      </div>
    </div>
  )
}

export default Tutorial
