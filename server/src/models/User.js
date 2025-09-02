import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, index: true },
  passwordHash: { type: String, required: true },   // guarda solo hash
  fullName: { type: String, required: true },
  avatarUrl: String,
  roles: { type: [String], enum: ["admin", "traveler"], default: ["traveler"] },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model("User", userSchema);
