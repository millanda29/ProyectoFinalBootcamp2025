import React from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Tabs, TabsList, TabsTrigger } from './ui/tabs'
import { Plane, MessageCircle, MapPin, DollarSign, User, LogOut } from 'lucide-react'

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
    { id: 'budget', label: 'Presupuesto', icon: DollarSign, path: '/budget' },
    { id: 'profile', label: 'Perfil', icon: User, path: '/profile' }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <div className="bg-primary p-2 rounded-lg">
                <Plane className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">TravelMate</span>
            </Link>

            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="hidden sm:inline-flex">
                Pro
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="hover:bg-destructive hover:text-destructive-foreground"
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
        {currentPath.startsWith('/dashboard') || currentPath === '/itineraries' || currentPath === '/budget' || currentPath === '/profile' ? (
          <div className="mb-8">
            <Tabs value={getCurrentTab(currentPath)} className="w-full">
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-6">
                {navItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <TabsTrigger 
                      key={item.id} 
                      value={item.id} 
                      className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                      onClick={() => navigate(item.path)}
                    >
                      <Icon className="w-4 h-4 mr-2" />
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

// Helper function to get current tab based on path
const getCurrentTab = (path) => {
  if (path === '/dashboard') return 'chat'
  if (path === '/itineraries') return 'itineraries'
  if (path === '/budget') return 'budget'
  if (path === '/profile') return 'profile'
  return 'chat'
}

export default Layout
