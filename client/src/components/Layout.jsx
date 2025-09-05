import React from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Tabs, TabsList, TabsTrigger } from './ui/tabs'
import { Plane, MessageCircle, MapPin, DollarSign, User, LogOut, Shield, Wand2, Bot } from 'lucide-react'
import Logo from './Logo'
import { useAuth } from '../context/AuthContext'

const Layout = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout, user } = useAuth()
  const currentPath = location.pathname

  console.log('🏗️ Layout: Datos del usuario:', user)
  console.log('🔐 Layout: Roles del usuario:', user?.roles)
  console.log('🔐 Layout: Primer rol:', user?.roles?.[0])
  console.log('❓ Layout: ¿Es admin?', user?.roles?.includes('admin'))
  console.log('📍 Layout: Ubicación actual:', currentPath)

  const handleLogout = async () => {
    try {
      await logout();
      // El ProtectedRoute se encargará de la redirección
    } catch (error) {
      console.error('Logout failed:', error);
      // En caso de error, forzar navegación
      navigate('/');
    }
  }

  // ✅ Configurar navItems dinámicamente basado en el rol del usuario
  const getNavItems = () => {
    console.log('🔧 getNavItems: Verificando rol del usuario...')
    console.log('👤 getNavItems: Usuario completo:', JSON.stringify(user, null, 2))
    console.log('🔐 getNavItems: Roles del usuario:', user?.roles)
    console.log('❓ getNavItems: ¿Es admin?', user?.roles?.includes('admin'))
    
    const baseItems = [
      { id: 'dashboard', label: 'Dashboard', icon: Plane, path: '/dashboard' },
      { id: 'chat', label: 'Chat IA', icon: Bot, path: '/chat', badge: 'Beta' },
      { id: 'itinerary-generator', label: 'Generador IA', icon: Wand2, path: '/itinerary-generator', badge: 'Beta' },
      { id: 'itineraries', label: 'Mis Viajes', icon: MapPin, path: '/itineraries' },
      { id: 'profile', label: 'Perfil', icon: User, path: '/profile' }
    ]

    // ✅ Solo añadir la pestaña Admin si el usuario tiene el rol 'admin'
    if (user?.roles?.includes('admin')) {
      console.log('✅ getNavItems: Usuario es admin, agregando pestaña Admin')
      baseItems.push({ id: 'admin', label: 'Admin', icon: Shield, path: '/admin', badge: 'Admin' })
    } else {
      console.log('❌ getNavItems: Usuario NO es admin, omitiendo pestaña Admin')
    }

    console.log('📋 getNavItems: Items finales:', baseItems.map(item => item.label))
    return baseItems
  }

  const navItems = getNavItems()

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
              {/* DEBUG: Mostrar información del usuario temporalmente */}
              <div className="text-xs bg-yellow-100 px-2 py-1 rounded border">
                DEBUG: {user?.email || 'No user'} | Roles: {user?.roles?.join(', ') || 'No roles'}
              </div>
              
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
        {shouldShowTabs(currentPath, user) ? (
          <div className="mb-8">
            <Tabs value={getCurrentTab(currentPath)} className="w-full">
              <TabsList className={`grid w-full mb-6 bg-white/80 backdrop-blur-sm border border-white/50 shadow-md ${
                user?.roles?.includes('admin') ? 'grid-cols-3 lg:grid-cols-6' : 'grid-cols-3 lg:grid-cols-5'
              }`}>
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
                      <div className="flex items-center gap-1">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : ''}`} />
                        <span className="hidden sm:inline">{item.label}</span>
                        {item.badge && (
                          <Badge 
                            variant="secondary" 
                            className={`text-xs ml-1 hidden lg:inline-flex ${
                              item.badge === 'Admin' 
                                ? 'bg-red-100 text-red-800' 
                                : 'bg-yellow-400 text-blue-900'
                            }`}
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </div>
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
// ✅ Verificar si se deben mostrar las pestañas basado en la ruta y el rol del usuario
const shouldShowTabs = (currentPath, user) => {
  const allowedPaths = ['/dashboard', '/chat', '/itinerary-generator', '/itineraries', '/profile']
  
  // Si está en una ruta permitida para todos los usuarios
  if (allowedPaths.some(path => currentPath.startsWith(path) || currentPath === path)) {
    return true
  }
  
  // Si está en /admin, solo mostrar si tiene rol admin
  if (currentPath === '/admin') {
    return user?.roles?.includes('admin')
  }
  
  return false
}

const getCurrentTab = (path) => {
  if (path === '/dashboard') return 'dashboard'
  if (path === '/chat') return 'chat'
  if (path === '/itinerary-generator') return 'itinerary-generator'
  if (path === '/itineraries') return 'itineraries'
  if (path === '/profile') return 'profile'
  if (path === '/admin') return 'admin'
  return 'dashboard'
}

export default Layout
