import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { MapPin, Calendar, DollarSign, MessageCircle, Eye, Trash2, Clock, Users } from 'lucide-react'

const Itineraries = () => {
  // Datos simulados de historial de chats/viajes
  const [travelHistory] = useState([
    {
      id: 1,
      destination: 'París, Francia',
      startDate: '2024-03-15',
      endDate: '2024-03-22',
      duration: '7 días',
      travelers: 2,
      budget: 2520,
      status: 'completado',
      lastMessage: 'Gracias por ayudarme a planificar mi viaje a París. ¡Fue increíble!',
      messagesCount: 24,
      createdAt: '2024-02-10'
    },
    {
      id: 2,
      destination: 'Tokio, Japón',
      startDate: '2024-05-10',
      endDate: '2024-05-20',
      duration: '10 días',
      travelers: 1,
      budget: 3300,
      status: 'planificado',
      lastMessage: 'Perfecto, ya tengo todo listo para mi aventura en Japón.',
      messagesCount: 18,
      createdAt: '2024-04-01'
    },
    {
      id: 3,
      destination: 'Nueva York, EE.UU.',
      startDate: '2024-07-05',
      endDate: '2024-07-12',
      duration: '7 días',
      travelers: 4,
      budget: 4200,
      status: 'en_progreso',
      lastMessage: 'Todavía necesito decidir sobre los espectáculos de Broadway...',
      messagesCount: 12,
      createdAt: '2024-06-15'
    },
    {
      id: 4,
      destination: 'Barcelona, España',
      startDate: '2024-09-20',
      endDate: '2024-09-27',
      duration: '7 días',
      travelers: 2,
      budget: 1890,
      status: 'borrador',
      lastMessage: 'Quiero explorar la arquitectura de Gaudí y las mejores tapas.',
      messagesCount: 5,
      createdAt: '2024-08-30'
    }
  ])

  const getStatusColor = (status) => {
    switch (status) {
      case 'completado':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'planificado':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'en_progreso':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'borrador':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'completado':
        return 'Completado'
      case 'planificado':
        return 'Planificado'
      case 'en_progreso':
        return 'En Progreso'
      case 'borrador':
        return 'Borrador'
      default:
        return 'Desconocido'
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Mis Viajes</h1>
            <p className="text-gray-600">Historial de todas tus conversaciones y planes de viaje</p>
          </div>
          <Link to="/dashboard">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <MessageCircle className="w-4 h-4 mr-2" />
              Nuevo Chat
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <Card className="border-0 shadow-lg bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Viajes</p>
                <p className="text-2xl font-bold text-blue-600">{travelHistory.length}</p>
              </div>
              <MapPin className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completados</p>
                <p className="text-2xl font-bold text-green-600">
                  {travelHistory.filter(trip => trip.status === 'completado').length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En Progreso</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {travelHistory.filter(trip => trip.status === 'en_progreso').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Presupuesto Total</p>
                <p className="text-2xl font-bold text-purple-600">
                  ${travelHistory.reduce((sum, trip) => sum + trip.budget, 0).toLocaleString()}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Travel History */}
      <div className="space-y-4">
        {travelHistory.map((trip) => (
          <Card key={trip.id} className="border-0 shadow-lg bg-white hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-xl font-bold text-gray-900">{trip.destination}</h3>
                    <Badge className={`${getStatusColor(trip.status)} border`}>
                      {getStatusText(trip.status)}
                    </Badge>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>{trip.duration}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="h-4 w-4" />
                        <span>{trip.travelers} {trip.travelers === 1 ? 'viajero' : 'viajeros'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <DollarSign className="h-4 w-4" />
                        <span>${trip.budget.toLocaleString()} presupuesto total</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <p className="text-sm text-gray-600 italic">"{trip.lastMessage}"</p>
                    <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                      <span>{trip.messagesCount} mensajes</span>
                      <span>Creado: {new Date(trip.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 ml-4">
                  <Button variant="outline" size="sm" className="hover:bg-blue-50">
                    <Eye className="w-4 h-4 mr-1" />
                    Ver Chat
                  </Button>
                  <Button variant="outline" size="sm" className="hover:bg-red-50 text-red-600 hover:text-red-700">
                    <Trash2 className="w-4 h-4 mr-1" />
                    Eliminar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {travelHistory.length === 0 && (
        <div className="text-center py-16">
          <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No tienes viajes aún</h3>
          <p className="text-gray-600 mb-6">Comienza planificando tu primera aventura</p>
          <Link to="/dashboard">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <MessageCircle className="w-4 h-4 mr-2" />
              Crear Primer Viaje
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}

export default Itineraries
