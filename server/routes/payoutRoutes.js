import express from "express";
import Payout from "../models/Payout.js";
import User from "../models/User.js";

const router = express.Router();

// 🔥 DISTANCE FUNCTION
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;

  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}


// ✅ CREATE PAYOUT WITH LOCATION CHECK
router.post("/", async (req, res) => {
  try {
    const { phone, amount, latitude, longitude } = req.body;

    // 🔍 FIND USER
    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(404).json({ error: "User not found ❌" });
    }

    // ❌ IF LOCATION NOT SET
    if (!user.location) {
      return res.status(400).json({ error: "Set your location first ❌" });
    }

    // 🔥 DISTANCE CHECK
    const distance = getDistance(
      user.location.latitude,
      user.location.longitude,
      Number(latitude),
      Number(longitude)
    );

    console.log("Distance:", distance);

    if (distance > 6.1) {
      return res.status(403).json({
        error: `Payout denied ❌ - You are ${distance.toFixed(2)} km away`,
      });
    }

    // ✅ ALLOW PAYOUT
    const payout = new Payout({
      phone,
      amount,
      latitude,
      longitude,
      status: "success",
      createdAt: new Date(),
    });

    await payout.save();

    res.json({
      message: "Payout success ✅",
      payout,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error ❌" });
  }
});


// ✅ GET USER PAYOUTS
router.get("/:phone", async (req, res) => {
  try {
    const payouts = await Payout.find({ phone: req.params.phone });
    res.json(payouts);
  } catch (err) {
    res.status(500).json({ error: "Error fetching payouts" });
  }
});

export default router;