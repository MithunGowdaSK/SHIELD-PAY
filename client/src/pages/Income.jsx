import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/hero.png";
import { FiArrowLeft } from "react-icons/fi";
import toast from "react-hot-toast";

export default function Income() {
  const navigate = useNavigate();

  const [daily, setDaily] = useState("");
  const [weekly, setWeekly] = useState("");

  // 🔥 SAFE CALCULATION
  const calculateRisk = () => {
    if (!daily || !weekly || weekly == 0) return null;

    const d = Number(daily);
    const w = Number(weekly);

    if (isNaN(d) || isNaN(w)) return null;

    const riskScore = Math.min(100, Math.floor((d * 7 / w) * 100));
    const premium = Math.floor(w * 0.02);

    return { riskScore, premium };
  };

  const data = calculateRisk();

  const handleContinue = () => {
    if (!daily || !weekly) {
      toast.error("Enter all income details");
      return;
    }

    const existingData = JSON.parse(localStorage.getItem("userData")) || {};

    const updated = {
      ...existingData,
      dailyIncome: Number(daily),
      weeklyIncome: Number(weekly),
      orders: existingData.orders || [],
      payouts: existingData.payouts || [],
    };

    localStorage.setItem("userData", JSON.stringify(updated));

    toast.success("Income saved");

    setTimeout(() => {
      navigate("/plans"); // make sure route exists
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">

      {/* HEADER */}
      <div className="h-[240px] bg-gradient-to-br from-blue-600 via-blue-500 to-teal-400 rounded-b-[40px] px-5 pt-6">

        {/* BACK */}
        <button onClick={() => navigate(-1)} className="text-white mb-4">
          <FiArrowLeft size={20} />
        </button>

        {/* LOGO */}
        <div className="flex justify-center">
          <img src={logo} className="w-28 bg-white p-2 rounded-lg shadow" />
        </div>

        {/* TITLE */}
        <h1 className="text-white text-xl font-semibold text-center mt-4">
          Income Setup
        </h1>

        <p className="text-white text-sm text-center opacity-90">
          Help us calculate your coverage
        </p>
      </div>

      {/* CARD */}
      <div className="-mt-14 px-5 pb-10">

        {/* INPUT CARD */}
        <div className="bg-white rounded-2xl shadow-xl p-6">

          {/* DAILY */}
          <label className="text-sm font-medium">
            Average Daily Earnings
          </label>

          <div className="flex items-center bg-gray-100 rounded-lg px-3 py-3 mt-2 mb-2">
            <span className="mr-2 text-gray-400">₹</span>
            <input
              type="number"
              value={daily}
              onChange={(e) => setDaily(e.target.value)}
              placeholder="Enter daily income"
              className="bg-transparent outline-none w-full text-sm"
            />
          </div>

          <p className="text-xs text-gray-400 mb-4">
            Your average earnings per working day
          </p>

          {/* WEEKLY */}
          <label className="text-sm font-medium">
            Average Weekly Earnings
          </label>

          <div className="flex items-center bg-gray-100 rounded-lg px-3 py-3 mt-2 mb-2">
            <span className="mr-2 text-gray-400">₹</span>
            <input
              type="number"
              value={weekly}
              onChange={(e) => setWeekly(e.target.value)}
              placeholder="Enter weekly income"
              className="bg-transparent outline-none w-full text-sm"
            />
          </div>

          <p className="text-xs text-gray-400">
            Your total earnings in a typical week
          </p>
        </div>

        {/* AI BLOCK */}
        {data && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 mt-4">

            <h2 className="font-semibold text-blue-700 mb-4">
              🧠 AI Risk Assessment
            </h2>

            {/* SCORE */}
            <div className="bg-white rounded-xl p-4 mb-3 shadow-sm">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">Risk Score</p>
                <p className="text-green-600 font-bold text-lg">
                  {data.riskScore}/100
                </p>
              </div>

              <div className="w-full bg-gray-200 h-2 rounded mt-2">
                <div
                  className="bg-blue-500 h-2 rounded"
                  style={{ width: `${data.riskScore}%` }}
                />
              </div>

              <p className="text-xs text-green-600 mt-1">
                Low Risk
              </p>
            </div>

            {/* PREMIUM */}
            <div className="bg-white rounded-xl p-4 shadow-sm flex justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Suggested Weekly Premium
                </p>
                <p className="text-xs text-gray-400">
                  Based on your income pattern
                </p>
              </div>

              <p className="text-blue-600 font-bold text-lg">
                ₹{data.premium}
                <span className="text-xs text-gray-500">/week</span>
              </p>
            </div>

          </div>
        )}

        {/* INFO */}
        <div className="bg-blue-50 border border-blue-200 text-blue-700 text-xs p-4 rounded-xl mt-4">
          📈 Our AI analyzes your income pattern, weather data, and historical
          claims to calculate personalized coverage and premium.
        </div>

        {/* BUTTON */}
        <button
          onClick={handleContinue}
          className="w-full py-3 rounded-xl text-white font-medium mt-5
          bg-gradient-to-r from-blue-500 to-teal-400 shadow-md"
        >
          Continue to Plans
        </button>

      </div>
    </div>
  );
}
