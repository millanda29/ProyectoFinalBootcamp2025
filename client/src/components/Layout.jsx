import React from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Tabs, TabsList, TabsTrigger } from './ui/tabs'
import { Plane, MessageCircle, MapPin, DollarSign, User, LogOut } from 'lucide-react'
import Logo from './Logo'

const Layout = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const currentPath = location.pathname

  const handleLogout = () => {
    navigate('/')
  }

  const navItems = [
    { id: 'chat', label: 'Chat IA', icon: MessageCircle, path: '/dashboard' },
    { id: 'itineraries', label: 'Mis Viajes', icon: MapPin, path: '/itineraries' },
    { id: 'profile', label: 'Perfil', icon: User, path: '/profile' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-gray-50 to-yellow-50">
      {/* Header */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/90 border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="transition-transform hover:scale-105">
              <Logo size="default" variant="default" />
            </Link>

            <div className="flex items-center space-x-4">
              <Badge className="hidden sm:inline-flex bg-yellow-400 text-blue-900 hover:bg-yellow-500 font-semibold">
                Pro
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Navigation Tabs - Solo mostrar en rutas del dashboard */}
        {currentPath.startsWith('/dashboard') || currentPath === '/itineraries' || currentPath === '/profile' ? (
          <div className="mb-8">
            <Tabs value={getCurrentTab(currentPath)} className="w-full">
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-3 mb-6 bg-white/80 backdrop-blur-sm border border-white/50 shadow-md">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const isActive = getCurrentTab(currentPath) === item.id
                  return (
                    <TabsTrigger 
                      key={item.id} 
                      value={item.id} 
                      className={`transition-all duration-300 font-medium ${
                        isActive 
                          ? 'bg-blue-600 text-white shadow-lg' 
                          : 'hover:bg-blue-50 hover:text-blue-700'
                      }`}
                      onClick={() => navigate(item.path)}
                    >
                      <Icon className={`w-4 h-4 mr-2 ${isActive ? 'text-white' : ''}`} />
                      <span className="hidden sm:inline">{item.label}</span>
                    </TabsTrigger>
                  )
                })}
              </TabsList>
            </Tabs>
          </div>
        ) : null}

        {/* Page Content */}
        <Outlet />
      </div>
    </div>
  )
}

// Helper functions
const getCurrentTab = (path) => {
  if (path === '/dashboard') return 'chat'
  if (path === '/itineraries') return 'itineraries'
  if (path === '/profile') return 'profile'
  return 'chat'
}

const getCurrentSectionName = (path) => {
  if (path === '/dashboard') return 'Chat IA'
  if (path === '/itineraries') return 'Mis Viajes'
  if (path === '/profile') return 'Mi Perfil'
  return 'Chat IA'
}

const getCurrentSectionDescription = (path) => {
  if (path === '/dashboard') return 'Planifica tus viajes con nuestro asistente inteligente'
  if (path === '/itineraries') return 'Gestiona y revisa todos tus itinerarios de viaje'
  if (path === '/profile') return 'Configura tu perfil y preferencias de viaje'
  return 'Planifica tus viajes con nuestro asistente inteligente'
}

const getCurrentSectionColor = (path) => {
  if (path === '/dashboard') return 'bg-blue-500'
  if (path === '/itineraries') return 'bg-green-500'
  if (path === '/profile') return 'bg-purple-500'
  return 'bg-blue-500'
}

export default Layout
