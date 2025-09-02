import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./src/app.js";

dotenv.config();

// Configuración desde .env
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/travelmate";

// Conexión a MongoDB
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("✅ Conectado a MongoDB");

    // Levantar servidor Express
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Error al conectar con MongoDB:", err);
    process.exit(1);
  });
