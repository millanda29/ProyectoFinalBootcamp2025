import mongoose from 'mongoose';

const ActivitySchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: String,
  startTime: String,
  endTime: String,
  location: String,
  externalRef: String
}, { _id: true });

const DaySchema = new mongoose.Schema({
  dayNumber: { type: Number, required: true },
  notes: String,
  activities: [ActivitySchema]
}, { _id: true });

const CostSchema = new mongoose.Schema({
  type: { type: String, enum: ["lodging","transport","activity","other"], required: true },
  label: { type: String, required: true },
  currency: { type: String, default: "USD" },
  amount: { type: Number, required: true, min: 0 },
  quantity: { type: Number, default: 1, min: 0 }
}, { _id: true });

const AiMessageSchema = new mongoose.Schema({
  role: { type: String, enum: ["user","assistant","system"], required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: () => new Date() }
}, { _id: true });

const ReportSchema = new mongoose.Schema({
  fileUrl: { type: String, required: true },
  format: { type: String, default: "pdf" },
  generatedAt: { type: Date, default: () => new Date() }
}, { _id: true });

const tripSchema = new mongoose.Schema({
  userId: { type: mongoose.Types.ObjectId, ref: "User", required: true, index: true },
  title: { type: String, required: true },
  destination: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate:   { type: Date, required: true },
  partySize: { type: Number, default: 1, min: 1 },
  itinerary: [DaySchema],
  costs: [CostSchema],
  aiConversations: [{
    startedAt: { type: Date, default: () => new Date() },
    messages: [AiMessageSchema]
  }],
  reports: [ReportSchema]
}, { timestamps: true });

export default mongoose.model("Trip", tripSchema);
