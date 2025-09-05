import React, { useState, useEffect, useContext } from 'react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { ScrollArea } from '../components/ui/scroll-area'
import { MessageCircle, Send, DollarSign, Plane, MapPin, Calendar, Users, Loader2 } from 'lucide-react'
import { AuthContext } from '../context/AuthContext'
import api, { utils } from '../data/api.js'

const Dashboard = () => {
  const { accessToken, loading: authLoading } = useContext(AuthContext)
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      message: '¡Hola! Soy tu asistente de viajes TravelMate. ¿A dónde te gustaría viajar?',
      timestamp: new Date()
    }
  ])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [trips, setTrips] = useState([])
  const [budget, setBudget] = useState({
    destination: '',
    duration: '',
    travelers: '',
    accommodation: 0,
    transportation: 0,
    food: 0,
    activities: 0,
    total: 0
  })

  // Cargar viajes al montar el componente
  useEffect(() => {
    loadTrips()
  }, [])

  const loadTrips = async () => {
    try {
      const response = await api.trips.getMyTrips({ page: 1, limit: 5 })
      setTrips(response.trips || [])
    } catch (error) {
      console.error('Error loading trips:', error)
      utils.showError(error)
    }
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || isLoading) return

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      message: newMessage.trim(),
      timestamp: new Date()
    }

    setMessages([...messages, userMessage])
    setNewMessage('')
    setIsLoading(true)

    try {
      // Usar la API real de chat
      const response = await api.chat.chatWithAssistant({
        message: newMessage.trim(),
        context: 'travel_planning'
      })

      const botResponse = {
        id: messages.length + 2,
        type: 'bot',
        message: response.message || response.response || 'Lo siento, no pude procesar tu solicitud.',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, botResponse])
      
      // Actualizar presupuesto si la respuesta incluye información relevante
      if (response.budget_estimate) {
        updateBudgetFromResponse(response.budget_estimate)
      }
    } catch (error) {
      console.error('Error sending message:', error)
      utils.showError(error)
      
      const errorResponse = {
        id: messages.length + 2,
        type: 'bot',
        message: 'Lo siento, hubo un error al procesar tu mensaje. Por favor, inténtalo de nuevo.',
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, errorResponse])
    } finally {
      setIsLoading(false)
    }
  }

  // Función para actualizar presupuesto basado en respuesta de la API
  const updateBudgetFromResponse = (budgetEstimate) => {
    if (budgetEstimate) {
      setBudget(prev => ({
        ...prev,
        destination: budgetEstimate.destination || prev.destination,
        duration: budgetEstimate.duration || prev.duration,
        travelers: budgetEstimate.travelers || prev.travelers,
        accommodation: budgetEstimate.accommodation || prev.accommodation,
        transportation: budgetEstimate.transportation || prev.transportation,
        food: budgetEstimate.food || prev.food,
        activities: budgetEstimate.activities || prev.activities,
        total: budgetEstimate.total || prev.total
      }))
    }
  }

  // Función para actualizar presupuesto basado en mensajes (fallback)
  const updateBudgetFromMessage = (message) => {
    const lowerMessage = message.toLowerCase()
    
    // Detectar destino
    if (lowerMessage.includes('paris') || lowerMessage.includes('francia')) {
      setBudget(prev => ({ ...prev, destination: 'París, Francia' }))
      simulateBudgetCalculation('paris')
    } else if (lowerMessage.includes('tokio') || lowerMessage.includes('japón')) {
      setBudget(prev => ({ ...prev, destination: 'Tokio, Japón' }))
      simulateBudgetCalculation('tokyo')
    } else if (lowerMessage.includes('new york') || lowerMessage.includes('nueva york')) {
      setBudget(prev => ({ ...prev, destination: 'Nueva York, EE.UU.' }))
      simulateBudgetCalculation('newyork')
    }
    
    // Detectar duración
    const daysMatch = lowerMessage.match(/(\d+)\s*(días?|days?)/)
    if (daysMatch) {
      setBudget(prev => ({ ...prev, duration: `${daysMatch[1]} días` }))
    }
    
    // Detectar número de viajeros
    const travelersMatch = lowerMessage.match(/(\d+)\s*(personas?|people|viajeros?)/)
    if (travelersMatch) {
      setBudget(prev => ({ ...prev, travelers: `${travelersMatch[1]} personas` }))
    }
  }

  const simulateBudgetCalculation = (destination) => {
    const budgets = {
      paris: { accommodation: 120, transportation: 80, food: 60, activities: 100 },
      tokyo: { accommodation: 100, transportation: 60, food: 50, activities: 120 },
      newyork: { accommodation: 150, transportation: 90, food: 70, activities: 110 }
    }
    
    const cityBudget = budgets[destination] || { accommodation: 80, transportation: 60, food: 40, activities: 80 }
    const total = Object.values(cityBudget).reduce((sum, val) => sum + val, 0)
    
    setBudget(prev => ({
      ...prev,
      ...cityBudget,
      total
    }))
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Chat Section */}
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-xl bg-white">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="bg-yellow-400 p-2 rounded-lg">
                  <MessageCircle className="h-6 w-6 text-blue-900" />
                </div>
                Asistente de Viajes IA
              </CardTitle>
              <CardDescription className="text-blue-100">
                Pregúntame sobre destinos, itinerarios y presupuestos
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {/* Chat Messages */}
              <ScrollArea className="h-96 mb-4 p-4 border border-gray-200 rounded-xl bg-gray-50">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${
                          message.type === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white border border-gray-200 text-gray-800'
                        }`}
                      >
                        <p className="text-sm font-medium">{message.message}</p>
                        <p className={`text-xs mt-2 ${
                          message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="flex gap-3">
                <Input
                  placeholder={isLoading ? "Procesando..." : "Escribe tu mensaje..."}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  disabled={isLoading}
                  className="flex-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
                <Button 
                  type="submit" 
                  size="icon" 
                  disabled={isLoading || !newMessage.trim()}
                  className="bg-blue-600 hover:bg-blue-700 shadow-md"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Budget Section */}
        <div className="lg:col-span-1">
          <Card className="border-0 shadow-xl bg-white h-fit sticky top-24">
            <CardHeader className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-blue-900 rounded-t-lg">
              <CardTitle className="flex items-center gap-3 text-lg">
                <DollarSign className="h-5 w-5" />
                Presupuesto Estimado
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {budget.destination ? (
                <div className="space-y-4">
                  {/* Trip Info */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-gray-700">{budget.destination}</span>
                    </div>
                    {budget.duration && (
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-blue-600" />
                        <span className="text-gray-600">{budget.duration}</span>
                      </div>
                    )}
                    {budget.travelers && (
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4 text-blue-600" />
                        <span className="text-gray-600">{budget.travelers}</span>
                      </div>
                    )}
                  </div>
                  
                  <hr className="border-gray-200" />
                  
                  {/* Budget Breakdown */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Alojamiento</span>
                      <span className="font-semibold">${budget.accommodation}/día</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Transporte</span>
                      <span className="font-semibold">${budget.transportation}/día</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Comida</span>
                      <span className="font-semibold">${budget.food}/día</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Actividades</span>
                      <span className="font-semibold">${budget.activities}/día</span>
                    </div>
                    
                    <hr className="border-gray-200" />
                    
                    <div className="flex justify-between items-center bg-blue-50 p-3 rounded-lg">
                      <span className="font-semibold text-blue-900">Total por día</span>
                      <span className="font-bold text-lg text-blue-900">${budget.total}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <DollarSign className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">
                    Comienza a chatear para ver el presupuesto estimado de tu viaje
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        <Card className="cursor-pointer hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-lg bg-white group">
          <CardContent className="p-6">
            <div className="bg-gradient-to-br from-blue-100 to-blue-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:from-blue-600 group-hover:to-blue-700 transition-all duration-300">
              <MessageCircle className="h-6 w-6 text-blue-600 group-hover:text-white transition-colors duration-300" />
            </div>
            <h3 className="font-bold mb-2 text-gray-900">Planificar viaje a Europa</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Obtén un itinerario completo para 10 días en Europa
            </p>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-lg bg-white group">
          <CardContent className="p-6">
            <div className="bg-gradient-to-br from-yellow-100 to-yellow-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:from-yellow-400 group-hover:to-yellow-500 transition-all duration-300">
              <DollarSign className="h-6 w-6 text-yellow-600 group-hover:text-blue-900 transition-colors duration-300" />
            </div>
            <h3 className="font-bold mb-2 text-gray-900">Presupuesto para Asia</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Calcula cuánto necesitas para un viaje de 2 semanas
            </p>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-lg bg-white group">
          <CardContent className="p-6">
            <div className="bg-gradient-to-br from-gray-100 to-gray-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:from-gray-800 group-hover:to-black transition-all duration-300">
              <Plane className="h-6 w-6 text-gray-700 group-hover:text-white transition-colors duration-300" />
            </div>
            <h3 className="font-bold mb-2 text-gray-900">Viaje de fin de semana</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Ideas para escapadas cortas cerca de tu ubicación
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard
