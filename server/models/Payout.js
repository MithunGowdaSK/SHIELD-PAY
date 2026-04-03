import mongoose from "mongoose";

const payoutSchema = new mongoose.Schema({
  userId: String,
  amount: Number,
  reason: String,
  date: { type: Date, default: Date.now },
});

export default mongoose.model("Payout", payoutSchema);