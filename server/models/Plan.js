import mongoose from "mongoose";

const planSchema = new mongoose.Schema({
  userId: String,
  name: String,
  price: Number,
  coverage: Number,
  startDate: Date,
});

export default mongoose.model("Plan", planSchema);