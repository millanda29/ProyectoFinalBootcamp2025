import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Badge } from '../components/ui/badge'
import { Check, X, Eye, EyeOff, AlertCircle } from 'lucide-react'
import Logo from '../components/Logo'
import { useAuth } from '../context/AuthContext'
import { utils } from '../data/api.js'

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    requirements: {
      length: false,
      uppercase: false,
      lowercase: false,
      number: false,
      special: false
    }
  })
  const navigate = useNavigate()
  const { register, accessToken, loading } = useAuth()

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (!loading && accessToken) {
      navigate('/dashboard')
    }
  }, [accessToken, loading, navigate])

  // Mostrar loading mientras verifica autenticación
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-white mx-auto mb-2"></div>
          <p className="text-white text-base font-medium">Verificando sesión...</p>
        </div>
      </div>
    )
  }

  // Función para evaluar la fortaleza de la contraseña
  const evaluatePasswordStrength = (password) => {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    }

    const score = Object.values(requirements).filter(Boolean).length
    
    return { score, requirements }
  }

  // Función para obtener el color y texto de la fortaleza
  const getPasswordStrengthInfo = (score) => {
    if (score === 0) return { color: 'text-gray-400', text: '', bgColor: '' }
    if (score <= 2) return { color: 'text-red-500', text: 'Débil', bgColor: 'bg-red-500' }
    if (score <= 3) return { color: 'text-yellow-500', text: 'Regular', bgColor: 'bg-yellow-500' }
    if (score <= 4) return { color: 'text-blue-500', text: 'Buena', bgColor: 'bg-blue-500' }
    return { color: 'text-green-500', text: 'Muy segura', bgColor: 'bg-green-500' }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Si es el campo de contraseña, evaluar su fortaleza
    if (name === 'password') {
      const strength = evaluatePasswordStrength(value)
      setPasswordStrength(strength)
    }

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    // Validar nombre
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'El nombre es requerido'
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'El nombre debe tener al menos 2 caracteres'
    }

    // Validar email
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido'
    }

    // Validar contraseña
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida'
    } else {
      const strength = evaluatePasswordStrength(formData.password)
      if (strength.score < 3) {
        newErrors.password = 'La contraseña debe ser más segura'
      }
    }

    // Validar confirmación de contraseña
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    try {
      // ✅ Usar función de register del contexto
      await register({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        password: formData.password
      })
      utils.showSuccess('Registro exitoso')
      // La navegación se manejará en el useEffect cuando cambie accessToken
    } catch (err) {
      console.error('Registration failed:', err)
      utils.showError('Error al registrarse')
      setErrors({ general: err.message || 'Error al registrarse. Intenta de nuevo.' })
    } finally {
      setIsLoading(false)
    }
  }

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
          <div className="flex items-center justify-center space-x-2 mb-2">
            <CardTitle className="text-2xl font-bold text-gray-900">Únete a TravelMate</CardTitle>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              IA
            </Badge>
            <Badge variant="secondary" className="bg-orange-100 text-orange-800">
              Beta
            </Badge>
          </div>
          <CardDescription className="text-gray-600">
            Crea tu cuenta y comienza a planificar tus viajes
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-gray-700 font-medium">Nombre completo</Label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="Tu nombre completo"
                value={formData.fullName}
                onChange={handleInputChange}
                className={`border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-11 ${
                  errors.fullName ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                }`}
                required
              />
              {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="tu@email.com"
                value={formData.email}
                onChange={handleInputChange}
                className={`border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-11 ${
                  errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                }`}
                required
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 font-medium">Contraseña</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-11 pr-10 ${
                    errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              
              {/* Indicador de fortaleza de contraseña */}
              {formData.password && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Seguridad:</span>
                    <span className={`text-sm font-medium ${getPasswordStrengthInfo(passwordStrength.score).color}`}>
                      {getPasswordStrengthInfo(passwordStrength.score).text}
                    </span>
                  </div>
                  
                  {/* Barra de progreso */}
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthInfo(passwordStrength.score).bgColor}`}
                      style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                    ></div>
                  </div>
                  
                  {/* Requisitos de contraseña */}
                  <div className="grid grid-cols-2 gap-1 text-xs">
                    <div className={`flex items-center ${passwordStrength.requirements.length ? 'text-green-600' : 'text-gray-400'}`}>
                      {passwordStrength.requirements.length ? <Check className="h-3 w-3 mr-1" /> : <X className="h-3 w-3 mr-1" />}
                      8+ caracteres
                    </div>
                    <div className={`flex items-center ${passwordStrength.requirements.uppercase ? 'text-green-600' : 'text-gray-400'}`}>
                      {passwordStrength.requirements.uppercase ? <Check className="h-3 w-3 mr-1" /> : <X className="h-3 w-3 mr-1" />}
                      Mayúscula
                    </div>
                    <div className={`flex items-center ${passwordStrength.requirements.lowercase ? 'text-green-600' : 'text-gray-400'}`}>
                      {passwordStrength.requirements.lowercase ? <Check className="h-3 w-3 mr-1" /> : <X className="h-3 w-3 mr-1" />}
                      Minúscula
                    </div>
                    <div className={`flex items-center ${passwordStrength.requirements.number ? 'text-green-600' : 'text-gray-400'}`}>
                      {passwordStrength.requirements.number ? <Check className="h-3 w-3 mr-1" /> : <X className="h-3 w-3 mr-1" />}
                      Número
                    </div>
                    <div className={`flex items-center ${passwordStrength.requirements.special ? 'text-green-600' : 'text-gray-400'} col-span-2`}>
                      {passwordStrength.requirements.special ? <Check className="h-3 w-3 mr-1" /> : <X className="h-3 w-3 mr-1" />}
                      Carácter especial (!@#$%^&*)
                    </div>
                  </div>
                </div>
              )}
              
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">Confirmar contraseña</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-11 pr-10 ${
                    errors.confirmPassword ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 
                    formData.confirmPassword && formData.password && formData.confirmPassword === formData.password ? 'border-green-500 focus:border-green-500 focus:ring-green-500' : ''
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              
              {/* Indicador de coincidencia */}
              {formData.confirmPassword && formData.password && (
                <div className="flex items-center text-sm">
                  {formData.confirmPassword === formData.password ? (
                    <div className="flex items-center text-green-600">
                      <Check className="h-4 w-4 mr-1" />
                      Las contraseñas coinciden
                    </div>
                  ) : (
                    <div className="flex items-center text-red-500">
                      <X className="h-4 w-4 mr-1" />
                      Las contraseñas no coinciden
                    </div>
                  )}
                </div>
              )}
              
              {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
            </div>
            
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white h-11 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
            >
              {isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿Ya tienes una cuenta?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-800 hover:underline font-semibold transition-colors">
                Inicia sesión aquí
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

export default Register
