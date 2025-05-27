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
  // Add new category states
  const [palitos, setPalitos] = useState([])
  const [crocker, setCrocker] = useState([])
  const [dieteticos, setDieteticos] = useState([])
  const [buffet, setBuffet] = useState([])
  const [dulces, setDulces] = useState([])
  const [paletas, setPaletas] = useState([])
  const [bites, setBites] = useState([])
  const [barritas, setBarritas] = useState([])
  
  // Track quantities separately for each product type
  const [heladosQuantities, setHeladosQuantities] = useState(orderData.heladosQuantities || {})
  const [postresQuantities, setPostresQuantities] = useState(orderData.postresQuantities || {})
  const [softsQuantities, setSoftsQuantities] = useState(orderData.softsQuantities || {})
  const [termicosQuantities, setTermicosQuantities] = useState(orderData.termicosQuantities || {})
  // Add new category quantities
  const [palitosQuantities, setPalitosQuantities] = useState(orderData.palitosQuantities || {})
  const [crockerQuantities, setCrockerQuantities] = useState(orderData.crockerQuantities || {})
  const [dieteticosQuantities, setDieteticosQuantities] = useState(orderData.dieteticosQuantities || {})
  const [buffetQuantities, setBuffetQuantities] = useState(orderData.buffetQuantities || {})
  const [dulcesQuantities, setDulcesQuantities] = useState(orderData.dulcesQuantities || {})
  const [paletasQuantities, setPaletasQuantities] = useState(orderData.paletasQuantities || {})
  const [bitesQuantities, setBitesQuantities] = useState(orderData.bitesQuantities || {})
  const [barritasQuantities, setBarritasQuantities] = useState(orderData.barritasQuantities || {})
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
        // Add new category data fetching
        { data: palitosData, error: palitosError },
        { data: crockerData, error: crockerError },
        { data: dieteticosData, error: dieteticosError },
        { data: buffetData, error: buffetError },
        { data: dulcesData, error: dulcesError },
        { data: paletasData, error: paletasError },
        { data: bitesData, error: bitesError },
        { data: barritasData, error: barritasError },
      ] = await Promise.all([
        supabase.from('sucursales').select('*'),
        supabase.from('helados').select('*'),
        supabase.from('postres').select('*'),
        supabase.from('softs').select('*'),
        supabase.from('termicos').select('*'),
        // Add new category queries
        supabase.from('palitos').select('*'),
        supabase.from('crocker').select('*'),
        supabase.from('dieteticos').select('*'),
        supabase.from('buffet').select('*'),
        supabase.from('dulces').select('*'),
        supabase.from('paletas').select('*'),
        supabase.from('bites').select('*'),
        supabase.from('barritas').select('*')
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

      // Process palitos
      if (palitosError) {
        console.error('Error fetching palitos:', palitosError)
      } else {
        setPalitos(palitosData)
        
        if (!orderData.palitosQuantities || Object.keys(orderData.palitosQuantities).length === 0) {
          const initialPalitosQuantities = {}
          palitosData.forEach(item => {
            initialPalitosQuantities[item.id] = 0
          })
          setPalitosQuantities(initialPalitosQuantities)
        }
      }

      // Process crocker
      if (crockerError) {
        console.error('Error fetching crocker:', crockerError)
      } else {
        setCrocker(crockerData)
        
        if (!orderData.crockerQuantities || Object.keys(orderData.crockerQuantities).length === 0) {
          const initialCrockerQuantities = {}
          crockerData.forEach(item => {
            initialCrockerQuantities[item.id] = 0
          })
          setCrockerQuantities(initialCrockerQuantities)
        }
      }

      // Process dieteticos
      if (dieteticosError) {
        console.error('Error fetching dieteticos:', dieteticosError)
      } else {
        setDieteticos(dieteticosData)
        
        if (!orderData.dieteticosQuantities || Object.keys(orderData.dieteticosQuantities).length === 0) {
          const initialDieteticosQuantities = {}
          dieteticosData.forEach(item => {
            initialDieteticosQuantities[item.id] = 0
          })
          setDieteticosQuantities(initialDieteticosQuantities)
        }
      }

      // Process buffet
      if (buffetError) {
        console.error('Error fetching buffet:', buffetError)
      } else {
        setBuffet(buffetData)
        
        if (!orderData.buffetQuantities || Object.keys(orderData.buffetQuantities).length === 0) {
          const initialBuffetQuantities = {}
          buffetData.forEach(item => {
            initialBuffetQuantities[item.id] = 0
          })
          setBuffetQuantities(initialBuffetQuantities)
        }
      }

      // Process dulces
      if (dulcesError) {
        console.error('Error fetching dulces:', dulcesError)
      } else {
        setDulces(dulcesData)
        
        if (!orderData.dulcesQuantities || Object.keys(orderData.dulcesQuantities).length === 0) {
          const initialDulcesQuantities = {}
          dulcesData.forEach(item => {
            initialDulcesQuantities[item.id] = 0
          })
          setDulcesQuantities(initialDulcesQuantities)
        }
      }

      // Process paletas
      if (paletasError) {
        console.error('Error fetching paletas:', paletasError)
      } else {
        setPaletas(paletasData)
        
        if (!orderData.paletasQuantities || Object.keys(orderData.paletasQuantities).length === 0) {
          const initialPaletasQuantities = {}
          paletasData.forEach(item => {
            initialPaletasQuantities[item.id] = 0
          })
          setPaletasQuantities(initialPaletasQuantities)
        }
      }

      // Process bites
      if (bitesError) {
        console.error('Error fetching bites:', bitesError)
      } else {
        setBites(bitesData)
        
        if (!orderData.bitesQuantities || Object.keys(orderData.bitesQuantities).length === 0) {
          const initialBitesQuantities = {}
          bitesData.forEach(item => {
            initialBitesQuantities[item.id] = 0
          })
          setBitesQuantities(initialBitesQuantities)
        }
      }

      // Process barritas
      if (barritasError) {
        console.error('Error fetching barritas:', barritasError)
      } else {
        setBarritas(barritasData)
        
        if (!orderData.barritasQuantities || Object.keys(orderData.barritasQuantities).length === 0) {
          const initialBarritasQuantities = {}
          barritasData.forEach(item => {
            initialBarritasQuantities[item.id] = 0
          })
          setBarritasQuantities(initialBarritasQuantities)
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

  // Handle increment/decrement for new categories
  const handleIncrementPalito = (id) => {
    setPalitosQuantities(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }))
  }

  const handleDecrementPalito = (id) => {
    setPalitosQuantities(prev => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) - 1)
    }))
  }

  const handleIncrementCrocker = (id) => {
    setCrockerQuantities(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }))
  }

  const handleDecrementCrocker = (id) => {
    setCrockerQuantities(prev => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) - 1)
    }))
  }

  const handleIncrementDietetico = (id) => {
    setDieteticosQuantities(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }))
  }

  const handleDecrementDietetico = (id) => {
    setDieteticosQuantities(prev => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) - 1)
    }))
  }

  const handleIncrementBuffet = (id) => {
    setBuffetQuantities(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }))
  }

  const handleDecrementBuffet = (id) => {
    setBuffetQuantities(prev => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) - 1)
    }))
  }

  const handleIncrementDulce = (id) => {
    setDulcesQuantities(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }))
  }

  const handleDecrementDulce = (id) => {
    setDulcesQuantities(prev => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) - 1)
    }))
  }

  const handleIncrementPaleta = (id) => {
    setPaletasQuantities(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }))
  }

  const handleDecrementPaleta = (id) => {
    setPaletasQuantities(prev => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) - 1)
    }))
  }

  const handleIncrementBite = (id) => {
    setBitesQuantities(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }))
  }

  const handleDecrementBite = (id) => {
    setBitesQuantities(prev => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) - 1)
    }))
  }

  const handleIncrementBarrita = (id) => {
    setBarritasQuantities(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }))
  }

  const handleDecrementBarrita = (id) => {
    setBarritasQuantities(prev => ({
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
      Object.values(termicosQuantities).some(qty => qty > 0) ||
      // Add checks for new categories
      Object.values(palitosQuantities).some(qty => qty > 0) ||
      Object.values(crockerQuantities).some(qty => qty > 0) ||
      Object.values(dieteticosQuantities).some(qty => qty > 0) ||
      Object.values(buffetQuantities).some(qty => qty > 0) ||
      Object.values(dulcesQuantities).some(qty => qty > 0) ||
      Object.values(paletasQuantities).some(qty => qty > 0) ||
      Object.values(bitesQuantities).some(qty => qty > 0) ||
      Object.values(barritasQuantities).some(qty => qty > 0)
    
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
    
    // Filter products for new categories
    const filteredPalitos = palitos.filter(p => palitosQuantities[p.id] > 0)
      .map(p => ({ id: p.id, title: p.title, quantity: palitosQuantities[p.id] }))
      
    const filteredCrocker = crocker.filter(c => crockerQuantities[c.id] > 0)
      .map(c => ({ id: c.id, title: c.title, quantity: crockerQuantities[c.id] }))
      
    const filteredDieteticos = dieteticos.filter(d => dieteticosQuantities[d.id] > 0)
      .map(d => ({ id: d.id, title: d.title, quantity: dieteticosQuantities[d.id] }))
      
    const filteredBuffet = buffet.filter(b => buffetQuantities[b.id] > 0)
      .map(b => ({ id: b.id, title: b.title, quantity: buffetQuantities[b.id] }))
      
    const filteredDulces = dulces.filter(d => dulcesQuantities[d.id] > 0)
      .map(d => ({ id: d.id, title: d.title, quantity: dulcesQuantities[d.id] }))
      
    const filteredPaletas = paletas.filter(p => paletasQuantities[p.id] > 0)
      .map(p => ({ id: p.id, title: p.title, quantity: paletasQuantities[p.id] }))
      
    const filteredBites = bites.filter(b => bitesQuantities[b.id] > 0)
      .map(b => ({ id: b.id, title: b.title, quantity: bitesQuantities[b.id] }))
      
    const filteredBarritas = barritas.filter(b => barritasQuantities[b.id] > 0)
      .map(b => ({ id: b.id, title: b.title, quantity: barritasQuantities[b.id] }))
    
    updateOrderData({
      heladosQuantities,
      postresQuantities,
      softsQuantities,
      termicosQuantities,
      // Add new category quantities
      palitosQuantities,
      crockerQuantities,
      dieteticosQuantities,
      buffetQuantities,
      dulcesQuantities,
      paletasQuantities,
      bitesQuantities,
      barritasQuantities,
      products: {
        helados: filteredHelados,
        postres: filteredPostres,
        softs: filteredSofts,
        termicos: filteredTermicos,
        // Add new category products
        palitos: filteredPalitos,
        crocker: filteredCrocker,
        dieteticos: filteredDieteticos,
        buffet: filteredBuffet,
        dulces: filteredDulces,
        paletas: filteredPaletas,
        bites: filteredBites,
        barritas: filteredBarritas
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

  // Function to render a product category section
  const renderProductSection = (title, products, quantities, handleIncrement, handleDecrement) => {
    if (!products || products.length === 0) return null;
    
    // Sort products by id in ascending order
    const sortedProducts = [...products].sort((a, b) => a.id - b.id);
    
    return (
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>{title}</h2>
        <div style={styles.productGrid}>
          {sortedProducts.map((product) => (
            <div key={product.id} style={styles.productCard}>
              <h3 style={styles.productTitle}>{product.title}</h3>
              <div style={styles.quantityControl}>
                <button 
                  onClick={() => handleDecrement(product.id)}
                  style={{...styles.button, ...styles.decrementButton}}
                >
                  -
                </button>
                <span style={styles.quantity}>
                  {quantities[product.id] || 0}
                </span>
                <button 
                  onClick={() => handleIncrement(product.id)}
                  style={{...styles.button, ...styles.incrementButton}}
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

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
      
      {/* Rendering product categories in the requested order */}
      {renderProductSection("Selecciona los Helados", helados, heladosQuantities, handleIncrementHelado, handleDecrementHelado)}
      {renderProductSection("Selecciona los Palitos", palitos, palitosQuantities, handleIncrementPalito, handleDecrementPalito)}
      {renderProductSection("Selecciona los Postres", postres, postresQuantities, handleIncrementPostre, handleDecrementPostre)}
      {renderProductSection("Selecciona los Crocker", crocker, crockerQuantities, handleIncrementCrocker, handleDecrementCrocker)}
      {renderProductSection("Selecciona los Dietéticos", dieteticos, dieteticosQuantities, handleIncrementDietetico, handleDecrementDietetico)}
      {renderProductSection("Selecciona los Buffet", buffet, buffetQuantities, handleIncrementBuffet, handleDecrementBuffet)}
      {renderProductSection("Selecciona los Softs", softs, softsQuantities, handleIncrementSoft, handleDecrementSoft)}
      {renderProductSection("Selecciona los Dulces", dulces, dulcesQuantities, handleIncrementDulce, handleDecrementDulce)}
      {renderProductSection("Selecciona las Paletas", paletas, paletasQuantities, handleIncrementPaleta, handleDecrementPaleta)}
      {renderProductSection("Selecciona los Bites", bites, bitesQuantities, handleIncrementBite, handleDecrementBite)}
      {renderProductSection("Selecciona los Termicos", termicos, termicosQuantities, handleIncrementTermico, handleDecrementTermico)}
      
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