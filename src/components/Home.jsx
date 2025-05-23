import { useEffect, useState } from 'react'
import { testSupabaseConnection } from '../db/testSupabase'
import supabase from '../db/SupabaseClient'

import logoLaFe from '../assets/img/logo-lafe.png'

const Home = () => {
  // Call the test function
  testSupabaseConnection().then(isConnected => {
    if (isConnected) {
        console.log('Supabase is working correctly!')
    } else {
        console.log('There was an issue with the Supabase connection')
    }
  })

  const [sucursales, setSucursales] = useState([])
  const [helados, setHelados] = useState([])
  const [postres, setPostres] = useState([])
  const [softs, setSofts] = useState([])
  const [termicos, setTermicos] = useState([])
  const [quantities, setQuantities] = useState({})
  
  // Add state for order date - initialize with today's date
  const [orderDate, setOrderDate] = useState(new Date().toISOString().split('T')[0])

  // Fetch data from supabase
  useEffect(() => {
    const fetchData = async () => {
      const { data: sucursalesData, error: sucursalesError } = await supabase
        .from('sucursales')
        .select('*')

      if (sucursalesError) {
        console.error('Error fetching sucursales:', sucursalesError)
      } else {
        setSucursales(sucursalesData)
      }

      const { data: heladosData, error: heladosError } = await supabase
        .from('helados')
        .select('*')

      if (heladosError) {
        console.error('Error fetching helados:', heladosError)
      } else {
        setHelados(heladosData)
        
        // Initialize quantities state with all helados set to 0
        const initialQuantities = {}
        heladosData.forEach(helado => {
          initialQuantities[helado.id] = 0
        })
        setQuantities(initialQuantities)
      }

      const { data: postresData, error: postresError } = await supabase
        .from('postres')
        .select('*')

      if (postresError) {
        console.error('Error fetching postres:', postresError)
      } else {
        setPostres(postresData)
      }

      const { data: softsData, error: softsError } = await supabase
        .from('softs')
        .select('*')

      if (softsError) {
        console.error('Error fetching softs:', softsError)
      } else {
        setSofts(softsData)
      }

      const { data: termicosData, error: termicosError } = await supabase
        .from('termicos')
        .select('*')

      if (termicosError) {
        console.error('Error fetching termicos:', termicosError)
      } else {
        setTermicos(termicosData)
      }
    }
    fetchData()
  }, [])

  const handleIncrement = (id) => {
    setQuantities(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }))
  }

  const handleDecrement = (id) => {
    setQuantities(prev => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) - 1)
    }))
  }

  // Handle date change
  const handleDateChange = (e) => {
    setOrderDate(e.target.value)
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
      maxWidth: '900px', // Limit max width for centering
      margin: '0 auto', // Center the grid
      justifyContent: 'center', // Center the grid items
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
            min={new Date().toISOString().split('T')[0]} // Set minimum date to today
          />
        </div>
      </div>
      
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Selecciona la Sucursal</h2>
        <div style={styles.formControl}>
          <select style={styles.select}>
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
                  onClick={() => handleDecrement(helado.id)}
                  style={{...styles.button, ...styles.decrementButton}}
                >
                  -
                </button>
                <span style={styles.quantity}>
                  {quantities[helado.id] || 0}
                </span>
                <button 
                  onClick={() => handleIncrement(helado.id)}
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
                  onClick={() => handleDecrement(postre.id)}
                  style={{...styles.button, ...styles.decrementButton}}
                >
                  -
                </button>
                <span style={styles.quantity}>
                  {quantities[postre.id] || 0}
                </span>
                <button 
                  onClick={() => handleIncrement(postre.id)}
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
                  onClick={() => handleDecrement(soft.id)}
                  style={{...styles.button, ...styles.decrementButton}}
                >
                  -
                </button>
                <span style={styles.quantity}>
                  {quantities[soft.id] || 0}
                </span>
                <button 
                  onClick={() => handleIncrement(soft.id)}
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
                  onClick={() => handleDecrement(termico.id)}
                  style={{...styles.button, ...styles.decrementButton}}
                >
                  -
                </button>
                <span style={styles.quantity}>
                  {quantities[termico.id] || 0}
                </span>
                <button 
                  onClick={() => handleIncrement(termico.id)}
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
          onClick={() => console.log('Revisar Pedido')}
          style={styles.actionButton}
        >
          Revisar Pedido
        </button>
      </div>
    </div>
  )
}

export default Home