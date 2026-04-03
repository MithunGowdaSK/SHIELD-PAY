import express from "express";
import User from "../models/User.js";

const router = express.Router();

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
    const user = await User.findOneAndUpdate(
      { phone: req.params.phone },
      { 
        $set: req.body,
        updatedAt: new Date(),
      },
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
    const { payoutId, amount, triggeredBy } = req.body;

    const user = await User.findOneAndUpdate(
      { phone: req.params.phone },
      {
        $push: {
          payouts: {
            id: payoutId,
            amount,
            date: new Date(),
            triggeredBy,
            status: "pending",
          },
        },
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "Payout recorded", user });

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