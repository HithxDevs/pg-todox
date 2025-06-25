
import './App.css'
import { BrowserRouter , Routes, Route } from 'react-router-dom'
import LandingPage from '../components/LandingPage'
import Todos from '../components/todos' 

function App() {


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signin" element={<LandingPage />} />
        <Route path="/todos" element={<Todos />} />
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
