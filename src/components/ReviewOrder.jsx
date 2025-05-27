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
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES')
  }
  
  const handleGoBack = () => {
    navigate('/')
  }
  
  // Update the PDF generation function to include new categories
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
  
  // Helper function to render product rows
  const renderProductRows = (productType, displayName) => {
    if (!orderData.products[productType] || orderData.products[productType].length === 0) {
      return null;
    }
    
    return orderData.products[productType].map((item, index) => (
      <tr key={`${productType}-${item.id}`} style={index % 2 === 0 ? styles.tr : styles.trAlternate}>
        <td style={styles.td}>{displayName}</td>
        <td style={styles.td}>{item.title}</td>
        <td style={styles.td}>{item.quantity}</td>
        <td style={styles.td}>{/* Empty cell for Kgs */}</td>
      </tr>
    ));
  };
  
  // Styles (similar to your existing styles)
  const styles = {
    container: {
      width: '100%',
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      boxSizing: 'border-box',
    },
    header: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginBottom: '30px',
    },
    logo: {
      width: '120px',
      marginBottom: '10px',
    },
    title: {
      fontSize: '28px',
      color: '#2c3e50',
      margin: '5px 0',
      textAlign: 'center',
    },
    orderDetails: {
      background: '#f8f9fa',
      padding: '20px',
      borderRadius: '8px',
      marginBottom: '20px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    },
    detailRow: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '10px 0',
      borderBottom: '1px solid #eee',
    },
    label: {
      fontWeight: 'bold',
      color: '#2c3e50',
    },
    value: {
      color: '#34495e',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginTop: '20px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      borderRadius: '8px',
      overflow: 'hidden',
    },
    th: {
      backgroundColor: '#3498db',
      color: 'white',
      padding: '12px 15px',
      textAlign: 'left',
    },
    td: {
      padding: '12px 15px',
      borderBottom: '1px solid #ddd',
    },
    tr: {
      backgroundColor: 'white',
    },
    trAlternate: {
      backgroundColor: '#f9f9f9',
    },
    buttonContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '30px',
      flexWrap: 'wrap',
      gap: '10px',
    },
    button: {
      padding: '12px 20px',
      fontSize: '16px',
      borderRadius: '5px',
      border: 'none',
      cursor: 'pointer',
      fontWeight: 'bold',
    },
    backButton: {
      backgroundColor: '#95a5a6',
      color: 'white',
    },
    sendButton: {
      backgroundColor: '#25D366', // WhatsApp green
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
    },
    whatsappIcon: {
      width: '20px',
      height: '20px',
    },
    noProducts: {
      textAlign: 'center',
      padding: '40px',
      color: '#7f8c8d',
      fontSize: '18px',
    },
    pdfButton: {
      backgroundColor: '#e74c3c', // Red color for PDF button
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
    },
    pdfIcon: {
      width: '20px',
      height: '20px',
    },
  }
  
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <img src={logoLaFe} alt="Logo La Fe" style={styles.logo} />
        <h1 style={styles.title}>Resumen del Pedido</h1>
      </div>
      
      <div style={styles.orderDetails}>
        <div style={styles.detailRow}>
          <span style={styles.label}>Fecha de entrega:</span>
          <span style={styles.value}>{formatDate(orderData.orderDate)}</span>
        </div>
        <div style={styles.detailRow}>
          <span style={styles.label}>Sucursal:</span>
          <span style={styles.value}>{orderData.sucursalTitle}</span>
        </div>
      </div>
      
      {hasProducts ? (
        <div ref={pdfRef}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Tipo</th>
                <th style={styles.th}>Producto</th>
                <th style={styles.th}>Cantidad</th>
                <th style={styles.th}>Kgs</th>
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
              {renderProductRows('termicos', 'Térmico')}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={styles.noProducts}>
          No hay productos seleccionados para este pedido.
        </div>
      )}
      
      <div style={styles.buttonContainer}>
        <button 
          onClick={handleGoBack}
          style={{...styles.button, ...styles.backButton}}
        >
          Volver y Editar
        </button>
        
        {hasProducts && (
          <>
            <button 
              onClick={handleSavePDF}
              style={{...styles.button, ...styles.pdfButton}}
            >
              {iconPdf && <img src={iconPdf} alt="PDF" style={styles.pdfIcon} />}
              Guardar PDF
            </button>
            
            <button 
              onClick={handleSendWhatsapp}
              style={{...styles.button, ...styles.sendButton}}
            >
              <img src={iconWhatsapp} alt="WhatsApp" style={styles.whatsappIcon} />
              Enviar por WhatsApp
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default ReviewOrder