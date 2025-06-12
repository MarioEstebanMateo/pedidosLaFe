import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useOrderContext } from '../context/OrderContext'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import logoLaFe from '../assets/img/logo-lafe.png'
import iconWhatsapp from '../assets/img/iconWhatsapp.png'
import iconPdf from '../assets/img/iconPdf.png'
import WhatsappHelp from './WhatsappHelp'

// Product categories configuration
const PRODUCT_CATEGORIES = [
  { name: 'helados', displayName: 'Helados', column: 'left' },
  { name: 'palitos', displayName: 'Palitos', column: 'right' },
  { name: 'postres', displayName: 'Postres', column: 'right' },
  { name: 'crocker', displayName: 'Crocker', column: 'right' },
  { name: 'dieteticos', displayName: 'Dietéticos', column: 'right' },
  { name: 'buffet', displayName: 'Buffet', column: 'right' },
  { name: 'softs', displayName: 'Softs', column: 'right' },
  { name: 'dulces', displayName: 'Dulces', column: 'right' },
  { name: 'paletas', displayName: 'Paletas', column: 'right' },
  { name: 'bites', displayName: 'Bites', column: 'right' },
  { name: 'barritas', displayName: 'Barritas', column: 'right' },
  { name: 'termicos', displayName: 'Térmicos', column: 'right' }
]

