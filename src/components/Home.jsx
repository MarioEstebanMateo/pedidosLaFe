import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { testSupabaseConnection } from '../db/testSupabase'
import supabase from '../db/SupabaseClient'
import { useOrderContext } from '../context/OrderContext'
import Swal from 'sweetalert2'

import logoLaFe from '../assets/img/logo-lafe.png'

const Home = () => {
  const navigate = useNavigate()
  const { orderData, updateOrderData } = useOrderContext()
  
  const [sucursales, setSucursales] = useState([])
  const [helados, setHelados] = useState([])
  const [postres, setPostres] = useState([])
  const [softs, setSofts] = useState([])
  const [termicos, setTermicos] = useState([])
  
  // Track quantities separately for each product type
  const [heladosQuantities, setHeladosQuantities] = useState(orderData.heladosQuantities || {})
  const [postresQuantities, setPostresQuantities] = useState(orderData.postresQuantities || {})
  const [softsQuantities, setSoftsQuantities] = useState(orderData.softsQuantities || {})
  const [termicosQuantities, setTermicosQuantities] = useState(orderData.termicosQuantities || {})
  const [selectedSucursal, setSelectedSucursal] = useState(orderData.sucursalId || '')
  
  // Add state for order date - initialize with today's date or from context
  const [orderDate, setOrderDate] = useState(orderData.orderDate || new Date().toISOString().split('T')[0])

  // Fetch data from supabase and initialize once
  useEffect(() => {
    // Call the test function
    testSupabaseConnection().then(isConnected => {
      if (isConnected) {
        console.log('Supabase is working correctly!')
      } else {
        console.log('There was an issue with the Supabase connection')
      }
    })

    const fetchData = async () => {
      // Fetch all data first
      const [
        { data: sucursalesData, error: sucursalesError },
        { data: heladosData, error: heladosError },
        { data: postresData, error: postresError },
        { data: softsData, error: softsError },
        { data: termicosData, error: termicosError },
      ] = await Promise.all([
        supabase.from('sucursales').select('*'),
        supabase.from('helados').select('*'),
        supabase.from('postres').select('*'),
        supabase.from('softs').select('*'),
        supabase.from('termicos').select('*')
      ])

      // Process sucursales
      if (sucursalesError) {
        console.error('Error fetching sucursales:', sucursalesError)
      } else {
        setSucursales(sucursalesData)
      }

      // Process helados
      if (heladosError) {
        console.error('Error fetching helados:', heladosError)
      } else {
        setHelados(heladosData)
        
        // Only initialize if we don't have existing quantities
        // This preserves quantities when navigating back from review
        if (!orderData.heladosQuantities || Object.keys(orderData.heladosQuantities).length === 0) {
          const initialHeladosQuantities = {}
          heladosData.forEach(helado => {
            initialHeladosQuantities[helado.id] = 0
          })
          setHeladosQuantities(initialHeladosQuantities)
        }
      }

      // Process postres
      if (postresError) {
        console.error('Error fetching postres:', postresError)
      } else {
        setPostres(postresData)
        
        if (!orderData.postresQuantities || Object.keys(orderData.postresQuantities).length === 0) {
          const initialPostresQuantities = {}
          postresData.forEach(postre => {
            initialPostresQuantities[postre.id] = 0
          })
          setPostresQuantities(initialPostresQuantities)
        }
      }

      // Process softs
      if (softsError) {
        console.error('Error fetching softs:', softsError)
      } else {
        setSofts(softsData)
        
        if (!orderData.softsQuantities || Object.keys(orderData.softsQuantities).length === 0) {
          const initialSoftsQuantities = {}
          softsData.forEach(soft => {
            initialSoftsQuantities[soft.id] = 0
          })
          setSoftsQuantities(initialSoftsQuantities)
        }
      }

      // Process termicos
      if (termicosError) {
        console.error('Error fetching termicos:', termicosError)
      } else {
        setTermicos(termicosData)
        
        if (!orderData.termicosQuantities || Object.keys(orderData.termicosQuantities).length === 0) {
          const initialTermicosQuantities = {}
          termicosData.forEach(termico => {
            initialTermicosQuantities[termico.id] = 0
          })
          setTermicosQuantities(initialTermicosQuantities)
        }
      }
    }

    fetchData()
  }, []) // Empty dependency array to run only once on mount

  // Handle quantity changes for each product type
  const handleIncrementHelado = (id) => {
    setHeladosQuantities(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }))
  }

  const handleDecrementHelado = (id) => {
    setHeladosQuantities(prev => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) - 1)
    }))
  }
  
  const handleIncrementPostre = (id) => {
    setPostresQuantities(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }))
  }

  const handleDecrementPostre = (id) => {
    setPostresQuantities(prev => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) - 1)
    }))
  }
  
  const handleIncrementSoft = (id) => {
    setSoftsQuantities(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }))
  }

  const handleDecrementSoft = (id) => {
    setSoftsQuantities(prev => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) - 1)
    }))
  }
  
  const handleIncrementTermico = (id) => {
    setTermicosQuantities(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }))
  }

  const handleDecrementTermico = (id) => {
    setTermicosQuantities(prev => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) - 1)
    }))
  }

  // Handle date change - update context only when user changes the date
  const handleDateChange = (e) => {
    const newDate = e.target.value
    setOrderDate(newDate)
    updateOrderData({ orderDate: newDate }) // Update context only when user changes date
  }

  // Handle sucursal selection
  const handleSucursalChange = (e) => {
    const selectedId = e.target.value
    const selectedTitle = sucursales.find(s => s.id.toString() === selectedId)?.title || ''
    
    setSelectedSucursal(selectedId)
    updateOrderData({ 
      sucursalId: selectedId,
      sucursalTitle: selectedTitle
    })
  }

  // Handle the "Revisar Pedido" button click
  const handleReviewOrder = () => {
    // Validation: check if a sucursal is selected
    if (!selectedSucursal) {
      Swal.fire({
        title: 'Selecciona una sucursal',
        text: 'Por favor selecciona una sucursal antes de continuar',
        icon: 'warning',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#3498db'
      })
      return
    }
    
    // Validation: check if at least one product is selected
    const hasAnyProducts = Object.values(heladosQuantities).some(qty => qty > 0) ||
      Object.values(postresQuantities).some(qty => qty > 0) ||
      Object.values(softsQuantities).some(qty => qty > 0) ||
      Object.values(termicosQuantities).some(qty => qty > 0)
    
    if (!hasAnyProducts) {
      Swal.fire({
        title: 'No hay productos',
        text: 'Por favor selecciona al menos un producto para tu pedido',
        icon: 'warning',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#3498db'
      })
      return
    }

    // First, update all products data in context
    const filteredHelados = helados.filter(h => heladosQuantities[h.id] > 0)
      .map(h => ({ id: h.id, title: h.title, quantity: heladosQuantities[h.id] }))
      
    const filteredPostres = postres.filter(p => postresQuantities[p.id] > 0)
      .map(p => ({ id: p.id, title: p.title, quantity: postresQuantities[p.id] }))
      
    const filteredSofts = softs.filter(s => softsQuantities[s.id] > 0)
      .map(s => ({ id: s.id, title: s.title, quantity: softsQuantities[s.id] }))
      
    const filteredTermicos = termicos.filter(t => termicosQuantities[t.id] > 0)
      .map(t => ({ id: t.id, title: t.title, quantity: termicosQuantities[t.id] }))
    
    updateOrderData({
      heladosQuantities,
      postresQuantities,
      softsQuantities,
      termicosQuantities,
      products: {
        helados: filteredHelados,
        postres: filteredPostres,
        softs: filteredSofts,
        termicos: filteredTermicos
      }
    })
    
    // Navigate to the review page
    navigate('/review')
  }

  // Mobile-responsive styling
  const styles = {
    container: {
      width: '100%',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '10px',
      fontFamily: 'Arial, sans-serif',
      boxSizing: 'border-box',
    },
    header: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginBottom: '20px',
    },
    logo: {
      width: '120px',
      marginBottom: '8px',
    },
    title: {
      fontSize: 'clamp(18px, 5vw, 28px)',
      color: '#2c3e50',
      margin: '5px 0',
      textAlign: 'center',
    },
    sectionTitle: {
      fontSize: 'clamp(16px, 4vw, 22px)',
      color: '#3498db',
      marginBottom: '12px',
      borderBottom: '2px solid #f1f1f1',
      paddingBottom: '8px',
      textAlign: 'center',
    },
    formControl: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
    },
    select: {
      padding: '10px',
      borderRadius: '5px',
      border: '1px solid #ddd',
      width: 'auto',
      minWidth: '200px',
      maxWidth: '100%',
      marginBottom: '20px',
      fontSize: '16px',
    },
    datePicker: {
      padding: '10px',
      borderRadius: '5px',
      border: '1px solid #ddd',
      width: 'auto',
      minWidth: '200px',
      maxWidth: '100%',
      marginBottom: '20px',
      fontSize: '16px',
      fontFamily: 'Arial, sans-serif',
    },
    productGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
      gap: '10px',
      maxWidth: '900px',
      margin: '0 auto',
      justifyContent: 'center',
    },
    productGridContainer: {
      display: 'flex',
      justifyContent: 'center',
      width: '100%',
    },
    productCard: {
      border: '1px solid #eee',
      borderRadius: '8px',
      padding: '12px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      transition: 'transform 0.2s, box-shadow 0.2s',
    },
    productTitle: {
      fontSize: '16px',
      fontWeight: 'bold',
      marginBottom: '10px',
      textAlign: 'center',
    },
    quantityControl: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: '8px',
    },
    button: {
      width: '36px',
      height: '36px',
      borderRadius: '50%',
      border: 'none',
      fontSize: '18px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: '36px',
      minHeight: '36px',
    },
    decrementButton: {
      backgroundColor: '#e74c3c',
      color: 'white',
    },
    incrementButton: {
      backgroundColor: '#2ecc71',
      color: 'white',
    },
    quantity: {
      margin: '0 12px',
      fontSize: '18px',
      fontWeight: 'bold',
      width: '25px',
      textAlign: 'center',
    },
    section: {
      marginBottom: '25px',
      textAlign: 'center',
    },
    label: {
      display: 'block',
      marginBottom: '5px',
      fontSize: 'clamp(14px, 3vw, 16px)',
      fontWeight: 'bold',
      color: '#2c3e50',
      textAlign: 'center',
    },
    actionButton: {
      backgroundColor: '#3498db',
      color: 'white',
      width: '100%', 
      maxWidth: '300px',
      padding: '12px',
      fontSize: '18px',
      borderRadius: '5px',
      border: 'none',
      cursor: 'pointer',
      fontWeight: 'bold',
    },
    '@media (max-width: 480px)': {
      productGrid: {
        gridTemplateColumns: '1fr 1fr',
      },
      button: {
        width: '44px',
        height: '44px',
      },
      select: {
        minWidth: '180px',
      },
      datePicker: {
        minWidth: '180px',
      }
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <img src={logoLaFe} alt="Logo La Fe" style={styles.logo} />
        <h1 style={styles.title}>App Pedidos La Fe</h1>
      </div>
      
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Selecciona la Fecha del Pedido</h2>
        <div style={styles.formControl}>
          <label style={styles.label} htmlFor="orderDate">Fecha de entrega:</label>
          <input
            type="date"
            id="orderDate"
            value={orderDate}
            onChange={handleDateChange}
            style={styles.datePicker}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
      </div>
      
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Selecciona la Sucursal</h2>
        <div style={styles.formControl}>
          <select 
            style={styles.select}
            value={selectedSucursal}
            onChange={handleSucursalChange}
          >
            <option value="">Selecciona una sucursal</option>
            {sucursales.map((sucursal) => (
              <option key={sucursal.id} value={sucursal.id}>{sucursal.title}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Selecciona los Helados</h2>
        <div style={styles.productGrid}>
          {helados.map((helado) => (
            <div key={helado.id} style={styles.productCard}>
              <h3 style={styles.productTitle}>{helado.title}</h3>
              <div style={styles.quantityControl}>
                <button 
                  onClick={() => handleDecrementHelado(helado.id)}
                  style={{...styles.button, ...styles.decrementButton}}
                >
                  -
                </button>
                <span style={styles.quantity}>
                  {heladosQuantities[helado.id] || 0}
                </span>
                <button 
                  onClick={() => handleIncrementHelado(helado.id)}
                  style={{...styles.button, ...styles.incrementButton}}
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Selecciona los Postres</h2>
        <div style={styles.productGrid}>
          {postres.map((postre) => (
            <div key={postre.id} style={styles.productCard}>
              <h3 style={styles.productTitle}>{postre.title}</h3>
              <div style={styles.quantityControl}>
                <button 
                  onClick={() => handleDecrementPostre(postre.id)}
                  style={{...styles.button, ...styles.decrementButton}}
                >
                  -
                </button>
                <span style={styles.quantity}>
                  {postresQuantities[postre.id] || 0}
                </span>
                <button 
                  onClick={() => handleIncrementPostre(postre.id)}
                  style={{...styles.button, ...styles.incrementButton}}
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Selecciona los Softs</h2>
        <div style={styles.productGrid}>
          {softs.map((soft) => (
            <div key={soft.id} style={styles.productCard}>
              <h3 style={styles.productTitle}>{soft.title}</h3>
              <div style={styles.quantityControl}>
                <button 
                  onClick={() => handleDecrementSoft(soft.id)}
                  style={{...styles.button, ...styles.decrementButton}}
                >
                  -
                </button>
                <span style={styles.quantity}>
                  {softsQuantities[soft.id] || 0}
                </span>
                <button 
                  onClick={() => handleIncrementSoft(soft.id)}
                  style={{...styles.button, ...styles.incrementButton}}
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Selecciona los Termicos</h2>
        <div style={styles.productGrid}>
          {termicos.map((termico) => (
            <div key={termico.id} style={styles.productCard}>
              <h3 style={styles.productTitle}>{termico.title}</h3>
              <div style={styles.quantityControl}>
                <button 
                  onClick={() => handleDecrementTermico(termico.id)}
                  style={{...styles.button, ...styles.decrementButton}}
                >
                  -
                </button>
                <span style={styles.quantity}>
                  {termicosQuantities[termico.id] || 0}
                </span>
                <button 
                  onClick={() => handleIncrementTermico(termico.id)}
                  style={{...styles.button, ...styles.incrementButton}}
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={styles.section}>
        <button 
          onClick={handleReviewOrder}
          style={{
            ...styles.actionButton,
            opacity: !selectedSucursal ? 0.6 : 1,
            cursor: !selectedSucursal ? 'not-allowed' : 'pointer'
          }}
        >
          Revisar Pedido
        </button>
      </div>
    </div>
  )
}

export default Home