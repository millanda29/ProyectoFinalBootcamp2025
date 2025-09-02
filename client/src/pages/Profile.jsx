import React, { useState } from 'react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Badge } from '../components/ui/badge'
import { Avatar, AvatarFallback } from '../components/ui/avatar'
import { 
  User, 
  Mail, 
  MapPin, 
  Calendar, 
  Phone, 
  Globe, 
  Camera, 
  Edit3, 
  Save, 
  X,
  Plane,
  Heart,
  Settings,
  Shield,
  Bell
} from 'lucide-react'

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [userInfo, setUserInfo] = useState({
    name: 'María García',
    email: 'maria.garcia@email.com',
    phone: '+34 612 345 678',
    location: 'Madrid, España',
    website: 'mariaviajes.blog',
    joinDate: '2023-08-15',
    bio: 'Apasionada por los viajes y la fotografía. Me encanta descubrir nuevas culturas y compartir mis experiencias.',
    avatar: null
  })

  const [stats] = useState({
    totalTrips: 12,
    countries: 8,
    cities: 24,
    totalBudget: 15750,
    favoriteDestination: 'Japón',
    travelStyle: 'Aventurero'
  })

  const [preferences] = useState({
    currency: 'EUR',
    language: 'Español',
    notifications: true,
    newsletter: true,
    privacy: 'Público'
  })

  const handleSave = () => {
    setIsEditing(false)
    // Aquí iría la lógica para guardar los cambios
    console.log('Guardando cambios:', userInfo)
  }

  const handleCancel = () => {
    setIsEditing(false)
    // Aquí podrías revertir los cambios si lo deseas
  }

  const handleInputChange = (field, value) => {
    setUserInfo(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Profile Card */}
          <Card className="border-0 shadow-xl bg-white">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">Mi Perfil</CardTitle>
                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleSave}
                        className="bg-white/20 border-white/30 text-white hover:bg-white hover:text-blue-600"
                      >
                        <Save className="w-4 h-4 mr-1" />
                        Guardar
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleCancel}
                        className="bg-white/20 border-white/30 text-white hover:bg-white hover:text-blue-600"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Cancelar
                      </Button>
                    </>
                  ) : (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setIsEditing(true)}
                      className="bg-white/20 border-white/30 text-white hover:bg-white hover:text-blue-600"
                    >
                      <Edit3 className="w-4 h-4 mr-1" />
                      Editar
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex items-start gap-6">
                {/* Avatar */}
                <div className="relative">
                  <Avatar className="w-24 h-24 border-4 border-blue-100">
                    <AvatarFallback className="bg-blue-600 text-white text-2xl font-bold">
                      {userInfo.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button 
                      size="sm" 
                      className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0 bg-blue-600 hover:bg-blue-700"
                    >
                      <Camera className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                {/* User Info */}
                <div className="flex-1 space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-sm font-medium text-gray-700">Nombre completo</Label>
                      {isEditing ? (
                        <Input
                          id="name"
                          value={userInfo.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className="mt-1"
                        />
                      ) : (
                        <p className="text-lg font-semibold text-gray-900 mt-1">{userInfo.name}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
                      {isEditing ? (
                        <Input
                          id="email"
                          type="email"
                          value={userInfo.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="mt-1"
                        />
                      ) : (
                        <div className="flex items-center gap-2 mt-1">
                          <Mail className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-700">{userInfo.email}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Teléfono</Label>
                      {isEditing ? (
                        <Input
                          id="phone"
                          value={userInfo.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="mt-1"
                        />
                      ) : (
                        <div className="flex items-center gap-2 mt-1">
                          <Phone className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-700">{userInfo.phone}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="location" className="text-sm font-medium text-gray-700">Ubicación</Label>
                      {isEditing ? (
                        <Input
                          id="location"
                          value={userInfo.location}
                          onChange={(e) => handleInputChange('location', e.target.value)}
                          className="mt-1"
                        />
                      ) : (
                        <div className="flex items-center gap-2 mt-1">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-700">{userInfo.location}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="bio" className="text-sm font-medium text-gray-700">Biografía</Label>
                    {isEditing ? (
                      <textarea
                        id="bio"
                        value={userInfo.bio}
                        onChange={(e) => handleInputChange('bio', e.target.value)}
                        rows={3}
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      />
                    ) : (
                      <p className="text-gray-600 mt-1 leading-relaxed">{userInfo.bio}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-4 pt-2">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span>Miembro desde {new Date(userInfo.joinDate).toLocaleDateString()}</span>
                    </div>
                    {userInfo.website && (
                      <div className="flex items-center gap-2 text-sm text-blue-600">
                        <Globe className="w-4 h-4" />
                        <a href={`https://${userInfo.website}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          {userInfo.website}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Travel Preferences */}
          <Card className="border-0 shadow-xl bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-blue-600" />
                Preferencias de Viaje
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Moneda preferida</span>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {preferences.currency}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Idioma</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    {preferences.language}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Estilo de viaje</span>
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                    {stats.travelStyle}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Destino favorito</span>
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4 text-red-500" />
                    <span className="font-medium text-gray-900">{stats.favoriteDestination}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Travel Stats */}
          <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-purple-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <Plane className="w-5 h-5" />
                Estadísticas de Viaje
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                  <p className="text-2xl font-bold text-blue-600">{stats.totalTrips}</p>
                  <p className="text-xs text-gray-600">Viajes</p>
                </div>
                <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                  <p className="text-2xl font-bold text-green-600">{stats.countries}</p>
                  <p className="text-xs text-gray-600">Países</p>
                </div>
                <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                  <p className="text-2xl font-bold text-purple-600">{stats.cities}</p>
                  <p className="text-xs text-gray-600">Ciudades</p>
                </div>
                <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                  <p className="text-lg font-bold text-yellow-600">${stats.totalBudget.toLocaleString()}</p>
                  <p className="text-xs text-gray-600">Gastado</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Settings */}
          <Card className="border-0 shadow-xl bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                Configuración de Cuenta
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700">Notificaciones</span>
                </div>
                <div className={`w-10 h-6 rounded-full ${preferences.notifications ? 'bg-blue-600' : 'bg-gray-300'} relative transition-colors`}>
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${preferences.notifications ? 'translate-x-5' : 'translate-x-1'}`}></div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700">Newsletter</span>
                </div>
                <div className={`w-10 h-6 rounded-full ${preferences.newsletter ? 'bg-blue-600' : 'bg-gray-300'} relative transition-colors`}>
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${preferences.newsletter ? 'translate-x-5' : 'translate-x-1'}`}></div>
                </div>
              </div>

              <div className="pt-4 space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Shield className="w-4 h-4 mr-2" />
                  Cambiar contraseña
                </Button>
                <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
                  <X className="w-4 h-4 mr-2" />
                  Eliminar cuenta
                </Button>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  )
}

export default Profile
