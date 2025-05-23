import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useOrderContext } from '../context/OrderContext'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import logoLaFe from '../assets/img/logo-lafe.png'
import iconWhatsapp from '../assets/img/iconWhatsapp.png'
import iconPdf from '../assets/img/iconPdf.png' // You'll need to add this image to your assets

const ReviewOrder = () => {
  const { orderData } = useOrderContext()
  const navigate = useNavigate()
  const pdfRef = useRef(null)
  
  // Check if any products were selected
  const hasProducts = Object.values(orderData.products).some(arr => arr.length > 0)
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES')
  }
  
  const handleGoBack = () => {
    navigate('/')
  }
  
  // Update the PDF generation function
  const generatePDF = () => {
    // Create a new document with A4 dimensions (210 x 297 mm)
    const doc = new jsPDF({
      format: 'a4',
      unit: 'mm',
    });
    
    // Get page dimensions
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Add logo - make it smaller (20x20 mm instead of 30x30)
    doc.addImage(logoLaFe, 'PNG', 10, 10, 20, 20);
    
    // Add title - center it based on A4 width
    doc.setFontSize(18);
    doc.text('Pedido La Fe', pageWidth / 2, 20, { align: 'center' });
    
    // Add order details
    doc.setFontSize(12);
    doc.text(`Fecha de entrega: ${formatDate(orderData.orderDate)}`, 15, 40);
    doc.text(`Sucursal: ${orderData.sucursalTitle}`, 15, 47);
    
    // Add products table
    const tableData = [];
    
    // Add helados if there are any
    if (orderData.products.helados.length > 0) {
      tableData.push(['Tipo', 'Producto', 'Cantidad', 'Kgs']); // Keep Kgs column
      orderData.products.helados.forEach(item => {
        // Leave the Kgs value blank for manual filling
        tableData.push(['Helado', item.title, item.quantity, '']);
      });
    }
    
    // Add postres if there are any
    if (orderData.products.postres.length > 0) {
      if (tableData.length === 0) tableData.push(['Tipo', 'Producto', 'Cantidad', 'Kgs']);
      orderData.products.postres.forEach(item => {
        tableData.push(['Postre', item.title, item.quantity, '']);
      });
    }
    
    // Add softs if there are any
    if (orderData.products.softs.length > 0) {
      if (tableData.length === 0) tableData.push(['Tipo', 'Producto', 'Cantidad', 'Kgs']);
      orderData.products.softs.forEach(item => {
        tableData.push(['Soft', item.title, item.quantity, '']);
      });
    }
    
    // Add termicos if there are any
    if (orderData.products.termicos.length > 0) {
      if (tableData.length === 0) tableData.push(['Tipo', 'Producto', 'Cantidad', 'Kgs']);
      orderData.products.termicos.forEach(item => {
        tableData.push(['Térmico', item.title, item.quantity, '']);
      });
    }
    
    if (tableData.length > 0) {
      // Use the imported autotable function with A4-friendly margins
      autoTable(doc, {
        startY: 55,
        margin: { left: 15, right: 15 },
        head: [tableData[0]],
        body: tableData.slice(1),
        theme: 'striped',
        headStyles: { fillColor: [52, 152, 219] },
        // Make table fit within A4 boundaries
        styles: {
          fontSize: 10,
          cellPadding: 3
        }
      });
    }
    
    return doc;
  }
  
  const handleSendWhatsapp = () => {
    const doc = generatePDF()
    const pdfBlob = doc.output('blob')
    
    // Create a FormData to send the file
    const formData = new FormData()
    formData.append('file', pdfBlob, 'PedidoLaFe.pdf')
    
    // Create a temporary link for download as a fallback
    const pdfUrl = URL.createObjectURL(pdfBlob)
    
    // Create text for WhatsApp
    const message = `Nuevo pedido para sucursal ${orderData.sucursalTitle} - Fecha de entrega: ${formatDate(orderData.orderDate)}`
    
    // Specific WhatsApp number to send to
    const whatsappNumber = '+542477347638'
    
    // Try to share via Web Share API
    try {
      if (navigator.share) {
        navigator.share({
          title: 'Pedido La Fe',
          text: message,
          files: [new File([pdfBlob], 'PedidoLaFe.pdf', { type: 'application/pdf' })]
        }).then(() => {
          // Also open WhatsApp with the specific number
          window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank')
        }).catch(error => {
          console.error('Error sharing:', error)
          // Fallback to direct WhatsApp link
          window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank')
        })
      } else {
        // Direct WhatsApp link with the specific number
        window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank')
        
        // Offer direct download
        const link = document.createElement('a')
        link.href = pdfUrl
        link.download = 'PedidoLaFe.pdf'
        link.click()
      }
    } catch (error) {
      console.error('Error sharing:', error)
      // Fallback to direct WhatsApp link with the specific number
      window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank')
      
      const link = document.createElement('a')
      link.href = pdfUrl
      link.download = 'PedidoLaFe.pdf'
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
                <th style={styles.th}>Kgs</th> {/* New column */}
              </tr>
            </thead>
            <tbody>
              {orderData.products.helados.map((item, index) => (
                <tr key={`helado-${item.id}`} style={index % 2 === 0 ? styles.tr : styles.trAlternate}>
                  <td style={styles.td}>Helado</td>
                  <td style={styles.td}>{item.title}</td>
                  <td style={styles.td}>{item.quantity}</td>
                  <td style={styles.td}></td> {/* Empty cell for Kgs */}
                </tr>
              ))}
              
              {orderData.products.postres.map((item, index) => (
                <tr key={`postre-${item.id}`} style={index % 2 === 0 ? styles.tr : styles.trAlternate}>
                  <td style={styles.td}>Postre</td>
                  <td style={styles.td}>{item.title}</td>
                  <td style={styles.td}>{item.quantity}</td>
                  <td style={styles.td}></td> {/* Empty cell for Kgs */}
                </tr>
              ))}
              
              {orderData.products.softs.map((item, index) => (
                <tr key={`soft-${item.id}`} style={index % 2 === 0 ? styles.tr : styles.trAlternate}>
                  <td style={styles.td}>Soft</td>
                  <td style={styles.td}>{item.title}</td>
                  <td style={styles.td}>{item.quantity}</td>
                  <td style={styles.td}></td> {/* Empty cell for Kgs */}
                </tr>
              ))}
              
              {orderData.products.termicos.map((item, index) => (
                <tr key={`termico-${item.id}`} style={index % 2 === 0 ? styles.tr : styles.trAlternate}>
                  <td style={styles.td}>Térmico</td>
                  <td style={styles.td}>{item.title}</td>
                  <td style={styles.td}>{item.quantity}</td>
                  <td style={styles.td}></td> {/* Empty cell for Kgs */}
                </tr>
              ))}
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
              {/* If you don't have a PDF icon, you can use text only */}
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