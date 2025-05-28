import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useOrderContext } from '../context/OrderContext'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import logoLaFe from '../assets/img/logo-lafe.png'
import iconWhatsapp from '../assets/img/iconWhatsapp.png'
import iconPdf from '../assets/img/iconPdf.png'

const ReviewOrder = () => {
  const { orderData } = useOrderContext()
  const navigate = useNavigate()
  const pdfRef = useRef(null)
  
  // Check if any products were selected across all categories
  const hasProducts = Object.values(orderData.products).some(arr => arr.length > 0)
  
  // Format date for display without timezone issues
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    // Split the date string into components
    const [year, month, day] = dateString.split('-').map(Number);
    
    // Create a date object using UTC to avoid timezone shifting
    // Note: month is 0-indexed in JavaScript Date
    const date = new Date(Date.UTC(year, month - 1, day));
    
    // Format using toLocaleDateString with explicit options to keep the date as is
    return date.toLocaleDateString('es-ES', { 
      timeZone: 'UTC',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  }
  
  const handleGoBack = () => {
    navigate('/')
  }
  
  // The PDF generation function doesn't need any changes as it's not using inline styles
  const generatePDF = () => {
    // Create a new document with A4 dimensions (210 x 297 mm)
    const doc = new jsPDF({
      format: 'a4',
      unit: 'mm',
    });
    
    // Get page dimensions
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    // Add logo - make it smaller (15x15 mm to save space)
    doc.addImage(logoLaFe, 'PNG', 10, 7, 15, 15);
    
    // Add title - center it based on A4 width but save space
    doc.setFontSize(16);
    doc.text('Pedido La Fe', pageWidth / 2, 15, { align: 'center' });
    
    // Add order details - make them more compact
    doc.setFontSize(10);
    doc.text(`Fecha de entrega: ${formatDate(orderData.orderDate)}`, 15, 25);
    doc.text(`Sucursal: ${orderData.sucursalTitle}`, 15, 30);
    
    // Count total products to determine layout approach
    const totalProducts = 
      orderData.products.helados.length + 
      orderData.products.postres.length + 
      orderData.products.softs.length + 
      orderData.products.termicos.length +
      // Add new categories
      orderData.products.palitos.length + 
      orderData.products.crocker.length + 
      orderData.products.dieteticos.length + 
      orderData.products.buffet.length + 
      orderData.products.dulces.length + 
      orderData.products.paletas.length + 
      orderData.products.bites.length + 
      orderData.products.barritas.length;
    
    // Always use 2-column layout for more than 10 items
    // For very large orders (>30), use even smaller font
    const useMultiColumn = totalProducts > 60;
    const useTinyFont = totalProducts > 30;
    
    if (useMultiColumn) {
      // Create left column table data
      const leftTableData = [['Tipo', 'Producto', 'Cant.', 'Kgs']];
      // Create right column table data
      const rightTableData = [['Tipo', 'Producto', 'Cant.', 'Kgs']];
      
      // Collect all products into a single array
      const allProducts = [];
      
      if (orderData.products.helados.length > 0) {
        orderData.products.helados.forEach(item => {
          allProducts.push(['Helado', item.title, item.quantity, '']);
        });
      }
      
      if (orderData.products.palitos.length > 0) {
        orderData.products.palitos.forEach(item => {
          allProducts.push(['Palito', item.title, item.quantity, '']);
        });
      }
      
      if (orderData.products.postres.length > 0) {
        orderData.products.postres.forEach(item => {
          allProducts.push(['Postre', item.title, item.quantity, '']);
        });
      }
      
      if (orderData.products.crocker.length > 0) {
        orderData.products.crocker.forEach(item => {
          allProducts.push(['Crocker', item.title, item.quantity, '']);
        });
      }
      
      if (orderData.products.dieteticos.length > 0) {
        orderData.products.dieteticos.forEach(item => {
          allProducts.push(['Dietético', item.title, item.quantity, '']);
        });
      }
      
      if (orderData.products.buffet.length > 0) {
        orderData.products.buffet.forEach(item => {
          allProducts.push(['Buffet', item.title, item.quantity, '']);
        });
      }
      
      if (orderData.products.softs.length > 0) {
        orderData.products.softs.forEach(item => {
          allProducts.push(['Soft', item.title, item.quantity, '']);
        });
      }
      
      if (orderData.products.dulces.length > 0) {
        orderData.products.dulces.forEach(item => {
          allProducts.push(['Dulce', item.title, item.quantity, '']);
        });
      }
      
      if (orderData.products.paletas.length > 0) {
        orderData.products.paletas.forEach(item => {
          allProducts.push(['Paleta', item.title, item.quantity, '']);
        });
      }
      
      if (orderData.products.bites.length > 0) {
        orderData.products.bites.forEach(item => {
          allProducts.push(['Bite', item.title, item.quantity, '']);
        });
      }
      
      if (orderData.products.barritas.length > 0) {
        orderData.products.barritas.forEach(item => {
          allProducts.push(['Barrita', item.title, item.quantity, '']);
        });
      }
      
      // Add missing termicos category
      if (orderData.products.termicos.length > 0) {
        orderData.products.termicos.forEach(item => {
          allProducts.push(['Térmico', item.title, item.quantity, '']);
        });
      }
      
      // Split products between columns
      const halfIndex = Math.ceil(allProducts.length / 2);
      const leftProducts = allProducts.slice(0, halfIndex);
      const rightProducts = allProducts.slice(halfIndex);
      
      // Add products to respective column data
      leftTableData.push(...leftProducts);
      rightTableData.push(...rightProducts);
      
      // Set starting Y position higher to save space
      const startY = 35;
      
      // Draw left column table with compact settings
      autoTable(doc, {
        startY: startY,
        margin: { left: 5, right: pageWidth / 2 + 5 },
        head: [leftTableData[0]],
        body: leftTableData.slice(1),
        theme: 'striped',
        headStyles: { 
          fillColor: [52, 152, 219],
          fontSize: useTinyFont ? 6 : 7,
          cellPadding: 1,
          lineWidth: 0.1,
          lineColor: [0, 0, 0]
        },
        styles: {
          fontSize: useTinyFont ? 6 : 7,
          cellPadding: useTinyFont ? 0.8 : 1.2,
          overflow: 'linebreak',
          lineWidth: 0.1,
          lineColor: [0, 0, 0]
        },
        columnStyles: {
          0: { cellWidth: 14 },
          1: { cellWidth: 35 },
          2: { cellWidth: 15, halign: 'center' },
          3: { cellWidth: 30, halign: 'center' }
        },
        tableWidth: (pageWidth / 2) - 10
      });
      
      // Draw right column table with compact settings
      autoTable(doc, {
        startY: startY,
        margin: { left: pageWidth / 2 + 5, right: 5 },
        head: [rightTableData[0]],
        body: rightTableData.slice(1),
        theme: 'striped',
        headStyles: { 
          fillColor: [52, 152, 219],
          fontSize: useTinyFont ? 6 : 7,
          cellPadding: 1,
          lineWidth: 0.1,
          lineColor: [0, 0, 0]
        },
        styles: {
          fontSize: useTinyFont ? 6 : 7,
          cellPadding: useTinyFont ? 0.8 : 1.2,
          overflow: 'linebreak',
          lineWidth: 0.1,
          lineColor: [0, 0, 0]
        },
        columnStyles: {
          0: { cellWidth: 14 },
          1: { cellWidth: 35 },
          2: { cellWidth: 15, halign: 'center' },
          3: { cellWidth: 30, halign: 'center' }
        },
        tableWidth: (pageWidth / 2) - 10
      });
    } else {
      // Simplified single-column layout for smaller orders
      const tableData = [['Tipo', 'Producto', 'Cant.', 'Kgs']];
      
      // Add all products in order by type
      if (orderData.products.helados.length > 0) {
        orderData.products.helados.forEach(item => {
          tableData.push(['Helado', item.title, item.quantity, '']);
        });
      }
      
      if (orderData.products.palitos.length > 0) {
        orderData.products.palitos.forEach(item => {
          tableData.push(['Palito', item.title, item.quantity, '']);
        });
      }
      
      if (orderData.products.postres.length > 0) {
        orderData.products.postres.forEach(item => {
          tableData.push(['Postre', item.title, item.quantity, '']);
        });
      }
      
      if (orderData.products.crocker.length > 0) {
        orderData.products.crocker.forEach(item => {
          tableData.push(['Crocker', item.title, item.quantity, '']);
        });
      }
      
      if (orderData.products.dieteticos.length > 0) {
        orderData.products.dieteticos.forEach(item => {
          tableData.push(['Dietético', item.title, item.quantity, '']);
        });
      }
      
      if (orderData.products.buffet.length > 0) {
        orderData.products.buffet.forEach(item => {
          tableData.push(['Buffet', item.title, item.quantity, '']);
        });
      }
      
      if (orderData.products.softs.length > 0) {
        orderData.products.softs.forEach(item => {
          tableData.push(['Soft', item.title, item.quantity, '']);
        });
      }
      
      if (orderData.products.dulces.length > 0) {
        orderData.products.dulces.forEach(item => {
          tableData.push(['Dulce', item.title, item.quantity, '']);
        });
      }
      
      if (orderData.products.paletas.length > 0) {
        orderData.products.paletas.forEach(item => {
          tableData.push(['Paleta', item.title, item.quantity, '']);
        });
      }
      
      if (orderData.products.bites.length > 0) {
        orderData.products.bites.forEach(item => {
          tableData.push(['Bite', item.title, item.quantity, '']);
        });
      }
      
      if (orderData.products.barritas.length > 0) {
        orderData.products.barritas.forEach(item => {
          tableData.push(['Barrita', item.title, item.quantity, '']);
        });
      }
      
      // Add missing termicos category
      if (orderData.products.termicos.length > 0) {
        orderData.products.termicos.forEach(item => {
          tableData.push(['Térmico', item.title, item.quantity, '']);
        });
      }
      
      if (tableData.length > 1) {
        // Use the imported autotable function with optimized settings
        autoTable(doc, {
          startY: 35,
          margin: { left: 15, right: 15 },
          head: [tableData[0]],
          body: tableData.slice(1),
          theme: 'striped',
          headStyles: { 
            fillColor: [52, 152, 219],
            fontSize: 8,
            lineWidth: 0.1,
            lineColor: [0, 0, 0]
          },
          styles: {
            fontSize: 8,
            cellPadding: 2,
            lineWidth: 0.1,
            lineColor: [0, 0, 0]
          },
          columnStyles: {
            0: { cellWidth: 14 },
            1: { cellWidth: 35 },
            2: { cellWidth: 15, halign: 'center' },
            3: { cellWidth: 30, halign: 'center' }
          }
        });
      }
    }
    
    return doc;
  }
  
  const handleSendWhatsapp = () => {
    const doc = generatePDF()
    const pdfBlob = doc.output('blob')
    
    // Use consistent filename for both saving and sharing
    const pdfFilename = `Pedido_LaFe_${orderData.sucursalTitle}_${formatDate(orderData.orderDate).replace(/\//g, '-')}.pdf`
    
    // Create a temporary link for download as a fallback
    const pdfUrl = URL.createObjectURL(pdfBlob)
    
    // Create text for WhatsApp
    const message = `Nuevo pedido para sucursal ${orderData.sucursalTitle} - Fecha de entrega: ${formatDate(orderData.orderDate)}`
    
    // Try to share via Web Share API
    try {
      if (navigator.share) {
        navigator.share({
          title: 'Pedido La Fe',
          text: message,
          files: [new File([pdfBlob], pdfFilename, { type: 'application/pdf' })]
        }).catch(error => {
          console.error('Error sharing:', error)
          // Fallback to direct WhatsApp link
          window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank')
        })
      } else {
        // Direct WhatsApp link without specific number
        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank')
        
        // Offer direct download
        const link = document.createElement('a')
        link.href = pdfUrl
        link.download = pdfFilename
        link.click()
      }
    } catch (error) {
      console.error('Error sharing:', error)
      // Fallback to direct WhatsApp link without specific number
      window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank')
      
      const link = document.createElement('a')
      link.href = pdfUrl
      link.download = pdfFilename
      link.click()
    }
  }
  
  // Add a function to handle PDF saving
  const handleSavePDF = () => {
    const doc = generatePDF()
    const pdfBlob = doc.output('blob')
    const pdfUrl = URL.createObjectURL(pdfBlob)
    
    // Create a download link and trigger it
    const link = document.createElement('a')
    link.href = pdfUrl
    link.download = `Pedido_LaFe_${orderData.sucursalTitle}_${formatDate(orderData.orderDate).replace(/\//g, '-')}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  
  // Helper function to render product rows with Tailwind classes
  const renderProductRows = (productType, displayName) => {
    if (!orderData.products[productType] || orderData.products[productType].length === 0) {
      return null;
    }
    
    return orderData.products[productType].map((item, index) => (
      <tr key={`${productType}-${item.id}`} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
        <td className="py-3 px-4 border-b border-gray-200">{displayName}</td>
        <td className="py-3 px-4 border-b border-gray-200">{item.title}</td>
        <td className="py-3 px-4 border-b border-gray-200">{item.quantity}</td>
        <td className="py-3 px-4 border-b border-gray-200">{/* Empty cell for Kgs */}</td>
      </tr>
    ));
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
                <th className="bg-[#3498db] text-white py-3 px-4 text-left">Tipo</th>
                <th className="bg-[#3498db] text-white py-3 px-4 text-left">Producto</th>
                <th className="bg-[#3498db] text-white py-3 px-4 text-left">Cantidad</th>
                <th className="bg-[#3498db] text-white py-3 px-4 text-left">Kgs</th>
              </tr>
            </thead>
            <tbody>
              {renderProductRows('helados', 'Helado')}
              {renderProductRows('palitos', 'Palito')}
              {renderProductRows('postres', 'Postre')}
              {renderProductRows('crocker', 'Crocker')}
              {renderProductRows('dieteticos', 'Dietético')}
              {renderProductRows('buffet', 'Buffet')}
              {renderProductRows('softs', 'Soft')}
              {renderProductRows('dulces', 'Dulce')}
              {renderProductRows('paletas', 'Paleta')}
              {renderProductRows('bites', 'Bite')}
              {renderProductRows('barritas', 'Barrita')}
              {renderProductRows('termicos', 'Térmico')}
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
              className="py-3 px-5 text-base rounded font-bold bg-red-500 text-white flex items-center justify-center gap-2.5"
            >
              {iconPdf && <img src={iconPdf} alt="PDF" className="w-5 h-5" />}
              Guardar PDF
            </button>
            
            <button 
              onClick={handleSendWhatsapp}
              className="py-3 px-5 text-base rounded font-bold bg-[#25D366] text-white flex items-center justify-center gap-2.5"
            >
              <img src={iconWhatsapp} alt="WhatsApp" className="w-5 h-5" />
              Enviar por WhatsApp
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default ReviewOrder