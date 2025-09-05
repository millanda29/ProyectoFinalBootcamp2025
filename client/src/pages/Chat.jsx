import React, { useState, useEffect, useRef } from 'react'
import { Send, Bot, User, Loader2, Copy, ThumbsUp, ThumbsDown, Lightbulb } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { useAuth } from '../context/AuthContext'
import api, { utils } from '../data/api.js'

const Chat = () => {
  const { accessToken } = useAuth()
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [conversationId, setConversationId] = useState(null)
  const [suggestions, setSuggestions] = useState([])
  const messagesEndRef = useRef(null)

  // Scroll automático al final de los mensajes
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // ✅ Cargar conversaciones y sugerencias iniciales
  useEffect(() => {
    const initializeChat = async () => {
      if (!accessToken) return
      
      try {
        // Cargar sugerencias de destinos
        const destinationSuggestions = await api.chat.getDestinationSuggestions(accessToken)
        setSuggestions(destinationSuggestions.slice(0, 4))
        
        // Cargar conversaciones previas si existen
        const conversations = await api.chat.getMyConversations(accessToken)
        if (conversations.length > 0) {
          const lastConversation = conversations[0]
          setConversationId(lastConversation._id)
          // Opcional: cargar mensajes de la última conversación
        }
      } catch (error) {
        console.error('Error initializing chat:', error)
      }
    }

    // Mensaje de bienvenida
    const welcomeMessage = {
      id: Date.now(),
      type: 'assistant',
      content: `¡Hola! 👋 Soy tu asistente de viajes con IA. Puedo ayudarte con:

🗺️ **Planificar itinerarios** personalizados
📍 **Recomendar destinos** basados en tus preferencias  
📋 **Información de viajes** (documentos, visas, salud)
💰 **Presupuestos** y costos estimados
🏨 **Alojamientos** y actividades
🍽️ **Gastronomía** local y restaurantes

¿En qué puedo ayudarte con tu próximo viaje?`,
      timestamp: new Date(),
      suggestions: [
        "¿Cuál es el mejor destino para luna de miel en Europa?",
        "Planifica un viaje de 7 días a Japón",
        "¿Qué documentos necesito para viajar a Estados Unidos?",
        "Recomiéndame actividades en París para familias"
      ]
    }
    setMessages([welcomeMessage])
    setSuggestions(welcomeMessage.suggestions)
    
    // Inicializar chat con datos del servidor
    initializeChat()
  }, [accessToken])

  const sendMessage = async (message = inputMessage) => {
    if (!message.trim() || isLoading) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)
    setSuggestions([])

    try {
      // ✅ Usar endpoint real de chat assistant
      const chatData = {
        message: message,
        conversationId: conversationId || undefined
      }

      const response = await api.chat.chatAssistant(accessToken, chatData)
      
      // Manejar diferentes estructuras de respuesta
      let responseText = '';
      let suggestions = [];
      let responseConversationId = null;
      
      if (response?.data?.response) {
        responseText = response.data.response;
        suggestions = response.data.relatedSuggestions || [];
        responseConversationId = response.data.conversationId;
      } else if (response?.response) {
        responseText = response.response;
        suggestions = response.relatedSuggestions || [];
        responseConversationId = response.conversationId;
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
        timestamp: new Date(),
        suggestions: suggestions,
        conversationId: responseConversationId
      }

      setMessages(prev => [...prev, assistantMessage])
      setSuggestions(suggestions)
      
      if (responseConversationId && !conversationId) {
        setConversationId(responseConversationId)
      }

    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: '❌ Lo siento, no pude procesar tu mensaje. Por favor, inténtalo de nuevo.',
        timestamp: new Date(),
        isError: true
      }
      setMessages(prev => [...prev, errorMessage])
      utils.showError('Error al enviar mensaje')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuggestionClick = (suggestion) => {
    sendMessage(suggestion)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    utils.showSuccess('Texto copiado al portapapeles')
  }

  const formatMessage = (content) => {
    // Convertir markdown básico a HTML
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>')
  }

  return (
    <div className="max-w-4xl mx-auto h-screen flex flex-col">
      {/* Header */}
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Bot className="w-6 h-6 text-blue-600" />
            Asistente de Viajes IA
            <Badge variant="secondary">Beta</Badge>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Messages Container */}
      <Card className="flex-1 flex flex-col">
        <CardContent className="flex-1 flex flex-col p-4">
          <div className="flex-1 overflow-y-auto mb-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.type === 'assistant' && (
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4 text-blue-600" />
                    </div>
                  </div>
                )}
                
                <div className={`max-w-[80%] ${message.type === 'user' ? 'order-1' : ''}`}>
                  <div
                    className={`rounded-lg px-4 py-3 ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white'
                        : message.isError
                        ? 'bg-red-50 text-red-800 border border-red-200'
                        : 'bg-gray-50 text-gray-800'
                    }`}
                  >
                    <div
                      dangerouslySetInnerHTML={{
                        __html: formatMessage(message.content)
                      }}
                    />
                  </div>
                  
                  {message.type === 'assistant' && !message.isError && (
                    <div className="flex gap-2 mt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(message.content)}
                        className="h-6 px-2 text-xs"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs"
                      >
                        <ThumbsUp className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs"
                      >
                        <ThumbsDown className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                </div>

                {message.type === 'user' && (
                  <div className="flex-shrink-0 order-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-gray-600">Pensando...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium text-gray-700">Sugerencias:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="text-xs h-8 rounded-full"
                    disabled={isLoading}
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe tu pregunta sobre viajes..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={() => sendMessage()}
              disabled={isLoading || !inputMessage.trim()}
              className="px-3"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Chat
