import React, { useState, useEffect } from 'react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Badge } from '../components/ui/badge'
import { Avatar, AvatarFallback } from '../components/ui/avatar'
import CountrySelector from '../components/CountrySelector'
import PhoneInput from '../components/PhoneInput'
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
  Bell,
  Loader2,
  AlertCircle
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api, { utils } from '../data/api.js'

// Importar la lista de países para mostrar banderas
const countries = [
  { code: 'AD', name: 'Andorra', flag: '🇦🇩' },
  { code: 'AE', name: 'Emiratos Árabes Unidos', flag: '🇦🇪' },
  { code: 'AF', name: 'Afganistán', flag: '🇦🇫' },
  { code: 'AG', name: 'Antigua y Barbuda', flag: '🇦🇬' },
  { code: 'AL', name: 'Albania', flag: '🇦🇱' },
  { code: 'AM', name: 'Armenia', flag: '🇦🇲' },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷' },
  { code: 'AT', name: 'Austria', flag: '🇦🇹' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'AZ', name: 'Azerbaiyán', flag: '🇦🇿' },
  { code: 'BA', name: 'Bosnia y Herzegovina', flag: '🇧🇦' },
  { code: 'BB', name: 'Barbados', flag: '🇧🇧' },
  { code: 'BD', name: 'Bangladés', flag: '🇧🇩' },
  { code: 'BE', name: 'Bélgica', flag: '🇧🇪' },
  { code: 'BF', name: 'Burkina Faso', flag: '🇧🇫' },
  { code: 'BG', name: 'Bulgaria', flag: '🇧🇬' },
  { code: 'BH', name: 'Baréin', flag: '🇧🇭' },
  { code: 'BI', name: 'Burundi', flag: '🇧🇮' },
  { code: 'BJ', name: 'Benín', flag: '🇧🇯' },
  { code: 'BN', name: 'Brunéi', flag: '🇧🇳' },
  { code: 'BO', name: 'Bolivia', flag: '🇧🇴' },
  { code: 'BR', name: 'Brasil', flag: '🇧🇷' },
  { code: 'BS', name: 'Bahamas', flag: '🇧🇸' },
  { code: 'BT', name: 'Bután', flag: '🇧🇹' },
  { code: 'BW', name: 'Botsuana', flag: '🇧🇼' },
  { code: 'BY', name: 'Bielorrusia', flag: '🇧🇾' },
  { code: 'BZ', name: 'Belice', flag: '🇧🇿' },
  { code: 'CA', name: 'Canadá', flag: '🇨🇦' },
  { code: 'CD', name: 'República Democrática del Congo', flag: '🇨🇩' },
  { code: 'CF', name: 'República Centroafricana', flag: '🇨🇫' },
  { code: 'CG', name: 'República del Congo', flag: '🇨🇬' },
  { code: 'CH', name: 'Suiza', flag: '🇨🇭' },
  { code: 'CI', name: 'Costa de Marfil', flag: '🇨🇮' },
  { code: 'CL', name: 'Chile', flag: '🇨🇱' },
  { code: 'CM', name: 'Camerún', flag: '🇨🇲' },
  { code: 'CN', name: 'China', flag: '🇨🇳' },
  { code: 'CO', name: 'Colombia', flag: '🇨🇴' },
  { code: 'CR', name: 'Costa Rica', flag: '🇨🇷' },
  { code: 'CU', name: 'Cuba', flag: '🇨🇺' },
  { code: 'CV', name: 'Cabo Verde', flag: '🇨🇻' },
  { code: 'CY', name: 'Chipre', flag: '🇨🇾' },
  { code: 'CZ', name: 'República Checa', flag: '🇨🇿' },
  { code: 'DE', name: 'Alemania', flag: '🇩🇪' },
  { code: 'DJ', name: 'Yibuti', flag: '🇩🇯' },
  { code: 'DK', name: 'Dinamarca', flag: '🇩🇰' },
  { code: 'DM', name: 'Dominica', flag: '🇩🇲' },
  { code: 'DO', name: 'República Dominicana', flag: '🇩🇴' },
  { code: 'DZ', name: 'Argelia', flag: '🇩🇿' },
  { code: 'EC', name: 'Ecuador', flag: '🇪🇨' },
  { code: 'EE', name: 'Estonia', flag: '🇪🇪' },
  { code: 'EG', name: 'Egipto', flag: '🇪🇬' },
  { code: 'ER', name: 'Eritrea', flag: '🇪🇷' },
  { code: 'ES', name: 'España', flag: '🇪🇸' },
  { code: 'ET', name: 'Etiopía', flag: '🇪🇹' },
  { code: 'FI', name: 'Finlandia', flag: '🇫🇮' },
  { code: 'FJ', name: 'Fiyi', flag: '🇫🇯' },
  { code: 'FR', name: 'Francia', flag: '🇫🇷' },
  { code: 'GA', name: 'Gabón', flag: '🇬🇦' },
  { code: 'GB', name: 'Reino Unido', flag: '🇬🇧' },
  { code: 'GD', name: 'Granada', flag: '🇬🇩' },
  { code: 'GE', name: 'Georgia', flag: '🇬🇪' },
  { code: 'GH', name: 'Ghana', flag: '🇬🇭' },
  { code: 'GM', name: 'Gambia', flag: '🇬🇲' },
  { code: 'GN', name: 'Guinea', flag: '🇬🇳' },
  { code: 'GQ', name: 'Guinea Ecuatorial', flag: '🇬🇶' },
  { code: 'GR', name: 'Grecia', flag: '🇬🇷' },
  { code: 'GT', name: 'Guatemala', flag: '🇬🇹' },
  { code: 'GW', name: 'Guinea-Bisáu', flag: '🇬🇼' },
  { code: 'GY', name: 'Guyana', flag: '🇬🇾' },
  { code: 'HN', name: 'Honduras', flag: '🇭🇳' },
  { code: 'HR', name: 'Croacia', flag: '🇭🇷' },
  { code: 'HT', name: 'Haití', flag: '🇭🇹' },
  { code: 'HU', name: 'Hungría', flag: '🇭🇺' },
  { code: 'ID', name: 'Indonesia', flag: '🇮🇩' },
  { code: 'IE', name: 'Irlanda', flag: '🇮🇪' },
  { code: 'IL', name: 'Israel', flag: '🇮🇱' },
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'IQ', name: 'Irak', flag: '🇮🇶' },
  { code: 'IR', name: 'Irán', flag: '🇮🇷' },
  { code: 'IS', name: 'Islandia', flag: '🇮🇸' },
  { code: 'IT', name: 'Italia', flag: '🇮🇹' },
  { code: 'JM', name: 'Jamaica', flag: '🇯🇲' },
  { code: 'JO', name: 'Jordania', flag: '🇯🇴' },
  { code: 'JP', name: 'Japón', flag: '🇯🇵' },
  { code: 'KE', name: 'Kenia', flag: '🇰🇪' },
  { code: 'KG', name: 'Kirguistán', flag: '🇰🇬' },
  { code: 'KH', name: 'Camboya', flag: '🇰🇭' },
  { code: 'KI', name: 'Kiribati', flag: '🇰🇮' },
  { code: 'KM', name: 'Comoras', flag: '🇰🇲' },
  { code: 'KN', name: 'San Cristóbal y Nieves', flag: '🇰🇳' },
  { code: 'KP', name: 'Corea del Norte', flag: '🇰🇵' },
  { code: 'KR', name: 'Corea del Sur', flag: '🇰🇷' },
  { code: 'KW', name: 'Kuwait', flag: '🇰🇼' },
  { code: 'KZ', name: 'Kazajistán', flag: '🇰🇿' },
  { code: 'LA', name: 'Laos', flag: '🇱🇦' },
  { code: 'LB', name: 'Líbano', flag: '🇱🇧' },
  { code: 'LC', name: 'Santa Lucía', flag: '🇱🇨' },
  { code: 'LI', name: 'Liechtenstein', flag: '🇱🇮' },
  { code: 'LK', name: 'Sri Lanka', flag: '🇱🇰' },
  { code: 'LR', name: 'Liberia', flag: '🇱🇷' },
  { code: 'LS', name: 'Lesoto', flag: '🇱🇸' },
  { code: 'LT', name: 'Lituania', flag: '🇱🇹' },
  { code: 'LU', name: 'Luxemburgo', flag: '🇱🇺' },
  { code: 'LV', name: 'Letonia', flag: '🇱🇻' },
  { code: 'LY', name: 'Libia', flag: '🇱🇾' },
  { code: 'MA', name: 'Marruecos', flag: '🇲🇦' },
  { code: 'MC', name: 'Mónaco', flag: '🇲🇨' },
  { code: 'MD', name: 'Moldavia', flag: '🇲🇩' },
  { code: 'ME', name: 'Montenegro', flag: '🇲🇪' },
  { code: 'MG', name: 'Madagascar', flag: '🇲🇬' },
  { code: 'MH', name: 'Islas Marshall', flag: '🇲🇭' },
  { code: 'MK', name: 'Macedonia del Norte', flag: '🇲🇰' },
  { code: 'ML', name: 'Malí', flag: '🇲🇱' },
  { code: 'MM', name: 'Birmania', flag: '🇲🇲' },
  { code: 'MN', name: 'Mongolia', flag: '🇲🇳' },
  { code: 'MR', name: 'Mauritania', flag: '🇲🇷' },
  { code: 'MT', name: 'Malta', flag: '🇲🇹' },
  { code: 'MU', name: 'Mauricio', flag: '🇲🇺' },
  { code: 'MV', name: 'Maldivas', flag: '🇲🇻' },
  { code: 'MW', name: 'Malaui', flag: '🇲🇼' },
  { code: 'MX', name: 'México', flag: '🇲🇽' },
  { code: 'MY', name: 'Malasia', flag: '🇲🇾' },
  { code: 'MZ', name: 'Mozambique', flag: '🇲🇿' },
  { code: 'NA', name: 'Namibia', flag: '🇳🇦' },
  { code: 'NE', name: 'Níger', flag: '🇳🇪' },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬' },
  { code: 'NI', name: 'Nicaragua', flag: '🇳🇮' },
  { code: 'NL', name: 'Países Bajos', flag: '🇳🇱' },
  { code: 'NO', name: 'Noruega', flag: '🇳🇴' },
  { code: 'NP', name: 'Nepal', flag: '🇳🇵' },
  { code: 'NR', name: 'Nauru', flag: '🇳🇷' },
  { code: 'NZ', name: 'Nueva Zelanda', flag: '🇳🇿' },
  { code: 'OM', name: 'Omán', flag: '🇴🇲' },
  { code: 'PA', name: 'Panamá', flag: '🇵🇦' },
  { code: 'PE', name: 'Perú', flag: '🇵🇪' },
  { code: 'PG', name: 'Papúa Nueva Guinea', flag: '🇵🇬' },
  { code: 'PH', name: 'Filipinas', flag: '🇵🇭' },
  { code: 'PK', name: 'Pakistán', flag: '🇵🇰' },
  { code: 'PL', name: 'Polonia', flag: '🇵🇱' },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹' },
  { code: 'PW', name: 'Palaos', flag: '🇵🇼' },
  { code: 'PY', name: 'Paraguay', flag: '🇵🇾' },
  { code: 'QA', name: 'Catar', flag: '🇶🇦' },
  { code: 'RO', name: 'Rumania', flag: '🇷🇴' },
  { code: 'RS', name: 'Serbia', flag: '🇷🇸' },
  { code: 'RU', name: 'Rusia', flag: '🇷🇺' },
  { code: 'RW', name: 'Ruanda', flag: '🇷🇼' },
  { code: 'SA', name: 'Arabia Saudí', flag: '🇸🇦' },
  { code: 'SB', name: 'Islas Salomón', flag: '🇸🇧' },
  { code: 'SC', name: 'Seychelles', flag: '🇸🇨' },
  { code: 'SD', name: 'Sudán', flag: '🇸🇩' },
  { code: 'SE', name: 'Suecia', flag: '🇸🇪' },
  { code: 'SG', name: 'Singapur', flag: '🇸🇬' },
  { code: 'SI', name: 'Eslovenia', flag: '🇸🇮' },
  { code: 'SK', name: 'Eslovaquia', flag: '🇸🇰' },
  { code: 'SL', name: 'Sierra Leona', flag: '🇸🇱' },
  { code: 'SM', name: 'San Marino', flag: '🇸🇲' },
  { code: 'SN', name: 'Senegal', flag: '🇸🇳' },
  { code: 'SO', name: 'Somalia', flag: '🇸🇴' },
  { code: 'SR', name: 'Surinam', flag: '🇸🇷' },
  { code: 'SS', name: 'Sudán del Sur', flag: '🇸🇸' },
  { code: 'ST', name: 'Santo Tomé y Príncipe', flag: '🇸🇹' },
  { code: 'SV', name: 'El Salvador', flag: '🇸🇻' },
  { code: 'SY', name: 'Siria', flag: '🇸🇾' },
  { code: 'SZ', name: 'Esuatini', flag: '🇸🇿' },
  { code: 'TD', name: 'Chad', flag: '🇹🇩' },
  { code: 'TG', name: 'Togo', flag: '🇹🇬' },
  { code: 'TH', name: 'Tailandia', flag: '🇹🇭' },
  { code: 'TJ', name: 'Tayikistán', flag: '🇹🇯' },
  { code: 'TL', name: 'Timor Oriental', flag: '🇹🇱' },
  { code: 'TM', name: 'Turkmenistán', flag: '🇹🇲' },
  { code: 'TN', name: 'Túnez', flag: '🇹🇳' },
  { code: 'TO', name: 'Tonga', flag: '🇹🇴' },
  { code: 'TR', name: 'Turquía', flag: '🇹🇷' },
  { code: 'TT', name: 'Trinidad y Tobago', flag: '🇹🇹' },
  { code: 'TV', name: 'Tuvalu', flag: '🇹🇻' },
  { code: 'TW', name: 'Taiwán', flag: '🇹🇼' },
  { code: 'TZ', name: 'Tanzania', flag: '🇹🇿' },
  { code: 'UA', name: 'Ucrania', flag: '🇺🇦' },
  { code: 'UG', name: 'Uganda', flag: '🇺🇬' },
  { code: 'US', name: 'Estados Unidos', flag: '🇺🇸' },
  { code: 'UY', name: 'Uruguay', flag: '🇺🇾' },
  { code: 'UZ', name: 'Uzbekistán', flag: '🇺🇿' },
  { code: 'VA', name: 'Ciudad del Vaticano', flag: '🇻🇦' },
  { code: 'VC', name: 'San Vicente y las Granadinas', flag: '🇻🇨' },
  { code: 'VE', name: 'Venezuela', flag: '🇻🇪' },
  { code: 'VN', name: 'Vietnam', flag: '🇻🇳' },
  { code: 'VU', name: 'Vanuatu', flag: '🇻🇺' },
  { code: 'WS', name: 'Samoa', flag: '🇼🇸' },
  { code: 'YE', name: 'Yemen', flag: '🇾🇪' },
  { code: 'ZA', name: 'Sudáfrica', flag: '🇿🇦' },
  { code: 'ZM', name: 'Zambia', flag: '🇿🇲' },
  { code: 'ZW', name: 'Zimbabue', flag: '🇿🇼' }
]

