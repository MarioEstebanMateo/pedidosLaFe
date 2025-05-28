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
  
  // Update the formatDate function to include the day name and proper formatting
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    // Split the date string into components
    const [year, month, day] = dateString.split('-').map(Number);
    
    // Create a date object using UTC to avoid timezone shifting
    const date = new Date(Date.UTC(year, month - 1, day));
    
    // Get day name in Spanish
    const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const dayName = dayNames[date.getUTCDay()];
    
    // Get month name in Spanish
    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                       'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const monthName = monthNames[date.getUTCMonth()];
    
    // Format the date as "Miércoles 29 de Mayo de 2025"
    return `${dayName} ${day} de ${monthName} de ${year}`;
  }
  
  const handleGoBack = () => {
    navigate('/')
  }
  
  // Update the PDF generation function to better organize columns and fit one page
  const generatePDF = () => {
    // Create a new document with A4 dimensions (210 x 297 mm)
    const doc = new jsPDF({
      format: 'a4',
      unit: 'mm',
      // Add minimum margins
      margins: {
        top: 1,
        bottom: 1,
        left: 1,
        right: 1
      }
    });
    
    // Get page dimensions
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    // Remove the logo section
    // doc.addImage(logoLaFe, 'PNG', 10, 7, 15, 15); - removed
    
    // Replace the title with sucursal name (centered)
    doc.setFontSize(10); // Keep this size for the sucursal name
    doc.text(`Sucursal: ${orderData.sucursalTitle}`, pageWidth / 2, 10, { align: 'center' }); // Center sucursal name
    
    // Add delivery date centered below sucursal
    doc.setFontSize(10); // Slightly smaller for the date
    doc.text(`Fecha de entrega: ${formatDate(orderData.orderDate)}`, pageWidth / 2, 18, { align: 'center' }); // Center date below sucursal
    
    // Always use 2-column layout with Helados in left column, others in right
    // Create left column table data for Helados only
    const leftTableData = [['Producto', 'Cant', 'Kgs']];
    
    // Create right column table data for all other products
    const rightTableData = [['Producto', 'Cant', 'Kgs']];
    
    // Add Helados to left column
    if (orderData.products.helados.length > 0) {
      // Add category header - updated style
      leftTableData.push([{ 
        content: 'Helados', 
        colSpan: 3, 
        styles: { 
          fontStyle: 'bold', 
          fillColor: [0, 0, 0],  // Black background 
          textColor: [255, 255, 255], // White text
          halign: 'center' // Center alignment
        } 
      }]);
      
      // Sort helados products by ID before adding to table
      const sortedHelados = sortProductsByID(orderData.products.helados);
      sortedHelados.forEach(item => {
        leftTableData.push([item.title, item.quantity, '']);
      });
    }
    
    // Add remaining product types to right column
    // Palitos
    if (orderData.products.palitos.length > 0) {
      rightTableData.push([{ 
        content: 'Palitos', 
        colSpan: 3, 
        styles: { 
          fontStyle: 'bold', 
          fillColor: [0, 0, 0],  // Black background 
          textColor: [255, 255, 255], // White text
          halign: 'center' // Center alignment
        } 
      }]);
      const sortedPalitos = sortProductsByID(orderData.products.palitos);
      sortedPalitos.forEach(item => {
        rightTableData.push([item.title, item.quantity, '']);
      });
    }
    
    // Postres
    if (orderData.products.postres.length > 0) {
      rightTableData.push([{ 
        content: 'Postres', 
        colSpan: 3, 
        styles: { 
          fontStyle: 'bold', 
          fillColor: [0, 0, 0],  // Black background for printing compatibility
          textColor: [255, 255, 255], 
          halign: 'center' 
        } 
      }]);
      const sortedPostres = sortProductsByID(orderData.products.postres);
      sortedPostres.forEach(item => {
        rightTableData.push([item.title, item.quantity, '']);
      });
    }
    
    // Crocker
    if (orderData.products.crocker.length > 0) {
      rightTableData.push([{ 
        content: 'Crocker', 
        colSpan: 3, 
        styles: { 
          fontStyle: 'bold', 
          fillColor: [0, 0, 0],  // Black background for printing compatibility
          textColor: [255, 255, 255], 
          halign: 'center' 
        } 
      }]);
      const sortedCrocker = sortProductsByID(orderData.products.crocker);
      sortedCrocker.forEach(item => {
        rightTableData.push([item.title, item.quantity, '']);
      });
    }
    
    // Dieteticos
    if (orderData.products.dieteticos.length > 0) {
      rightTableData.push([{ 
        content: 'Dietéticos', 
        colSpan: 3, 
        styles: { 
          fontStyle: 'bold', 
          fillColor: [0, 0, 0],  // Black background for printing compatibility
          textColor: [255, 255, 255], 
          halign: 'center' 
        } 
      }]);
      const sortedDieteticos = sortProductsByID(orderData.products.dieteticos);
      sortedDieteticos.forEach(item => {
        rightTableData.push([item.title, item.quantity, '']);
      });
    }
    
    // Buffet
    if (orderData.products.buffet.length > 0) {
      rightTableData.push([{ 
        content: 'Buffet', 
        colSpan: 3, 
        styles: { 
          fontStyle: 'bold', 
          fillColor: [0, 0, 0],  // Black background for printing compatibility
          textColor: [255, 255, 255], 
          halign: 'center' 
        } 
      }]);
      const sortedBuffet = sortProductsByID(orderData.products.buffet);
      sortedBuffet.forEach(item => {
        rightTableData.push([item.title, item.quantity, '']);
      });
    }
    
    // Softs
    if (orderData.products.softs.length > 0) {
      rightTableData.push([{ 
        content: 'Softs', 
        colSpan: 3, 
        styles: { 
          fontStyle: 'bold', 
          fillColor: [0, 0, 0],  // Black background for printing compatibility
          textColor: [255, 255, 255], 
          halign: 'center' 
        } 
      }]);
      const sortedSofts = sortProductsByID(orderData.products.softs);
      sortedSofts.forEach(item => {
        rightTableData.push([item.title, item.quantity, '']);
      });
    }
    
    // Dulces
    if (orderData.products.dulces.length > 0) {
      rightTableData.push([{ 
        content: 'Dulces', 
        colSpan: 3, 
        styles: { 
          fontStyle: 'bold', 
          fillColor: [0, 0, 0],  // Black background for printing compatibility
          textColor: [255, 255, 255], 
          halign: 'center' 
        } 
      }]);
      const sortedDulces = sortProductsByID(orderData.products.dulces);
      sortedDulces.forEach(item => {
        rightTableData.push([item.title, item.quantity, '']);
      });
    }
    
    // Paletas
    if (orderData.products.paletas.length > 0) {
      rightTableData.push([{ 
        content: 'Paletas', 
        colSpan: 3, 
        styles: { 
          fontStyle: 'bold', 
          fillColor: [0, 0, 0],  // Black background for printing compatibility
          textColor: [255, 255, 255], 
          halign: 'center' 
        } 
      }]);
      const sortedPaletas = sortProductsByID(orderData.products.paletas);
      sortedPaletas.forEach(item => {
        rightTableData.push([item.title, item.quantity, '']);
      });
    }
    
    // Bites
    if (orderData.products.bites.length > 0) {
      rightTableData.push([{ 
        content: 'Bites', 
        colSpan: 3, 
        styles: { 
          fontStyle: 'bold', 
          fillColor: [0, 0, 0],  // Black background for printing compatibility
          textColor: [255, 255, 255], 
          halign: 'center' 
        } 
      }]);
      const sortedBites = sortProductsByID(orderData.products.bites);
      sortedBites.forEach(item => {
        rightTableData.push([item.title, item.quantity, '']);
      });
    }
    
    // Barritas
    if (orderData.products.barritas.length > 0) {
      rightTableData.push([{ 
        content: 'Barritas', 
        colSpan: 3, 
        styles: { 
          fontStyle: 'bold', 
          fillColor: [0, 0, 0],  // Black background for printing compatibility
          textColor: [255, 255, 255], 
          halign: 'center' 
        } 
      }]);
      const sortedBarritas = sortProductsByID(orderData.products.barritas);
      sortedBarritas.forEach(item => {
        rightTableData.push([item.title, item.quantity, '']);
      });
    }
    
    // Termicos
    if (orderData.products.termicos.length > 0) {
      rightTableData.push([{ 
        content: 'Térmicos', 
        colSpan: 3, 
        styles: { 
          fontStyle: 'bold', 
          fillColor: [0, 0, 0],  // Black background for printing compatibility
          textColor: [255, 255, 255], 
          halign: 'center' 
        } 
      }]);
      const sortedTermicos = sortProductsByID(orderData.products.termicos);
      sortedTermicos.forEach(item => {
        rightTableData.push([item.title, item.quantity, '']);
      });
    }
    
    // Count total products to determine if we need smaller font
    const totalProducts = 
      orderData.products.helados.length + 
      orderData.products.postres.length + 
      orderData.products.softs.length + 
      orderData.products.termicos.length +
      orderData.products.palitos.length + 
      orderData.products.crocker.length + 
      orderData.products.dieteticos.length + 
      orderData.products.buffet.length + 
      orderData.products.dulces.length + 
      orderData.products.paletas.length + 
      orderData.products.bites.length + 
      orderData.products.barritas.length;
    
    // Use smaller font and tighter spacing if many products
    const useTinyFont = totalProducts > 50;
    
    // Adjust these base font size values
    const baseFontSize = useTinyFont ? 7 : 8;  // Increased from 6/7 to 7/8
    const headerFontSize = useTinyFont ? 7 : 8;  // Increased from 6/7 to 7/8
    const cellPadding = useTinyFont ? 1 : 1.5;  // Slightly increased padding
    
    // Set starting Y position 
    const startY = 25; // Keep this value as it works well with the new header
    
    // Only draw left column table (Helados) if it has products (more than just the header)
    if (leftTableData.length > 1) {
      autoTable(doc, {
        startY: startY,
        margin: { left: 5, right: pageWidth / 2 + 1 }, // Adjusted to reduce gap
        head: [leftTableData[0]],
        body: leftTableData.slice(1),
        theme: 'striped',
        headStyles: { 
          fillColor: [0, 0, 0],   // Black background for printing compatibility
          textColor: [255, 255, 255], 
          fontSize: headerFontSize,  // Use new variable
          cellPadding: cellPadding, // Use new variable
          lineWidth: 0.1,
          lineColor: [0, 0, 0],
          halign: 'center' // Center the header text
        },
        styles: {
          fontSize: baseFontSize,  // Use new variable
          cellPadding: cellPadding, // Use new variable
          overflow: 'linebreak',
          lineWidth: 0.1,
          lineColor: [0, 0, 0],
          textColor: [0, 0, 0]    // Explicitly set text to black
        },
        columnStyles: {
          0: { cellWidth: 40 },          // Slightly increased
          1: { cellWidth: 12, halign: 'center' },
          2: { cellWidth: 30, halign: 'center' }
        },
        tableWidth: (pageWidth / 2)// Adjusted width to make tables touch
      });
    }
    
    // Only draw right column table if it has products (more than just the header)
    if (rightTableData.length > 1) {
      autoTable(doc, {
        startY: startY,
        margin: { left: pageWidth / 2 - 1, right: 5 }, // Adjusted to reduce gap
        head: [rightTableData[0]],
        body: rightTableData.slice(1),
        theme: 'striped',
        headStyles: { 
          fillColor: [0, 0, 0],   // Black background for printing compatibility
          textColor: [255, 255, 255], 
          fontSize: headerFontSize,  // Use new variable
          cellPadding: cellPadding, // Use new variable
          lineWidth: 0.1,
          lineColor: [0, 0, 0],
          halign: 'center' // Center the header text
        },
        styles: {
          fontSize: baseFontSize,  // Use new variable
          cellPadding: cellPadding, // Use new variable
          overflow: 'linebreak',
          lineWidth: 0.1,
          lineColor: [0, 0, 0],
          textColor: [0, 0, 0]    // Explicitly set text to black
        },
        columnStyles: {
          0: { cellWidth: 50 },          // Slightly increased
          1: { cellWidth: 12, halign: 'center' },
          2: { cellWidth: 30, halign: 'center' }
        },
        tableWidth: (pageWidth / 2)  // Adjusted width to make tables touch
      });
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
  
  // Helper function to sort products by ID
  const sortProductsByID = (products) => {
    return [...products].sort((a, b) => a.id - b.id);
  };
  
  // Update the renderProductRows function to sort products by ID
  const renderProductRows = (productType, displayName) => {
    if (!orderData.products[productType] || orderData.products[productType].length === 0) {
      return null;
    }
    
    // Sort products by ID before rendering
    const sortedProducts = sortProductsByID(orderData.products[productType]);
    
    return [
      // Add category header row - updated with a new color
      <tr key={`${productType}-header`} className="bg-[#2980b9]">
        <td colSpan="3" className="py-2 px-4 border-b border-gray-300 font-bold text-white text-center">{displayName}</td>
      </tr>,
      // Add product rows
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
              {renderProductRows('helados', 'Helados')}
              {renderProductRows('palitos', 'Palitos')}
              {renderProductRows('postres', 'Postres')}
              {renderProductRows('crocker', 'Crocker')}
              {renderProductRows('dieteticos', 'Dietéticos')}
              {renderProductRows('buffet', 'Buffet')}
              {renderProductRows('softs', 'Softs')}
              {renderProductRows('dulces', 'Dulces')}
              {renderProductRows('paletas', 'Paletas')}
              {renderProductRows('bites', 'Bites')}
              {renderProductRows('barritas', 'Barritas')}
              {renderProductRows('termicos', 'Térmicos')}
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
    </div>
  )
}

export default ReviewOrder