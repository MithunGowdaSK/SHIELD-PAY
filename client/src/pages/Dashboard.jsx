import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useApp } from "../context/useApp";
import {
  FiBell,
  FiShield,
  FiCloudRain,
  FiArrowUpRight,
} from "react-icons/fi";

import { getData } from "../utils/storage";
import { checkWeatherTrigger } from "../utils/aiEngine";

export default function Dashboard() {
  const navigate = useNavigate();
  const { coords } = useApp();

  // 📦 DATA
  const data = getData();
  const name = localStorage.getItem("name") || "User";

  const plan = data.plan || { name: "No Plan", price: 0, coverage: 0 };
  const orders = data.orders || [];
  const payouts = data.payouts || [];

  const lastPayout = payouts[payouts.length - 1];

  // 📍 LOCATION
  const cityLocal = localStorage.getItem("city");
  const city = cityLocal
    ? cityLocal
    : coords
    ? `${coords.latitude.toFixed(3)}, ${coords.longitude.toFixed(3)}`
    : "Your City";

  // ⏰ TIME
  const now = new Date();
  const hour = now.getHours();
  const todayStr = now.toDateString();

  let greeting = "Good Morning";
  if (hour >= 12 && hour < 17) greeting = "Good Afternoon";
  else if (hour >= 17) greeting = "Good Evening";

  // 💰 EARNINGS
  const todayEarnings = orders
    .filter((o) => new Date(o.date).toDateString() === todayStr)
    .reduce((sum, o) => sum + Number(o.amount), 0);

  const weeklyEarnings = orders.reduce(
    (sum, o) => sum + Number(o.amount),
    0
  );

  // 📅 PLAN PROGRESS
  let startDateRaw = localStorage.getItem("planStart");
  let startDate = startDateRaw ? new Date(startDateRaw) : new Date();

  if (!startDateRaw) {
    localStorage.setItem("planStart", startDate.toISOString());
  }

  const diffTime = now.getTime() - startDate.getTime();
  const daysPassed = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const totalDays = 7;

  if (daysPassed >= totalDays) {
    startDate = new Date();
    localStorage.setItem("planStart", startDate.toISOString());
  }

  const progress = Math.min((daysPassed / totalDays) * 100, 100);

  const nextPayment = new Date(startDate);
  nextPayment.setDate(startDate.getDate() + 7);

  const formatCurrency = (n) => `₹${n.toLocaleString("en-IN")}`;

  const formatDate = (date) =>
    date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  // 🔥 AI AUTO TRIGGER SYSTEM
  useEffect(() => {
    const runAI = async () => {
      const isRain = await checkWeatherTrigger();

      const grouped = {};
      orders.forEach((o) => {
        const d = new Date(o.date).toDateString();
        if (!grouped[d]) grouped[d] = 0;
        grouped[d] += o.amount;
      });

      const dates = Object.keys(grouped);

      const avg =
        dates.length > 1
          ? dates.reduce((sum, d) => sum + grouped[d], 0) / dates.length
          : 0;

      const loss = Math.max(avg - todayEarnings, 0);

      if (isRain && loss > 50) {
        if (!localStorage.getItem("triggered")) {
          localStorage.setItem("triggered", "true");

          setTimeout(() => {
            navigate("/disruption");
          }, 1500);
        }
      }
    };

    runAI();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-50 pb-20">

      {/* HEADER */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-500 to-teal-400 rounded-b-3xl px-6 pt-6 pb-20 text-white shadow-lg relative overflow-hidden">
        
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full blur-2xl" />
        </div>

        <div className="relative z-10">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">ShieldPay</h1>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate("/profile")}
                className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors text-xl"
              >
                👤
              </button>
              <button className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors">
                <FiBell size={18} />
              </button>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-sm text-white/80">{greeting} 👋</p>
            <h2 className="text-3xl font-bold">{name}</h2>
            <p className="text-sm text-white/70 mt-1">📍 {city}</p>
          </div>

          {/* PLAN CARD */}
          <div className="bg-white/95 text-gray-900 rounded-2xl p-5 shadow-lg flex justify-between items-center">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">Protection Limit</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">
                ₹{plan.coverage}
              </h3>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <p className="text-xs font-semibold text-green-600">
                  {plan.name} Active
                </p>
              </div>
            </div>

            <div className="bg-green-100 p-4 rounded-2xl">
              <FiShield className="text-green-600 text-2xl" />
            </div>
          </div>

          {/* EARNINGS */}
          <div className="grid grid-cols-2 gap-3 mt-5">
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/20">
              <p className="text-xs text-white/70 font-semibold uppercase">Today's Earnings</p>
              <h3 className="text-xl font-bold mt-2">
                {formatCurrency(todayEarnings)}
              </h3>
            </div>

            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/20">
              <p className="text-xs text-white/70 font-semibold uppercase">Total Revenue</p>
              <h3 className="text-xl font-bold mt-2">
                {formatCurrency(weeklyEarnings)}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* BODY */}
      <div className="px-6 -mt-12 space-y-4 relative z-10">

        {/* WEATHER */}
        <button
          onClick={() => navigate("/weather")}
          className="w-full bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200 rounded-2xl p-5 cursor-pointer hover:shadow-lg transition-shadow text-left"
        >
          <div className="flex gap-4 items-center">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <FiCloudRain className="text-orange-600 text-xl" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-gray-900">Weather Insight</p>
              <p className="text-xs text-gray-600 mt-1">
                Tap for AI weather analysis
              </p>
            </div>
            <div className="text-orange-600 text-lg">→</div>
          </div>
        </button>

        {/* SECURITY */}
        <button
          onClick={() => navigate("/security")}
          className="w-full bg-white rounded-2xl p-5 shadow-sm hover:shadow-lg transition-shadow text-left border border-gray-100"
        >
          <div className="flex gap-4 items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <FiShield className="text-blue-600 text-xl" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-gray-900">Security Info</p>
              <p className="text-xs text-gray-600 mt-1">
                AI fraud detection system
              </p>
            </div>
            <div className="text-blue-600 text-lg">→</div>
          </div>
        </button>

        {/* PLAN STATUS */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm font-semibold text-gray-600 uppercase">Weekly Premium</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-2">
            ₹{plan.price}/week
          </h3>

          <div className="w-full bg-gray-200 h-3 rounded-full mt-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-teal-400 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="text-xs text-gray-500 mt-2">
            🔄 Renew: {formatDate(nextPayment)}
          </p>
        </div>

        {/* PAYOUT */}
        {lastPayout && (
          <button
            onClick={() => navigate("/payout")}
            className="w-full bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-5 hover:shadow-lg transition-shadow text-left"
          >
            <p className="text-sm font-semibold text-gray-600 uppercase">Latest Payout</p>
            <h3 className="text-2xl font-bold text-green-600 mt-2">
              ₹{lastPayout.amount}
            </h3>
          </button>
        )}

        {/* ORDERS */}
        <button
          onClick={() => navigate("/orders")}
          className="w-full bg-white rounded-2xl p-5 shadow-sm hover:shadow-lg transition-shadow border border-gray-100 flex justify-between items-center group"
        >
          <div className="flex items-center gap-3">
            <div className="text-2xl">📦</div>
            <div className="text-left">
              <p className="font-bold text-gray-900">My Orders</p>
              <p className="text-xs text-gray-500">{orders.length} total orders</p>
            </div>
          </div>
          <div className="text-blue-600 group-hover:translate-x-1 transition-transform">→</div>
        </button>

        {/* DISRUPTION TEST */}
        <button
          onClick={() => navigate("/disruption")}
          className="w-full py-4 rounded-2xl text-white font-bold bg-gradient-to-r from-gray-800 to-gray-900 hover:shadow-lg active:scale-95 transition-all duration-200"
        >
          🧪 Simulate Disruption
        </button>

      </div>
    </div>
  );
}