import React, { useState } from 'react'
import { Bot, Send, Loader2, X, Maximize2, Minimize2 } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { useAuth } from '../context/AuthContext'
import api from '../data/api.js'

const ChatWidget = ({ tripId = null, isExpanded = false, onToggleExpand }) => {
  const { accessToken } = useAuth()
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      // Simplificar el formato de datos para que coincida con lo que espera el backend
      const chatData = {
        message: inputMessage
      }

      const response = await api.chat.chatAssistant(accessToken, chatData)
      
      // Manejar diferentes estructuras de respuesta
      let responseText = '';
      if (response?.data?.response) {
        responseText = response.data.response;
      } else if (response?.response) {
        responseText = response.response;
      } else if (response?.message) {
        responseText = response.message;
      } else if (typeof response === 'string') {
        responseText = response;
      } else {
        responseText = 'Respuesta recibida del asistente';
      }
      
      const assistantMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: responseText,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])

    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: '❌ Error al procesar tu mensaje',
        timestamp: new Date(),
        isError: true
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      sendMessage()
    }
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 w-14 h-14 rounded-full shadow-lg z-40"
      >
        <Bot className="w-6 h-6" />
      </Button>
    )
  }

  return (
    <div className={`fixed bottom-4 right-4 z-40 ${isExpanded ? 'w-96' : 'w-80'} ${isExpanded ? 'h-[500px]' : 'h-96'}`}>
      <Card className="h-full flex flex-col shadow-xl">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Bot className="w-4 h-4 text-blue-600" />
              <span>Asistente IA</span>
              <Badge variant="secondary" className="text-xs bg-yellow-400 text-blue-900">
                Beta
              </Badge>
              {tripId && <span className="text-xs text-gray-500">• Trip Chat</span>}
            </CardTitle>
            <div className="flex gap-1">
              {onToggleExpand && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggleExpand}
                  className="h-6 w-6 p-0"
                >
                  {isExpanded ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-6 w-6 p-0"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-3">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto mb-3 space-y-2">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 text-sm py-4">
                <Bot className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                {tripId ? 
                  "¡Hola! Pregúntame sobre tu viaje" : 
                  "¡Hola! ¿En qué puedo ayudarte?"
                }
              </div>
            )}
            
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : message.isError
                      ? 'bg-red-50 text-red-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg px-3 py-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>Pensando...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe tu pregunta..."
              disabled={isLoading}
              className="flex-1 text-sm"
            />
            <Button
              onClick={sendMessage}
              disabled={isLoading || !inputMessage.trim()}
              size="sm"
              className="px-3"
            >
              {isLoading ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Send className="w-3 h-3" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ChatWidget
