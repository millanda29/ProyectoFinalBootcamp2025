import React, { useState, useEffect, useContext } from 'react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { 
  Users, 
  Plane, 
  MessageCircle, 
  Settings, 
  BarChart3, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Trash2,
  UserCheck,
  UserX,
  Loader2
} from 'lucide-react'
import { AuthContext } from '../context/AuthContext'
import api, { utils, constants } from '../data/api.js'

const Admin = () => {
  const { accessToken, loading: authLoading } = useContext(AuthContext)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTrips: 0,
    totalMessages: 0,
    activeUsers: 0
  })
  const [users, setUsers] = useState([])
  const [trips, setTrips] = useState([])

  useEffect(() => {
    const loadData = async () => {
      if (!accessToken) {
        console.warn('No token available for admin data loading')
        setLoading(false)
        return
      }
      
      setLoading(true)
      try {
        // Simular datos de admin por ahora
        setStats({
          totalUsers: 156,
          totalTrips: 342,
          totalMessages: 1284,
          activeUsers: 89
        })
        
        setUsers([
          {
            _id: '1',
            name: 'Juan Pérez',
            email: 'juan@example.com',
            role: 'user',
            isActive: true,
            joinDate: '2024-01-15',
            totalTrips: 5
          },
          {
            _id: '2',
            name: 'María García',
            email: 'maria@example.com',
            role: 'user',
            isActive: true,
            joinDate: '2024-02-20',
            totalTrips: 3
          },
          {
            _id: '3',
            name: 'Carlos López',
            email: 'carlos@example.com',
            role: 'admin',
            isActive: true,
            joinDate: '2024-01-01',
            totalTrips: 0
          }
        ])

        setTrips([
          {
            _id: '1',
            title: 'Viaje a París',
            destination: 'París, Francia',
            creator: 'Juan Pérez',
            status: 'active',
            startDate: '2024-12-15',
            budget: 2500,
            participants: 2
          },
          {
            _id: '2',
            title: 'Aventura en Tokio',
            destination: 'Tokio, Japón',
            creator: 'María García',
            status: 'completed',
            startDate: '2024-11-01',
            budget: 3200,
            participants: 1
          }
        ])
        
      } catch (error) {
        console.error('Error loading admin data:', error)
        utils.showError(error)
      } finally {
        setLoading(false)
      }
    }

    if (!authLoading && accessToken) {
      loadData()
    } else if (!authLoading && !accessToken) {
      setLoading(false)
    }
  }, [authLoading, accessToken])

  const handleUserStatusToggle = async (userId, currentStatus) => {
    try {
      // Aquí iría la llamada real a la API
      setUsers(prev => prev.map(user => 
        user._id === userId 
          ? { ...user, isActive: !currentStatus }
          : user
      ))
      utils.showSuccess(`Usuario ${!currentStatus ? 'activado' : 'desactivado'} exitosamente`)
    } catch (error) {
      console.error('Error updating user status:', error)
      utils.showError(error)
    }
  }

  const handleDeleteTrip = async (tripId) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este viaje?')) {
      return
    }

    try {
      // Aquí iría la llamada real a la API
      setTrips(prev => prev.filter(trip => trip._id !== tripId))
      utils.showSuccess('Viaje eliminado exitosamente')
    } catch (error) {
      console.error('Error deleting trip:', error)
      utils.showError(error)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-blue-600" />
          <p className="text-gray-600">Cargando panel de administración...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Panel de Administración</h1>
        <p className="text-gray-600">Gestiona usuarios, viajes y configuraciones del sistema</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Usuarios</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Viajes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalTrips}</p>
              </div>
              <Plane className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Mensajes Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalMessages}</p>
              </div>
              <MessageCircle className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Usuarios Activos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeUsers}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users">Usuarios</TabsTrigger>
          <TabsTrigger value="trips">Viajes</TabsTrigger>
          <TabsTrigger value="settings">Configuración</TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gestión de Usuarios</CardTitle>
              <CardDescription>
                Administra los usuarios registrados en la plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user._id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{user.name}</h3>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                            {user.role}
                          </Badge>
                          <Badge variant={user.isActive ? 'success' : 'destructive'}>
                            {user.isActive ? 'Activo' : 'Inactivo'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUserStatusToggle(user._id, user.isActive)}
                      >
                        {user.isActive ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trips Tab */}
        <TabsContent value="trips" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gestión de Viajes</CardTitle>
              <CardDescription>
                Supervisa y administra los viajes creados por los usuarios
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trips.map((trip) => (
                  <div key={trip._id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Plane className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{trip.title}</h3>
                        <p className="text-sm text-gray-500">{trip.destination}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant={trip.status === 'active' ? 'default' : 'secondary'}>
                            {trip.status}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            por {trip.creator} • ${trip.budget}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDeleteTrip(trip._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuración del Sistema</CardTitle>
              <CardDescription>
                Ajustes generales y configuraciones de la aplicación
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Shield className="h-5 w-5 text-green-600" />
                    <div>
                      <h3 className="font-medium">Seguridad del Sistema</h3>
                      <p className="text-sm text-gray-500">Estado actual: Activo</p>
                    </div>
                  </div>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <MessageCircle className="h-5 w-5 text-blue-600" />
                    <div>
                      <h3 className="font-medium">Servicio de Chat</h3>
                      <p className="text-sm text-gray-500">Estado actual: Funcionando</p>
                    </div>
                  </div>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    <div>
                      <h3 className="font-medium">Mantenimiento Programado</h3>
                      <p className="text-sm text-gray-500">Próximo: No programado</p>
                    </div>
                  </div>
                  <XCircle className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Admin
