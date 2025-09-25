import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { 
  MapPin, Calendar, DollarSign, Users, ArrowLeft, Download, Edit, 
  Clock, Plane, Hotel, Utensils, Car, Camera, Star,
  MessageCircle, Share2, Trash2, Loader2, Eye, CheckCircle
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api, { utils } from '../data/api.js'

const TripDetails = () => {
  const { tripId } = useParams()
  const navigate = useNavigate()
  const { accessToken } = useAuth()
  const [trip, setTrip] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pdfExists, setPdfExists] = useState(false)
  const [checkingPDF, setCheckingPDF] = useState(false)

  useEffect(() => {
    const loadTripDetails = async () => {
      if (!accessToken || !tripId) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        
        // ✅ Usar el endpoint específico para obtener un viaje por ID
        const response = await api.trips.getTripById(accessToken, tripId)
        
        if (response.success && response.data) {
          setTrip(response.data)
          
          // ✅ Verificar si ya existe un PDF para este viaje
          setCheckingPDF(true)
          try {
            const pdfExists = await api.trips.checkPDFExists(accessToken, tripId)
            setPdfExists(pdfExists)
          } catch {
            setPdfExists(false)
          } finally {
            setCheckingPDF(false)
          }
        } else {
          setError('Viaje no encontrado')
        }
      } catch (error) {
        console.error('Error loading trip details:', error)
        setError('Error al cargar el viaje')
      } finally {
        setLoading(false)
      }
    }

    loadTripDetails()
  }, [tripId, accessToken])

  const getStatusBadge = (status) => {
    const statusConfig = {
      'planned': { color: 'bg-blue-100 text-blue-800', label: 'Planificado' },
      'active': { color: 'bg-green-100 text-green-800', label: 'En curso' },
      'completed': { color: 'bg-gray-100 text-gray-800', label: 'Completado' },
      'cancelled': { color: 'bg-red-100 text-red-800', label: 'Cancelado' },
    }
    
    const config = statusConfig[status] || statusConfig['planned']
    return <Badge className={config.color}>{config.label}</Badge>
  }

  const getCostIcon = (type) => {
    const icons = {
      'lodging': Hotel,
      'food': Utensils,
      'transportation': Car,
      'activities': Camera,
      'other': Star
    }
    return icons[type] || Star
  }

  const handleDeleteTrip = async () => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este viaje?')) {
      return
    }

    try {
      await api.trips.deleteTrip(accessToken, tripId)
      utils.showSuccess('Viaje eliminado exitosamente')
      navigate('/itineraries')
    } catch (error) {
      console.error('Error deleting trip:', error)
      utils.showError('Error al eliminar el viaje')
    }
  }

  const handleGenerateAndDownloadPDF = async () => {
    try {
      const wasExisting = pdfExists
      
      // ✅ Generar reporte en el servidor Y descargarlo en una sola operación (inteligente)
      const pdfBlob = await api.trips.generateAndDownloadPDF(accessToken, tripId)
      
      // Verificar que es un blob válido
      if (!pdfBlob || pdfBlob.size === 0) {
        throw new Error('El PDF no está disponible')
      }
      
      const url = window.URL.createObjectURL(pdfBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${trip.title || trip.destination}-${tripId}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      // Mostrar mensaje apropiado según si ya existía o se generó nuevo
      if (wasExisting) {
        utils.showSuccess('PDF descargado exitosamente (usando reporte existente)')
      } else {
        utils.showSuccess('PDF generado y descargado exitosamente')
      }
      
      // ✅ Actualizar estado para reflejar que ahora existe el PDF
      setPdfExists(true)
    } catch (error) {
      console.error('Error exporting PDF:', error)
      utils.showError('Error al descargar el PDF: ' + (error.message || 'Error desconocido'))
    }
  }

  const handleViewReport = (report) => {
    // Construir la URL correcta para ver el reporte
    const reportUrl = report.fileUrl.startsWith('http') 
      ? report.fileUrl 
      : `http://localhost:4000${report.fileUrl.startsWith('/') ? '' : '/'}${report.fileUrl}`
    
    window.open(reportUrl, '_blank')
  }

  const handleDownloadReport = async () => {
    try {
      // Usar la función de descarga de PDF
      await handleGenerateAndDownloadPDF()
    } catch (error) {
      console.error('Error downloading report:', error)
      utils.showError('Error al descargar el reporte')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Cargando detalles del viaje...</p>
        </div>
      </div>
    )
  }

  if (error || !trip) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Plane className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {error || 'Viaje no encontrado'}
          </h2>
          <p className="text-gray-600 mb-4">
            No pudimos encontrar los detalles de este viaje.
          </p>
          <Button onClick={() => navigate('/itineraries')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Mis Viajes
          </Button>
        </div>
      </div>
    )
  }

  const totalCost = trip.costs?.reduce((sum, cost) => sum + (cost.amount * (cost.quantity || 1)), 0) || 0

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/itineraries')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>
          {getStatusBadge(trip.status)}
        </div>
        
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {trip.title || trip.destination}
            </h1>
            <div className="flex items-center gap-6 text-gray-600">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                <span>{trip.destination}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>
                  {trip.startDate && trip.endDate ? (
                    `${new Date(trip.startDate).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric'
                    })} - ${new Date(trip.endDate).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric'
                    })}`
                  ) : 'Fechas pendientes'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <span>{trip.partySize || 1} viajero{(trip.partySize || 1) !== 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {pdfExists && !checkingPDF && (
              <div className="flex items-center gap-1 text-sm text-green-600 bg-green-50 px-2 py-1 rounded">
                <CheckCircle className="h-4 w-4" />
                PDF disponible
              </div>
            )}
            <Button 
              variant="outline" 
              onClick={handleGenerateAndDownloadPDF}
              disabled={checkingPDF}
            >
              <Download className="h-4 w-4 mr-2" />
              {checkingPDF 
                ? "Verificando..." 
                : pdfExists 
                  ? "Descargar PDF" 
                  : "Generar y Descargar PDF"
              }
            </Button>
            <Button variant="outline">
              <Share2 className="h-4 w-4 mr-2" />
              Compartir
            </Button>
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
            <Button variant="outline" onClick={handleDeleteTrip} className="text-red-600 hover:text-red-700">
              <Trash2 className="h-4 w-4 mr-2" />
              Eliminar
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Itinerario */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Itinerario
              </CardTitle>
            </CardHeader>
            <CardContent>
              {trip.itinerary && trip.itinerary.length > 0 ? (
                <div className="space-y-4">
                  {trip.itinerary.map((day, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Día {day.dayNumber}: {day.notes || `Actividades del día ${day.dayNumber}`}
                      </h4>
                      {day.activities && day.activities.length > 0 ? (
                        <div className="space-y-2">
                          {day.activities.map((activity, actIndex) => (
                            <div key={actIndex} className="bg-gray-50 p-3 rounded">
                              <div className="font-medium">{activity.name || activity.title}</div>
                              {activity.time && (
                                <div className="text-sm text-gray-600">{activity.time}</div>
                              )}
                              {activity.description && (
                                <div className="text-sm text-gray-700">{activity.description}</div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-600">{day.notes || 'Actividades por definir'}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>No hay itinerario definido para este viaje</p>
                  <Button className="mt-4" variant="outline">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Generar con IA
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Conversaciones de IA */}
          {trip.aiConversations && trip.aiConversations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Conversaciones de IA
                  <Badge variant="secondary">Beta</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {trip.aiConversations.map((conversation, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-3">
                      <div className="font-medium">{conversation.title || `Conversación ${index + 1}`}</div>
                      <div className="text-sm text-gray-600">
                        {new Date(conversation.createdAt).toLocaleDateString('es-ES')}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Columna lateral */}
        <div className="space-y-6">
          {/* Resumen de costos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Costos del Viaje
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total:</span>
                  <span className="text-green-600">${totalCost.toLocaleString()}</span>
                </div>
                
                {trip.costs && trip.costs.length > 0 ? (
                  <div className="space-y-2 border-t pt-3">
                    {trip.costs.map((cost, index) => {
                      const Icon = getCostIcon(cost.type)
                      return (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4 text-gray-600" />
                            <span className="text-sm">{cost.label}</span>
                          </div>
                          <span className="font-medium">
                            ${(cost.amount * (cost.quantity || 1)).toLocaleString()}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    <p className="text-sm">No hay costos registrados</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Reportes */}
          {trip.reports && trip.reports.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Reportes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {trip.reports.map((report, index) => (
                    <div key={index} className="flex items-center justify-between border border-gray-200 rounded p-3">
                      <div className="flex-1">
                        <div className="text-sm font-medium">{report.format.toUpperCase()}</div>
                        <div className="text-xs text-gray-500">
                          {new Date(report.createdAt || trip.createdAt).toLocaleDateString('es-ES')}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleViewReport(report)}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Ver
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDownloadReport()}
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Descargar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Información adicional */}
          <Card>
            <CardHeader>
              <CardTitle>Información</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="text-sm font-medium text-gray-600">Creado</div>
                <div className="text-sm">
                  {new Date(trip.createdAt).toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                  })}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-600">Última actualización</div>
                <div className="text-sm">
                  {new Date(trip.updatedAt).toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                  })}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-600">ID del viaje</div>
                <div className="text-xs font-mono text-gray-500">{trip._id}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default TripDetails
