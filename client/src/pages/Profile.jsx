import { useNavigate } from "react-router-dom";
import logo from "../assets/hero.png";
import { FiArrowLeft, FiUser, FiMapPin, FiShield } from "react-icons/fi";
import { getData } from "../utils/storage";

export default function Profile() {
  const navigate = useNavigate();

  // 📦 GET DATA
  const data = getData();

  const name = localStorage.getItem("name") || "User";
  const city = localStorage.getItem("city") || "Not set";

  const plan = data.plan || null;
  const orders = data.orders || [];

  const totalEarnings = orders.reduce(
    (sum, o) => sum + Number(o.amount),
    0
  );

  return (
    <div className="min-h-screen bg-gray-100">

      {/* HEADER */}
      <div className="bg-gradient-to-br from-blue-600 to-teal-400 text-white p-6 pb-14 rounded-b-[40px]">

        <button onClick={() => navigate(-1)}>
          <FiArrowLeft size={20} />
        </button>

        <div className="flex flex-col items-center mt-5">
          <img src={logo} className="w-20 bg-white p-2 rounded-xl" />

          <h1 className="text-xl font-bold mt-3">
            {name}
          </h1>

          <p className="text-sm opacity-80">
            Delivery Partner
          </p>
        </div>
      </div>

      {/* CONTENT */}
      <div className="px-5 -mt-10 space-y-4 pb-10">

        {/* USER INFO */}
        <div className="bg-white rounded-xl p-5 shadow space-y-3">

          <div className="flex items-center gap-3">
            <FiUser className="text-blue-500" />
            <span className="text-sm">{name}</span>
          </div>

          <div className="flex items-center gap-3">
            <FiMapPin className="text-blue-500" />
            <span className="text-sm">{city}</span>
          </div>

          <div className="flex items-center gap-3">
            <FiShield className="text-green-500" />
            <span className="text-sm">
              {plan ? "Verified ✅" : "Not Verified ❌"}
            </span>
          </div>

        </div>

        {/* PLAN INFO */}
        <div className="bg-white rounded-xl p-5 shadow">

          <h2 className="text-sm text-gray-500 mb-2">
            Active Plan
          </h2>

          {plan ? (
            <>
              <p className="font-semibold text-lg">
                {plan.name}
              </p>

              <p className="text-sm text-gray-500">
                Coverage: ₹{plan.coverage}
              </p>

              <p className="text-sm text-gray-500">
                Weekly: ₹{plan.price}
              </p>
            </>
          ) : (
            <p className="text-sm text-gray-500">
              No active plan
            </p>
          )}
        </div>

        {/* EARNINGS */}
        <div className="bg-white rounded-xl p-5 shadow">

          <h2 className="text-sm text-gray-500 mb-2">
            Earnings Summary
          </h2>

          <p className="text-lg font-bold text-green-600">
            ₹{totalEarnings}
          </p>

          <p className="text-xs text-gray-400">
            Total earnings from orders
          </p>

        </div>

        {/* BUTTON */}
        <button
          onClick={() => navigate("/dashboard")}
          className="w-full py-3 bg-black text-white rounded-xl"
        >
          Back to Dashboard
        </button>

      </div>
    </div>
  );
}