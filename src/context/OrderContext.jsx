import { createContext, useState, useContext, useCallback } from 'react'

const OrderContext = createContext()

export const OrderProvider = ({ children }) => {
  const [orderData, setOrderData] = useState({
    orderDate: new Date().toISOString().split('T')[0],
    sucursalId: '',
    sucursalTitle: '',
    // Order the quantities in the same sequence
    heladosQuantities: {},
    palitosQuantities: {},
    postresQuantities: {},
    crockerQuantities: {},
    dieteticosQuantities: {},
    buffetQuantities: {},
    softsQuantities: {},
    dulcesQuantities: {},
    paletasQuantities: {},
    bitesQuantities: {},
    termicosQuantities: {},
    barritasQuantities: {},
    products: {
      // Order the products in the same sequence
      helados: [],
      palitos: [],
      postres: [],
      crocker: [],
      dieteticos: [],
      buffet: [],
      softs: [],
      dulces: [],
      paletas: [],
      bites: [],
      termicos: [],
      barritas: []
    }
  })

  // Use useCallback to prevent the function from being recreated on every render
  const updateOrderData = useCallback((newData) => {
    setOrderData(prev => ({
      ...prev,
      ...newData
    }))
  }, [])

  return (
    <OrderContext.Provider value={{ orderData, updateOrderData }}>
      {children}
    </OrderContext.Provider>
  )
}

export const useOrderContext = () => useContext(OrderContext)