import React, { useState, useContext, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Plane } from 'lucide-react'
import Logo from '../components/Logo'
import { AuthContext } from '../context/AuthContext'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { login, accessToken, loading } = useContext(AuthContext)

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (!loading && accessToken) {
      console.log('Redirecting to dashboard...'); // Debug
      navigate('/dashboard');
    }
  }, [accessToken, loading, navigate]);

  // Mostrar loading mientras verifica autenticación
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-white mx-auto mb-2"></div>
          <p className="text-white text-base font-medium">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      console.log('Starting login...'); // Debug
      await login(email, password);
      console.log('Login completed successfully'); // Debug
      // La navegación se manejará en el useEffect cuando cambie accessToken
    } catch (err) {
      console.error('Login failed:', err); // Debug
      alert(err.message); // Muestra error si credenciales inválidas
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-yellow-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 right-20 w-40 h-40 bg-yellow-300 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white rounded-full blur-2xl"></div>
      </div>
      
      <Card className="w-full max-w-md border-0 shadow-2xl bg-white/95 backdrop-blur-sm relative z-10">
        <CardHeader className="text-center pb-2">
          <div className="flex items-center justify-center mb-6">
            <Logo size="large" variant="default" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900 mb-2">Bienvenido de vuelta</CardTitle>
          <CardDescription className="text-gray-600">
            Accede a tu cuenta para planificar tus viajes
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-11"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 font-medium">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-11"
                required
              />
            </div>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white h-11 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿No tienes una cuenta?{' '}
              <Link to="/register" className="text-blue-600 hover:text-blue-800 hover:underline font-semibold transition-colors">
                Regístrate aquí
              </Link>
            </p>
          </div>
          
          <div className="mt-4 text-center">
            <Link to="/" className="text-sm text-gray-500 hover:text-blue-600 transition-colors font-medium">
              ← Volver al inicio
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Login
