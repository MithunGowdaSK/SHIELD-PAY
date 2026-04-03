import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiCloudRain, FiZap } from "react-icons/fi";
import { getData } from "../utils/storage";

export default function Weather() {
  const navigate = useNavigate();

  const data = getData();
  const orders = data.orders || [];

  const today = new Date().toDateString();

  // 💰 TODAY
  const todayEarnings = orders
    .filter((o) => new Date(o.date).toDateString() === today)
    .reduce((sum, o) => sum + o.amount, 0);

  // 📊 AVG
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

  // 🌧 SIMULATED WEATHER (replace with API later)
  const isRain = true;

  const loss = Math.max(avg - todayEarnings, 0);

  let risk = "Low";
  if (loss > 200) risk = "High";
  else if (loss > 100) risk = "Medium";

  return (
    <div className="min-h-screen bg-gray-100">

      {/* HEADER */}
      <div className="bg-gradient-to-br from-blue-600 to-teal-400 text-white p-6 rounded-b-[40px]">

        <button onClick={() => navigate(-1)} className="mb-4">
          <FiArrowLeft size={20} />
        </button>

        <h1 className="text-2xl font-bold">AI Weather Engine</h1>
        <p className="text-sm opacity-80">
          Smart disruption prediction
        </p>
      </div>

      <div className="p-5 space-y-4">

        {/* WEATHER STATUS */}
        <div className="bg-white rounded-xl p-5 shadow text-center">
          <FiCloudRain size={40} className="mx-auto text-blue-500 mb-2" />

          <h2 className="font-bold text-lg">
            {isRain ? "Rain Detected 🌧" : "Clear Weather ☀"}
          </h2>

          <p className="text-sm text-gray-500">
            Real-time monitoring active
          </p>
        </div>

        {/* AI RISK */}
        <div className="bg-white rounded-xl p-5 shadow">

          <div className="flex items-center gap-2 mb-2">
            <FiZap className="text-yellow-500" />
            <p className="font-semibold">AI Risk Analysis</p>
          </div>

          <p className="text-sm">
            Risk Level:
            <span
              className={`ml-2 font-bold ${
                risk === "High"
                  ? "text-red-500"
                  : risk === "Medium"
                  ? "text-orange-500"
                  : "text-green-500"
              }`}
            >
              {risk}
            </span>
          </p>

          <p className="text-sm mt-2">
            Avg Earnings: ₹{Math.round(avg)}
          </p>

          <p className="text-sm">
            Today Earnings: ₹{todayEarnings}
          </p>

          <p className="text-sm text-red-500 font-semibold mt-2">
            Predicted Loss: ₹{Math.round(loss)}
          </p>

        </div>

        {/* CLAIM ELIGIBILITY */}
        <div className="bg-green-50 border border-green-200 p-4 rounded-xl">

          <p className="font-semibold text-green-700">
            {isRain && loss > 50
              ? "✔ Eligible for claim"
              : "❌ Not eligible"}
          </p>

          <p className="text-xs text-green-600 mt-1">
            Based on AI + weather + earnings
          </p>

        </div>

      </div>
    </div>
  );
}