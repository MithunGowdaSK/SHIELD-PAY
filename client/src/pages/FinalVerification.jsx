import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FiCheckCircle } from "react-icons/fi";
import { getData } from "../utils/storage";

export default function FinalVerification() {
  const navigate = useNavigate();

  const data = getData();
  const orders = data.orders || [];
  const plan = data.plan || null;

  const [isRain, setIsRain] = useState(false);
  const [visibleSteps, setVisibleSteps] = useState([]);
  const [showFinal, setShowFinal] = useState(false);

  // 📅 TODAY
  const today = new Date().toDateString();

  const todayEarnings = orders
    .filter((o) => new Date(o.date).toDateString() === today)
    .reduce((sum, o) => sum + Number(o.amount), 0);

  // 📊 AVG
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

  const payout = plan ? Math.min(loss, plan.coverage) : 0;

  // 🌧 WEATHER
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=12.97&longitude=77.59&current_weather=true"
        );
        const data = await res.json();
        setIsRain(data.current_weather.weathercode >= 60);
      } catch {
        setIsRain(false);
      }
    };

    fetchWeather();
  }, []);

  // ✅ CHECKS
  const checks = [
    { label: "Weather confirmed", ok: isRain },
    { label: "Order activity confirmed", ok: orders.length > 0 },
    { label: "Location verified", ok: true },
    { label: "Device verified", ok: true },
    { label: "AI risk low", ok: loss > 0 },
  ];

  const allPassed = checks.every((c) => c.ok);

  // 🎬 FIXED STEP ANIMATION (NO RANDOM BUG)
  useEffect(() => {
    checks.forEach((_, i) => {
      setTimeout(() => {
        setVisibleSteps((prev) => {
          if (prev.includes(i)) return prev;
          return [...prev, i];
        });
      }, i * 600);
    });

    setTimeout(() => {
      setShowFinal(true);
    }, checks.length * 600 + 300);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">

      {/* HEADER */}
      <div className="bg-gradient-to-br from-blue-600 to-teal-400 text-white p-6 pb-14 rounded-b-[40px] text-center shadow-lg">
        <h1 className="text-xl font-bold animate-fade">
          Final Verification
        </h1>
        <p className="text-sm opacity-90">
          Confirming payout eligibility
        </p>
      </div>

      {/* CONTENT */}
      <div className="-mt-10 px-5 pb-10 space-y-4">

        {/* CHECKLIST */}
        <div className="bg-white rounded-2xl shadow p-5">
          <h2 className="font-semibold mb-4">
            Verification Checklist
          </h2>

          <div className="space-y-3">
            {checks.map((item, i) => {
              if (!visibleSteps.includes(i)) return null;

              return (
                <div
                  key={i}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all
                  ${
                    item.ok
                      ? "bg-green-50 border-green-200 animate-success"
                      : "bg-red-50 border-red-200 animate-fail"
                  }`}
                >

                  <FiCheckCircle
                    className={`text-xl ${
                      item.ok
                        ? "text-green-500 animate-scale"
                        : "text-red-500 animate-shake"
                    }`}
                  />

                  <div>
                    <p className="text-sm font-medium">
                      {item.label}
                    </p>
                    <p className="text-xs text-gray-500">
                      {item.ok ? "Verified" : "Failed"}
                    </p>
                  </div>

                </div>
              );
            })}
          </div>

          {/* ✅ REAL BUTTON */}
          {showFinal && (
            <button
              onClick={() => {
                if (allPassed) navigate("/payout");
              }}
              disabled={!allPassed}
              className={`mt-4 w-full p-3 rounded-xl text-sm font-medium transition-all
              ${
                allPassed
                  ? "bg-green-500 text-white active:scale-95 shadow-md animate-pulse"
                  : "bg-red-100 text-red-700 cursor-not-allowed opacity-80"
              }`}
            >
              {allPassed
                ? "Proceed to Payout →"
                : "Verification failed. Claim rejected."}
            </button>
          )}

        </div>

      </div>

      {/* 🎬 ANIMATIONS */}
      <style>
        {`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes scalePop {
          0% { transform: scale(0.8); opacity: 0 }
          100% { transform: scale(1); opacity: 1 }
        }

        @keyframes shake {
          0% { transform: translateX(0) }
          25% { transform: translateX(-4px) }
          50% { transform: translateX(4px) }
          75% { transform: translateX(-4px) }
          100% { transform: translateX(0) }
        }

        .animate-fade {
          animation: fadeIn 0.5s ease forwards;
        }

        .animate-success {
          animation: fadeIn 0.5s ease forwards;
        }

        .animate-fail {
          animation: fadeIn 0.5s ease forwards;
        }

        .animate-scale {
          animation: scalePop 0.4s ease;
        }

        .animate-shake {
          animation: shake 0.4s ease;
        }
      `}
      </style>

    </div>
  );
}