import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import RequestHelp from './pages/RequestHelp'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Signup from './pages/Signup'
import './index.css'

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <main className="page-container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/request-help" element={<RequestHelp />} />
            <Route path="/requests" element={<Dashboard />} />
          </Routes>
        </main>
      </AuthProvider>
    </Router>
  )
}

export default App
