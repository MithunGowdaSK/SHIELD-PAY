import express from "express";
import User from "../models/User.js";

const router = express.Router();

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI/180) *
    Math.cos(lat2 * Math.PI/180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// ✅ REGISTER NEW USER (Phone based)
router.post("/register", async (req, res) => {
  try {
    const { phone, name, city } = req.body;

    if (!phone) {
      return res.status(400).json({ error: "Phone is required" });
    }

    // Check if user already exists
    let user = await User.findOne({ phone });

    if (user) {
      // User exists - return existing data
      return res.json({ 
        message: "User found", 
        user,
        isNewUser: false 
      });
    }

    // Create new user
    user = new User({
      phone,
      name: name || "User",
      city: city || "Unknown",
      createdAt: new Date(),
    });

    await user.save();

    res.json({ 
      message: "User registered successfully", 
      user,
      isNewUser: true 
    });

  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ GET USER BY PHONE
router.get("/phone/:phone", async (req, res) => {
  try {
    const user = await User.findOne({ phone: req.params.phone });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);

  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ GET USER BY ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);

  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ UPDATE USER PROFILE
router.put("/:phone", async (req, res) => {
  try {
    const { name, city, location } = req.body;
    const updateData = {
      updatedAt: new Date(),
    };
    if (name) updateData.name = name;
    if (city) updateData.city = city;
    // ✅ SAVE LOCATION
    if (location && location.latitude && location.longitude) {
      updateData.location = {
        latitude: Number(location.latitude),
        longitude: Number(location.longitude),
      };
    }
    const user = await User.findOneAndUpdate(
      { phone: req.params.phone },
      { $set: updateData },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: "User updated", user });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ ADD ORDER
router.post("/:phone/orders", async (req, res) => {
  try {
    const { orderId, amount, latitude, longitude, platform } = req.body;

    const user = await User.findOneAndUpdate(
      { phone: req.params.phone },
      {
        $push: {
          orders: {
            id: orderId,
            amount,
            date: new Date(),
            latitude,
            longitude,
            platform,
          },
        },
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "Order added", user });

  } catch (error) {
    console.error("Add order error:", error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ GET USER ORDERS
router.get("/:phone/orders", async (req, res) => {
  try {
    const user = await User.findOne({ phone: req.params.phone });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ orders: user.orders || [] });

  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ ADD PAYOUT
router.post("/:phone/payouts", async (req, res) => {
  try {
    const { payoutId, amount, triggeredBy, latitude, longitude } = req.body;
    const user = await User.findOne({ phone: req.params.phone });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // ❌ LOCATION NOT SET
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
    user.payouts.push({
      id: payoutId,
      amount,
      date: new Date(),
      triggeredBy,
      status: "success",
    });
    await user.save();
    res.json({ message: "Payout success ✅", user });
  } catch (error) {
    console.error("Add payout error:", error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ GET USER PAYOUTS
router.get("/:phone/payouts", async (req, res) => {
  try {
    const user = await User.findOne({ phone: req.params.phone });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ payouts: user.payouts || [] });

  } catch (error) {
    console.error("Get payouts error:", error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ UPDATE PLAN
router.post("/:phone/plan", async (req, res) => {
  try {
    const { planName, planPrice, coverage } = req.body;

    const user = await User.findOneAndUpdate(
      { phone: req.params.phone },
      {
        $set: {
          plan: {
            name: planName,
            price: planPrice,
            coverage,
            startDate: new Date(),
          },
          updatedAt: new Date(),
        },
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "Plan updated", user });

  } catch (error) {
    console.error("Update plan error:", error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ UPDATE WALLET
router.post("/:phone/wallet", async (req, res) => {
  try {
    const { amount, reason } = req.body;

    const user = await User.findOne({ phone: req.params.phone });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update wallet balance
    user.wallet.balance += amount;
    user.wallet.topUps.push({
      amount,
      date: new Date(),
      reason,
    });

    await user.save();

    res.json({ message: "Wallet updated", user });

  } catch (error) {
    console.error("Update wallet error:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;