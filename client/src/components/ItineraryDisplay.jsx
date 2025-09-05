import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { MapPin, Clock, Calendar, DollarSign, Users } from 'lucide-react'

const ItineraryDisplay = ({ itinerary }) => {
  if (!itinerary || !itinerary.days) {
    return null
  }

  const getCategoryColor = (category) => {
    const colors = {
      'Cultural': 'bg-blue-100 text-blue-800',
      'Gastronomía': 'bg-green-100 text-green-800',
      'Ocio': 'bg-purple-100 text-purple-800',
      'Transporte': 'bg-yellow-100 text-yellow-800',
      'default': 'bg-gray-100 text-gray-800'
    }
    return colors[category] || colors.default
  }

  const formatTime = (time) => {
    if (!time) return ''
    return time.slice(0, 5) // Format "14:00" from "14:00:00"
  }

  const calculateTotalCost = () => {
    if (!itinerary.estimatedCosts) return 0
    return itinerary.estimatedCosts.reduce((total, cost) => {
      return total + (cost.amount * cost.quantity)
    }, 0)
  }

  return (
    <div className="space-y-6">
      {/* Header Information */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-blue-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <MapPin className="h-5 w-5" />
            {itinerary.destination}
          </CardTitle>
          <div className="flex items-center gap-4 text-sm text-blue-700">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{itinerary.duration}</span>
            </div>
            {itinerary.partySize && (
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{itinerary.partySize} persona{itinerary.partySize > 1 ? 's' : ''}</span>
              </div>
            )}
            {itinerary.totalEstimate && (
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                <span className="font-semibold">${itinerary.totalEstimate}</span>
              </div>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Daily Itinerary */}
      <div className="space-y-4">
        {itinerary.days.map((day) => (
          <Card key={day.dayNumber} className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                  {day.dayNumber}
                </div>
                Día {day.dayNumber}
                {day.date && (
                  <span className="text-sm text-gray-600 font-normal ml-2">
                    {new Date(day.date).toLocaleDateString('es-ES', { 
                      weekday: 'long', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                {day.activities.map((activity, index) => (
                  <div key={index} className="border-l-4 border-blue-200 pl-4 py-2">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{activity.title}</h4>
                      <Badge className={getCategoryColor(activity.category)}>
                        {activity.category}
                      </Badge>
                    </div>
                    
                    <div className="space-y-1 text-sm text-gray-600">
                      {(activity.startTime || activity.endTime) && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>
                            {formatTime(activity.startTime)}
                            {activity.endTime && ` - ${formatTime(activity.endTime)}`}
                          </span>
                        </div>
                      )}
                      
                      {activity.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{activity.location}</span>
                        </div>
                      )}
                      
                      {activity.description && (
                        <p className="text-gray-500 italic">{activity.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Cost Breakdown */}
      {itinerary.estimatedCosts && itinerary.estimatedCosts.length > 0 && (
        <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-green-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-900">
              <DollarSign className="h-5 w-5" />
              Desglose de Costos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {itinerary.estimatedCosts.map((cost, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <span className="font-medium text-gray-900">{cost.label}</span>
                    <span className="text-sm text-gray-600 ml-2">
                      (${cost.amount} x {cost.quantity})
                    </span>
                  </div>
                  <span className="font-semibold text-green-800">
                    ${cost.amount * cost.quantity}
                  </span>
                </div>
              ))}
              
              <hr className="border-green-200" />
              
              <div className="flex justify-between items-center bg-green-200 p-3 rounded-lg">
                <span className="font-bold text-green-900">Total Estimado</span>
                <span className="font-bold text-xl text-green-900">
                  ${calculateTotalCost()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default ItineraryDisplay
