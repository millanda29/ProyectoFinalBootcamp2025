import React, { useState } from 'react'
import { Wand2, MapPin, Calendar, Users, DollarSign, Loader2, Save, Eye } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { useAuth } from '../context/AuthContext'
import api, { utils } from '../data/api.js'

const ItineraryGenerator = () => {
  const { accessToken } = useAuth()
  const [formData, setFormData] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    partySize: 1,
    budget: '',
    interests: []
  })
  const [generatedItinerary, setGeneratedItinerary] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const interestOptions = [
    'cultura', 'gastronomía', 'historia', 'naturaleza', 'aventura',
    'relax', 'vida nocturna', 'arte', 'museos', 'playas',
    'montañas', 'ciudades', 'compras', 'fotografía', 'deportes'
  ]

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleInterestToggle = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }))
  }

  const calculateDays = () => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate)
      const end = new Date(formData.endDate)
      const diffTime = Math.abs(end - start)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return diffDays + 1
    }
    return 0
  }

  const generateItinerary = async () => {
    if (!formData.destination || !formData.startDate || !formData.endDate) {
      utils.showError('Por favor completa todos los campos obligatorios')
      return
    }

    setIsGenerating(true)
    try {
      // Simplificar el formato de datos para que coincida con lo que espera el backend
      const itineraryData = {
        destination: formData.destination,
        startDate: formData.startDate,
        endDate: formData.endDate,
        partySize: formData.partySize,
        budget: formData.budget,
        interests: formData.interests
      }

      const response = await api.chat.generateBasicItinerary(accessToken, itineraryData)
      
      // Manejar la respuesta de la API correctamente
      let itineraryResult = null
      
      if (response.success && response.data) {
        // Estructura: { success: true, data: { destination, duration, days, estimatedCosts, totalEstimate } }
        itineraryResult = response.data
      } else if (response.data) {
        // Solo data directamente
        itineraryResult = response.data
      } else {
        // Respuesta directa
        itineraryResult = response
      }
      
      setGeneratedItinerary(itineraryResult)
      utils.showSuccess('¡Itinerario generado exitosamente!')
    } catch (error) {
      console.error('Error generating itinerary:', error)
      utils.showError('Error al generar el itinerario: ' + (error.message || 'Error desconocido'))
    } finally {
      setIsGenerating(false)
    }
  }

  const saveItineraryAsTrip = async () => {
    if (!generatedItinerary) return

    setIsSaving(true)
    try {
      // Formatear el itinerario antes de crear el viaje
      let formattedItinerary = []
      
      if (generatedItinerary.days && Array.isArray(generatedItinerary.days)) {
        // Nueva estructura con 'days'
        formattedItinerary = generatedItinerary.days.map((day, index) => ({
          dayNumber: index + 1,
          notes: `Día ${index + 1}`,
          activities: Array.isArray(day.activities) ? day.activities.map(activity => ({
            title: activity.title || activity.name || 'Actividad',
            category: 'sightseeing', // Usar string básico
            startTime: activity.startTime || activity.time || '09:00',
            endTime: activity.endTime || '',
            location: activity.location || activity.place || formData.destination,
            estimatedCost: 0,
            description: activity.description || `${activity.category || 'Actividad'} en ${activity.location || formData.destination}`
          })) : []
        }))
      } else if (generatedItinerary.itinerary && Array.isArray(generatedItinerary.itinerary)) {
        // Estructura anterior con 'itinerary'
        formattedItinerary = generatedItinerary.itinerary.map((day, index) => ({
          dayNumber: day.day || (index + 1),
          notes: day.title || `Día ${day.day || (index + 1)}`,
          activities: Array.isArray(day.activities) ? day.activities.map(activity => ({
            title: activity.activity || activity.title || 'Actividad',
            category: 'sightseeing', // Usar string básico
            startTime: activity.time || activity.startTime || '09:00',
            endTime: activity.endTime || '',
            location: activity.location || formData.destination,
            estimatedCost: parseFloat(activity.cost) || 0,
            description: activity.duration || activity.description || ''
          })) : []
        }))
      }

      // Formatear costos
      let formattedCosts = []
      if (generatedItinerary.estimatedCosts) {
        if (typeof generatedItinerary.estimatedCosts === 'object' && !Array.isArray(generatedItinerary.estimatedCosts)) {
          // Si estimatedCosts es un objeto (accommodation, food, etc.)
          const costTypeMapping = {
            'accommodation': 'lodging',
            'food': 'other',
            'activities': 'other', 
            'transportation': 'transportation',
            'lodging': 'lodging',
            'meals': 'other',
            'entertainment': 'other',
            'transport': 'transportation'
          }
          
          Object.entries(generatedItinerary.estimatedCosts).forEach(([key, value]) => {
            if (value > 0) {
              formattedCosts.push({
                type: costTypeMapping[key] || 'other',
                label: key.charAt(0).toUpperCase() + key.slice(1),
                currency: 'USD',
                amount: parseFloat(value),
                quantity: 1
              })
            }
          })
        } else if (Array.isArray(generatedItinerary.estimatedCosts)) {
          // Si estimatedCosts es un array
          const costTypeMapping = {
            'accommodation': 'lodging',
            'food': 'other',
            'activities': 'other',
            'transportation': 'transportation'
          }
          
          formattedCosts = generatedItinerary.estimatedCosts.map(cost => ({
            type: costTypeMapping[cost.type] || 'other',
            label: cost.label || cost.type || 'Costo',
            currency: cost.currency || 'USD',
            amount: parseFloat(cost.amount) || 0,
            quantity: cost.quantity || 1
          }))
        }
      }

      // Crear el viaje con todos los datos incluidos
      const tripData = {
        title: `Viaje a ${formData.destination}`,
        destination: formData.destination,
        startDate: formData.startDate,
        endDate: formData.endDate,
        partySize: parseInt(formData.partySize) || 1,
        budget: formData.budget ? parseFloat(formData.budget) : generatedItinerary.totalEstimate || 0,
        itinerary: formattedItinerary,
        costs: formattedCosts,
        description: `Viaje generado por IA para ${formData.destination}`,
        status: 'planned'
      }

      await api.trips.createTrip(accessToken, tripData)

      utils.showSuccess('¡Itinerario guardado como viaje!')
      
      // Resetear formulario
      setFormData({
        destination: '',
        startDate: '',
        endDate: '',
        partySize: 1,
        budget: '',
        interests: []
      })
      setGeneratedItinerary(null)

    } catch (error) {
      console.error('Error saving itinerary:', error)
      utils.showError('Error al guardar el itinerario: ' + (error.message || 'Error desconocido'))
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="w-6 h-6 text-purple-600" />
            <span>Generador de Itinerarios IA</span>
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
              Beta
            </Badge>
          </CardTitle>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulario */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Detalles del Viaje</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Destino */}
            <div>
              <Label htmlFor="destination" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Destino *
              </Label>
              <Input
                id="destination"
                value={formData.destination}
                onChange={(e) => handleInputChange('destination', e.target.value)}
                placeholder="ej. París, Francia"
                className="mt-1"
              />
            </div>

            {/* Fechas */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Fecha inicio *
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="endDate">Fecha fin *</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            {/* Duración calculada */}
            {calculateDays() > 0 && (
              <div className="text-sm text-gray-600 bg-blue-50 p-2 rounded">
                📅 Duración: {calculateDays()} días
              </div>
            )}

            {/* Personas y Presupuesto */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="partySize" className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Personas
                </Label>
                <Input
                  id="partySize"
                  type="number"
                  min="1"
                  value={formData.partySize}
                  onChange={(e) => handleInputChange('partySize', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="budget" className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Presupuesto (USD)
                </Label>
                <Input
                  id="budget"
                  type="number"
                  value={formData.budget}
                  onChange={(e) => handleInputChange('budget', e.target.value)}
                  placeholder="Opcional"
                  className="mt-1"
                />
              </div>
            </div>

            {/* Intereses */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-3 block">
                Intereses (selecciona hasta 5)
              </Label>
              <div className="flex flex-wrap gap-2">
                {interestOptions.map((interest) => (
                  <Button
                    key={interest}
                    variant={formData.interests.includes(interest) ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleInterestToggle(interest)}
                    disabled={!formData.interests.includes(interest) && formData.interests.length >= 5}
                    className="text-xs rounded-full"
                  >
                    {interest}
                  </Button>
                ))}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {formData.interests.length}/5 seleccionados
              </div>
            </div>

            {/* Botón Generar */}
            <Button
              onClick={generateItinerary}
              disabled={isGenerating || !formData.destination || !formData.startDate || !formData.endDate}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Generando Itinerario...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 mr-2" />
                  Generar Itinerario IA
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Resultado */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Itinerario Generado</CardTitle>
          </CardHeader>
          <CardContent>
            {!generatedItinerary ? (
              <div className="text-center py-12 text-gray-500">
                <Wand2 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Completa el formulario y genera tu itinerario personalizado</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Resumen */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">
                    {generatedItinerary.destination || formData.destination}
                  </h3>
                  <div className="grid grid-cols-2 gap-2 text-sm text-blue-800">
                    <div>📅 {generatedItinerary.duration || `${calculateDays()} días`}</div>
                    <div>💰 ${generatedItinerary.totalEstimate || generatedItinerary.estimatedBudget || generatedItinerary.budget || formData.budget || 'N/A'}</div>
                  </div>
                  {/* Mostrar desglose de costos si está disponible */}
                  {generatedItinerary.estimatedCosts && (
                    <div className="mt-3 pt-2 border-t border-blue-200">
                      <div className="text-xs text-blue-700 space-y-1">
                        {generatedItinerary.estimatedCosts.accommodation && (
                          <div>🏨 Alojamiento: ${generatedItinerary.estimatedCosts.accommodation}</div>
                        )}
                        {generatedItinerary.estimatedCosts.food && (
                          <div>🍽️ Comida: ${generatedItinerary.estimatedCosts.food}</div>
                        )}
                        {generatedItinerary.estimatedCosts.activities && (
                          <div>🎯 Actividades: ${generatedItinerary.estimatedCosts.activities}</div>
                        )}
                        {generatedItinerary.estimatedCosts.transportation && (
                          <div>🚗 Transporte: ${generatedItinerary.estimatedCosts.transportation}</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Itinerario por días */}
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {(generatedItinerary.days && Array.isArray(generatedItinerary.days)) || 
                   (generatedItinerary.itinerary && Array.isArray(generatedItinerary.itinerary)) ? 
                    (generatedItinerary.days || generatedItinerary.itinerary).map((day, index) => (
                      <div key={index} className="border rounded-lg p-3">
                        <h4 className="font-semibold text-gray-900 mb-2">
                          Día {day.day || (index + 1)}: {day.title || day.name || `Día en ${formData.destination}`}
                        </h4>
                        <div className="space-y-2">
                          {day.activities && Array.isArray(day.activities) ? 
                            day.activities.map((activity, actIndex) => (
                              <div key={actIndex} className="text-sm bg-gray-50 p-2 rounded">
                                <div className="font-medium">
                                  {activity.time || activity.startTime || 'Todo el día'} - {activity.activity || activity.title || activity.name || 'Actividad'}
                                </div>
                                <div className="text-gray-600">{activity.location || activity.place || formData.destination}</div>
                                <div className="flex justify-between text-xs text-gray-500">
                                  <span>{activity.duration || activity.description || 'Duración a determinar'}</span>
                                  {(activity.cost > 0 || activity.estimatedCost > 0) && 
                                    <span>${activity.cost || activity.estimatedCost}</span>
                                  }
                                </div>
                              </div>
                            )) 
                            : (
                              <div className="text-sm bg-gray-50 p-2 rounded text-gray-600">
                                Actividades en planificación...
                              </div>
                            )
                          }
                        </div>
                      </div>
                    ))
                    : (
                      <div className="border rounded-lg p-3 text-center text-gray-500">
                        <p>Itinerario en proceso de generación...</p>
                        <p className="text-sm mt-2">Los detalles aparecerán aquí una vez que la IA procese tu solicitud.</p>
                      </div>
                    )
                  }
                </div>

                {/* Recomendaciones */}
                {generatedItinerary.recommendations && Array.isArray(generatedItinerary.recommendations) && (
                  <div className="bg-green-50 p-3 rounded-lg">
                    <h4 className="font-semibold text-green-900 mb-2">💡 Recomendaciones</h4>
                    <ul className="text-sm text-green-800 space-y-1">
                      {generatedItinerary.recommendations.map((rec, index) => (
                        <li key={index}>• {rec}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Botones de acción */}
                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={saveItineraryAsTrip}
                    disabled={isSaving}
                    className="flex-1"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Guardando...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Guardar como Viaje
                      </>
                    )}
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Eye className="w-4 h-4 mr-2" />
                    Ver Detalles
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ItineraryGenerator
