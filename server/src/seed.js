import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import User from "./models/User.js";
import Trip from "./models/Trip.js";
import RefreshToken from "./models/RefreshToken.js";

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/travelmate";

async function seed() {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

    console.log("🚀 Conectado a MongoDB para seeding");

    // Limpieza previa
    await User.deleteMany({});
    await Trip.deleteMany({});
    await RefreshToken.deleteMany({});
    console.log("🧹 Base de datos limpiada");

    // 🔹 Usuarios de ejemplo
    const users = await User.insertMany([
      {
        email: "maria.garcia@email.com",
        passwordHash: await bcrypt.hash("Password123!", 10),
        fullName: "María García",
        phone: "+34612345678",
        location: "Madrid, España",
        bio: "Apasionada por los viajes y la fotografía. Me encanta descubrir nuevas culturas y compartir mis experiencias.",
        website: "https://mariaviajes.blog",
        roles: ["traveler"],
        avatarUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b494",
        isActive: true,
        lastLogin: new Date(),
        createdAt: new Date("2023-08-14"), // Miembro desde 14/8/2023
        travelPreferences: {
          preferredCurrency: "EUR",
          preferredLanguage: "es",
          travelStyle: "adventure",
          favoriteDestination: "Japón",
          budgetRange: {
            min: 800,
            max: 3000,
            currency: "EUR"
          },
          accommodationPreference: "hotel",
          transportPreference: "flight"
        },
        notifications: {
          email: true,
          push: true,
          tripReminders: true,
          promotions: false
        },
        stats: {
          tripsCompleted: 12,
          countriesVisited: ["España", "Francia", "Italia", "Japón", "Tailandia", "Portugal"],
          totalSpent: 8500,
          totalSaved: 1200
        }
      },
      {
        email: "alice@travelmate.com",
        passwordHash: await bcrypt.hash("Password123!", 10),
        fullName: "Alice Johnson",
        phone: "+15551234567",
        location: "New York, USA",
        bio: "Travel enthusiast and food lover. Always planning my next adventure!",
        roles: ["traveler"],
        avatarUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b494",
        isActive: true,
        lastLogin: new Date(),
        travelPreferences: {
          preferredCurrency: "USD",
          preferredLanguage: "en",
          travelStyle: "cultural",
          favoriteDestination: "Italia",
          budgetRange: {
            min: 1000,
            max: 4000,
            currency: "USD"
          },
          accommodationPreference: "airbnb",
          transportPreference: "any"
        },
        stats: {
          tripsCompleted: 8,
          countriesVisited: ["USA", "Italy", "France", "Spain"],
          totalSpent: 12000,
          totalSaved: 800
        }
      },
      {
        email: "bob@travelmate.com", 
        passwordHash: await bcrypt.hash("Secret456$", 10),
        fullName: "Bob Smith",
        phone: "+442079460958",
        location: "London, UK",
        bio: "Adventure seeker and backpacker. Love exploring off the beaten path destinations.",
        roles: ["traveler"],
        avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
        isActive: true,
        lastLogin: new Date(),
        travelPreferences: {
          preferredCurrency: "GBP",
          preferredLanguage: "en",
          travelStyle: "budget",
          favoriteDestination: "Nepal",
          budgetRange: {
            min: 300,
            max: 1500,
            currency: "GBP"
          },
          accommodationPreference: "hostel",
          transportPreference: "bus"
        },
        stats: {
          tripsCompleted: 15,
          countriesVisited: ["UK", "Nepal", "India", "Thailand", "Vietnam", "Cambodia"],
          totalSpent: 6500,
          totalSaved: 2100
        }
      },
      {
        email: "admin@travelmate.com",
        passwordHash: await bcrypt.hash("Admin789#", 10),
        fullName: "Sarah Admin",
        phone: "+15559990000",
        location: "San Francisco, USA",
        bio: "TravelMate platform administrator. Here to help you have amazing travel experiences!",
        roles: ["admin"],
        avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
        isActive: true,
        lastLogin: new Date(),
        travelPreferences: {
          preferredCurrency: "USD",
          preferredLanguage: "en",
          travelStyle: "business",
          favoriteDestination: "Singapore",
          budgetRange: {
            min: 2000,
            max: 8000,
            currency: "USD"
          },
          accommodationPreference: "hotel",
          transportPreference: "flight"
        },
        stats: {
          tripsCompleted: 3,
          countriesVisited: ["USA", "Singapore", "Germany"],
          totalSpent: 15000,
          totalSaved: 500
        }
      },
      {
        email: "carlos@travelmate.com",
        passwordHash: await bcrypt.hash("Travel2024!", 10),
        fullName: "Carlos Martinez",
        phone: "+525512345678",
        location: "Ciudad de México, México",
        bio: "Ingeniero de software que ama viajar. Siempre en busca de la mejor comida local y experiencias auténticas.",
        website: "https://carlosviaja.mx",
        roles: ["traveler"],
        avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
        isActive: true,
        lastLogin: new Date(),
        travelPreferences: {
          preferredCurrency: "MXN",
          preferredLanguage: "es",
          travelStyle: "cultural",
          favoriteDestination: "Perú",
          budgetRange: {
            min: 15000,
            max: 50000,
            currency: "MXN"
          },
          accommodationPreference: "airbnb",
          transportPreference: "any"
        },
        stats: {
          tripsCompleted: 6,
          countriesVisited: ["México", "Perú", "Colombia", "Argentina"],
          totalSpent: 180000,
          totalSaved: 25000
        }
      }
    ]);

    console.log(`✅ Usuarios insertados: ${users.length}`);

    // 🔹 Viajes de ejemplo con itinerarios y costos completos
    const trips = await Trip.insertMany([
      {
        userId: users[0]._id, // Alice
        title: "Aventura en París",
        destination: "París, Francia",
        startDate: new Date("2024-06-15"),
        endDate: new Date("2024-06-20"),
        partySize: 2,
        status: "planned",
        itinerary: [
          {
            dayNumber: 1,
            notes: "Llegada y primer día explorando el centro",
            activities: [
              {
                title: "Llegada al Aeropuerto Charles de Gaulle",
                category: "Transporte",
                startTime: "10:00",
                endTime: "11:30",
                location: "CDG Airport, París"
              },
              {
                title: "Check-in Hotel Notre-Dame",
                category: "Alojamiento",
                startTime: "14:00",
                endTime: "15:00",
                location: "Distrito 4, París"
              }
            ]
          },
          {
            dayNumber: 2,
            notes: "Día de museos y cultura",
            activities: [
              {
                title: "Visita al Museo del Louvre",
                category: "Cultural",
                startTime: "09:00",
                endTime: "13:00",
                location: "Museo del Louvre, París"
              }
            ]
          }
        ],
        costs: [
          {
            type: "lodging",
            label: "Hotel Notre-Dame (5 noches)",
            currency: "EUR",
            amount: 120,
            quantity: 5
          },
          {
            type: "transport",
            label: "Vuelos ida y vuelta",
            currency: "EUR",
            amount: 350,
            quantity: 2
          },
          {
            type: "activity",
            label: "Entrada Louvre",
            currency: "EUR",
            amount: 17,
            quantity: 2
          }
        ],
        aiConversations: [
          {
            startedAt: new Date(),
            messages: [
              {
                role: "user",
                content: "Quiero planificar un viaje romántico a París para 2 personas",
                createdAt: new Date()
              },
              {
                role: "assistant",
                content: "¡Excelente elección! París es perfecta para un viaje romántico.",
                createdAt: new Date()
              }
            ]
          }
        ]
      },
      {
        userId: users[1]._id, // Bob
        title: "Escapada a Tokio",
        destination: "Tokio, Japón",
        startDate: new Date("2024-09-01"),
        endDate: new Date("2024-09-08"),
        partySize: 1,
        status: "completed",
        itinerary: [
          {
            dayNumber: 1,
            notes: "Llegada y adaptación al jet lag",
            activities: [
              {
                title: "Llegada a Narita",
                category: "Transporte",
                startTime: "16:00",
                endTime: "18:00",
                location: "Aeropuerto Narita, Tokio"
              }
            ]
          }
        ],
        costs: [
          {
            type: "lodging",
            label: "Hotel en Shibuya (7 noches)",
            currency: "JPY",
            amount: 12000,
            quantity: 7
          },
          {
            type: "transport",
            label: "Vuelo Madrid-Tokio",
            currency: "EUR",
            amount: 850,
            quantity: 1
          }
        ]
      }
    ]);

    console.log(`✅ Viajes insertados: ${trips.length}`);

    // Actualizar usuarios con sus trips creados
    for (let i = 0; i < users.length; i++) {
      const userTrips = trips.filter(trip => trip.userId.equals(users[i]._id));
      await User.findByIdAndUpdate(users[i]._id, {
        createdTrips: userTrips.map(trip => trip._id)
      });
    }

    console.log("✅ Relaciones usuario-viajes actualizadas");

    // 🔹 Token de ejemplo
    await RefreshToken.create({
      userId: users[0]._id,
      token: await bcrypt.hash("randomtoken123", 10),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 días
    });

    console.log("✅ Token de ejemplo insertado");

    // Mostrar credenciales de ejemplo
    console.log("\n🔐 Credenciales de ejemplo:");
    console.log("👤 Usuario regular: alice@travelmate.com / Password123!");
    console.log("👤 Usuario regular: bob@travelmate.com / Secret456$");
    console.log("👑 Administrador: admin@travelmate.com / Admin789#");
    console.log("👤 Usuario regular: carlos@travelmate.com / Travel2024!");

    console.log("\n📊 Resumen de datos creados:");
    console.log(`👥 ${users.length} usuarios`);
    console.log(`🧳 ${trips.length} viajes`);
    console.log(`📝 ${trips.reduce((acc, trip) => acc + trip.itinerary.length, 0)} días de itinerario`);
    console.log(`💰 ${trips.reduce((acc, trip) => acc + trip.costs.length, 0)} elementos de costos`);

    console.log("\n🌱 Seed completado con éxito!");

  } catch (error) {
    console.error("❌ Error durante el seeding:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Desconectado de MongoDB");
  }
}

seed();
