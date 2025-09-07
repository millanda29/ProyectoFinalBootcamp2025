import React, { useState, useEffect } from 'react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { MessageCircle, DollarSign, Plane, MapPin, Calendar } from 'lucide-react'
import api from '../data/api.js'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
  const { accessToken } = useAuth()
  const navigate = useNavigate()
  const [trips, setTrips] = useState([])
  const [stats, setStats] = useState({
    totalTrips: 0,
    upcomingTrips: 0,
    totalBudget: 0,
    favoriteDestination: ''
  })

  // ✅ Cargar datos del dashboard usando endpoints reales
  useEffect(() => {
    const loadDashboardData = async () => {
      if (!accessToken) return
      
      try {
        // ✅ Usar el endpoint correcto para obtener viajes del usuario
        const response = await api.users.getUserTrips(accessToken)
        
        // La respuesta tiene estructura: { success: true, data: [...], pagination: {...} }
        const tripsData = Array.isArray(response.data) ? response.data : []
        setTrips(tripsData)
        
        // Calcular estadísticas básicas de los viajes
        const totalTrips = tripsData.length
        const upcomingTrips = tripsData.filter(trip => 
          trip.status !== 'completed' && trip.status !== 'cancelled'
        ).length
        const totalBudget = tripsData.reduce((sum, trip) => {
          // Sumar todos los costos del viaje
          const tripCosts = trip.costs?.reduce((costSum, cost) => 
            costSum + (cost.amount * (cost.quantity || 1)), 0) || 0
          return sum + tripCosts
        }, 0)
        const destinations = tripsData.map(trip => trip.destination).filter(Boolean)
        const favoriteDestination = destinations.length > 0 
          ? destinations.reduce((a, b, i, arr) => 
              arr.filter(v => v === a).length >= arr.filter(v => v === b).length ? a : b
            ) 
          : 'No hay viajes'
          
        setStats({
          totalTrips,
          upcomingTrips,
          totalBudget,
          favoriteDestination
        })
        
      } catch (error) {
        console.error('Error loading dashboard data:', error)
        // Si hay error, usar valores por defecto
        setStats({
          totalTrips: 0,
          upcomingTrips: 0,
          totalBudget: 0,
          favoriteDestination: 'No hay viajes'
        })
      }
    }
    
    loadDashboardData()
  }, [accessToken])

  const quickActions = [
    {
      title: "Chat con IA",
      description: "Pregunta al asistente sobre destinos y consejos de viaje",
      icon: MessageCircle,
      action: () => navigate('/chat'),
      color: "from-blue-600 to-blue-700",
      iconColor: "text-blue-600",
      hoverColor: "group-hover:text-white"
    },
    {
      title: "Generar Itinerario",
      description: "Crea un itinerario detallado con IA",
      icon: MapPin,
      action: () => navigate('/itinerary-generator'),
      color: "from-purple-600 to-purple-700",
      iconColor: "text-purple-600",
      hoverColor: "group-hover:text-white"
    },
    {
      title: "Mis Viajes",
      description: "Gestiona y revisa tus viajes planificados",
      icon: Plane,
      action: () => navigate('/itineraries'),
      color: "from-green-600 to-green-700",
      iconColor: "text-green-600",
      hoverColor: "group-hover:text-white"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <h1 className="text-4xl font-bold text-gray-800">
              ¡Bienvenido a TravelMate!
            </h1>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              IA
            </Badge>
            <Badge variant="secondary" className="bg-orange-100 text-orange-800">
              Beta
            </Badge>
          </div>
          <p className="text-xl text-gray-600">
            Tu asistente inteligente para planificar viajes únicos
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Plane className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Viajes</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalTrips}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Próximos</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.upcomingTrips}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Presupuesto</p>
                  <p className="text-2xl font-bold text-gray-900">${stats.totalBudget}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Favorito</p>
                  <p className="text-lg font-bold text-gray-900">{stats.favoriteDestination}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {quickActions.map((action, index) => (
            <Card key={index} className="shadow-lg border-0 bg-white/90 backdrop-blur-sm hover:shadow-xl transition-shadow duration-300 cursor-pointer group" onClick={action.action}>
              <CardContent className="p-6">
                <div className={`w-16 h-16 bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center mb-4 mx-auto`}>
                  <action.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 text-center mb-2">
                  {action.title}
                </h3>
                <p className="text-gray-600 text-center text-sm">
                  {action.description}
                </p>
                <div className="mt-4 text-center">
                  <Button className={`bg-gradient-to-r ${action.color} hover:opacity-90 text-white px-6 py-2 rounded-lg transition-all duration-200`}>
                    Comenzar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Trips */}
        <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center">
                  <Plane className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Mis Viajes Recientes</h3>
                  <p className="text-sm text-gray-600">Tus últimos viajes planificados</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/itineraries')}
                className="border-blue-200 text-blue-600 hover:bg-blue-50"
              >
                Ver Todos
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="p-6">
            {trips.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {trips.slice(0, 3).map((trip, index) => (
                  <div 
                    key={trip._id || index} 
                    className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200 cursor-pointer"
                    onClick={() => navigate(`/itineraries/${trip._id}`)}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <MapPin className="w-5 h-5 text-blue-600" />
                      <h4 className="font-semibold text-gray-800">{trip.title || trip.destination || 'Viaje sin título'}</h4>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {trip.startDate ? new Date(trip.startDate).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        }) : 'Fecha pendiente'}
                        {trip.endDate && ` - ${new Date(trip.endDate).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: 'short'
                        })}`}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <DollarSign className="w-4 h-4" />
                      <span>
                        ${trip.costs?.reduce((sum, cost) => sum + (cost.amount * (cost.quantity || 1)), 0) || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        trip.status === 'planned' ? 'bg-blue-100 text-blue-800' :
                        trip.status === 'active' ? 'bg-green-100 text-green-800' :
                        trip.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {trip.status === 'planned' ? 'Planificado' :
                         trip.status === 'active' ? 'En curso' :
                         trip.status === 'completed' ? 'Completado' :
                         trip.status}
                      </span>
                      <span className="text-xs text-gray-500">
                        {trip.partySize || 1} persona{(trip.partySize || 1) !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Plane className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm mb-4">
                  Aún no tienes viajes planificados
                </p>
                <Button 
                  onClick={() => navigate('/itinerary-generator')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  Crear Mi Primer Viaje
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard
