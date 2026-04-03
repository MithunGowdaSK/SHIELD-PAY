import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import platformRoutes from "./routes/platformRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// ROUTES
app.use("/api/platform", platformRoutes);
app.use("/api/users", userRoutes);

// DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected 🔥"))
  .catch(err => console.log(err));

// START
app.listen(5000, () => {
  console.log("Server running on 5000");
});