import React, { useState } from 'react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { ScrollArea } from '../components/ui/scroll-area'
import { MessageCircle, Send } from 'lucide-react'

const Dashboard = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      message: '¡Hola! Soy tu asistente de viajes TravelMate. ¿A dónde te gustaría viajar?',
      timestamp: new Date()
    }
  ])
  const [newMessage, setNewMessage] = useState('')

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      message: newMessage,
      timestamp: new Date()
    }

    setMessages([...messages, userMessage])
    setNewMessage('')

    // Simular respuesta del bot después de un delay
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        type: 'bot',
        message: 'Excelente elección! Te ayudo a planificar tu viaje. ¿Cuántos días planeas quedarte y cuál es tu presupuesto aproximado?',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botResponse])
    }, 1000)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Asistente de Viajes IA
          </CardTitle>
          <CardDescription>
            Pregúntame sobre destinos, itinerarios y presupuestos
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Chat Messages */}
          <ScrollArea className="h-96 mb-4 p-4 border rounded-lg bg-muted/20">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-foreground'
                    }`}
                  >
                    <p className="text-sm">{message.message}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Message Input */}
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              placeholder="Escribe tu mensaje..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2">Planificar viaje a Europa</h3>
            <p className="text-sm text-muted-foreground">
              Obtén un itinerario completo para 10 días en Europa
            </p>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2">Presupuesto para Asia</h3>
            <p className="text-sm text-muted-foreground">
              Calcula cuánto necesitas para un viaje de 2 semanas
            </p>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2">Viaje de fin de semana</h3>
            <p className="text-sm text-muted-foreground">
              Ideas para escapadas cortas cerca de tu ubicación
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard
