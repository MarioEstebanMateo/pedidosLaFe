import React, { useEffect, useState } from 'react'
import './App.css'
import { supabase } from '../src/db/SupabaseClient'


function App() {
  const [sucursales, setSucursales] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('sucursales')
        .select('*')

      if (error) {
        console.error('Error fetching data:', error)
      } else {
        setSucursales(data)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="App">
      <h1>Lista de Sucursales</h1>
      <ul>
        {sucursales.map((sucursal) => (
          <li key={sucursal.id}>
            {sucursal.nombre} - {sucursal.direccion}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