const Profile = () => {
  const { accessToken, loading: authLoading, user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [errors, setErrors] = useState({})
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    location: '',
    birthdate: '',
    website: '',
    joinDate: '',
    avatar: null
  })

  // Función helper para obtener la información del país por su nombre
  const getCountryInfo = (locationText) => {
    if (!locationText) return null
    
    // Buscar por nombre de país (case insensitive)
    const country = countries.find(c => 
      locationText.toLowerCase().includes(c.name.toLowerCase())
    )
    
    return country
  }

  const [stats, setStats] = useState({
    totalTrips: 0,
    countries: 0,
    cities: 0,
    totalBudget: 0,
    favoriteDestination: '',
    travelStyle: 'balanced'
  })

  const [preferences, setPreferences] = useState({
    currency: 'USD',
    language: 'English',
    notifications: true,
    newsletter: true,
    privacy: 'Público'
  })

  // Cargar perfil al montar el componente
  useEffect(() => {
    const loadData = async () => {
      if (!accessToken) {
        setIsLoading(false)
        return
      }
      
      // Si ya tenemos datos del usuario en el contexto, usarlos primero
      if (user) {
        // Los datos están en user.data según la estructura de respuesta
        const userData = user.data || user
        
        setUserInfo({
          name: userData.fullName || userData.name || userData.email || '',
          email: userData.email || '',
          phone: userData.phone || '',
          bio: userData.bio || '',
          location: userData.location || '',
          birthdate: userData.birthdate || '',
          website: userData.website || '',
          joinDate: userData.createdAt || userData.joinDate || '',
          avatar: userData.avatarUrl || userData.avatar || null
        })
        
        // Actualizar estadísticas reales
        setStats({
          totalTrips: userData.stats?.tripsCompleted || 0,
          countries: userData.stats?.countriesVisited?.length || 0,
          cities: userData.stats?.citiesVisited?.length || 0,
          totalBudget: userData.stats?.totalSpent || 0,
          favoriteDestination: userData.stats?.favoriteDestination || '',
          travelStyle: userData.travelPreferences?.travelStyle || 'balanced'
        })
        
        // Actualizar preferencias reales
        setPreferences({
          currency: userData.travelPreferences?.preferredCurrency || 'USD',
          language: userData.preferredLanguageName || userData.travelPreferences?.preferredLanguage || 'English',
          notifications: userData.notifications?.email || true,
          newsletter: userData.notifications?.promotions || false,
          privacy: 'Público'
        })
        
        setIsLoading(false)
        return
      }
      
      // Si no hay datos en el contexto, cargar desde la API
      setIsLoading(true)
      try {
        // ✅ Usar endpoint con token
        const profile = await api.users.getProfile(accessToken)
        
        setUserInfo({
          name: profile.fullName || profile.name || profile.email || '',
          email: profile.email || '',
          phone: profile.phone || '',
          bio: profile.bio || '',
          location: profile.location || '',
          birthdate: profile.birthdate || '',
          website: profile.website || '',
          joinDate: profile.createdAt || profile.joinDate || '',
          avatar: profile.avatarUrl || profile.avatar || null
        })
        
        // Actualizar estadísticas desde la API
        setStats({
          totalTrips: profile.stats?.tripsCompleted || 0,
          countries: profile.stats?.countriesVisited?.length || 0,
          cities: profile.stats?.citiesVisited?.length || 0,
          totalBudget: profile.stats?.totalSpent || 0,
          favoriteDestination: profile.stats?.favoriteDestination || '',
          travelStyle: profile.travelPreferences?.travelStyle || 'balanced'
        })
        
        // Actualizar preferencias desde la API
        setPreferences({
          currency: profile.travelPreferences?.preferredCurrency || 'USD',
          language: profile.preferredLanguageName || profile.travelPreferences?.preferredLanguage || 'English',
          notifications: profile.notifications?.email || true,
          newsletter: profile.notifications?.promotions || false,
          privacy: 'Público'
        })
      } catch (error) {
        console.error('Error loading profile:', error)
        utils.showError(error)
        setErrors({ general: error.message })
      } finally {
        setIsLoading(false)
      }
    }

    // Solo cargar si tenemos token y no estamos en loading de auth
    if (!authLoading && accessToken) {
      loadData()
    } else if (!authLoading && !accessToken) {
      setIsLoading(false)
    }
  }, [authLoading, accessToken, user])

  const handleSave = async () => {
    // Validar datos
    const validation = utils.validateForm(userInfo, {
      name: [utils.validateRequired, utils.validateName],
      email: [utils.validateEmail],
      phone: userInfo.phone ? [utils.validatePhone] : [], // Solo validar si hay teléfono
    })

    if (!validation.isValid) {
      setErrors(validation.errors)
      utils.showError('Por favor, corrige los errores en el formulario')
      return
    }

    setIsSaving(true)
    setErrors({})
    
    try {
      // Separar nombre completo si es necesario
      const nameParts = userInfo.name.trim().split(' ')
      const firstName = nameParts[0]
      const lastName = nameParts.slice(1).join(' ')

      const updateData = {
        fullName: userInfo.name,
        firstName,
        lastName,
        bio: userInfo.bio || '',
        location: userInfo.location || '',
        birthdate: userInfo.birthdate || '',
        website: userInfo.website || '',
      }

      // Solo incluir teléfono si no está vacío y es válido
      if (userInfo.phone && userInfo.phone.trim()) {
        // Limpiar el teléfono (remover espacios, guiones, paréntesis)
        const cleanPhone = userInfo.phone.replace(/[\s\-()]/g, '')
        if (cleanPhone.length >= 10) {
          updateData.phone = cleanPhone
        }
      }

      await api.users.updateProfile(accessToken, updateData)
      setIsEditing(false)
      utils.showSuccess('Perfil actualizado correctamente')
    } catch (error) {
      console.error('Error updating profile:', error)
      utils.showError('Error al actualizar el perfil')
      setErrors({ general: error.message })
    } finally {
      setIsSaving(false)
    }
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
      {/* No Token State */}
      {!authLoading && !accessToken ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertCircle className="w-8 h-8 text-amber-500 mx-auto mb-4" />
            <p className="text-amber-600 mb-2">No hay sesión activa</p>
            <p className="text-gray-600 text-sm">Por favor, inicia sesión para ver tu perfil</p>
          </div>
        </div>
      ) : 
      /* Loading State */
      isLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Cargando perfil...</p>
          </div>
        </div>
      ) : errors.general ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 mb-2">Error al cargar el perfil</p>
            <p className="text-gray-600 text-sm">{errors.general}</p>
          </div>
        </div>
      ) : (
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Profile Card */}
          <Card className="border-0 shadow-xl bg-white">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CardTitle className="text-2xl">Mi Perfil</CardTitle>
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    IA
                  </Badge>
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    Beta
                  </Badge>
                </div>
                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-white/20 border-white/30 text-white hover:bg-white hover:text-blue-600 disabled:opacity-50"
                      >
                        {isSaving ? (
                          <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                        ) : (
                          <Save className="w-4 h-4 mr-1" />
                        )}
                        {isSaving ? 'Guardando...' : 'Guardar'}
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
                        <PhoneInput
                          value={userInfo.phone}
                          onChange={(value) => handleInputChange('phone', value)}
                          className="mt-1"
                        />
                      ) : (
                        <div className="flex items-center gap-2 mt-1">
                          <Phone className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-700">{userInfo.phone || 'No especificado'}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="location" className="text-sm font-medium text-gray-700">Ubicación</Label>
                      {isEditing ? (
                        <CountrySelector
                          value={userInfo.location}
                          onChange={(value) => handleInputChange('location', value)}
                          placeholder="Selecciona tu país"
                          className="mt-1"
                        />
                      ) : (
                        <div className="flex items-center gap-2 mt-1">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          {(() => {
                            const countryInfo = getCountryInfo(userInfo.location)
                            return (
                              <div className="flex items-center gap-2">
                                {countryInfo && (
                                  <span className="text-lg">{countryInfo.flag}</span>
                                )}
                                <span className="text-gray-700">{userInfo.location || 'No especificado'}</span>
                              </div>
                            )
                          })()}
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
                        placeholder="Cuéntanos algo sobre ti..."
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      />
                    ) : (
                      <p className="text-gray-600 mt-1 leading-relaxed">{userInfo.bio || 'No hay biografía disponible'}</p>
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
                    {stats.travelStyle === 'balanced' ? 'Equilibrado' : 
                     stats.travelStyle === 'luxury' ? 'Lujo' : 
                     stats.travelStyle === 'budget' ? 'Económico' : 
                     stats.travelStyle === 'adventure' ? 'Aventura' : 
                     stats.travelStyle}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Destino favorito</span>
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4 text-red-500" />
                    <span className="font-medium text-gray-900">{stats.favoriteDestination || 'No definido'}</span>
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
      )}
    </div>
  )
}

export default Profile
