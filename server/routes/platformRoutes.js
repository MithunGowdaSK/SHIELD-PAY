import express from "express";
import User from "../models/User.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { platform, workerId, phone, latitude, longitude } = req.body;

    console.log("BODY:", req.body);

    // ✅ VALIDATION
    if (!phone || !platform || !workerId) {
      return res.status(400).json({ message: "Missing fields ❌" });
    }

    // ✅ AUTO CREATE USER
    let user = await User.findOne({ phone });

    if (!user) {
      user = new User({
        phone,
        name: "New User",
      });
    }

    // ✅ UPDATE DATA
    user.platform = platform;
    user.workerId = workerId;

    if (latitude && longitude) {
      user.location = {
        latitude: Number(latitude),
        longitude: Number(longitude),
      };
    }

    await user.save();

    res.status(200).json({
      message: "Platform registered successfully ✅",
    });

  } catch (err) {
    console.error("ERROR:", err);
    res.status(500).json({
      message: "Server error ❌",
    });
  }
});

export default router;