import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { MapPin, Calendar, DollarSign, MessageCircle, Eye, Trash2, Clock, Users, Loader2, Plus, Download } from 'lucide-react'
import api, { utils, constants } from '../data/api.js'

const Itineraries = () => {
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  
  useEffect(() => {
    loadTrips()
  }, [])

  const loadTrips = async () => {
    setLoading(true)
    try {
      const response = await api.trips.getMyTrips({ 
        page: 1, 
        limit: 20 
      })
      setTrips(response.trips || [])
    } catch (error) {
      console.error('Error loading trips:', error)
      utils.showError(error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteTrip = async (tripId) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este viaje?')) {
      return
    }

    try {
      await api.trips.deleteTrip(tripId)
      setTrips(prev => prev.filter(trip => trip._id !== tripId))
      utils.showSuccess('Viaje eliminado exitosamente')
    } catch (error) {
      console.error('Error deleting trip:', error)
      utils.showError(error)
    }
  }

  const handleExportPDF = async (tripId) => {
    try {
      const pdfBlob = await api.trips.exportToPDF(tripId)
      
      // Crear link de descarga
      const url = window.URL.createObjectURL(pdfBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `viaje-${tripId}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      utils.showSuccess('PDF descargado exitosamente')
    } catch (error) {
      console.error('Error exporting PDF:', error)
      utils.showError(error)
    }
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      [constants.TRIP_STATUS.PLANNED]: { color: 'bg-blue-100 text-blue-800', label: 'Planificado' },
      [constants.TRIP_STATUS.ONGOING]: { color: 'bg-green-100 text-green-800', label: 'En curso' },
      [constants.TRIP_STATUS.COMPLETED]: { color: 'bg-gray-100 text-gray-800', label: 'Completado' },
      [constants.TRIP_STATUS.CANCELLED]: { color: 'bg-red-100 text-red-800', label: 'Cancelado' },
    }
    
    const config = statusConfig[status] || statusConfig[constants.TRIP_STATUS.PLANNED]
    return <Badge className={config.color}>{config.label}</Badge>
  }

  const filteredTrips = trips.filter(trip => {
    if (filter === 'all') return true
    return trip.status === filter
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Cargando tus viajes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Mis Viajes</h1>
            <p className="text-gray-600">Gestiona y revisa todos tus itinerarios de viaje</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Viaje
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-2">
        <Button 
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
          size="sm"
        >
          Todos ({trips.length})
        </Button>
        <Button 
          variant={filter === constants.TRIP_STATUS.PLANNED ? 'default' : 'outline'}
          onClick={() => setFilter(constants.TRIP_STATUS.PLANNED)}
          size="sm"
        >
          Planificados ({trips.filter(t => t.status === constants.TRIP_STATUS.PLANNED).length})
        </Button>
        <Button 
          variant={filter === constants.TRIP_STATUS.ONGOING ? 'default' : 'outline'}
          onClick={() => setFilter(constants.TRIP_STATUS.ONGOING)}
          size="sm"
        >
          En curso ({trips.filter(t => t.status === constants.TRIP_STATUS.ONGOING).length})
        </Button>
        <Button 
          variant={filter === constants.TRIP_STATUS.COMPLETED ? 'default' : 'outline'}
          onClick={() => setFilter(constants.TRIP_STATUS.COMPLETED)}
          size="sm"
        >
          Completados ({trips.filter(t => t.status === constants.TRIP_STATUS.COMPLETED).length})
        </Button>
      </div>

      {/* Trips Grid */}
      {filteredTrips.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Plane className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {filter === 'all' ? 'No tienes viajes aún' : 'No hay viajes en esta categoría'}
            </h3>
            <p className="text-gray-500 mb-4">
              {filter === 'all' 
                ? 'Comienza a planificar tu próxima aventura creando tu primer viaje'
                : 'Cambia el filtro para ver viajes en otras categorías'
              }
            </p>
            {filter === 'all' && (
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Crear mi primer viaje
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips.map((trip) => (
            <Card key={trip._id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
                      {trip.destination}
                    </CardTitle>
                    <div className="flex items-center text-sm text-gray-500 gap-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {utils.formatDate(trip.startDate)} - {utils.formatDate(trip.endDate)}
                      </div>
                    </div>
                  </div>
                  {getStatusBadge(trip.status)}
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-gray-600">
                      <Users className="h-4 w-4" />
                      {trip.partySize} {trip.partySize === 1 ? 'viajero' : 'viajeros'}
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <DollarSign className="h-4 w-4" />
                      {utils.formatCurrency(trip.budget, trip.currency)}
                    </div>
                  </div>
                  
                  {trip.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {trip.description}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-2 pt-2">
                    <Button size="sm" variant="outline" asChild>
                      <Link to={`/trips/${trip._id}`}>
                        <Eye className="h-4 w-4 mr-1" />
                        Ver
                      </Link>
                    </Button>
                    
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleExportPDF(trip._id)}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      PDF
                    </Button>
                    
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleDeleteTrip(trip._id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default Itineraries
