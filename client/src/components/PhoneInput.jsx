import React from 'react'
import CountrySelector from './CountrySelector'
import { Input } from './ui/input'

const PhoneInput = ({ value = '', onChange, className = "" }) => {
  // Separar el código de país del número de teléfono
  const parsePhoneValue = (phoneValue) => {
    if (!phoneValue) return { countryCode: '+1', phoneNumber: '' }
    
    // Buscar el código de país más largo que coincida
    const codes = ['+1787', '+1868', '+1869', '+1876', '+1939', '+1', '+33', '+34', '+44', '+49', '+52', '+54', '+55', '+56', '+57', '+58', '+591', '+595', '+598']
    let countryCode = '+1'
    let phoneNumber = phoneValue
    
    for (const code of codes.sort((a, b) => b.length - a.length)) {
      if (phoneValue.startsWith(code)) {
        countryCode = code
        phoneNumber = phoneValue.slice(code.length)
        break
      }
    }
    
    return { countryCode, phoneNumber }
  }

  const { countryCode, phoneNumber } = parsePhoneValue(value)

  const handleCountryChange = (newCountryCode) => {
    const newValue = newCountryCode + phoneNumber
    onChange(newValue)
  }

  const handlePhoneChange = (e) => {
    const newPhoneNumber = e.target.value.replace(/[^\d]/g, '') // Solo números
    const newValue = countryCode + newPhoneNumber
    onChange(newValue)
  }

  return (
    <div className={`flex gap-2 ${className}`}>
      <div className="w-auto min-w-[140px] flex-shrink-0">
        <CountrySelector
          value={countryCode}
          onChange={handleCountryChange}
          placeholder="Código"
          showPhoneCode={true}
        />
      </div>
      <div className="flex-1">
        <Input
          type="tel"
          value={phoneNumber}
          onChange={handlePhoneChange}
          placeholder="Número de teléfono"
          className="w-full"
        />
      </div>
    </div>
  )
}

export default PhoneInput