const ReviewOrder = () => {
  const { orderData } = useOrderContext()
  const navigate = useNavigate()
  const pdfRef = useRef(null)
  
  // Check if any products were selected across all categories
  const hasProducts = Object.values(orderData.products).some(arr => arr.length > 0)
  
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                         'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    
    return `${dayNames[date.getUTCDay()]} ${day} de ${monthNames[date.getUTCMonth()]} de ${year}`;
  }
  
  // Helper function to sort products by ID
  const sortProductsByID = (products) => {
    return [...products].sort((a, b) => a.id - b.id);
  };
  
  const handleGoBack = () => navigate('/')
  
  // Unified PDF generation function
  const generatePDF = () => {
    const doc = new jsPDF({
      format: 'a4',
      unit: 'mm',
      margins: { top: 1, bottom: 1, left: 1, right: 1 }
    });
    
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Add document title with sucursal and date
    doc.setFontSize(10);
    doc.text(`Sucursal: ${orderData.sucursalTitle}`, pageWidth / 2, 10, { align: 'center' });
    doc.text(`Fecha de entrega: ${formatDate(orderData.orderDate)}`, pageWidth / 2, 18, { align: 'center' });
    
    // Create table data for left and right columns
    const leftTableData = [['Producto', 'Cant', 'Kgs']];
    const rightTableData = [['Producto', 'Cant', 'Kgs']];
    
    // Count total products to determine font size
    const totalProducts = PRODUCT_CATEGORIES.reduce((count, category) => 
      count + (orderData.products[category.name]?.length || 0), 0);
    
    const useTinyFont = totalProducts > 50;
    const baseFontSize = useTinyFont ? 7 : 8;
    const headerFontSize = useTinyFont ? 7 : 8;
    const cellPadding = useTinyFont ? 1 : 1.5;
    
    // Add products to appropriate column
    PRODUCT_CATEGORIES.forEach(category => {
      const { name, displayName, column } = category;
      const products = orderData.products[name] || [];
      
      if (products.length > 0) {
        const targetTable = column === 'left' ? leftTableData : rightTableData;
        
        // Add category header
        targetTable.push([{ 
          content: displayName, 
          colSpan: 3, 
          styles: { 
            fontStyle: 'bold', 
            fillColor: [0, 0, 0],
            textColor: [255, 255, 255], 
            halign: 'center' 
          } 
        }]);
        
        // Add sorted products
        const sortedProducts = sortProductsByID(products);
        sortedProducts.forEach(item => {
          targetTable.push([item.title, item.quantity, '']);
        });
      }
    });
    
    // Draw left column table if not empty
    if (leftTableData.length > 1) {
      autoTable(doc, {
        startY: 25,
        margin: { left: 5, right: pageWidth / 2 + 1 },
        head: [leftTableData[0]],
        body: leftTableData.slice(1),
        theme: 'striped',
        headStyles: { 
          fillColor: [0, 0, 0],
          textColor: [255, 255, 255], 
          fontSize: headerFontSize,
          cellPadding: cellPadding,
          lineWidth: 0.1,
          lineColor: [0, 0, 0],
          halign: 'center'
        },
        styles: {
          fontSize: baseFontSize,
          cellPadding: cellPadding,
          overflow: 'linebreak',
          lineWidth: 0.1,
          lineColor: [0, 0, 0],
          textColor: [0, 0, 0]
        },
        columnStyles: {
          0: { cellWidth: 40 },
          1: { cellWidth: 12, halign: 'center' },
          2: { cellWidth: 30, halign: 'center' }
        },
        tableWidth: (pageWidth / 2)
      });
    }
    
    // Draw right column table if not empty
    if (rightTableData.length > 1) {
      autoTable(doc, {
        startY: 25,
        margin: { left: pageWidth / 2 - 1, right: 5 },
        head: [rightTableData[0]],
        body: rightTableData.slice(1),
        theme: 'striped',
        headStyles: { 
          fillColor: [0, 0, 0],
          textColor: [255, 255, 255], 
          fontSize: headerFontSize,
          cellPadding: cellPadding,
          lineWidth: 0.1,
          lineColor: [0, 0, 0],
          halign: 'center'
        },
        styles: {
          fontSize: baseFontSize,
          cellPadding: cellPadding,
          overflow: 'linebreak',
          lineWidth: 0.1,
          lineColor: [0, 0, 0],
          textColor: [0, 0, 0]
        },
        columnStyles: {
          0: { cellWidth: 50 },
          1: { cellWidth: 12, halign: 'center' },
          2: { cellWidth: 30, halign: 'center' }
        },
        tableWidth: (pageWidth / 2)
      });
    }
    
    return doc;
  }
  
  const handleSavePDF = () => {
    const doc = generatePDF()
    const pdfBlob = doc.output('blob')
    const pdfUrl = URL.createObjectURL(pdfBlob)
    
    const link = document.createElement('a')
    link.href = pdfUrl
    link.download = `Pedido_LaFe_${orderData.sucursalTitle}_${formatDate(orderData.orderDate).replace(/\//g, '-')}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  
  const handleSendWhatsapp = () => {
    const doc = generatePDF()
    const pdfBlob = doc.output('blob')
    
    const pdfFilename = `Pedido_LaFe_${orderData.sucursalTitle}_${formatDate(orderData.orderDate).replace(/\//g, '-')}.pdf`
    const pdfUrl = URL.createObjectURL(pdfBlob)
    const message = `Nuevo pedido para sucursal ${orderData.sucursalTitle} - Fecha de entrega: ${formatDate(orderData.orderDate)}`
    
    try {
      if (navigator.share) {
        navigator.share({
          title: 'Pedido La Fe',
          text: message,
          files: [new File([pdfBlob], pdfFilename, { type: 'application/pdf' })]
        }).catch(error => {
          console.error('Error sharing:', error)
          window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank')
        })
      } else {
        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank')
        
        const link = document.createElement('a')
        link.href = pdfUrl
        link.download = pdfFilename
        link.click()
      }
    } catch (error) {
      console.error('Error sharing:', error)
      window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank')
      
      const link = document.createElement('a')
      link.href = pdfUrl
      link.download = pdfFilename
      link.click()
    }
  }
  
  // Unified function to render product rows in table
  const renderProductRows = (productType, displayName) => {
    const products = orderData.products[productType]
    if (!products || products.length === 0) return null;
    
    const sortedProducts = sortProductsByID(products);
    
    return [
      <tr key={`${productType}-header`} className="bg-[#2980b9]">
        <td colSpan="3" className="py-2 px-4 border-b border-gray-300 font-bold text-white text-center">{displayName}</td>
      </tr>,
      ...sortedProducts.map((item, index) => (
        <tr key={`${productType}-${item.id}`} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
          <td className="py-3 px-4 border-b border-gray-200">{item.title}</td>
          <td className="py-3 px-4 border-b border-gray-200 text-center">{item.quantity}</td>
          <td className="py-3 px-4 border-b border-gray-200">{/* Empty cell for Kgs */}</td>
        </tr>
      ))
    ];
  };
  
  return (
    <div className="w-full max-w-3xl mx-auto p-5 font-sans box-border">
      <div className="flex flex-col items-center mb-8">
        <img src={logoLaFe} alt="Logo La Fe" className="w-32 mb-2.5" />
        <h1 className="text-2xl md:text-3xl text-[#2c3e50] my-1 text-center font-bold">Resumen del Pedido</h1>
      </div>
      
      <div className="bg-gray-50 p-5 rounded-lg mb-5 shadow-sm">
        <div className="flex justify-between py-2.5 border-b border-gray-100">
          <span className="font-bold text-[#2c3e50]">Fecha de entrega:</span>
          <span className="text-[#34495e]">{formatDate(orderData.orderDate)}</span>
        </div>
        <div className="flex justify-between py-2.5 border-b border-gray-100">
          <span className="font-bold text-[#2c3e50]">Sucursal:</span>
          <span className="text-[#34495e]">{orderData.sucursalTitle}</span>
        </div>
      </div>
      
      {hasProducts ? (
        <div ref={pdfRef}>
          <table className="w-full border-collapse mt-5 shadow-sm rounded-lg overflow-hidden">
            <thead>
              <tr>
                <th className="bg-[#3498db] text-white py-3 px-4 text-center">Producto</th>
                <th className="bg-[#3498db] text-white py-3 px-4 text-center">Cantidad</th>
                <th className="bg-[#3498db] text-white py-3 px-4 text-center">Kgs</th>
              </tr>
            </thead>
            <tbody>
              {PRODUCT_CATEGORIES.map(category => 
                renderProductRows(category.name, category.displayName)
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-10 text-gray-500 text-lg">
          No hay productos seleccionados para este pedido.
        </div>
      )}
      
      <div className="flex justify-between mt-8 flex-wrap gap-2.5">
        <button 
          onClick={handleGoBack}
          className="py-3 px-5 text-base rounded font-bold bg-gray-400 text-white"
        >
          Volver y Editar
        </button>
        
        {hasProducts && (
          <>
            <button 
              onClick={handleSavePDF}
              className="py-3 px-5 textBase rounded font-bold bg-red-500 text-white flex items-center justify-center gap-2.5"
            >
              {iconPdf && <img src={iconPdf} alt="PDF" className="w-5 h-5" />}
              Guardar PDF
            </button>
            
            <button 
              onClick={handleSendWhatsapp}
              className="py-3 px-5 textBase rounded font-bold bg-[#25D366] text-white flex items-center justify-center gap-2.5"
            >
              <img src={iconWhatsapp} alt="WhatsApp" className="w-5 h-5" />
              Enviar por WhatsApp
            </button>
          </>
        )}
      </div>
      
      {/* Replace the WhatsApp section with the new component */}
      <WhatsappHelp />
    </div>
  )
}

export default ReviewOrder