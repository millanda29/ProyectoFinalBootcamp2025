import React, { useState, useEffect } from 'react'
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
import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'
import { usersAPI, tripsAPI, utils } from '../data/api.js'

const Admin = () => {
  const { accessToken, user, loading: authLoading } = useAuth()
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
    const loadAdminData = async () => {
      if (!accessToken || !user || !user.roles?.includes('admin')) {
        setLoading(false)
        return
      }
      
      setLoading(true)
      try {
        // ✅ Cargar estadísticas de usuarios
        const userStatsResponse = await usersAPI.admin.getDashboardStats(accessToken)
        
        // ✅ Cargar lista de trips para calcular estadísticas localmente
        const tripsResponse = await tripsAPI.admin.getAllTrips(accessToken)
        
        // Procesar estadísticas de usuarios
        const userStats = userStatsResponse?.data || userStatsResponse || {}
        
        // Procesar datos de trips y calcular estadísticas localmente
        const tripData = tripsResponse?.data || tripsResponse
        const tripsArray = tripData?.trips || tripData || []
        setTrips(Array.isArray(tripsArray) ? tripsArray : [])
        
        // Calcular estadísticas de trips localmente
        const tripStats = {
          totalTrips: tripsArray.length || 0,
          activeTrips: tripsArray.filter(trip => trip.status === 'active').length || 0,
          completedTrips: tripsArray.filter(trip => trip.status === 'completed').length || 0,
          plannedTrips: tripsArray.filter(trip => trip.status === 'planned').length || 0,
          cancelledTrips: tripsArray.filter(trip => trip.status === 'cancelled').length || 0
        }
        
        setStats({
          totalUsers: userStats.totalUsers || 0,
          activeUsers: userStats.activeUsers || 0,
          totalTrips: tripStats.totalTrips,
          totalMessages: 0 // TODO: Implementar cuando tengamos stats de chat
        })
        
        // Cargar lista de usuarios
        const allUsersResponse = await usersAPI.admin.getAllUsers(accessToken)
        
        const userData = allUsersResponse?.data || allUsersResponse
        const usersArray = userData?.users || userData || []
        setUsers(Array.isArray(usersArray) ? usersArray : [])
        
      } catch (error) {
        console.error('Error loading admin data:', error)
        utils.showError('Error al cargar datos de administración')
        
        // Fallback data en caso de error
        setStats({
          totalUsers: 0,
          totalTrips: 0,
          totalMessages: 0,
          activeUsers: 0
        })
        setUsers([])
        setTrips([])
      } finally {
        setLoading(false)
      }
    }

    loadAdminData()
  }, [accessToken, user])

  // ✅ Protección de ruta - Solo admins pueden acceder
  if (!authLoading && (!user || !user.roles?.includes('admin'))) {
    return <Navigate to="/dashboard" replace />
  }

  const handleUserStatusToggle = async (userId, currentStatus) => {
    try {
      // ✅ Usar endpoints específicos de activar/desactivar
      if (currentStatus) {
        await usersAPI.admin.deactivateUser(accessToken, userId)
      } else {
        await usersAPI.admin.activateUser(accessToken, userId)
      }
      
      setUsers(prev => prev.map(user => 
        user._id === userId 
          ? { ...user, isActive: !currentStatus }
          : user
      ))
      utils.showSuccess(`Usuario ${!currentStatus ? 'activado' : 'desactivado'} exitosamente`)
    } catch (error) {
      console.error('Error updating user status:', error)
      utils.showError('Error al actualizar estado del usuario')
    }
  }

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      return
    }

    try {
      // ✅ Usar endpoint real para eliminar usuario
      await usersAPI.admin.deleteUser(accessToken, userId)
      
      setUsers(prev => prev.filter(user => user._id !== userId))
      utils.showSuccess('Usuario eliminado exitosamente')
    } catch (error) {
      console.error('Error deleting user:', error)
      utils.showError('Error al eliminar usuario')
    }
  }

  const handleDeleteTrip = async (tripId) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este viaje?')) {
      return
    }

    try {
      // ✅ Usar endpoint real para eliminar viaje
      await tripsAPI.deleteTrip(accessToken, tripId)
      
      setTrips(prev => prev.filter(trip => trip._id !== tripId))
      utils.showSuccess('Viaje eliminado exitosamente')
    } catch (error) {
      console.error('Error deleting trip:', error)
      utils.showError('Error al eliminar viaje')
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
                {Array.isArray(users) && users.length > 0 ? (
                  users.map((user) => (
                    <div key={user._id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <Users className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{user.fullName || user.name || 'Sin nombre'}</h3>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant={user.roles?.includes('admin') ? 'default' : 'secondary'}>
                            {user.roles?.[0] || 'user'}
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
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteUser(user._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Eliminar
                      </Button>
                    </div>
                  </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No hay usuarios para mostrar</p>
                  </div>
                )}
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
