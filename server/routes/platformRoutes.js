import express from "express";
import upload from "../middleware/upload.js";
import User from "../models/User.js";

const router = express.Router();

router.post("/", upload.single("file"), async (req, res) => {
  try {
    const { platform, workerId, phone, latitude, longitude } = req.body;

    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    // ✅ VALIDATION
    if (!phone) {
      return res.status(400).json({ message: "Phone missing ❌" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "File missing ❌" });
    }

    // ✅ AUTO CREATE USER (BEST)
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
    user.idProof = req.file.filename;

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
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({
      message: "Upload failed ❌",
    });
  }
});

export default router;