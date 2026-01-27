import { useNavigate } from 'react-router-dom'
import logoLaFe from '../assets/img/logo-lafe.png'

const Tutorial = () => {
  const navigate = useNavigate()

  const steps = [
    {
      number: 1,
      title: 'Seleccionar Fecha del Pedido',
      description: 'Elige la fecha de entrega para tu pedido. La fecha debe ser igual o posterior al día actual.',
      icon: '📅'
    },
    {
      number: 2,
      title: 'Elegir Sucursal o Cliente',
      description: 'Selecciona la sucursal de destino. Si es un cliente especial, elige "Clientes Varios" e ingresa el nombre del cliente.',
      icon: '🏪'
    },
    {
      number: 3,
      title: 'Seleccionar Productos',
      description: 'Navega por las diferentes categorías (Helados, Palitos, Postres, etc.) y usa los botones "+" y "-" para agregar o quitar productos.',
      icon: '🍦'
    },
    {
      number: 4,
      title: 'Ordenar Alfabéticamente (Opcional)',
      description: 'En la sección de Helados, puedes usar el botón "Ordenar Alfabéticamente" para encontrar productos más fácilmente.',
      icon: '🔤'
    },
    {
      number: 5,
      title: 'Agregar Observaciones',
      description: 'Si seleccionaste la sucursal "Centro", puedes agregar observaciones especiales para el pedido.',
      icon: '📝'
    },
    {
      number: 6,
      title: 'Revisar Pedido',
      description: 'Haz clic en "Revisar Pedido" para ver un resumen completo de tu orden antes de enviarlo.',
      icon: '👀'
    },
    {
      number: 7,
      title: 'Confirmar y Enviar',
      description: 'En la pantalla de revisión, verifica que todo esté correcto y presiona "Confirmar Pedido". El pedido se guardará en el sistema automáticamente.',
      icon: '✅'
    },
    {
      number: 8,
      title: 'Compartir por WhatsApp',
      description: 'Después de confirmar, puedes enviar el resumen del pedido por WhatsApp al número configurado para mantener un registro.',
      icon: '📱'
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
                <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 md:p-6 rounded-lg mb-8 max-w-4xl mx-auto">
        <div className="flex items-start gap-3">
          <span className="text-2xl md:text-3xl">💡</span>
          <div>
            <h3 className="font-bold text-[#2c3e50] text-base md:text-lg mb-2">
              Consejos Útiles
            </h3>
            <ul className="space-y-2 text-gray-700 text-sm md:text-base">
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">•</span>
                <span>Asegúrate de revisar el pedido antes de confirmarlo, ya que no podrás editarlo después.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">•</span>
                <span>Si necesitas ayuda, usa el botón de WhatsApp en la página principal.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">•</span>
                <span>Los pedidos se guardan automáticamente y pueden ser consultados desde el panel administrativo.</span>
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
