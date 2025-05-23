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
    },
    select: {
      padding: '10px',
      borderRadius: '5px',
      border: '1px solid #ddd',
      width: '100%',
      maxWidth: '100%',
      marginBottom: '20px',
      fontSize: '16px', // Larger font size for mobile touch
    },
    productGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
      gap: '10px',
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
      // Improved touch target for mobile
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
    },
    // Add media queries handling for different screen sizes
    '@media (max-width: 480px)': {
      productGrid: {
        gridTemplateColumns: '1fr 1fr', // 2 columns on very small screens
      },
      button: {
        width: '44px', // Larger buttons on very small screens
        height: '44px',
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
        <h2 style={styles.sectionTitle}>Selecciona la Sucursal</h2>
        <select style={styles.select}>
          {sucursales.map((sucursal) => (
            <option key={sucursal.id} value={sucursal.id}>{sucursal.title}</option>
          ))}
        </select>
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

    <div style={styles.section}></div>
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

      <div style={styles.section}></div>
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
  )
}

export default Home