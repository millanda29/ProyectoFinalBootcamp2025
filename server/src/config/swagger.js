import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Travel Management API',
      version: '1.0.0',
      description: 'API para gestión de viajes con funcionalidades de autenticación, usuarios, viajes y chat con IA',
      contact: {
        name: 'Travel Management Team',
        email: 'support@travelmanagement.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:4000',
        description: 'Servidor de desarrollo'
      },
      {
        url: 'https://proyectofinalbootcamp2025.onrender.com',
        description: 'Servidor de producción'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token JWT para autenticación'
        }
      },
      schemas: {
        User: {
          type: 'object',
          required: ['email', 'passwordHash', 'fullName'],
          properties: {
            _id: {
              type: 'string',
              description: 'ID único del usuario'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email del usuario (único)'
            },
            fullName: {
              type: 'string',
              description: 'Nombre completo del usuario'
            },
            phone: {
              type: 'string',
              description: 'Teléfono del usuario (formato internacional)'
            },
            location: {
              type: 'string',
              description: 'Ubicación del usuario (Ciudad, País)'
            },
            bio: {
              type: 'string',
              maxLength: 500,
              description: 'Biografía del usuario'
            },
            website: {
              type: 'string',
              format: 'uri',
              description: 'Sitio web del usuario'
            },
            avatarUrl: {
              type: 'string',
              format: 'uri',
              description: 'URL del avatar del usuario'
            },
            roles: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Roles del usuario'
            },
            isActive: {
              type: 'boolean',
              description: 'Estado de actividad del usuario'
            },
            lastLogin: {
              type: 'string',
              format: 'date-time',
              description: 'Último inicio de sesión'
            },
            travelPreferences: {
              type: 'object',
              properties: {
                preferredCurrency: {
                  type: 'string',
                  enum: ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'MXN', 'BRL']
                },
                preferredLanguage: {
                  type: 'string',
                  enum: ['en', 'es', 'fr', 'de', 'it', 'pt', 'ja', 'ko', 'zh', 'ru']
                },
                travelStyle: {
                  type: 'string',
                  enum: ['budget', 'balanced', 'luxury', 'adventure', 'cultural', 'relaxation', 'business']
                },
                favoriteDestination: {
                  type: 'string'
                },
                budgetRange: {
                  type: 'object',
                  properties: {
                    min: { type: 'number', minimum: 0 },
                    max: { type: 'number', minimum: 0 },
                    currency: { type: 'string' }
                  }
                },
                accommodationPreference: {
                  type: 'string',
                  enum: ['hotel', 'hostel', 'airbnb', 'resort', 'camping', 'any']
                },
                transportPreference: {
                  type: 'string',
                  enum: ['flight', 'train', 'bus', 'car', 'any']
                }
              }
            },
            notifications: {
              type: 'object',
              properties: {
                email: { type: 'boolean' },
                push: { type: 'boolean' },
                tripReminders: { type: 'boolean' },
                promotions: { type: 'boolean' }
              }
            },
            stats: {
              type: 'object',
              properties: {
                tripsCompleted: { type: 'number' },
                countriesVisited: {
                  type: 'array',
                  items: { type: 'string' }
                },
                totalSpent: { type: 'number' }
              }
            }
          }
        },
        Trip: {
          type: 'object',
          required: ['userId', 'title', 'destination', 'startDate', 'endDate'],
          properties: {
            _id: {
              type: 'string',
              description: 'ID único del viaje'
            },
            userId: {
              type: 'string',
              description: 'ID del usuario propietario del viaje'
            },
            title: {
              type: 'string',
              description: 'Título del viaje'
            },
            destination: {
              type: 'string',
              description: 'Destino del viaje'
            },
            startDate: {
              type: 'string',
              format: 'date',
              description: 'Fecha de inicio del viaje'
            },
            endDate: {
              type: 'string',
              format: 'date',
              description: 'Fecha de fin del viaje'
            },
            partySize: {
              type: 'number',
              minimum: 1,
              description: 'Número de personas en el viaje'
            },
            status: {
              type: 'string',
              enum: ['planned', 'ongoing', 'completed'],
              description: 'Estado del viaje'
            },
            itinerary: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  dayNumber: { type: 'number' },
                  notes: { type: 'string' },
                  activities: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        title: { type: 'string' },
                        category: { type: 'string' },
                        startTime: { type: 'string' },
                        endTime: { type: 'string' },
                        location: { type: 'string' },
                        externalRef: { type: 'string' }
                      }
                    }
                  }
                }
              }
            },
            costs: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  type: {
                    type: 'string',
                    enum: ['lodging', 'transport', 'activity', 'other']
                  },
                  label: { type: 'string' },
                  currency: { type: 'string' },
                  amount: { type: 'number', minimum: 0 },
                  quantity: { type: 'number', minimum: 0 }
                }
              }
            },
            reports: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  fileUrl: { type: 'string' },
                  format: { type: 'string' },
                  generatedAt: { type: 'string', format: 'date-time' }
                }
              }
            },
            isDeleted: {
              type: 'boolean',
              description: 'Indica si el viaje fue eliminado lógicamente'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'Email del usuario'
            },
            password: {
              type: 'string',
              minLength: 6,
              description: 'Contraseña del usuario'
            }
          }
        },
        RegisterRequest: {
          type: 'object',
          required: ['email', 'password', 'fullName'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'Email del usuario'
            },
            password: {
              type: 'string',
              minLength: 6,
              description: 'Contraseña del usuario'
            },
            fullName: {
              type: 'string',
              description: 'Nombre completo del usuario'
            }
          }
        },
        AuthResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Mensaje de respuesta'
            },
            user: {
              $ref: '#/components/schemas/User'
            },
            accessToken: {
              type: 'string',
              description: 'Token de acceso JWT'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Mensaje de error'
            },
            details: {
              type: 'string',
              description: 'Detalles adicionales del error'
            }
          }
        },
        ChatItineraryRequest: {
          type: 'object',
          required: ['destination', 'duration', 'budget'],
          properties: {
            destination: {
              type: 'string',
              description: 'Destino del viaje'
            },
            duration: {
              type: 'number',
              description: 'Duración del viaje en días'
            },
            budget: {
              type: 'number',
              description: 'Presupuesto para el viaje'
            },
            interests: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Intereses del usuario'
            },
            travelStyle: {
              type: 'string',
              enum: ['budget', 'balanced', 'luxury', 'adventure', 'cultural', 'relaxation', 'business'],
              description: 'Estilo de viaje preferido'
            }
          }
        },
        ChatAssistantRequest: {
          type: 'object',
          required: ['message'],
          properties: {
            message: {
              type: 'string',
              description: 'Mensaje del usuario para el asistente'
            },
            context: {
              type: 'string',
              description: 'Contexto adicional para el asistente'
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: [
    path.join(__dirname, '../auth/*.js'),
    path.join(__dirname, '../routers/*.js'),
    path.join(__dirname, '../controllers/*.js')
  ]
};

const specs = swaggerJSDoc(options);

export { specs, swaggerUi };