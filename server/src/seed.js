import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "./models/User.js";
import Trip from "./models/Trip.js";
import RefreshToken from "./models/RefreshToken.js";

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/travelmate";

async function seed() {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

    console.log("Conectado a MongoDB 🚀");

    // Limpieza previa
    await User.deleteMany({});
    await Trip.deleteMany({});
    await RefreshToken.deleteMany({});

    // 🔹 Usuarios de ejemplo
    const users = await User.insertMany([
      {
        email: "alice@example.com",
        passwordHash: await bcrypt.hash("Password123!", 10),
        fullName: "Alice Johnson",
        roles: ["traveler"],
      },
      {
        email: "bob@example.com",
        passwordHash: await bcrypt.hash("Secret456$", 10),
        fullName: "Bob Smith",
        roles: ["traveler"],
      },
      {
        email: "admin@example.com",
        passwordHash: await bcrypt.hash("Admin789#", 10),
        fullName: "Admin User",
        roles: ["admin"],
      }
    ]);

    console.log(`✅ Usuarios insertados: ${users.length}`);

    // 🔹 Viajes de ejemplo
    const trips = await Trip.insertMany([
      {
        userId: users[0]._id,
        title: "Paris Getaway",
        destination: "Paris, France",
        startDate: new Date("2025-10-10"),
        endDate: new Date("2025-10-15"),
        partySize: 2,
        itinerary: [
          {
            dayNumber: 1,
            notes: "Visit Eiffel Tower",
            activities: [
              { title: "Eiffel Tower Tour", category: "sightseeing", startTime: "10:00", endTime: "12:00", location: "Champ de Mars" },
              { title: "Lunch at Le Jules Verne", category: "food", startTime: "13:00" }
            ]
          },
          {
            dayNumber: 2,
            notes: "Louvre Museum",
            activities: [{ title: "Museum Tour", category: "culture", startTime: "09:00", location: "Rue de Rivoli" }]
          }
        ],
        costs: [
          { type: "lodging", label: "Hotel 5 nights", amount: 800, currency: "EUR" },
          { type: "transport", label: "Metro Pass", amount: 30, quantity: 2, currency: "EUR" }
        ],
        aiConversations: [
          {
            messages: [
              { role: "user", content: "Plan a trip to Paris", createdAt: new Date() },
              { role: "assistant", content: "Here’s a 5-day itinerary...", createdAt: new Date() }
            ]
          }
        ],
        reports: [{ fileUrl: "https://cdn.example.com/reports/paris_trip.pdf" }]
      },
      {
        userId: users[1]._id,
        title: "Tokyo Adventure",
        destination: "Tokyo, Japan",
        startDate: new Date("2025-11-01"),
        endDate: new Date("2025-11-07"),
        partySize: 1,
        itinerary: [
          {
            dayNumber: 1,
            notes: "Shibuya Crossing + Sushi dinner",
            activities: [
              { title: "Walk in Shibuya", category: "explore", startTime: "18:00" },
              { title: "Sushi Dinner", category: "food", startTime: "20:00" }
            ]
          }
        ],
        costs: [
          { type: "lodging", label: "Capsule Hotel", amount: 200, currency: "JPY" },
          { type: "activity", label: "Tokyo Tower Ticket", amount: 15, currency: "JPY" }
        ],
        aiConversations: [
          {
            messages: [
              { role: "user", content: "Best sushi places in Tokyo?", createdAt: new Date() },
              { role: "assistant", content: "Check out Sukiyabashi Jiro...", createdAt: new Date() }
            ]
          }
        ]
      }
    ]);

    console.log(`✅ Viajes insertados: ${trips.length}`);

    // 🔹 Token de ejemplo
    await RefreshToken.create({
      userId: users[0]._id,
      tokenHash: await bcrypt.hash("randomtoken123", 10),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 días
    });

    console.log("✅ Token insertado");

    console.log("🌱 Seed completado con éxito!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error en seed:", err);
    process.exit(1);
  }
}

seed();
