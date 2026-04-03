import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  FiArrowLeft,
  FiMapPin,
  FiCalendar,
  FiClock,
  FiCloudRain,
} from "react-icons/fi";

import { getData } from "../utils/storage";

export default function Disruption() {
  const navigate = useNavigate();

  const [location, setLocation] = useState("Fetching...");
  const [coords, setCoords] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  const time = new Date().toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const data = getData();
  const orders = data.orders || [];
  const plan = data.plan || { coverage: 0, name: "No Plan" };

  const today = new Date().toDateString();

  const todayEarnings = orders
    .filter((o) => new Date(o.date).toDateString() === today)
    .reduce((sum, o) => sum + Number(o.amount), 0);

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
  const payout = Math.min(loss, plan.coverage);

  // 📍 LOCATION
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoords({ latitude, longitude });

        const res = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
        );

        const data = await res.json();

        setLocation(
          `${data.city || data.locality}, ${data.principalSubdivision}`
        );
      },
      () => {
        setCoords({ latitude: 12.9716, longitude: 77.5946 });
        setLocation("Bengaluru, Karnataka");
      }
    );
  }, []);

  // 🌧 WEATHER
  useEffect(() => {
    if (!coords) return;

    const fetchWeather = async () => {
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${coords.latitude}&longitude=${coords.longitude}&current_weather=true`
        );

        const data = await res.json();

        setWeather(data.current_weather);
        setLoading(false);
      } catch {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [coords]);

  const isRain = weather?.weathercode >= 60;

  return (
    <div className="min-h-screen bg-gray-100 overflow-x-hidden">

      {/* 🔥 HEADER (FIXED SPACING + SMOOTH CURVE) */}
      <div className="relative bg-gradient-to-r from-red-500 to-orange-500 text-white pb-20 pt-8 px-5 rounded-b-[50px] shadow-lg">

        <button onClick={() => navigate(-1)} className="mb-4">
          <FiArrowLeft size={22} />
        </button>

        <div className="text-center mt-2 animate-fade-in">
          <FiCloudRain size={44} className="mx-auto mb-3 opacity-90" />

          <h1 className="text-2xl font-bold tracking-wide">
            Weather Disruption
          </h1>

          <p className="text-sm opacity-80 mt-1">
            AI-triggered insurance event
          </p>
        </div>
      </div>

      {/* CONTENT */}
      <div className="-mt-12 px-5 space-y-4 pb-10">

        {/* WEATHER CARD (FLOATING EFFECT) */}
        <div className="bg-white rounded-2xl p-4 shadow-xl text-center animate-slide-up">

          {loading ? (
            <p className="text-gray-500 animate-pulse">
              Fetching weather...
            </p>
          ) : weather ? (
            <div className="space-y-1">
              <p className="text-sm font-semibold">
                🌡 {weather.temperature}°C
              </p>

              <p className="text-xs text-gray-500">
                💨 Wind {weather.windspeed} km/h
              </p>

              <p className={`text-sm font-semibold mt-1 ${isRain ? "text-blue-500" : "text-gray-500"}`}>
                {isRain ? "🌧 Rain Detected" : "☀️ No Rain"}
              </p>
            </div>
          ) : (
            <p className="text-red-500">Weather unavailable ❌</p>
          )}

        </div>

        {/* DETAILS */}
        <div className="bg-white rounded-2xl p-5 shadow animate-slide-up delay-100 space-y-3">

          <div className="flex items-center gap-3">
            <FiMapPin className="text-blue-500" />
            <span className="text-sm">{location}</span>
          </div>

          <div className="flex items-center gap-3">
            <FiCalendar className="text-blue-500" />
            <span className="text-sm">
              {new Date().toLocaleDateString()}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <FiClock className="text-blue-500" />
            <span className="text-sm">{time}</span>
          </div>

        </div>

        {/* AI ANALYSIS */}
        <div className="bg-white rounded-2xl p-5 shadow animate-slide-up delay-200">

          <h2 className="font-semibold mb-2">
            AI Analysis
          </h2>

          <p className="text-sm text-gray-600">
            Avg Earnings: ₹{Math.round(avg)}
          </p>

          <p className="text-sm text-gray-600">
            Today Earnings: ₹{todayEarnings}
          </p>

          <p className="text-sm text-red-500 font-semibold mt-2">
            Income Loss: ₹{Math.round(loss)}
          </p>

        </div>

        {/* PAYOUT */}
        <div className="bg-green-500 text-white rounded-2xl p-5 shadow-lg animate-slide-up delay-300">

          <p className="text-sm opacity-80">
            Estimated Compensation
          </p>

          <h2 className="text-2xl font-bold">
            ₹{Math.round(payout)}
          </h2>

          <p className="text-xs opacity-80">
            Based on loss & {plan.name}
          </p>

        </div>

        {/* BUTTON */}
        <button
          onClick={() => navigate("/final")}
          className="w-full py-3 bg-black text-white rounded-xl shadow-md active:scale-95 transition-transform duration-150 animate-slide-up delay-400"
        >
          Continue to Approval
        </button>

      </div>

      {/* ✨ ANIMATION STYLES */}
      <style>
        {`
        .animate-fade-in {
          animation: fadeIn 0.6s ease forwards;
        }

        .animate-slide-up {
          animation: slideUp 0.5s ease forwards;
        }

        .delay-100 { animation-delay: 0.1s }
        .delay-200 { animation-delay: 0.2s }
        .delay-300 { animation-delay: 0.3s }
        .delay-400 { animation-delay: 0.4s }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(25px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}
      </style>

    </div>
  );
}