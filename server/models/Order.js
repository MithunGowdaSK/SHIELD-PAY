import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: String,
  orderId: String,
  amount: Number,
  date: { type: Date, default: Date.now },
});

export default mongoose.model("Order", orderSchema);