import express from "express";
import Plan from "../models/Plan.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const plan = new Plan(req.body);
  await plan.save();
  res.json(plan);
});

router.get("/:userId", async (req, res) => {
  const plan = await Plan.findOne({ userId: req.params.userId });
  res.json(plan);
});

export default router;