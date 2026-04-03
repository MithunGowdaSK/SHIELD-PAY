import express from "express";
import { getOrdersForWorker } from "../connectors/mockConnectors.js";
import { detectRainOnDate, simpleRiskScore, haversineKm } from "../services/fraud.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

// Quick helper to read the simple JSON store (backwards compat with existing code)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, "..", "..", "data", "users.json");

function readData() {
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf8");
    return JSON.parse(raw || "{}");
  } catch {
    return {};
  }
}

router.get("/health", (req, res) => res.json({ ok: true }));

// Simulate platform verification: register platform on server
router.post("/platform/verify", express.json(), (req, res) => {
  const { phone, platform, workerId, latitude, longitude } = req.body;
  if (!phone || !platform || !workerId) return res.status(400).json({ message: "phone, platform, workerId required" });
  const data = readData();
  const user = data[phone] || { phone, platformAccounts: [], orders: [], payouts: [], wallet: 0, lastLocation: null };
  user.platformAccounts.push({ platform, workerId, verifiedAt: new Date().toISOString() });
  if (latitude && longitude) user.lastLocation = { latitude: Number(latitude), longitude: Number(longitude), at: new Date().toISOString() };
  data[phone] = user;
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  return res.json({ message: "platform registered" });
});

// Mock endpoint to fetch orders for a worker from a platform (uses mock connector)
router.get("/platform/orders", async (req, res) => {
  const { platform, workerId } = req.query;
  if (!platform || !workerId) return res.status(400).json({ message: "platform and workerId required" });
  const list = await getOrdersForWorker(platform, workerId);
  return res.json({ orders: list });
});

// Simple endpoint to evaluate a single order for fraud/weather and return a risk decision
router.post("/fraud/check", express.json(), async (req, res) => {
  const { phone, order } = req.body;
  if (!phone || !order) return res.status(400).json({ message: "phone and order required" });
  const data = readData();
  const user = data[phone] || null;
  const loc = user && user.lastLocation ? user.lastLocation : null;

  let dist = null;
  if (loc && order.latitude && order.longitude) {
    dist = haversineKm(loc.latitude, loc.longitude, order.latitude, order.longitude);
  }

  // detect rain on order date
  const isoDate = order.date ? order.date.slice(0,10) : new Date().toISOString().slice(0,10);
  const weather = (order.latitude && order.longitude) ? await detectRainOnDate(order.latitude, order.longitude, isoDate) : { rained: false };

  const suspiciousOrders = (user && user.orders) ? user.orders.filter(o => o.suspicious).length : 0;
  const score = simpleRiskScore({ orders: user ? user.orders : [], suspiciousOrders, locationConsistency: dist === null || dist < 50, weatherSeverity: weather.total ? Math.min(Math.round(weather.total/10), 2) : 0 });

  return res.json({ distanceKm: dist, rained: weather.rained, totalPrecip: weather.total, riskScore: score });
});

// AI assistant placeholder
router.post("/ai/assistant", express.json(), (req, res) => {
  const { phone, message } = req.body;
  const reply = `Assistant reply (demo): I received your message: "${message}". For demo purposes, check your Payout and Fraud screens.`;
  return res.json({ reply });
});

export default router;
