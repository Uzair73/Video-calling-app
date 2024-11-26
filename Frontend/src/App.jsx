import './App.css'
import Register from './pages/singup/Register' // Corrected the typo in the path from 'singup' to 'signup'
import Login from './pages/login/Login'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom' // Updated to use Routes for grouping Route components
function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} exact />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  )
}

export default App
