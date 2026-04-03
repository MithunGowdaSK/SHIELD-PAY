import { useState, useMemo } from "react"; // Added useMemo
import { useNavigate } from "react-router-dom";
import logo from "../assets/hero.png";
import { FiArrowLeft, FiCheck, FiShield } from "react-icons/fi";
import toast from "react-hot-toast";

export default function Plans() {
  const navigate = useNavigate();
  const city = localStorage.getItem("city") || ""; // Fallback to empty string

  // 1. Define the risk logic and modified plans using useMemo
  const plans = useMemo(() => {
    const lowRiskCities = ["Bangalore"];
    const highRiskCities = ["Mumbai", "Chennai"];

    let priceAdjustment = 0;
    if (lowRiskCities.includes(city)) priceAdjustment = -5;
    if (highRiskCities.includes(city)) priceAdjustment = 10;

    const basePlans = [
      {
        name: "Basic",
        price: 30,
        coverage: 1000,
        color: "bg-blue-50 border-blue-200",
        icon: "text-blue-500",
        features: ["Rain protection", "Basic support", "Weekly payout"],
      },
      {
        name: "Standard",
        price: 50,
        coverage: 2000,
        color: "bg-green-50 border-green-300",
        icon: "text-green-500",
        recommended: true,
        features: [
          "Rain & heat protection",
          "Priority support",
          "Instant payout",
          "Weather alerts",
        ],
      },
      {
        name: "Pro",
        price: 80,
        coverage: 3500,
        color: "bg-purple-50 border-purple-200",
        icon: "text-purple-500",
        features: [
          "Full weather coverage",
          "24/7 support",
          "Instant payout",
        ],
      },
    ];

    // Apply the dynamic adjustment to each plan price
    return basePlans.map(plan => ({
      ...plan,
      price: plan.price + priceAdjustment
    }));
  }, [city]);

  // Set default selected to the Standard plan from the memoized list
  const [selected, setSelected] = useState(plans[1]);

  const handleContinue = () => {
    if (!selected) {
      toast.error("Select a plan");
      return;
    }

    localStorage.setItem("plan", JSON.stringify(selected));
    localStorage.setItem("planStart", new Date().toISOString());

    toast.success(`${selected.name} Plan selected`);

    setTimeout(() => {
      navigate("/payment");
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* HEADER */}
      <div className="h-[240px] bg-gradient-to-br from-blue-600 via-blue-500 to-teal-400 rounded-b-[40px] px-5 pt-6">
        <button onClick={() => navigate(-1)} className="text-white mb-4">
          <FiArrowLeft size={20} />
        </button>

        <div className="flex justify-center">
          <img src={logo} alt="Logo" className="w-28 bg-white p-2 rounded-lg shadow" />
        </div>

        <h1 className="text-white text-xl font-semibold text-center mt-4">
          Choose Your Plan
        </h1>

        <p className="text-white text-sm text-center opacity-90">
          Select weekly insurance coverage {city && `for ${city}`}
        </p>
      </div>

      {/* CONTENT */}
      <div className="-mt-14 px-5 pb-28">
        {plans.map((plan, i) => (
          <div
            key={i}
            onClick={() => setSelected(plan)}
            className={`relative rounded-2xl p-5 mb-4 border shadow-sm cursor-pointer transition
              ${plan.color}
              ${selected.name === plan.name ? "ring-2 ring-blue-500" : ""}
            `}
          >
            {plan.recommended && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500 text-white text-xs px-3 py-1 rounded-full">
                Recommended
              </div>
            )}

            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-semibold text-lg">
                  {plan.name} Plan
                </h2>
                <p className="text-xl font-bold">
                  ₹{plan.price}
                  <span className="text-sm text-gray-500">/week</span>
                </p>
              </div>

              <div className={`p-3 rounded-full bg-white ${plan.icon}`}>
                {selected.name === plan.name ? (
                  <FiCheck size={20} />
                ) : (
                  <FiShield size={20} />
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl p-3 mt-4 text-center">
              <p className="text-xs text-gray-500">Coverage Amount</p>
              <p className="font-bold text-lg">₹{plan.coverage}</p>
            </div>

            <div className="mt-4 space-y-1 text-sm">
              {plan.features.map((f, idx) => (
                <div key={idx} className="flex items-center gap-2 text-green-600">
                  <FiCheck size={14} />
                  <p className="text-gray-700">{f}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* BUTTON */}
      <div className="fixed bottom-0 left-0 w-full bg-white p-4 shadow-lg">
        <button
          onClick={handleContinue}
          className="w-full py-3 rounded-xl text-white font-medium
          bg-gradient-to-r from-blue-500 to-teal-400"
        >
          Continue with {selected.name} Plan
        </button>
      </div>
    </div>
  );
}