import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { Plane, MessageCircle, DollarSign, Download, LogIn } from 'lucide-react'
import Logo from '../components/Logo'

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Header */}
      <nav className="absolute top-0 left-0 right-0 z-20 p-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="transition-transform hover:scale-105">
            <Logo size="default" variant="light" />
          </Link>
          <Link to="/login">
            <Button 
              variant="outline" 
              className="bg-white/10 border-white/30 text-white hover:bg-yellow-400 hover:text-blue-900 hover:border-yellow-400 backdrop-blur-sm transition-all duration-300 font-semibold"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Iniciar Sesión
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white min-h-[90vh] flex items-center overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-32 h-32 bg-yellow-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-40 right-20 w-40 h-40 bg-yellow-300 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white rounded-full blur-2xl"></div>
        </div>
        
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">
              Tu Asistente Inteligente de <span className="text-yellow-400 bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent">Viajes</span>
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-blue-100 leading-relaxed max-w-3xl mx-auto font-medium">
              Planifica tus viajes de forma rápida, económica y personalizada con nuestro asistente de IA. 
              Obtén itinerarios inteligentes, presupuestos precisos y recomendaciones personalizadas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login">
                <Button size="lg" className="bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-bold px-10 py-4 text-lg shadow-2xl hover:shadow-yellow-400/25 transition-all duration-300 hover:-translate-y-1">
                  Comenzar Gratis
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="outline" size="lg" className="border-2 border-yellow-400/50 text-yellow-400 hover:bg-yellow-400 hover:text-blue-900 px-10 py-4 text-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 font-semibold">
                  Ver Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Decorative wave - moved down more */}
        <div className="absolute -bottom-1 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path 
              fill="white" 
              fillOpacity="1" 
              d="M0,32L48,42.7C96,53,192,75,288,80C384,85,480,75,576,69.3C672,64,768,64,864,69.3C960,75,1056,85,1152,85.3C1248,85,1344,75,1392,69.3L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
            />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-yellow-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 text-gray-900">
            ¿Por qué elegir TravelMate?
          </h2>
          <p className="text-gray-600 text-center mb-16 max-w-2xl mx-auto text-lg leading-relaxed">
            Nuestra plataforma utiliza inteligencia artificial para crear experiencias de viaje únicas y personalizadas
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
            <Card className="text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg bg-white group">
              <CardContent className="p-8">
                <div className="bg-gradient-to-br from-blue-100 to-blue-50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:from-blue-600 group-hover:to-blue-700 transition-all duration-300">
                  <MessageCircle className="h-10 w-10 text-blue-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">ChatBot Inteligente</h3>
                <p className="text-gray-600 leading-relaxed">
                  Nuestro asistente de IA te ayuda a planificar itinerarios personalizados en segundos.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg bg-white group">
              <CardContent className="p-8">
                <div className="bg-gradient-to-br from-yellow-100 to-yellow-50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:from-yellow-400 group-hover:to-yellow-500 transition-all duration-300">
                  <DollarSign className="h-10 w-10 text-yellow-600 group-hover:text-blue-900 transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">Presupuesto Inteligente</h3>
                <p className="text-gray-600 leading-relaxed">
                  Calcula costos precisos de alojamiento, transporte y actividades para tu viaje.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg bg-white group">
              <CardContent className="p-8">
                <div className="bg-gradient-to-br from-gray-100 to-gray-50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:from-gray-800 group-hover:to-black transition-all duration-300">
                  <Download className="h-10 w-10 text-gray-700 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">Reportes Exportables</h3>
                <p className="text-gray-600 leading-relaxed">
                  Genera y descarga itinerarios detallados en PDF para llevar contigo.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* CTA Buttons moved here */}
          <div className="text-center bg-white/60 backdrop-blur-sm py-16 px-8 rounded-3xl border border-white/50 shadow-xl">
            <h3 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">
              Comienza tu aventura hoy mismo
            </h3>
            <p className="text-gray-600 mb-8 max-w-xl mx-auto leading-relaxed">
              Únete a miles de viajeros que ya han descubierto la forma más inteligente de planificar sus viajes
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 text-lg shadow-2xl hover:shadow-blue-600/25 transition-all duration-300 hover:-translate-y-1 font-semibold">
                  <Plane className="w-5 h-5 mr-2" />
                  Comienza tu viaje ahora
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="outline" size="lg" className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-10 py-4 text-lg hover:shadow-lg transition-all duration-300 hover:-translate-y-1 font-semibold">
                  Explorar Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
