import React, { useState } from 'react'
import { ChevronDown, Search } from 'lucide-react'

const countries = [
  { code: 'AD', name: 'Andorra', flag: '🇦🇩', phone: '+376' },
  { code: 'AE', name: 'Emiratos Árabes Unidos', flag: '🇦🇪', phone: '+971' },
  { code: 'AF', name: 'Afganistán', flag: '🇦🇫', phone: '+93' },
  { code: 'AG', name: 'Antigua y Barbuda', flag: '🇦🇬', phone: '+1268' },
  { code: 'AI', name: 'Anguila', flag: '🇦🇮', phone: '+1264' },
  { code: 'AL', name: 'Albania', flag: '🇦🇱', phone: '+355' },
  { code: 'AM', name: 'Armenia', flag: '🇦🇲', phone: '+374' },
  { code: 'AO', name: 'Angola', flag: '🇦🇴', phone: '+244' },
  { code: 'AQ', name: 'Antártida', flag: '🇦🇶', phone: '+672' },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷', phone: '+54' },
  { code: 'AS', name: 'Samoa Americana', flag: '🇦🇸', phone: '+1684' },
  { code: 'AT', name: 'Austria', flag: '🇦🇹', phone: '+43' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', phone: '+61' },
  { code: 'AW', name: 'Aruba', flag: '🇦🇼', phone: '+297' },
  { code: 'AX', name: 'Islas Åland', flag: '🇦🇽', phone: '+358' },
  { code: 'AZ', name: 'Azerbaiyán', flag: '🇦🇿', phone: '+994' },
  { code: 'BA', name: 'Bosnia y Herzegovina', flag: '🇧🇦', phone: '+387' },
  { code: 'BB', name: 'Barbados', flag: '🇧🇧', phone: '+1246' },
  { code: 'BD', name: 'Bangladés', flag: '🇧🇩', phone: '+880' },
  { code: 'BE', name: 'Bélgica', flag: '🇧🇪', phone: '+32' },
  { code: 'BF', name: 'Burkina Faso', flag: '🇧🇫', phone: '+226' },
  { code: 'BG', name: 'Bulgaria', flag: '🇧🇬', phone: '+359' },
  { code: 'BH', name: 'Baréin', flag: '🇧🇭', phone: '+973' },
  { code: 'BI', name: 'Burundi', flag: '🇧🇮', phone: '+257' },
  { code: 'BJ', name: 'Benín', flag: '🇧🇯', phone: '+229' },
  { code: 'BL', name: 'San Bartolomé', flag: '🇧🇱', phone: '+590' },
  { code: 'BM', name: 'Bermudas', flag: '🇧🇲', phone: '+1441' },
  { code: 'BN', name: 'Brunéi', flag: '🇧🇳', phone: '+673' },
  { code: 'BO', name: 'Bolivia', flag: '🇧🇴', phone: '+591' },
  { code: 'BQ', name: 'Bonaire, San Eustaquio y Saba', flag: '🇧🇶', phone: '+599' },
  { code: 'BR', name: 'Brasil', flag: '🇧🇷', phone: '+55' },
  { code: 'BS', name: 'Bahamas', flag: '🇧🇸', phone: '+1242' },
  { code: 'BT', name: 'Bután', flag: '🇧🇹', phone: '+975' },
  { code: 'BV', name: 'Isla Bouvet', flag: '🇧🇻', phone: '+47' },
  { code: 'BW', name: 'Botsuana', flag: '🇧🇼', phone: '+267' },
  { code: 'BY', name: 'Bielorrusia', flag: '🇧🇾', phone: '+375' },
  { code: 'BZ', name: 'Belice', flag: '🇧🇿', phone: '+501' },
  { code: 'CA', name: 'Canadá', flag: '🇨🇦', phone: '+1' },
  { code: 'CC', name: 'Islas Cocos', flag: '🇨🇨', phone: '+61' },
  { code: 'CD', name: 'República Democrática del Congo', flag: '🇨🇩', phone: '+243' },
  { code: 'CF', name: 'República Centroafricana', flag: '🇨🇫', phone: '+236' },
  { code: 'CG', name: 'República del Congo', flag: '🇨🇬', phone: '+242' },
  { code: 'CH', name: 'Suiza', flag: '🇨🇭', phone: '+41' },
  { code: 'CI', name: 'Costa de Marfil', flag: '🇨🇮', phone: '+225' },
  { code: 'CK', name: 'Islas Cook', flag: '🇨🇰', phone: '+682' },
  { code: 'CL', name: 'Chile', flag: '🇨🇱', phone: '+56' },
  { code: 'CM', name: 'Camerún', flag: '🇨🇲', phone: '+237' },
  { code: 'CN', name: 'China', flag: '🇨🇳', phone: '+86' },
  { code: 'CO', name: 'Colombia', flag: '🇨🇴', phone: '+57' },
  { code: 'CR', name: 'Costa Rica', flag: '🇨🇷', phone: '+506' },
  { code: 'CU', name: 'Cuba', flag: '🇨🇺', phone: '+53' },
  { code: 'CV', name: 'Cabo Verde', flag: '🇨🇻', phone: '+238' },
  { code: 'CW', name: 'Curazao', flag: '🇨🇼', phone: '+599' },
  { code: 'CX', name: 'Isla de Navidad', flag: '🇨🇽', phone: '+61' },
  { code: 'CY', name: 'Chipre', flag: '🇨🇾', phone: '+357' },
  { code: 'CZ', name: 'República Checa', flag: '🇨🇿', phone: '+420' },
  { code: 'DE', name: 'Alemania', flag: '🇩🇪', phone: '+49' },
  { code: 'DJ', name: 'Yibuti', flag: '🇩🇯', phone: '+253' },
  { code: 'DK', name: 'Dinamarca', flag: '🇩🇰', phone: '+45' },
  { code: 'DM', name: 'Dominica', flag: '🇩🇲', phone: '+1767' },
  { code: 'DO', name: 'República Dominicana', flag: '🇩🇴', phone: '+1809' },
  { code: 'DZ', name: 'Argelia', flag: '🇩🇿', phone: '+213' },
  { code: 'EC', name: 'Ecuador', flag: '🇪🇨', phone: '+593' },
  { code: 'EE', name: 'Estonia', flag: '🇪🇪', phone: '+372' },
  { code: 'EG', name: 'Egipto', flag: '🇪🇬', phone: '+20' },
  { code: 'EH', name: 'Sáhara Occidental', flag: '🇪🇭', phone: '+212' },
  { code: 'ER', name: 'Eritrea', flag: '🇪🇷', phone: '+291' },
  { code: 'ES', name: 'España', flag: '🇪🇸', phone: '+34' },
  { code: 'ET', name: 'Etiopía', flag: '🇪🇹', phone: '+251' },
  { code: 'FI', name: 'Finlandia', flag: '🇫🇮', phone: '+358' },
  { code: 'FJ', name: 'Fiyi', flag: '🇫🇯', phone: '+679' },
  { code: 'FK', name: 'Islas Malvinas', flag: '🇫🇰', phone: '+500' },
  { code: 'FM', name: 'Micronesia', flag: '🇫🇲', phone: '+691' },
  { code: 'FO', name: 'Islas Feroe', flag: '🇫🇴', phone: '+298' },
  { code: 'FR', name: 'Francia', flag: '🇫🇷', phone: '+33' },
  { code: 'GA', name: 'Gabón', flag: '🇬🇦', phone: '+241' },
  { code: 'GB', name: 'Reino Unido', flag: '🇬🇧', phone: '+44' },
  { code: 'GD', name: 'Granada', flag: '🇬🇩', phone: '+1473' },
  { code: 'GE', name: 'Georgia', flag: '🇬🇪', phone: '+995' },
  { code: 'GF', name: 'Guayana Francesa', flag: '🇬🇫', phone: '+594' },
  { code: 'GG', name: 'Guernsey', flag: '🇬🇬', phone: '+44' },
  { code: 'GH', name: 'Ghana', flag: '🇬🇭', phone: '+233' },
  { code: 'GI', name: 'Gibraltar', flag: '🇬🇮', phone: '+350' },
  { code: 'GL', name: 'Groenlandia', flag: '🇬🇱', phone: '+299' },
  { code: 'GM', name: 'Gambia', flag: '🇬🇲', phone: '+220' },
  { code: 'GN', name: 'Guinea', flag: '🇬🇳', phone: '+224' },
  { code: 'GP', name: 'Guadalupe', flag: '🇬🇵', phone: '+590' },
  { code: 'GQ', name: 'Guinea Ecuatorial', flag: '🇬🇶', phone: '+240' },
  { code: 'GR', name: 'Grecia', flag: '🇬🇷', phone: '+30' },
  { code: 'GS', name: 'Georgia del Sur e Islas Sandwich del Sur', flag: '🇬🇸', phone: '+500' },
  { code: 'GT', name: 'Guatemala', flag: '🇬🇹', phone: '+502' },
  { code: 'GU', name: 'Guam', flag: '🇬🇺', phone: '+1671' },
  { code: 'GW', name: 'Guinea-Bisáu', flag: '🇬🇼', phone: '+245' },
  { code: 'GY', name: 'Guyana', flag: '🇬🇾', phone: '+592' },
  { code: 'HK', name: 'Hong Kong', flag: '🇭🇰', phone: '+852' },
  { code: 'HM', name: 'Islas Heard y McDonald', flag: '🇭🇲', phone: '+672' },
  { code: 'HN', name: 'Honduras', flag: '🇭🇳', phone: '+504' },
  { code: 'HR', name: 'Croacia', flag: '🇭🇷', phone: '+385' },
  { code: 'HT', name: 'Haití', flag: '🇭🇹', phone: '+509' },
  { code: 'HU', name: 'Hungría', flag: '🇭🇺', phone: '+36' },
  { code: 'ID', name: 'Indonesia', flag: '🇮🇩', phone: '+62' },
  { code: 'IE', name: 'Irlanda', flag: '🇮🇪', phone: '+353' },
  { code: 'IL', name: 'Israel', flag: '🇮🇱', phone: '+972' },
  { code: 'IM', name: 'Isla de Man', flag: '🇮🇲', phone: '+44' },
  { code: 'IN', name: 'India', flag: '🇮🇳', phone: '+91' },
  { code: 'IO', name: 'Territorio Británico del Océano Índico', flag: '🇮🇴', phone: '+246' },
  { code: 'IQ', name: 'Irak', flag: '🇮🇶', phone: '+964' },
  { code: 'IR', name: 'Irán', flag: '🇮🇷', phone: '+98' },
  { code: 'IS', name: 'Islandia', flag: '🇮🇸', phone: '+354' },
  { code: 'IT', name: 'Italia', flag: '🇮🇹', phone: '+39' },
  { code: 'JE', name: 'Jersey', flag: '🇯🇪', phone: '+44' },
  { code: 'JM', name: 'Jamaica', flag: '🇯🇲', phone: '+1876' },
  { code: 'JO', name: 'Jordania', flag: '🇯🇴', phone: '+962' },
  { code: 'JP', name: 'Japón', flag: '🇯🇵', phone: '+81' },
  { code: 'KE', name: 'Kenia', flag: '🇰🇪', phone: '+254' },
  { code: 'KG', name: 'Kirguistán', flag: '🇰🇬', phone: '+996' },
  { code: 'KH', name: 'Camboya', flag: '🇰🇭', phone: '+855' },
  { code: 'KI', name: 'Kiribati', flag: '🇰🇮', phone: '+686' },
  { code: 'KM', name: 'Comoras', flag: '🇰🇲', phone: '+269' },
  { code: 'KN', name: 'San Cristóbal y Nieves', flag: '🇰🇳', phone: '+1869' },
  { code: 'KP', name: 'Corea del Norte', flag: '🇰🇵', phone: '+850' },
  { code: 'KR', name: 'Corea del Sur', flag: '🇰🇷', phone: '+82' },
  { code: 'KW', name: 'Kuwait', flag: '🇰🇼', phone: '+965' },
  { code: 'KY', name: 'Islas Caimán', flag: '🇰🇾', phone: '+1345' },
  { code: 'KZ', name: 'Kazajistán', flag: '🇰🇿', phone: '+7' },
  { code: 'LA', name: 'Laos', flag: '🇱🇦', phone: '+856' },
  { code: 'LB', name: 'Líbano', flag: '🇱🇧', phone: '+961' },
  { code: 'LC', name: 'Santa Lucía', flag: '🇱🇨', phone: '+1758' },
  { code: 'LI', name: 'Liechtenstein', flag: '🇱🇮', phone: '+423' },
  { code: 'LK', name: 'Sri Lanka', flag: '🇱🇰', phone: '+94' },
  { code: 'LR', name: 'Liberia', flag: '🇱🇷', phone: '+231' },
  { code: 'LS', name: 'Lesoto', flag: '🇱🇸', phone: '+266' },
  { code: 'LT', name: 'Lituania', flag: '🇱🇹', phone: '+370' },
  { code: 'LU', name: 'Luxemburgo', flag: '🇱🇺', phone: '+352' },
  { code: 'LV', name: 'Letonia', flag: '🇱🇻', phone: '+371' },
  { code: 'LY', name: 'Libia', flag: '🇱🇾', phone: '+218' },
  { code: 'MA', name: 'Marruecos', flag: '🇲🇦', phone: '+212' },
  { code: 'MC', name: 'Mónaco', flag: '🇲🇨', phone: '+377' },
  { code: 'MD', name: 'Moldavia', flag: '🇲🇩', phone: '+373' },
  { code: 'ME', name: 'Montenegro', flag: '🇲🇪', phone: '+382' },
  { code: 'MF', name: 'San Martín', flag: '🇲🇫', phone: '+590' },
  { code: 'MG', name: 'Madagascar', flag: '🇲🇬', phone: '+261' },
  { code: 'MH', name: 'Islas Marshall', flag: '🇲🇭', phone: '+692' },
  { code: 'MK', name: 'Macedonia del Norte', flag: '🇲🇰', phone: '+389' },
  { code: 'ML', name: 'Malí', flag: '🇲🇱', phone: '+223' },
  { code: 'MM', name: 'Birmania', flag: '🇲🇲', phone: '+95' },
  { code: 'MN', name: 'Mongolia', flag: '🇲🇳', phone: '+976' },
  { code: 'MO', name: 'Macao', flag: '🇲🇴', phone: '+853' },
  { code: 'MP', name: 'Islas Marianas del Norte', flag: '🇲🇵', phone: '+1670' },
  { code: 'MQ', name: 'Martinica', flag: '🇲🇶', phone: '+596' },
  { code: 'MR', name: 'Mauritania', flag: '🇲🇷', phone: '+222' },
  { code: 'MS', name: 'Montserrat', flag: '🇲🇸', phone: '+1664' },
  { code: 'MT', name: 'Malta', flag: '🇲🇹', phone: '+356' },
  { code: 'MU', name: 'Mauricio', flag: '🇲🇺', phone: '+230' },
  { code: 'MV', name: 'Maldivas', flag: '🇲🇻', phone: '+960' },
  { code: 'MW', name: 'Malaui', flag: '🇲🇼', phone: '+265' },
  { code: 'MX', name: 'México', flag: '🇲🇽', phone: '+52' },
  { code: 'MY', name: 'Malasia', flag: '🇲🇾', phone: '+60' },
  { code: 'MZ', name: 'Mozambique', flag: '🇲🇿', phone: '+258' },
  { code: 'NA', name: 'Namibia', flag: '🇳🇦', phone: '+264' },
  { code: 'NC', name: 'Nueva Caledonia', flag: '🇳🇨', phone: '+687' },
  { code: 'NE', name: 'Níger', flag: '🇳🇪', phone: '+227' },
  { code: 'NF', name: 'Isla Norfolk', flag: '🇳🇫', phone: '+672' },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬', phone: '+234' },
  { code: 'NI', name: 'Nicaragua', flag: '🇳🇮', phone: '+505' },
  { code: 'NL', name: 'Países Bajos', flag: '🇳🇱', phone: '+31' },
  { code: 'NO', name: 'Noruega', flag: '🇳🇴', phone: '+47' },
  { code: 'NP', name: 'Nepal', flag: '🇳🇵', phone: '+977' },
  { code: 'NR', name: 'Nauru', flag: '🇳🇷', phone: '+674' },
  { code: 'NU', name: 'Niue', flag: '🇳🇺', phone: '+683' },
  { code: 'NZ', name: 'Nueva Zelanda', flag: '🇳🇿', phone: '+64' },
  { code: 'OM', name: 'Omán', flag: '🇴🇲', phone: '+968' },
  { code: 'PA', name: 'Panamá', flag: '🇵🇦', phone: '+507' },
  { code: 'PE', name: 'Perú', flag: '🇵🇪', phone: '+51' },
  { code: 'PF', name: 'Polinesia Francesa', flag: '🇵🇫', phone: '+689' },
  { code: 'PG', name: 'Papúa Nueva Guinea', flag: '🇵🇬', phone: '+675' },
  { code: 'PH', name: 'Filipinas', flag: '🇵🇭', phone: '+63' },
  { code: 'PK', name: 'Pakistán', flag: '🇵🇰', phone: '+92' },
  { code: 'PL', name: 'Polonia', flag: '🇵🇱', phone: '+48' },
  { code: 'PM', name: 'San Pedro y Miquelón', flag: '🇵🇲', phone: '+508' },
  { code: 'PN', name: 'Islas Pitcairn', flag: '🇵🇳', phone: '+64' },
  { code: 'PR', name: 'Puerto Rico', flag: '🇵🇷', phone: '+1787' },
  { code: 'PS', name: 'Palestina', flag: '🇵🇸', phone: '+970' },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹', phone: '+351' },
  { code: 'PW', name: 'Palaos', flag: '🇵🇼', phone: '+680' },
  { code: 'PY', name: 'Paraguay', flag: '🇵🇾', phone: '+595' },
  { code: 'QA', name: 'Catar', flag: '🇶🇦', phone: '+974' },
  { code: 'RE', name: 'Reunión', flag: '🇷🇪', phone: '+262' },
  { code: 'RO', name: 'Rumania', flag: '🇷🇴', phone: '+40' },
  { code: 'RS', name: 'Serbia', flag: '🇷🇸', phone: '+381' },
  { code: 'RU', name: 'Rusia', flag: '🇷🇺', phone: '+7' },
  { code: 'RW', name: 'Ruanda', flag: '🇷🇼', phone: '+250' },
  { code: 'SA', name: 'Arabia Saudí', flag: '🇸🇦', phone: '+966' },
  { code: 'SB', name: 'Islas Salomón', flag: '🇸🇧', phone: '+677' },
  { code: 'SC', name: 'Seychelles', flag: '🇸🇨', phone: '+248' },
  { code: 'SD', name: 'Sudán', flag: '🇸🇩', phone: '+249' },
  { code: 'SE', name: 'Suecia', flag: '🇸🇪', phone: '+46' },
  { code: 'SG', name: 'Singapur', flag: '🇸🇬', phone: '+65' },
  { code: 'SH', name: 'Santa Elena', flag: '🇸🇭', phone: '+290' },
  { code: 'SI', name: 'Eslovenia', flag: '🇸🇮', phone: '+386' },
  { code: 'SJ', name: 'Svalbard y Jan Mayen', flag: '🇸🇯', phone: '+47' },
  { code: 'SK', name: 'Eslovaquia', flag: '🇸🇰', phone: '+421' },
  { code: 'SL', name: 'Sierra Leona', flag: '🇸🇱', phone: '+232' },
  { code: 'SM', name: 'San Marino', flag: '🇸🇲', phone: '+378' },
  { code: 'SN', name: 'Senegal', flag: '🇸🇳', phone: '+221' },
  { code: 'SO', name: 'Somalia', flag: '🇸🇴', phone: '+252' },
  { code: 'SR', name: 'Surinam', flag: '🇸🇷', phone: '+597' },
  { code: 'SS', name: 'Sudán del Sur', flag: '🇸🇸', phone: '+211' },
  { code: 'ST', name: 'Santo Tomé y Príncipe', flag: '🇸🇹', phone: '+239' },
  { code: 'SV', name: 'El Salvador', flag: '🇸🇻', phone: '+503' },
  { code: 'SX', name: 'Sint Maarten', flag: '🇸🇽', phone: '+1721' },
  { code: 'SY', name: 'Siria', flag: '🇸🇾', phone: '+963' },
  { code: 'SZ', name: 'Esuatini', flag: '🇸🇿', phone: '+268' },
  { code: 'TC', name: 'Islas Turcas y Caicos', flag: '🇹🇨', phone: '+1649' },
  { code: 'TD', name: 'Chad', flag: '🇹🇩', phone: '+235' },
  { code: 'TF', name: 'Territorios Australes Franceses', flag: '🇹🇫', phone: '+262' },
  { code: 'TG', name: 'Togo', flag: '🇹🇬', phone: '+228' },
  { code: 'TH', name: 'Tailandia', flag: '🇹🇭', phone: '+66' },
  { code: 'TJ', name: 'Tayikistán', flag: '🇹🇯', phone: '+992' },
  { code: 'TK', name: 'Tokelau', flag: '🇹🇰', phone: '+690' },
  { code: 'TL', name: 'Timor Oriental', flag: '🇹🇱', phone: '+670' },
  { code: 'TM', name: 'Turkmenistán', flag: '🇹🇲', phone: '+993' },
  { code: 'TN', name: 'Túnez', flag: '🇹🇳', phone: '+216' },
  { code: 'TO', name: 'Tonga', flag: '🇹🇴', phone: '+676' },
  { code: 'TR', name: 'Turquía', flag: '🇹🇷', phone: '+90' },
  { code: 'TT', name: 'Trinidad y Tobago', flag: '🇹🇹', phone: '+1868' },
  { code: 'TV', name: 'Tuvalu', flag: '🇹🇻', phone: '+688' },
  { code: 'TW', name: 'Taiwán', flag: '🇹🇼', phone: '+886' },
  { code: 'TZ', name: 'Tanzania', flag: '🇹🇿', phone: '+255' },
  { code: 'UA', name: 'Ucrania', flag: '🇺🇦', phone: '+380' },
  { code: 'UG', name: 'Uganda', flag: '🇺🇬', phone: '+256' },
  { code: 'UM', name: 'Islas Ultramarinas de Estados Unidos', flag: '🇺🇲', phone: '+1' },
  { code: 'US', name: 'Estados Unidos', flag: '🇺🇸', phone: '+1' },
  { code: 'UY', name: 'Uruguay', flag: '🇺🇾', phone: '+598' },
  { code: 'UZ', name: 'Uzbekistán', flag: '🇺🇿', phone: '+998' },
  { code: 'VA', name: 'Ciudad del Vaticano', flag: '🇻🇦', phone: '+39' },
  { code: 'VC', name: 'San Vicente y las Granadinas', flag: '🇻🇨', phone: '+1784' },
  { code: 'VE', name: 'Venezuela', flag: '🇻🇪', phone: '+58' },
  { code: 'VG', name: 'Islas Vírgenes Británicas', flag: '🇻🇬', phone: '+1284' },
  { code: 'VI', name: 'Islas Vírgenes de los Estados Unidos', flag: '🇻🇮', phone: '+1340' },
  { code: 'VN', name: 'Vietnam', flag: '🇻🇳', phone: '+84' },
  { code: 'VU', name: 'Vanuatu', flag: '🇻🇺', phone: '+678' },
  { code: 'WF', name: 'Wallis y Futuna', flag: '🇼🇫', phone: '+681' },
  { code: 'WS', name: 'Samoa', flag: '🇼🇸', phone: '+685' },
  { code: 'YE', name: 'Yemen', flag: '🇾🇪', phone: '+967' },
  { code: 'YT', name: 'Mayotte', flag: '🇾🇹', phone: '+262' },
  { code: 'ZA', name: 'Sudáfrica', flag: '🇿🇦', phone: '+27' },
  { code: 'ZM', name: 'Zambia', flag: '🇿🇲', phone: '+260' },
  { code: 'ZW', name: 'Zimbabue', flag: '🇿🇼', phone: '+263' }
]

const CountrySelector = ({ 
  value = '', 
  onChange, 
  placeholder = "Selecciona un país", 
  showPhoneCode = false,
  className = "" 
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')

  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(search.toLowerCase()) ||
    country.code.toLowerCase().includes(search.toLowerCase()) ||
    (showPhoneCode && country.phone.includes(search))
  )

  const selectedCountry = countries.find(country => 
    showPhoneCode ? country.phone === value : country.name === value
  )

  const handleSelect = (country) => {
    const selectedValue = showPhoneCode ? country.phone : country.name
    onChange(selectedValue)
    setIsOpen(false)
    setSearch('')
  }

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          {selectedCountry ? (
            <>
              <span className="text-lg">{selectedCountry.flag}</span>
              {showPhoneCode ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-blue-700 bg-blue-100 px-3 py-1 rounded-full border border-blue-200">
                    {selectedCountry.phone}
                  </span>
                  <span className="text-sm text-gray-600 truncate font-medium">
                    {selectedCountry.name}
                  </span>
                </div>
              ) : (
                <span className="text-sm text-gray-700">
                  {selectedCountry.code} - {selectedCountry.name}
                </span>
              )}
            </>
          ) : (
            <span className="text-gray-500">{placeholder}</span>
          )}
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full min-w-fit bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-hidden">
          <div className="p-2 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar país..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="max-h-48 overflow-y-auto">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country) => (
                <button
                  key={country.code}
                  type="button"
                  onClick={() => handleSelect(country)}
                  className="w-full px-4 py-3 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none flex items-center gap-3 transition-colors border-b border-gray-100 last:border-b-0"
                >
                  <span className="text-lg flex-shrink-0">{country.flag}</span>
                  {showPhoneCode ? (
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <span className="text-sm font-semibold text-blue-700 bg-blue-100 px-3 py-1 rounded-full flex-shrink-0 border border-blue-200">
                        {country.phone}
                      </span>
                      <span className="text-sm text-gray-700 truncate font-medium">
                        {country.name}
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-700 truncate">
                      {country.code} - {country.name}
                    </span>
                  )}
                </button>
              ))
            ) : (
              <div className="px-3 py-2 text-gray-500 text-sm">
                No se encontraron países
              </div>
            )}
          </div>
        </div>
      )}

      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}

export default CountrySelector
