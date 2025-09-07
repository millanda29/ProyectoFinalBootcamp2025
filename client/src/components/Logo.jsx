import React from 'react'
import { Plane } from 'lucide-react'

const Logo = ({ size = 'default', variant = 'default' }) => {
  const sizes = {
    small: { container: 'text-lg', icon: 'h-5 w-5', iconContainer: 'p-1.5' },
    default: { container: 'text-xl', icon: 'h-6 w-6', iconContainer: 'p-2' },
    large: { container: 'text-2xl md:text-3xl', icon: 'h-8 w-8 md:h-10 md:w-10', iconContainer: 'p-2.5 md:p-3' }
  }

  const variants = {
    default: {
      iconBg: 'bg-gradient-to-r from-blue-600 to-blue-700',
      iconColor: 'text-white',
      textColor: 'text-gray-900'
    },
    light: {
      iconBg: 'bg-gradient-to-r from-yellow-400 to-yellow-500',
      iconColor: 'text-blue-900',
      textColor: 'text-white'
    },
    minimal: {
      iconBg: 'bg-blue-600',
      iconColor: 'text-white',
      textColor: 'text-gray-900'
    }
  }

  const currentSize = sizes[size]
  const currentVariant = variants[variant]

  return (
    <div className="flex items-center space-x-3">
      <div className={`${currentVariant.iconBg} ${currentSize.iconContainer} rounded-xl shadow-lg`}>
        <Plane className={`${currentSize.icon} ${currentVariant.iconColor}`} />
      </div>
      <span className={`${currentSize.container} font-bold ${currentVariant.textColor}`}>
        TravelMate
      </span>
    </div>
  )
}

export default Logo
