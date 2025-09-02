import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        
        {/* Rutas protegidas con layout */}
        <Route path="/" element={<Layout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="itineraries" element={<div className="text-center py-20"><h2 className="text-2xl font-bold">Página de Itinerarios</h2><p className="text-muted-foreground">Esta página está en construcción</p></div>} />
          <Route path="budget" element={<div className="text-center py-20"><h2 className="text-2xl font-bold">Página de Presupuesto</h2><p className="text-muted-foreground">Esta página está en construcción</p></div>} />
          <Route path="profile" element={<div className="text-center py-20"><h2 className="text-2xl font-bold">Página de Perfil</h2><p className="text-muted-foreground">Esta página está en construcción</p></div>} />
        </Route>
        
        {/* Redireccionar rutas no encontradas */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
