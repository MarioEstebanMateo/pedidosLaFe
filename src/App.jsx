import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { OrderProvider } from './context/OrderContext'
import Home from '../src/components/Home'
import ReviewOrder from '../src/components/ReviewOrder'
import Footer from './components/Footer'

function App() {
  return (
    <OrderProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/review" element={<ReviewOrder />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </OrderProvider>
  )
}

export default App
