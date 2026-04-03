import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  // Profile Info
  phone: { type: String, unique: true, required: true },
  name: String,
  city: String,
  
  // Platform Info
  platform: String,
  workerId: String,
  proofUrl: String,
  
  // Location
  latitude: Number,
  longitude: Number,
  lastLocation: {
    latitude: Number,
    longitude: Number,
    timestamp: Date,
  },
  
  // Plan
  plan: {
    name: String,
    price: Number,
    coverage: Number,
    startDate: { type: Date, default: Date.now },
  },
  
  // Orders
  orders: [
    {
      id: String,
      amount: Number,
      date: { type: Date, default: Date.now },
      latitude: Number,
      longitude: Number,
      platform: String,
      suspicious: { type: Boolean, default: false },
    },
  ],
  
  // Payouts
  payouts: [
    {
      id: String,
      amount: Number,
      date: { type: Date, default: Date.now },
      triggeredBy: String,
      status: { type: String, default: "pending" },
    },
  ],
  
  // Wallet
  wallet: {
    balance: { type: Number, default: 0 },
    topUps: [
      {
        amount: Number,
        date: { type: Date, default: Date.now },
        reason: String,
      },
    ],
  },
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("User", userSchema);