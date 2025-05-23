import { createContext, useState, useContext, useCallback } from 'react'

const OrderContext = createContext()

export const OrderProvider = ({ children }) => {
  const [orderData, setOrderData] = useState({
    orderDate: new Date().toISOString().split('T')[0],
    sucursalId: '',
    sucursalTitle: '',
    heladosQuantities: {},
    postresQuantities: {},
    softsQuantities: {},
    termicosQuantities: {},
    products: {
      helados: [],
      postres: [],
      softs: [],
      termicos: []
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