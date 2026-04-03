import express from "express";
import Payout from "../models/Payout.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const payout = new Payout(req.body);
  await payout.save();
  res.json(payout);
});

router.get("/:userId", async (req, res) => {
  const payouts = await Payout.find({ userId: req.params.userId });
  res.json(payouts);
});

export default router;