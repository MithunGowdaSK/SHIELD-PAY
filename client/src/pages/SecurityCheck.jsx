import { useNavigate } from "react-router-dom";
import logo from "../assets/hero.png";
import {
  FiArrowLeft,
  FiShield,
  FiCheckCircle,
} from "react-icons/fi";

export default function SecurityCheck() {
  const navigate = useNavigate();

  const features = [
    "GPS location consistency",
    "Platform API cross-check",
    "Device fingerprinting",
    "Weather zone matching",
    "Cluster fraud detection",
    "Behavior analysis",
    "Blockchain audit trail",
    "Real-time risk scoring",
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">

      {/* HEADER */}
      <div className="h-[240px] bg-gradient-to-br from-blue-600 via-blue-500 to-teal-400 rounded-b-[40px] px-5 pt-6">

        <button onClick={() => navigate(-1)} className="text-white mb-4">
          <FiArrowLeft size={20} />
        </button>

        <div className="flex justify-center">
          <img src={logo} className="w-28 bg-white p-2 rounded-lg shadow" />
        </div>

        <h1 className="text-white text-xl font-semibold text-center mt-4">
          Security System
        </h1>

        <p className="text-white text-sm text-center opacity-90">
          How we protect you from fraud
        </p>
      </div>

      {/* CONTENT */}
      <div className="-mt-14 px-5 pb-10">

        {/* MAIN CARD */}
        <div className="bg-white rounded-2xl shadow-xl p-5 mb-5">

          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
              <FiShield size={20} />
            </div>
            <div>
              <h2 className="font-semibold text-lg">
                Multi-Layer Fraud Protection
              </h2>
              <p className="text-xs text-gray-500">
                Advanced AI ensures secure verification
              </p>
            </div>
          </div>

          <p className="text-sm text-gray-600">
            ShieldPay uses multiple layers of verification to ensure
            genuine claims and prevent fraud attempts.
          </p>
        </div>

        {/* FEATURES */}
        <div className="bg-white rounded-2xl shadow-xl p-5 mb-5">
          <h2 className="font-semibold mb-3">
            Security Features
          </h2>

          <div className="space-y-2">
            {features.map((f, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <FiCheckCircle className="text-green-500" />
                <p>{f}</p>
              </div>
            ))}
          </div>
        </div>

        {/* METRICS */}
        <div className="bg-green-50 border border-green-200 rounded-2xl p-5 text-center mb-5">

          <h2 className="font-semibold mb-3">
            Protection Metrics
          </h2>

          <div className="grid grid-cols-2 gap-3">

            <div className="bg-white p-3 rounded-lg shadow">
              <p className="text-green-600 font-bold text-lg">99.7%</p>
              <p className="text-xs">Fraud Detection</p>
            </div>

            <div className="bg-white p-3 rounded-lg shadow">
              <p className="text-blue-600 font-bold text-lg">2 min</p>
              <p className="text-xs">Verification</p>
            </div>

            <div className="bg-white p-3 rounded-lg shadow">
              <p className="text-purple-600 font-bold text-lg">8 Layers</p>
              <p className="text-xs">Security</p>
            </div>

            <div className="bg-white p-3 rounded-lg shadow">
              <p className="text-red-500 font-bold text-lg">&lt;0.1%</p>
              <p className="text-xs">False Positive</p>
            </div>

          </div>
        </div>

        {/* BUTTON */}
        <button
          onClick={() => navigate("/dashboard")}
          className="w-full py-3 rounded-xl text-white font-medium
          bg-gradient-to-r from-blue-500 to-teal-400"
        >
          Back to Dashboard
        </button>

      </div>
    </div>
  );
}