import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { Plane, MessageCircle, DollarSign, Download } from 'lucide-react'

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-cyan-600 via-blue-700 to-purple-800 text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Tu Asistente Inteligente de <span className="text-yellow-300">Viajes</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Planifica tus viajes de forma rápida, económica y personalizada con nuestro asistente de IA. 
              Obtén itinerarios inteligentes, presupuestos precisos y recomendaciones personalizadas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login">
                <Button size="lg" className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-8">
                  Comenzar Gratis
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-black px-8">
                  Ver Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 320" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              fill="hsl(var(--background))" 
              fillOpacity="1" 
              d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,149.3C960,160,1056,160,1152,138.7C1248,117,1344,75,1392,53.3L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            ¿Por qué elegir TravelMate?
          </h2>
          <p className="text-muted-foreground text-center mb-16 max-w-2xl mx-auto">
            Nuestra plataforma utiliza inteligencia artificial para crear experiencias de viaje únicas y personalizadas
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageCircle className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-4">ChatBot Inteligente</h3>
                <p className="text-muted-foreground">
                  Nuestro asistente de IA te ayuda a planificar itinerarios personalizados en segundos.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="bg-secondary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <DollarSign className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Presupuesto Inteligente</h3>
                <p className="text-muted-foreground">
                  Calcula costos precisos de alojamiento, transporte y actividades para tu viaje.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Download className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Reportes Exportables</h3>
                <p className="text-muted-foreground">
                  Genera y descarga itinerarios detallados en PDF para llevar contigo.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            ¿Listo para tu próxima aventura?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Únete a miles de viajeros que ya han descubierto la forma más inteligente de planificar sus viajes
          </p>
          <Link to="/login">
            <Button size="lg" className="bg-primary hover:bg-primary/90 px-8">
              <Plane className="w-5 h-5 mr-2" />
              Comienza tu viaje ahora
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home
