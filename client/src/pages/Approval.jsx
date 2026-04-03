import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getData } from "../utils/storage";

export default function Approval() {
  const navigate = useNavigate();

  const [isRain, setIsRain] = useState(false);
  const [loading, setLoading] = useState(true);

  const data = getData();
  const orders = data.orders || [];

  const today = new Date().toDateString();

  // 💰 TODAY EARNINGS
  const todayEarnings = orders
    .filter((o) => new Date(o.date).toDateString() === today)
    .reduce((sum, o) => sum + Number(o.amount), 0);

  // 📊 AVG EARNINGS
  const grouped = {};
  orders.forEach((o) => {
    const d = new Date(o.date).toDateString();
    if (!grouped[d]) grouped[d] = 0;
    grouped[d] += Number(o.amount);
  });

  const dates = Object.keys(grouped);
  const avg =
    dates.length > 1
      ? dates.reduce((sum, d) => sum + grouped[d], 0) / dates.length
      : 0;

  const loss = Math.max(avg - todayEarnings, 0);

  // 🌧 WEATHER CHECK
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch(
          "https://api.openweathermap.org/data/2.5/weather?q=Bangalore&appid=YOUR_API_KEY"
        );
        const weatherData = await res.json();
        const condition = weatherData.weather[0].main;
        setIsRain(condition === "Rain" || condition === "Drizzle");
      } catch {
        setIsRain(false);
      }
      setLoading(false);
    };

    fetchWeather();
  }, []);

  // ✅ FINAL DECISION
  const approved = isRain && loss > 50;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* HEADER */}
      <div
        className={`${
          approved ? "bg-green-500" : "bg-red-500"
        } text-white pt-10 pb-16 px-6 rounded-b-[40px] text-center transition-colors duration-500`}
      >
        <h1 className="text-2xl font-bold">
          {approved ? "Claim Approved" : "Claim Rejected"}
        </h1>
        <p className="text-sm opacity-90 mt-1">AI Smart Verification</p>
      </div>

      {/* CONTENT */}
      <div className="px-5 -mt-10 pb-10">
        {/* CARD */}
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
          <h2 className="text-xs text-gray-400 tracking-wide font-bold">
            VERIFICATION DETAILS
          </h2>

          {/* ROW: Weather */}
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Weather Condition</span>
            <span className="text-blue-600 font-medium">
              {loading
                ? "Checking..."
                : isRain
                ? "Rain Detected 🌧"
                : "No Rain ❌"}
            </span>
          </div>

          <div className="h-[1px] bg-gray-100" />

          {/* ROW: Historical Avg */}
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Historical Avg</span>
            <span className="font-medium">₹{Math.round(avg)}</span>
          </div>

          <div className="h-[1px] bg-gray-100" />

          {/* ROW: Today's Earnings */}
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Today's Earnings</span>
            <span className="text-red-500 font-medium">
              ₹{todayEarnings}
            </span>
          </div>

          <div className="h-[1px] bg-gray-100" />

          {/* ROW: Loss */}
          <div className="flex justify-between items-center text-base font-semibold pt-2">
            <span>Calculated Loss</span>
            <span className={loss > 50 ? "text-green-600" : "text-gray-400"}>
              ₹{Math.round(loss)}
            </span>
          </div>
        </div>

        {/* BUTTON SECTION */}
        <div className="mt-6">
          {approved ? (
            <button
              onClick={() => navigate("/payout")}
              className="w-full py-3 rounded-xl text-white font-semibold 
              bg-gradient-to-r from-green-500 to-green-600 shadow-md active:scale-[0.98] transition-transform"
            >
              Claim Payout
            </button>
          ) : (
            <button
              onClick={() => navigate("/dashboard")}
              className="w-full py-3 rounded-xl text-white font-semibold 
              bg-gradient-to-r from-gray-800 to-gray-900 shadow-md active:scale-[0.98] transition-transform"
            >
              Return to Dashboard
            </button>
          )}
        </div>
      </div>
    </div>
  );
}